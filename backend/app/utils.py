# backend\app\utils.py
from functools import wraps 
from app.db import execute_query
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt

#? https://flask-jwt-extended.readthedocs.io/en/stable/blocklist_and_token_revoking.html

# Revoke Token
# used when logging out to insert the previous token into blacklist
def revoke_token(jti):
    query = "INSERT INTO revoked_tokens (jti) VALUES (%s)"
    execute_query(query, (jti,))

# Check if Token is Revoked
def is_token_revoked(jwt_payload):
    jti = jwt_payload["jti"]
    query = "SELECT * FROM revoked_tokens WHERE jti = %s"
    token = execute_query(query, (jti,), fetch=True)
    return token is not None

'''
CREATE TABLE revoked_tokens (
    id SERIAL PRIMARY KEY,
    jti VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
'''


# Admin Role Check
def admin_required(fn):
    @wraps(fn)  # This preserves the original function's name and metadata
    @jwt_required()
    def wrapper(*args, **kwargs):
        try:
            claims = get_jwt()
            if claims.get("role") != "admin":
                return jsonify({"msg": "Admin access required"}), 403
            return fn(*args, **kwargs)
        except Exception as e:
            return jsonify({"msg": "Internal server error"}), 500
    return wrapper