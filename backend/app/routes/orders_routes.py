from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..db import query_db, execute_query
from ..utils import admin_required

orders_bp = Blueprint('orders', __name__)

"""
I need to do this checking before i create an order

1. Validates the shipping address. If no shipping address return error
2. Check if the cart has items
3. Calculate the total from the user's cart items
4. Inserts a new order into the orders table
5. Creates corresponding entries in the order_items table for each item in the cart
6. Clears the cart after the order is created

"""

#! NEW ORDER_TABLE 

#* Create Order [Updated]
@orders_bp.route('', methods=['POST'])  # POST /api/orders
@jwt_required()
def create_order():
    user_id = get_jwt_identity()
    shipping_cost = request.json.get('shipping_cost')
    shipping_address = request.json.get('shipping_address')

    # 1. Validate the shipping address. If no shipping address, return an error.
    if not shipping_address:
        return jsonify({"error": "Shipping address is required"}), 400

    # 2. Check if the cart has items
    cart_items_query = """
        SELECT COUNT(*) AS item_count
        FROM carts
        WHERE user_id = %s;
    """
    cart_item_count = query_db(cart_items_query, (user_id,), one=True)['item_count']

    if cart_item_count == 0:
        return jsonify({"error": "Cart is empty, cannot create order."}), 400

    # 3. Calculate the total amount from cart items
    total_query = """
        SELECT SUM(c.quantity * p.price) AS total
        FROM carts c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = %s;
    """
    total_result = query_db(total_query, (user_id,), one=True)
    total = total_result['total'] if total_result and total_result['total'] is not None else 0.0

    # 4. Insert a new order into the orders table
    order_query = """
        INSERT INTO orders (user_id, total, shipping_cost, shipping_address)
        VALUES (%s, %s, %s, %s) RETURNING id;
    """
    order_id_result = execute_query(order_query, (user_id, total, shipping_cost, shipping_address), fetch=True)
    order_id = order_id_result[0] if order_id_result else None

    if order_id is None:
        return jsonify({"error": "Failed to create order."}), 500

    # 5. Create corresponding entries in the order_items table for each item in the cart
    cart_items_query = """
        SELECT c.product_id, c.quantity, p.price, p.name, p.description, p.image_url
        FROM carts c
        JOIN products p ON c.product_id = p.id
        WHERE c.user_id = %s;
    """
    cart_items = query_db(cart_items_query, (user_id,))

    for item in cart_items:
        order_item_query = """
            INSERT INTO order_items (order_id, name, description, image_url, quantity, price)
            VALUES (%s, %s, %s, %s, %s, %s);
        """
        execute_query(order_item_query, (
            order_id,
            item['name'],
            item['description'],
            item['image_url'],
            item['quantity'],
            item['price']
        ))

    # # 6. Clear the cart after the order is created
    # execute_query("DELETE FROM carts WHERE user_id = %s;", (user_id,))

    return jsonify({"message": "Order created successfully!", "order_id": order_id}), 201

#!

# #* Create Order [OK]
# @orders_bp.route('', methods=['POST'])  # POST /api/orders
# @jwt_required()
# def create_order():
#     user_id = get_jwt_identity()
#     shipping_cost = request.json.get('shipping_cost')
#     shipping_address = request.json.get('shipping_address')

#     # # 1. Validate the shipping address. If no shipping address, return an error.
#     # if not shipping_address_id:
#     #     print({"error": "Shipping address ID is required"})
#     #     return jsonify({"error": "Shipping address ID is required"}), 400

#     # 2. Check if the cart has items
#     cart_items_query = """
#         SELECT COUNT(*) AS item_count
#         FROM carts
#         WHERE user_id = %s;
#     """
#     cart_item_count = query_db(cart_items_query, (user_id,), one=True)['item_count']

#     if cart_item_count == 0:
#         return jsonify({"error": "Cart is empty, cannot create order."}), 400

#     # 3. Calculate the total amount from cart items
#     total_query = """
#         SELECT SUM(c.quantity * p.price) AS total
#         FROM carts c
#         JOIN products p ON c.product_id = p.id
#         WHERE c.user_id = %s;
#     """
#     total_result = query_db(total_query, (user_id,), one=True)
#     total = total_result['total'] if total_result and total_result['total'] is not None else 0.0

#     # 4. Insert a new order into the orders table
#     order_query = """
#         INSERT INTO orders (user_id, total, shipping_cost, shipping_address)
#         VALUES (%s, %s, %s, %s) RETURNING id;
#     """
#     order_id_result = execute_query(order_query, (user_id, total, shipping_cost, shipping_address), fetch=True)
#     order_id = order_id_result[0] if order_id_result else None

#     if order_id is None:
#         return jsonify({"error": "Failed to create order."}), 500

#     # 5. Create corresponding entries in the order_items table for each item in the cart
#     cart_items_query = """
#         SELECT c.product_id, c.quantity, p.price
#         FROM carts c
#         JOIN products p ON c.product_id = p.id
#         WHERE c.user_id = %s;
#     """
#     cart_items = query_db(cart_items_query, (user_id,))

#     for item in cart_items:
#         order_item_query = """
#             INSERT INTO order_items (order_id, product_id, quantity, price)
#             VALUES (%s, %s, %s, %s);
#         """
#         execute_query(order_item_query, (order_id, item['product_id'], item['quantity'], item['price']))

#     # # 6. Clear the cart after the order is created
#     # execute_query("DELETE FROM carts WHERE user_id = %s;", (user_id,))

