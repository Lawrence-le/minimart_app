# backend\app\routes\carts_routes.py

from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..db import query_db, execute_query

carts_bp = Blueprint('carts', __name__)

#* Create Empty Cart [OK]
@carts_bp.route('/create_empty', methods=['POST'])
def create_empty_cart():
    user_id = request.json.get('user_id')

    if not user_id:
        return jsonify({"msg": "User ID is required"}), 400


    query = "INSERT INTO carts (user_id) VALUES (%s)"
    execute_query(query, (user_id,))

    return jsonify({"msg": "Empty cart created successfully!"}), 201


#* Add to Cart [OK]
@carts_bp.route('/add', methods=['POST']) # http://localhost:5000/cart/add
@jwt_required() 
def add_to_cart():
    data = request.json
    product_id = data.get('product_id')
    quantity = data.get('quantity', 1)  # Default to 1 if not provided

    if not product_id:
        return jsonify({"error": "Product ID is required"}), 400

    try:
        product = query_db("SELECT * FROM products WHERE id = %s;", (product_id,), one=True)
        if not product:
            return jsonify({"error": "Product not found"}), 404

        user_id = get_jwt_identity()
        
        cart_item = query_db(
            "SELECT * FROM carts WHERE user_id = %s AND product_id = %s;", 
            (user_id, product_id), 
            one=True
        )

        if cart_item:
            execute_query(
                "UPDATE carts SET quantity = quantity + %s WHERE user_id = %s AND product_id = %s;", 
                (quantity, user_id, product_id)
            )
        else:
            execute_query(
                "INSERT INTO carts (user_id, product_id, quantity) VALUES (%s, %s, %s);", 
                (user_id, product_id, quantity)
            )

        return jsonify({"message": "Product added to cart"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Update Cart Quantity [OK]
@carts_bp.route('/update/<int:product_id>', methods=['PUT']) # /api/carts/update/<product_id>
@jwt_required()  
def update_cart_quantity(product_id):
    data = request.json
    quantity = data.get('quantity')

    if quantity is None or quantity <= 0:
        return jsonify({"error": "Valid quantity is required"}), 400

    try:
        user_id = get_jwt_identity()
        
        cart_item = query_db(
            "SELECT * FROM carts WHERE user_id = %s AND product_id = %s;", 
            (user_id, product_id), 
            one=True
        )

        if cart_item:
            execute_query(
                "UPDATE carts SET quantity = %s WHERE user_id = %s AND product_id = %s;", 
                (quantity, user_id, product_id)
            )
            return jsonify({"message": "Cart updated"}), 200
        else:
            return jsonify({"error": "Product not found in cart"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Remove Product from Cart [OK]
@carts_bp.route('/remove/<int:product_id>', methods=['DELETE']) #  /api/carts/remove/<product_id>
@jwt_required()  
def remove_from_cart(product_id):
    try:

        user_id = get_jwt_identity()
        

        cart_item = query_db(
            "SELECT * FROM carts WHERE user_id = %s AND product_id = %s;", 
            (user_id, product_id),
            one=True
        )

        if not cart_item:
            return jsonify({"error": "Product not found in cart"}), 404

        execute_query(
            "DELETE FROM carts WHERE user_id = %s AND product_id = %s;", 
            (user_id, product_id)
        )

        return jsonify({"message": "Product removed from cart"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    
#* Get Cart Items [OK]
@carts_bp.route('', methods=['GET']) # GET /api/carts
@jwt_required()  
def get_cart_items():
    try:

        user_id = get_jwt_identity()
        
        cart_items = query_db(
            "SELECT * FROM carts WHERE user_id = %s;", 
            (user_id,)
        )
        
        if not cart_items: 
            return jsonify({"message": "No items in cart"}), 200
            
        return jsonify({"cart_items": cart_items}), 200
        # return jsonify({"user_id": user_id, "cart_items": cart_items}), 200


    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Clear Cart Items []
@carts_bp.route('/clear', methods=['DELETE']) # /api/carts/clear
@jwt_required()  
def clear_cart():
    try:
        user_id = get_jwt_identity()
        
        cart_items = query_db(
            "SELECT * FROM carts WHERE user_id = %s;", 
            (user_id,)
        )

        if not cart_items:
            return jsonify({"message": "Cart is already empty"}), 404

        execute_query(
            "DELETE FROM carts WHERE user_id = %s;", 
            (user_id,)
        )

        return jsonify({"message": "Cart cleared"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500



#* Get Cart Total []
@carts_bp.route('/total', methods=['GET'])  # GET /api/carts/total
@jwt_required()
def get_cart_total():
    try:
        user_id = get_jwt_identity()

        total = query_db("""
            SELECT SUM(c.quantity * p.price) AS total
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = %s
            GROUP BY c.user_id;
        """, (user_id,), one=True)

        if total and total['total'] is not None:
            return jsonify({"total": float(total['total'])}), 200
        else:
            return jsonify({"total": 0}), 200 

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Get All Cart Products []
@carts_bp.route('/products', methods=['GET'])  # GET /api/carts/products
@jwt_required()
def get_cart_products():
    try:
        user_id = get_jwt_identity()

        cart_products = query_db("""
            SELECT c.id, c.product_id, c.quantity, p.name, p.price, p.image_url
            FROM carts c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = %s;
        """, (user_id,))

        if cart_products:
            return jsonify({"cart_products": cart_products}), 200
        else:
            return jsonify({"message": "No items in cart"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
