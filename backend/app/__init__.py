# backend\app\__init__.py

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
# from ..config import Config
from config import Config
from app.utils import is_token_revoked


jwt = JWTManager()


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    jwt.init_app(app)
    CORS(app)

    @jwt.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        return is_token_revoked(jwt_payload)

    from .routes.admin_routes import admin_bp
    from .routes.user_routes import user_bp
    from .routes.products_routes import products_bp
    from .routes.categories_routes import categories_bp
    from .routes.carts_routes import carts_bp
    from .routes.addresses_routes import addresses_bp
    from .routes.orders_routes import orders_bp
    from .routes.payments_routes import payments_bp

    app.register_blueprint(admin_bp, url_prefix='/api/admin')
    app.register_blueprint(user_bp, url_prefix='/api/user')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')
    app.register_blueprint(carts_bp, url_prefix='/api/carts')
    app.register_blueprint(addresses_bp, url_prefix='/api/addresses')
    app.register_blueprint(orders_bp, url_prefix="/api/orders")
    app.register_blueprint(payments_bp, url_prefix="/api/payments")
    # app.register_blueprint(create_checkout_session_bp, url_prefix="/api/create-checkout-session")


    return app
