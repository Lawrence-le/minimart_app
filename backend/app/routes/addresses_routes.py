from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..db import query_db, execute_query

addresses_bp = Blueprint('addresses', __name__)

#* Add New Address
@addresses_bp.route('/add', methods=['POST'])  # POST /api/addresses/add
@jwt_required()
def add_address():
    data = request.json
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    address_line1 = data.get('address_line1')
    address_line2 = data.get('address_line2')
    postal_code = data.get('postal_code')

    if not first_name or not last_name or not address_line1 or not postal_code:
        return jsonify({"error": "First Name, Last Name, Address Line 1, and Postal Code are required"}), 400

    try:
        user_id = get_jwt_identity()
        query = """
            INSERT INTO addresses (user_id, first_name, last_name, address_line1, address_line2, postal_code) 
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        execute_query(query, (user_id, first_name, last_name, address_line1, address_line2, postal_code))

        return jsonify({"message": "Address added successfully!"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Update Address
@addresses_bp.route('/update/<int:address_id>', methods=['PUT'])  # PUT /api/addresses/update/<address_id>
@jwt_required()
def update_address(address_id):
    data = request.json
    first_name = data.get('first_name')
    last_name = data.get('last_name')
    address_line1 = data.get('address_line1')
    address_line2 = data.get('address_line2')
    postal_code = data.get('postal_code')

    if not first_name or not last_name or not address_line1 or not postal_code:
        return jsonify({"error": "First Name, Last Name, Address Line 1, and Postal Code are required"}), 400

    try:
        user_id = get_jwt_identity()
        
        query = "SELECT * FROM addresses WHERE id = %s AND user_id = %s;"
        address = query_db(query, (address_id, user_id), one=True)

        if not address:
            return jsonify({"error": "Address not found"}), 404

        query = """
            UPDATE addresses 
            SET first_name = %s, last_name = %s, address_line1 = %s, address_line2 = %s, postal_code = %s 
            WHERE id = %s AND user_id = %s
        """
        execute_query(query, (first_name, last_name, address_line1, address_line2, postal_code, address_id, user_id))

        return jsonify({"message": "Address updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Delete Address
@addresses_bp.route('/delete/<int:address_id>', methods=['DELETE'])  # DELETE /api/addresses/delete/<address_id>
@jwt_required()
def delete_address(address_id):
    try:
        user_id = get_jwt_identity()

        query = "SELECT * FROM addresses WHERE id = %s AND user_id = %s;"
        address = query_db(query, (address_id, user_id), one=True)

        if not address:
            return jsonify({"error": "Address not found"}), 404

        query = "DELETE FROM addresses WHERE id = %s AND user_id = %s;"
        execute_query(query, (address_id, user_id))

        return jsonify({"message": "Address deleted successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Get All Addresses
@addresses_bp.route('', methods=['GET'])  # GET /api/addresses
@jwt_required()
def get_addresses():
    try:
        user_id = get_jwt_identity()

        query = "SELECT * FROM addresses WHERE user_id = %s;"
        addresses = query_db(query, (user_id,))

        if not addresses:
            return jsonify({"message": "No addresses found"}), 200

        return jsonify({"addresses": addresses}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Get Shipping Address for Orders
@addresses_bp.route('/shipping/<int:address_id>', methods=['GET'])  # GET /api/addresses/shipping/<address_id>
@jwt_required()
def get_shipping_address(address_id):
    try:
        user_id = get_jwt_identity()
        query = "SELECT first_name, last_name, address_line1, address_line2, postal_code FROM addresses WHERE id = %s AND user_id = %s;"
        address = query_db(query, (address_id, user_id), one=True)

        if not address:
            return jsonify({"error": "Address not found"}), 404

        # address_text_block = f"{address['first_name']} {address['last_name']}\n{address['address_line1']}\n{address.get('address_line2', '')}\n{address['postal_code']}"
        address_single_line = f"{address['first_name']} {address['last_name']}, {address['address_line1']}, {address.get('address_line2', '')}, {address['postal_code']}"

        return jsonify({
            # "address_text_block": address_text_block.strip(),
            "address_single_line": address_single_line.strip()
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
