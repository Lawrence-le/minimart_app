# move this script to the backend folder and run : python create_tables.py

import sys
import os
import psycopg
from flask import Flask

from config import Config

app = Flask(__name__)
app.config.from_object(Config)

def execute_query(query):
    with psycopg.connect(app.config['DATABASE_URL']) as conn:
        with conn.cursor() as cursor:
            cursor.execute(query)
            conn.commit()

create_users_table = """
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

create_categories_table = """
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);
"""

create_products_table = """
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INTEGER NOT NULL,
    category_id INTEGER REFERENCES categories(id),
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

create_cart_table = """
CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id),  -- References the user who owns the cart
    product_id INT REFERENCES products(id),  -- References the product being added
    quantity INT NOT NULL,  -- Number of units of the product
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- Time when the product was added
);
"""

# create_cart_table = """
# CREATE TABLE IF NOT EXISTS cart (
#     id SERIAL PRIMARY KEY,
#     user_id INTEGER REFERENCES users(id),
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );
# """

# create_cart_items_table = """
# CREATE TABLE IF NOT EXISTS cart_items (
#     id SERIAL PRIMARY KEY,
#     cart_id INTEGER REFERENCES cart(id) ON DELETE CASCADE,
#     product_id INTEGER REFERENCES products(id),
#     quantity INTEGER NOT NULL
# );
# """

# create_addresses_table = """
# CREATE TABLE IF NOT EXISTS addresses (
#     id SERIAL PRIMARY KEY,
#     user_id INTEGER REFERENCES users(id),
#     address_line1 VARCHAR(255) NOT NULL,
#     address_line2 VARCHAR(255),
#     city VARCHAR(100) NOT NULL,
#     state VARCHAR(100) NOT NULL,
#     postal_code VARCHAR(20) NOT NULL,
#     country VARCHAR(100) NOT NULL,
#     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
# );
# """

create_addresses_table = """
CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255) NOT NULL,
    address_line2 VARCHAR(255),
    postal_code VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

"""

create_orders_table = """
CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    shipping_address_id INTEGER REFERENCES addresses(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

create_order_items_table = """
CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(id),
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);
"""

create_payments_table = """
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
    payment_method VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

create_revoked_tokens_table = """
CREATE TABLE IF NOT EXISTS revoked_tokens (
    id SERIAL PRIMARY KEY,
    jti VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""

tables = [
    create_users_table, 
    create_categories_table, 
    create_products_table, 
    create_cart_table, 
    create_cart_items_table,
    create_addresses_table,
    create_orders_table,     
    create_order_items_table, 
    create_payments_table,
    create_revoked_tokens_table
]

if __name__ == "__main__":
    with app.app_context():
        for table in tables:
            execute_query(table)
        print("All tables created successfully!")
