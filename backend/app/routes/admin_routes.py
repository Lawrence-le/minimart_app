from flask import Blueprint, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from ..utils import revoke_token
from ..db import execute_query

admin_bp = Blueprint('admin', __name__)
bcrypt = Bcrypt()

# Admin Registration
@admin_bp.route('/register', methods=['POST'])
def register_admin():
    # Extract the data from the request JSON body
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')

    # Check if the admin already exists
    query = "SELECT * FROM users WHERE username = %s OR email = %s"
    admin = execute_query(query, (username, email), fetch=True)

    if admin:
        return jsonify({"msg": "Admin with this username or email already exists"}), 400

    # Hash the password
    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    # Insert the new admin into the database including first_name and last_name
    query = """
        INSERT INTO users (username, email, password, first_name, last_name) 
        VALUES (%s, %s, %s, %s, %s)
    """
    execute_query(query, (username, email, hashed_password, first_name, last_name))

    return jsonify({"msg": "Admin registered successfully!"}), 201

# Admin Login
@admin_bp.route('/login', methods=['POST'])
def login_admin():
    username = request.json.get('username')
    password = request.json.get('password')

    query = "SELECT id, username, password_hash, is_admin FROM users WHERE username = %s"
    user = execute_query(query, (username,), fetch=True)

    if not user or not user[2] or not bcrypt.check_password_hash(user[2], password):  # user[2] is the password_hash
        return jsonify({"msg": "Bad username or password"}), 401

    if not user[3]:  # Ensure the user is an admin; user[3] is is_admin
        return jsonify({"msg": "Access forbidden"}), 403

    # Authentication. Include username and role in the token payload
    access_token = create_access_token(
        identity=user[0],  # user[0] is the id
        additional_claims={
            "role": "admin",
            "username": user[1]  # user[1] is the username
        }
    )
    return jsonify(access_token=access_token)


# Admin Logout
@admin_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout_admin():
    jwt_data = get_jwt()
    jti = jwt_data['jti']  # Get the JWT ID from the token

    # Revoke the token by adding its JTI to the blacklist
    revoke_token(jti)
    return jsonify({"msg": "Logged out successfully!"})


# Protected Route for Admins
@admin_bp.route('/protected', methods=['GET'])
@jwt_required()
def get_admin_protected_data():
    # Get the current admin's identity from the token
    current_admin_id = get_jwt_identity()

    # Ensure the user is an admin; otherwise, return an error
    query = "SELECT id FROM users WHERE id = %s AND is_admin = TRUE"
    user = execute_query(query, (current_admin_id,), fetch=True)
    if not user:
        return jsonify({"msg": "Access forbidden"}), 403

    # return jsonify({"message": "Welcome Admin!"})
    body = execute_query("SELECT * FROM users WHERE id = %s AND is_admin = TRUE" , (current_admin_id,), fetch=True)

    return jsonify({"WELCOME ADMIN": body})

