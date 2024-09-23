from flask import Blueprint, jsonify, request
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from ..utils import revoke_token
from ..db import execute_query, query_db

user_bp = Blueprint('user', __name__)
bcrypt = Bcrypt()

# User Registration
@user_bp.route('/register', methods=['POST'])
def register_user():
    username = request.json.get('username')
    email = request.json.get('email')
    password = request.json.get('password')
    first_name = request.json.get('first_name')
    last_name = request.json.get('last_name')

    # Check if user already exists
    query = "SELECT * FROM users WHERE username = %s OR email = %s"
    user = execute_query(query, (username, email), fetch=True)

    if user:
        return jsonify({"msg": "User with this username or email already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
    query = """
    INSERT INTO users (username, email, password_hash, first_name, last_name)
    VALUES (%s, %s, %s, %s, %s)
    RETURNING id, username, email, first_name, last_name
    """
    new_user = execute_query(query, (username, email, hashed_password, first_name, last_name), fetch=True)

    return jsonify({
        "msg": "User registered successfully!",
        "user": new_user
    }), 201


# User Login
@user_bp.route('/login', methods=['POST'])
def login_user():
    username = request.json.get('username')
    password = request.json.get('password')

    query = "SELECT id, username, password_hash, is_admin FROM users WHERE username = %s"
    user = execute_query(query, (username,), fetch=True)

    if not user or not bcrypt.check_password_hash(user[2], password):  # user[2] is the password_hash
        return jsonify({"msg": "Bad username or password"}), 401

    # Authentication. Include username and role in the token payload

    role = "admin" if user[3] else "user"
    print(user)

    access_token = create_access_token(
        identity=user[0], 
        additional_claims={
            "role": role,
            "username": user[1]
        }
    )
    return jsonify(access_token=access_token)

# User Logout
@user_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout_user():
    jwt_data = get_jwt()
    jti = jwt_data['jti']  
    revoke_token(jti)
    return jsonify({"msg": "Logged out successfully!"})

# Protected Route for Users
@user_bp.route('/protected', methods=['GET'])
@jwt_required()
def get_user_protected_data():
    current_user_id = get_jwt_identity()
    
    query = """
        SELECT id, username, email, first_name, last_name, is_admin, created_at
        FROM users
        WHERE id = %s
    """
    
    # user = execute_query(query, (current_user_id,), fetch=True)
    user = query_db(query, (current_user_id,), one=True)

    
    if not user:
        return jsonify({"msg": "Access forbidden"}), 403

    print(f"Fetched User Data: {user}")

    return jsonify({"user_data": user})

