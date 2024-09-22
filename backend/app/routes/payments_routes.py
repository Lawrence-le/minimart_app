# backend/app/routes/payments_routes.py
#* https://docs.stripe.com/testing
#* https://docs.stripe.com/payments/checkout/how-checkout-works?lang=python
#* https://docs.stripe.com/js/custom_checkout/session_object


import stripe
from flask import Flask, jsonify, request, Blueprint, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from config import Config

payments_bp = Blueprint('payments', __name__)


@payments_bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    try:
        # Extract order data from request
        data = request.get_json()
        total_amount = data.get('total_amount', 0) 
        shipping_address = data.get('shipping_address') 
        quantity = data.get('quantity') 
        shipping_cost = data.get('shipping_cost')

        frontend_url = current_app.config['FRONTEND_URL'] 
        stripe.api_key = current_app.config['STRIPE_API_KEY']

        # Define shipping options
        shipping_options = [
            {
                'shipping_rate_data': {
                    'type': 'fixed_amount',
                    'fixed_amount': {
                        'amount': 500,
                        'currency': 'sgd',
                    },
                    'display_name': 'Standard Shipping',
                    'delivery_estimate': {
                        'minimum': {
                            'unit': 'business_day',
                            'value': 1,
                        },
                        'maximum': {
                            'unit': 'business_day',
                            'value': 3,
                        },
                    },
                },
            },
            {
                'shipping_rate_data': {
                    'type': 'fixed_amount',
                    'fixed_amount': {
                        'amount': 1500,  
                        'currency': 'sgd',
                    },
                    'display_name': 'Express Shipping',
                    'delivery_estimate': {
                        'minimum': {
                            'unit': 'business_day',
                            'value': 1,
                        },
                        'maximum': {
                            'unit': 'business_day',
                            'value': 2,
                        },
                    },
                },
            },
            {
                'shipping_rate_data': {
                    'type': 'fixed_amount',
                    'fixed_amount': {
                        'amount': 0,  
                        'currency': 'sgd',
                    },
                    'display_name': 'Free Shipping',
                    'delivery_estimate': {
                        'minimum': {
                            'unit': 'business_day',
                            'value': 3,
                        },
                        'maximum': {
                            'unit': 'business_day',
                            'value': 5,
                        },
                    },
                },
            },
        ]


        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'sgd',
                    'product_data': {
                        'name': 'Total',  
                    },
                    'unit_amount': total_amount, 
                    'shipping_cost': shipping_cost,

                },
                'quantity': quantity, 


            }],
            shipping_options=shipping_options,
            mode='payment',
            success_url=f'{frontend_url}/success',
            cancel_url=f'{frontend_url}/cancel',
            
        )
        return jsonify({'id': session.id, 'url': session.url})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify(error=str(e)), 403

