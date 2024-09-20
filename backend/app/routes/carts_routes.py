# backend\app\routes\carts_routes.py

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..db import query_db, execute_query

carts_bp = Blueprint('carts', __name__)

#* Create Empty Cart []
@carts_bp.route('/create_empty', methods=['POST'])
def create_empty_cart():
    user_id = request.json.get('user_id')

    if not user_id:
        return jsonify({"msg": "User ID is required"}), 400

    # Logic to create an empty cart for the user
    # For example:
    query = "INSERT INTO carts (user_id) VALUES (%s)"
    execute_query(query, (user_id,))

    return jsonify({"msg": "Empty cart created successfully!"}), 201


#* Add to Cart [OK]
@carts_bp.route('/add', methods=['POST']) # http://localhost:5000/cart/add
@jwt_required()  # Ensures the user is logged in
def add_to_cart():
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)  # Default to 1 if not provided

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    try:
        # Check if product exists
        product = query_db("SELECT * FROM products WHERE id = %s;", (product_id,), one=True)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        # Get the current user ID from JWT
        user_id = get_jwt_identity()
        
        # Check if the product is already in the cart for the user
        cart_item = query_db(
            "SELECT * FROM cart WHERE user_id = %s AND product_id = %s;", 
            (user_id, product_id), 
            one=True
        )

        if cart_item:
            # If the product is already in the cart, update the quantity
            execute_query(
                "UPDATE cart SET quantity = quantity + %s WHERE user_id = %s AND product_id = %s;", 
                (quantity, user_id, product_id)
            )
        else:
            # If the product is not in the cart, insert it
            execute_query(
                "INSERT INTO cart (user_id, product_id, quantity) VALUES (%s, %s, %s);", 
                (user_id, product_id, quantity)
            )

        return jsonify({"message": "Product added to cart"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Update Cart Quantity [OK]
@carts_bp.route('/update/<int:product_id>', methods=['PUT']) # /api/carts/update/<product_id>
@jwt_required()  # Ensures the user is logged in
def update_cart_quantity(product_id):
    data = request.json
    quantity = data.get('quantity')

    if quantity is None or quantity <= 0:
        return jsonify({"error": "Valid quantity is required"}), 400

    try:
        # Get the current user ID from JWT
        user_id = get_jwt_identity()
        
        # Check if the product is in the cart for the user
        cart_item = query_db(
            "SELECT * FROM cart WHERE user_id = %s AND product_id = %s;", 
            (user_id, product_id), 
            one=True
        )

        if cart_item:
            # Update the quantity if the product is already in the cart
            execute_query(
                "UPDATE cart SET quantity = %s WHERE user_id = %s AND product_id = %s;", 
                (quantity, user_id, product_id)
            )
            return jsonify({"message": "Cart updated"}), 200
        else:
            return jsonify({"error": "Product not found in cart"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Remove Product from Cart [OK]
@carts_bp.route('/remove/<int:product_id>', methods=['DELETE']) #  /api/carts/remove/<product_id>
@jwt_required()  # Ensures the user is logged in
def remove_from_cart(product_id):
    try:
        # Get the current user ID from JWT
        user_id = get_jwt_identity()
        
        # Check if the product exists in the cart
        cart_item = query_db(
            "SELECT * FROM cart WHERE user_id = %s AND product_id = %s;", 
            (user_id, product_id),
            one=True
        )

        if not cart_item:
            return jsonify({"error": "Product not found in cart"}), 404

        # Remove the product from the cart
        execute_query(
            "DELETE FROM cart WHERE user_id = %s AND product_id = %s;", 
            (user_id, product_id)
        )

        return jsonify({"message": "Product removed from cart"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
#* Get Cart Items [OK]
@carts_bp.route('', methods=['GET']) # GET /api/carts
@jwt_required()  # Ensures the user is logged in
def get_cart_items():
    try:
        # Get the current user ID from JWT
        user_id = get_jwt_identity()
        
        # Retrieve all items in the cart for the user
        cart_items = query_db(
            "SELECT * FROM cart WHERE user_id = %s;", 
            (user_id,)
        )
        
        if not cart_items:  # Check if the list is empty
            return jsonify({"message": "No items in cart"}), 200
            
        return jsonify({"cart_items": cart_items}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Clear Cart Items []
@carts_bp.route('/clear', methods=['DELETE']) # /api/carts/clear
@jwt_required()  # Ensures the user is logged in
def clear_cart():
    try:
        # Get the current user ID from JWT
        user_id = get_jwt_identity()
        
        # Check if the cart is already empty
        cart_items = query_db(
            "SELECT * FROM cart WHERE user_id = %s;", 
            (user_id,)
        )

        if not cart_items:
            # If the cart is empty, return a message indicating so
            return jsonify({"message": "Cart is already empty"}), 404

        # If the cart is not empty, clear all items from the user's cart
        execute_query(
            "DELETE FROM cart WHERE user_id = %s;", 
            (user_id,)
        )

        return jsonify({"message": "Cart cleared"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
