# backend/app/routes/payments_routes.py
#* https://docs.stripe.com/testing
#* https://docs.stripe.com/payments/checkout/how-checkout-works?lang=python
#* https://docs.stripe.com/js/custom_checkout/session_object


import stripe
from flask import Flask, jsonify, request, Blueprint, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from ..db import query_db, execute_query
from config import Config

payments_bp = Blueprint('payments', __name__)

@payments_bp.route('/create-checkout-session', methods=['POST'])
@jwt_required()
def create_checkout_session():
    try:
        # Extract order data from request
        data = request.get_json()
        # total_amount = data.get('total_amount', 0)
        # shipping_address = data.get('shipping_address') 
        shipping_cost = data.get('shipping_cost', 0) 
        order_items = data.get('order_items', [])  
        order_id = data.get('order_id') 


        frontend_url = current_app.config['FRONTEND_URL']
        stripe.api_key = current_app.config['STRIPE_API_KEY']

        # Prepare line items for the Stripe checkout session
        line_items = []
        for item in order_items:
            line_items.append({
                'price_data': {
                    'currency': 'sgd',
                    'product_data': {
                        'name': item['name'],  
                    },
                    'unit_amount': item['price'], 
                },
                'quantity': item['quantity'],
            })

        if shipping_cost > 0:
            line_items.append({
                'price_data': {
                    'currency': 'sgd',
                    'product_data': {
                        'name': 'Shipping Cost', 
                    },
                    'unit_amount': shipping_cost,
                },
                'quantity': 1, 
            })


        # Create a checkout session
        session = stripe.checkout.Session.create(
            # shipping_options=shipping_options,
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            metadata={'order_id': str(order_id)},  # Store order_id in metadata
            # success_url=f'{frontend_url}/success',
            success_url=f'{frontend_url}/success?order_id={order_id}',
            cancel_url=f'{frontend_url}/cancel?order_id={order_id}',
        )
        return jsonify({'id': session.id, 'url': session.url})
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify(error=str(e)), 403
    

        # shipping_options = [
        #             {
        #                 'shipping_rate_data': {
        #                     'type': 'fixed_amount',
        #                     'fixed_amount': {
        #                         'amount': 500,
        #                         'currency': 'sgd',
        #                     },
        #                     'display_name': 'Standard Shipping',
        #                     'delivery_estimate': {
        #                         'minimum': {
        #                             'unit': 'business_day',
        #                             'value': 1,
        #                         },
        #                         'maximum': {
        #                             'unit': 'business_day',
        #                             'value': 3,
        #                         },
        #                     },
        #                 },
        #             },
        #             {
        #                 'shipping_rate_data': {
        #                     'type': 'fixed_amount',
        #                     'fixed_amount': {
        #                         'amount': 1500,  
        #                         'currency': 'sgd',
        #                     },
        #                     'display_name': 'Express Shipping',
        #                     'delivery_estimate': {
        #                         'minimum': {
        #                             'unit': 'business_day',
        #                             'value': 1,
        #                         },
        #                         'maximum': {
        #                             'unit': 'business_day',
        #                             'value': 2,
        #                         },
        #                     },
        #                 },
        #             },
        #             {
        #                 'shipping_rate_data': {
        #                     'type': 'fixed_amount',
        #                     'fixed_amount': {
        #                         'amount': 0,  
        #                         'currency': 'sgd',
        #                     },
        #                     'display_name': 'Free Shipping',
        #                     'delivery_estimate': {
        #                         'minimum': {
        #                             'unit': 'business_day',
        #                             'value': 3,
        #                         },
        #                         'maximum': {
        #                             'unit': 'business_day',
        #                             'value': 5,
        #                         },
        #                     },
        #                 },
        #             },
        #         ]

    

# @payments_bp.route('/retrieve-session', methods=['POST'])
# @jwt_required()
# def retrieve_session():
#     try:
#         # Log the raw request data for debugging
#         print("Request data:", request.data)
        
#         # Get session ID from request data
#         data = request.get_json()
#         print("Decoded JSON data:", data)  # Log the decoded JSON

#         session_id = data.get('session_id')
        
#         if not session_id:
#             return jsonify({"error": "session_id is required"}), 400
        
#         # Retrieve the Stripe session
#         session = stripe.checkout.Session.retrieve(session_id)
        
#         # Extract shipping cost (assuming it's in cents from Stripe)
#         shipping_cost = session.shipping_cost['amount_total'] / 100  # Convert to dollars if it's in cents
        
#         # Assuming order_id is stored in metadata for easier association
#         order_id = session.metadata['order_id']  
        
#         # Update the order with the shipping cost
#         execute_query("UPDATE orders SET shipping_cost = %s WHERE id = %s;", (shipping_cost, order_id))
        
#         # Return the session details
#         return jsonify(session), 200
#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return jsonify(error=str(e)), 403



# @payments_bp.route('/create-checkout-session', methods=['POST'])
# @jwt_required()
# def create_checkout_session():
#     try:
#         # Extract order data from request
#         data = request.get_json()
#         total_amount = data.get('total_amount', 0) 
#         shipping_address = data.get('shipping_address') 
#         quantity = data.get('quantity') 
#         shipping_cost = data.get('shipping_cost')

#         frontend_url = current_app.config['FRONTEND_URL'] 
#         stripe.api_key = current_app.config['STRIPE_API_KEY']

#         # Define shipping options
#         shipping_options = [
#             {
#                 'shipping_rate_data': {
#                     'type': 'fixed_amount',
#                     'fixed_amount': {
#                         'amount': 500,
#                         'currency': 'sgd',
#                     },
#                     'display_name': 'Standard Shipping',
#                     'delivery_estimate': {
#                         'minimum': {
#                             'unit': 'business_day',
#                             'value': 1,
#                         },
#                         'maximum': {
#                             'unit': 'business_day',
#                             'value': 3,
#                         },
#                     },
#                 },
#             },
#             {
#                 'shipping_rate_data': {
#                     'type': 'fixed_amount',
#                     'fixed_amount': {
#                         'amount': 1500,  
#                         'currency': 'sgd',
#                     },
#                     'display_name': 'Express Shipping',
#                     'delivery_estimate': {
#                         'minimum': {
#                             'unit': 'business_day',
#                             'value': 1,
#                         },
#                         'maximum': {
#                             'unit': 'business_day',
#                             'value': 2,
#                         },
#                     },
#                 },
#             },
#             {
#                 'shipping_rate_data': {
#                     'type': 'fixed_amount',
#                     'fixed_amount': {
#                         'amount': 0,  
#                         'currency': 'sgd',
#                     },
#                     'display_name': 'Free Shipping',
#                     'delivery_estimate': {
#                         'minimum': {
#                             'unit': 'business_day',
#                             'value': 3,
#                         },
#                         'maximum': {
#                             'unit': 'business_day',
#                             'value': 5,
#                         },
#                     },
#                 },
#             },
#         ]


#         session = stripe.checkout.Session.create(
#             payment_method_types=['card'],
#             line_items=[{
#                 'price_data': {
#                     'currency': 'sgd',
#                     'product_data': {
#                         'name': 'Total',  
#                     },
#                     'unit_amount': total_amount, 
#                     'shipping_cost': shipping_cost,

#                 },
#                 'quantity': quantity, 


#             }],
#             shipping_options=shipping_options,
#             mode='payment',
#             success_url=f'{frontend_url}/success',
#             cancel_url=f'{frontend_url}/cancel',
            
#         )
#         return jsonify({'id': session.id, 'url': session.url})
#     except Exception as e:
#         print(f"Error: {str(e)}")
#         return jsonify(error=str(e)), 403

