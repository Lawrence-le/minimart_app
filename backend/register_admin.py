#! move this script to the backend folder and run : python create_tables.py

#? SQL syntax for resetting id
##? ALTER SEQUENCE users_id_seq RESTART WITH 1;
#* https://medium.com/pythons-gurus/python-sys-module-beginner-guide-e7585684c26c
#* https://www.geeksforgeeks.org/command-line-arguments-in-python/

"""
This is the basic flask example

from flask import Flask

app = Flask(__name__)

@app.route('/')
def home():
    return "Hello, World!"

if __name__ == "__main__":
    app.run(debug=True)
"""
import sys  # access to command-line arguments
from getpass import getpass
from flask import Flask
from flask_bcrypt import Bcrypt
from config import Config
from app.db import execute_query

app = Flask(__name__)
app.config.from_object(Config)
bcrypt = Bcrypt(app)

def register_admin(username, email, password, first_name, last_name):
    with app.app_context(): 
        # Check if the username or email already exists
        query = "SELECT * FROM users WHERE username = %s OR email = %s"
        user = execute_query(query, (username, email), fetch=True)

        if user:
            print("User with this username or email already exists.")
            return

        # Hash the password
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        # Insert user with first_name, last_name, and is_admin = True
        query = """
            INSERT INTO users (username, email, password_hash, is_admin, first_name, last_name)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        execute_query(query, (username, email, hashed_password, True, first_name, last_name))

        print("Admin registered successfully!")

if __name__ == "__main__":
    if len(sys.argv) != 5:
        print("Usage: python create_tables.py <username> <email> <first_name> <last_name>")
        sys.exit(1)

    username = sys.argv[1]
    email = sys.argv[2]
    first_name = sys.argv[3]
    last_name = sys.argv[4]
    password = input("Enter password: ")

    register_admin(username, email, password, first_name, last_name)
