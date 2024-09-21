from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..db import query_db, execute_query

orders_bp = Blueprint('orders', __name__)

"""
I need to do this checking before i create an order

1. Validates the shipping address. If no shipping address return error
2. Calculate the total from the user's cart items
3. Inserts a new order into the orders table
4. Creates corresponding entries in the order_items table for each item in the cart
5. Clears the cart after the order is created

"""

#* Create Order [OK]
@orders_bp.route('', methods=['POST'])  # POST /api/orders
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    shipping_address_id = request.json.get('shipping_address_id')

    #1. Validates the shipping address. If no shipping address return error
    if not shipping_address_id:
        return jsonify({"error": "Shipping address ID is required"}), 400

    #2. Calculate the total amount from cart items
    total_query = """
        SELECT SUM(c.quantity * p.price) AS total
        FROM carts c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = %s;
    """
    total_result = query_db(total_query, (user_id,), one=True)
    total = total_result['total'] if total_result and total_result['total'] is not None else 0.0

    #3. Inserts a new order into the orders table
    order_query = """
        INSERT INTO orders (user_id, total, shipping_address_id)
        VALUES (%s, %s, %s) RETURNING id;
    """
    order_id = execute_query(order_query, (user_id, total, shipping_address_id))

    #4. Creates corresponding entries in the order_items table for each item in the cart
    cart_items_query = """
        SELECT product_id, quantity, price_at_purchase
        FROM carts
        WHERE user_id = %s;
    """
    cart_items = query_db(cart_items_query, (user_id,))

    for item in cart_items:
        order_item_query = """
            INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase)
            VALUES (%s, %s, %s, %s);
        """
        execute_query(order_item_query, (order_id, item['product_id'], item['quantity'], item['price_at_purchase']))

    #5. Clears the cart after the order is created
    execute_query("DELETE FROM carts WHERE user_id = %s;", (user_id,))

    return jsonify({"message": "Order created successfully!", "order_id": order_id}), 201


#* Get User Orders [OK]
@orders_bp.route('', methods=['GET'])  # GET /api/orders
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    try:
        orders = query_db("SELECT * FROM orders WHERE user_id = %s;", (user_id,))
        return jsonify({"orders": orders}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Get Order Details [OK]
@orders_bp.route('/<int:order_id>', methods=['GET'])  # GET /api/orders/<order_id>
@jwt_required()
def get_order_details(order_id):
    user_id = get_jwt_identity()
    try:
        order = query_db("SELECT * FROM orders WHERE id = %s AND user_id = %s;", (order_id, user_id), one=True)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order_items = query_db("SELECT * FROM order_items WHERE order_id = %s;", (order_id,))
        return jsonify({"order": order, "order_items": order_items}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
