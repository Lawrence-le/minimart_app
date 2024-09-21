# backend\app\routes\payments_routes.py

import stripe
from flask import Flask, jsonify, request, Blueprint, current_app
from config import Config

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('create-checkout-session', methods=['POST'])
def create_checkout_session():
    try:
        frontend_url = current_app.config['FRONTEND_URL'] 
        stripe.api_key = current_app.config['STRIPE_API_KEY']

        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'product_data': {
                        'name': 'Jeans',
                    },
                    'unit_amount': 2000, 
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=f'{frontend_url}/success',
            cancel_url=f'{frontend_url}/cancel',   
        )
        return jsonify({'id': session.id, 'url': session.url})
    except Exception as e:
        print(f"Error: {str(e)}") 
        return jsonify(error=str(e)), 403
