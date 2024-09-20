# backend\app\routes\products_routes.py
from flask import Blueprint, request, jsonify, current_app
from werkzeug.utils import secure_filename
import boto3
from ..utils import admin_required
from ..db import query_db, execute_query

products_bp = Blueprint('products', __name__)


#? Public routes

#* Get all products route [OK]
@products_bp.route('', methods=['GET'])
def get_products():
    try:

        query = """
        SELECT id, name, description, price, stock, category_id, image_url, created_at
        FROM products;
        """
        products = query_db(query) 
        return jsonify({"products": products}), 200
    except Exception as e:
        print(f"Error fetching products: {e}")
        return jsonify({"error": "Failed to fetch products"}), 500


#* Get product route [OK]
@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    try:
        query = """
        SELECT id, name, description, price, stock, category_id, image_url, created_at
        FROM products
        WHERE id = %s;
        """
        product = query_db(query, (product_id,), one=True)
        
        if product:
            return jsonify({"product": product}), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

#* Search products by name or description
@products_bp.route('/search', methods=['GET'])
def search_products():
    search_query = request.args.get('q', '')  # Get the 'q' query parameter

    if not search_query:
        return jsonify({"error": "No search query provided"}), 400

    try:
        # Use ILIKE for case-insensitive search
        query = """
        SELECT id, name, description, price, stock, category_id, image_url, created_at
        FROM products
        WHERE name ILIKE %s OR description ILIKE %s;
        """
        # Add wildcard % to the search term for partial matching
        search_term = f"%{search_query}%"
        products = query_db(query, (search_term, search_term))

        return jsonify({"products": products}), 200

    except Exception as e:
        return jsonify({"error": f"Error searching products: {str(e)}"}), 500

#* Filter products by category [OK]
@products_bp.route('filter/category/<int:category_id>', methods=['GET'])
def get_products_by_category(category_id):
    try:
        query = """
        SELECT id, name, description, price, stock, category_id, image_url, created_at
        FROM products
        WHERE category_id = %s;
        """
        products = query_db(query, (category_id,))
        
        if products:
            return jsonify({"products": products}), 200
        else:
            return jsonify({"message": "No products found for this category"}), 404

    except Exception as e:
        return jsonify({"error": f"Error fetching products by category: {str(e)}"}), 500

#? Admin routes

#* Add product route [OK]
@products_bp.route('', methods=['POST'])
@admin_required  # Protects this route for admin only

def add_product():
    data = request.json
    try:
        query = """
        INSERT INTO products (name, description, price, stock, category_id, image_url)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        execute_query(query, (data['name'], data['description'], data['price'], data['stock'], data['category_id'], data['image_url']))
        return jsonify({"message": "Product added"}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#* Update product route [OK]
@products_bp.route('/<int:product_id>', methods=['PUT'])
@admin_required  #? Protects this route for admin only

def update_product(product_id):
    data = request.json
    try:
        query = """
        UPDATE products
        SET name = %s, description = %s, price = %s, stock = %s, category_id = %s, image_url = %s
        WHERE id = %s
        """
        execute_query(query, (data['name'], data['description'], data['price'], data['stock'], data['category_id'], data['image_url'], product_id))
        return jsonify({"message": "Product updated"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Delete product route [OK]
@products_bp.route('/<int:product_id>', methods=['DELETE'])
@admin_required  # Protects this route for admin only

def delete_product(product_id):
    try:
        query = "DELETE FROM products WHERE id = %s;"
        execute_query(query, (product_id,))
        return jsonify({"message": "Product deleted"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#* Upload product image route [OK]
@products_bp.route('/upload_image', methods=['POST'])
@admin_required  #? Protects this route for admin only

def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    filename = secure_filename(file.filename)

    s3 = boto3.client(
        's3',
        aws_access_key_id=current_app.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=current_app.config['AWS_SECRET_ACCESS_KEY'],
        region_name=current_app.config['S3_REGION']
    )

    try:
        s3.upload_fileobj(
            file,
            current_app.config['S3_BUCKET'],
            filename,
            ExtraArgs={'ACL': 'public-read'}
        )
        s3_url = f"https://{current_app.config['S3_BUCKET']}.s3.amazonaws.com/{filename}"
        return jsonify({"message": "File uploaded", "url": s3_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

#* Update product image route [OK]
@products_bp.route('/update_image/<int:product_id>', methods=['PUT'])
@admin_required  #? Protects this route for admin only
def update_product_image(product_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    # Secure the file name
    filename = secure_filename(file.filename)

    # Initialize the S3 client
    s3 = boto3.client(
        's3',
        aws_access_key_id=current_app.config['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=current_app.config['AWS_SECRET_ACCESS_KEY'],
        region_name=current_app.config['S3_REGION']
    )

    try:
        # Upload the file to S3
        s3.upload_fileobj(
            file,
            current_app.config['S3_BUCKET'],
            filename,
            ExtraArgs={'ACL': 'public-read'}
        )
        
        # Create the S3 URL for the uploaded image
        s3_url = f"https://{current_app.config['S3_BUCKET']}.s3.amazonaws.com/{filename}"

        # Update the product's image URL in the database
        query = """
        UPDATE products
        SET image_url = %s
        WHERE id = %s;
        """
        execute_query(query, (s3_url, product_id))

        return jsonify({"message": "Product image updated", "url": s3_url}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


#* Delete product image route [OK]
@products_bp.route('/delete_image/<int:product_id>', methods=['DELETE'])
@admin_required  #? Protects this route for admin only

def delete_product_image(product_id):
    try:
        current_image_query = "SELECT image_url FROM products WHERE id = %s;"
        product = query_db(current_image_query, (product_id,), one=True)

        if not product:
            return jsonify({"error": "Product not found"}), 404

        current_image_url = product.get('image_url')

        if current_image_url:
            s3 = boto3.client(
                's3',
                aws_access_key_id=current_app.config['AWS_ACCESS_KEY_ID'],
                aws_secret_access_key=current_app.config['AWS_SECRET_ACCESS_KEY'],
                region_name=current_app.config['S3_REGION']
            )
            try:
                s3_key = current_image_url.split(f"https://{current_app.config['S3_BUCKET']}.s3.amazonaws.com/")[-1]
                s3.delete_object(
                    Bucket=current_app.config['S3_BUCKET'],
                    Key=s3_key
                )
            except Exception as e:
                return jsonify({"error": f"Failed to delete image from S3: {str(e)}"}), 500

            update_image_query = "UPDATE products SET image_url = NULL WHERE id = %s;"
            execute_query(update_image_query, (product_id,))
            return jsonify({"message": "Image URL removed and image deleted"}), 200
        else:
            return jsonify({"error": "No image URL to delete"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