#     return jsonify({"message": "Order created successfully!", "order_id": order_id}), 201



#* Get User Orders [OK]
@orders_bp.route('', methods=['GET'])  # GET /api/orders
@jwt_required()
def get_user_orders():
    user_id = get_jwt_identity()
    try:
        orders = query_db("SELECT * FROM orders WHERE user_id = %s;", (user_id,))
        # return jsonify({"orders": orders}), 200
        return jsonify(orders), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# #* Get Order Details [OK]
# @orders_bp.route('/<int:order_id>', methods=['GET'])  # GET /api/orders/<order_id>
# @jwt_required()
# def get_order_details(order_id):
#     user_id = get_jwt_identity()
#     try:
#         order = query_db("SELECT * FROM orders WHERE id = %s AND user_id = %s;", (order_id, user_id), one=True)
#         if not order:
#             return jsonify({"error": "Order not found"}), 404

#         query = """
#         SELECT oi.id, oi.order_id, oi.product_id, oi.price, oi.quantity, p.name, p.image_url
#         FROM order_items oi
#         JOIN products p ON oi.product_id = p.id
#         WHERE oi.order_id = %s;
#         """
#         order_items = query_db(query, (order_id,))
        
#         return jsonify({"order_items": order_items}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


#* Get Order Items [OK]
@orders_bp.route('/<int:order_id>', methods=['GET'])  # GET /api/orders/<order_id>
@jwt_required()
def get_order_details(order_id):
    user_id = get_jwt_identity()
    try:
        order = query_db("SELECT * FROM orders WHERE id = %s AND user_id = %s;", (order_id, user_id), one=True)
        if not order:
            return jsonify({"error": "Order not found"}), 404

        order_items_query = """
            SELECT oi.id, oi.name, oi.description, oi.image_url, oi.price, oi.quantity
            FROM order_items oi
            WHERE oi.order_id = %s;
        """
        order_items = query_db(order_items_query, (order_id,))

        # Return only the order items
        return jsonify({"order_items": order_items}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500






#* Confirm Order Status [OK]
@orders_bp.route('/<int:order_id>/confirm', methods=['PUT'])  # PUT /api/orders/<order_id>/confirm
@jwt_required()
def confirm_order_status(order_id):
    user_id = get_jwt_identity()
    try:

        print(f"User ID: {user_id}, Order ID: {order_id}")

        # Check order for order id and user id
        query = "SELECT * FROM orders WHERE id = %s AND user_id = %s;"
        print(f"Executing query: {query} with parameters: (id={order_id}, user_id={user_id})")
        order = query_db(query, (order_id, user_id), one=True)
        
        if not order:
            print("Order not found.")
            return jsonify({"error": "Order not found"}), 404
        
        print("Found order:", order)

        # Update the order status
        update_query = "UPDATE orders SET status = %s WHERE id = %s;"
        print(f"Executing update: {update_query} with parameters: (status='Order Confirmed', id={order_id})")
        execute_query(update_query, ('Order Confirmed', order_id))
        
        print("Order status updated successfully.")
        return jsonify({"message": "Order status updated to Order Confirmed"}), 200
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500



#* Change Order Status to Shipped [OK]
@orders_bp.route('/<int:order_id>/shipped', methods=['PUT'])  # PUT /api/orders/<order_id>/shipped
@admin_required()
def confirm_order_status(order_id):

    try:

        # Check order for order id and user id
        query = "SELECT * FROM orders WHERE id = %s;"
        order = query_db(query, (order_id), one=True)
        
        if not order:
            print("Order not found.")
            return jsonify({"error": "Order not found"}), 404
        
        print("Found order:", order)

        # Update the order status
        update_query = "UPDATE orders SET status = %s WHERE id = %s;"
        execute_query(update_query, ('Shipped', order_id))
        
        print("Order status updated successfully.")
        return jsonify({"message": "Order status updated to Shipped"}), 200
    except Exception as e:
        print(f"Error occurred: {str(e)}")
        return jsonify({"error": str(e)}), 500

# #* Get Order Details [OK]
# @orders_bp.route('/<int:order_id>', methods=['GET'])  # GET /api/orders/<order_id>
# @jwt_required()
# def get_order_details(order_id):
#     user_id = get_jwt_identity()
#     try:
#         order = query_db("SELECT * FROM orders WHERE id = %s AND user_id = %s;", (order_id, user_id), one=True)
#         if not order:
#             return jsonify({"error": "Order not found"}), 404

#         order_items = query_db("SELECT * FROM order_items WHERE order_id = %s;", (order_id,))
#         # return jsonify({"order": order, "order_items": order_items}), 200
#         return jsonify({"order_items": order_items}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500

# #* Confirm Order Status [OK]
# @orders_bp.route('/<int:order_id>/confirm', methods=['PUT'])  # PUT /api/orders/<order_id>/confirm
# @jwt_required()
# def confirm_order_status(order_id):
#     user_id = get_jwt_identity()
#     try:
#         # Check order for order id and user id
#         order = query_db("SELECT * FROM orders WHERE id = %s AND user_id = %s;", (order_id, user_id), one=True)
#         if not order:
#             return jsonify({"error": "Order not found"}), 404
        
#         # Update the order status
#         update_query = "UPDATE orders SET status = %s WHERE id = %s;"
#         query_db(update_query, ('Order Confirmed', order_id))
        
#         return jsonify({"message": "Order status updated to Order Confirmed"}), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 500