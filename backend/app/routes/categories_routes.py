# backend\app\routes\admin_categories_routes.py

from flask import Blueprint, request, jsonify
from ..db import query_db, execute_query
from ..utils import admin_required


categories_bp = Blueprint('categories', __name__)


#? Public routes

#* Get All Categories [OK]
@categories_bp.route('', methods=['GET'])
def get_categories():
    try:
        # Fetch all categories from the database
        query = "SELECT * FROM categories;"
        categories = query_db(query)  # No need for fetch_all=True
        return jsonify(categories), 200
    except Exception as e:
        print(f"Error fetching categories: {e}")
        return jsonify({"error": "Failed to fetch categories"}), 500

#* Get Category [OK]
@categories_bp.route('/<int:category_id>', methods=['GET'])
def get_category(category_id):
    try:
        # Fetch a single category by ID
        query = "SELECT * FROM categories WHERE id = %s;"
        category = query_db(query, (category_id,) )
        if category:
            return jsonify(category), 200
        else:
            return jsonify({"error": "Category not found"}), 404
    except Exception as e:
        print(f"Error fetching category: {e}")
        return jsonify({"error": "Failed to fetch category"}), 500


#? Admin routes

#* Update Categories [OK]
@categories_bp.route('/<int:category_id>', methods=['PUT'])
@admin_required  # Protects this route for admin only

def update_category(category_id):
    try:
        data = request.json
        name = data.get('name')
        if not name:
            return jsonify({"error": "Category name is required"}), 400
        query = "UPDATE categories SET name = %s WHERE id = %s;"
        execute_query(query, (name, category_id))
        return jsonify({"message": "Category updated successfully"}), 200
    except Exception as e:
        print(f"Error updating category: {e}")
        return jsonify({"error": "Failed to update category"}), 500
    

#* Add Category [OK]
@categories_bp.route('', methods=['POST'])
@admin_required  # Protects this route for admin only
def add_category():
    try:
        data = request.json
        name = data.get('name')

        # # Check if categeory name is present during entry
        # if not name:
        #     return jsonify({"error": "Category name is required"}), 400

        # Check for Existing Category
        query = "SELECT * FROM categories WHERE name = %s;"
        existing_category = query_db(query, (name,))
        if existing_category:
            return jsonify({"error": "Category with this name already exists"}), 400

        # Retrieve Max ID
        query = "SELECT MAX(id) FROM categories;"
        max_id_result = query_db(query, one=True)
        next_id = (max_id_result['max'] or 0) + 1

        # Insert New Category with the calculated ID
        query = "INSERT INTO categories (id, name) VALUES (%s, %s);"
        execute_query(query, (next_id, name))

        # Return Success Response
        return jsonify({"id": next_id}), 201

    except Exception as e:
        print(f"Error adding category: {e}")
        return jsonify({"error": "Failed to add category", "message": str(e)}), 500




#* Delete Category [OK]
@categories_bp.route('/<int:category_id>', methods=['DELETE'])
@admin_required  # Protects this route for admin only
def delete_category(category_id):
    try:
        # Check if the category exists
        query = "SELECT * FROM categories WHERE id = %s;"
        category = query_db(query, (category_id,), one=True)  # 'one=True' to get a single result

        if not category:
            return jsonify({"error": "Category not found"}), 404

        # Proceed with deletion
        query = "DELETE FROM categories WHERE id = %s;"
        execute_query(query, (category_id,))
        return jsonify({"message": "Category deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting category: {e}")  
        return jsonify({"error": f"Failed to delete category: {str(e)}"}), 500
