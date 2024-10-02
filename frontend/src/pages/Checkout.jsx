// frontend/src/pages/Checkout.jsx

import { useEffect, useState } from "react";
import { Button, Row, Col, Card, Container, Spinner } from "react-bootstrap";
import {
  getCartProducts,
  getCartTotal,
  clearCart,
} from "../services/cartsService";
import { getAddresses, getShippingAddress } from "../services/addressesService";
import CartProductCard from "../components/CartProductCard";
import AddressForm from "../components/AddressForm";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/ordersService";
import { useNavigate } from "react-router-dom";
import { getOrderDetails, getUserOrders } from "../services/ordersService";
import { createCheckoutSession } from "../services/paymentService";

import "../styles/cartStyles.css";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCart, setTotalCart] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const { shippingCost } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [orderCreated, setOrderCreated] = useState(false);
  // const [orderItems, setOrderItems] = useState([]);
  const navigate = useNavigate();

  const updateTotals = (totalAmount) => {
    setTotalCart(totalAmount.toFixed(2));
    setTotalOrder(
      (parseFloat(totalAmount) + parseFloat(shippingCost)).toFixed(2)
    );
  };

  useEffect(() => {
    const fetchCartData = async () => {
      try {
        const cartResponse = await getCartProducts();
        setCartItems(cartResponse);
        const totalAmount = await getCartTotal();
        updateTotals(totalAmount);
      } catch (error) {
        console.error("Failed to fetch cart data.", error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const addressList = await getAddresses();
        // console.log("addressList:", addressList);
        setAddresses(addressList);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartData();
    fetchAddresses();
  }, [shippingCost]);

  // //! CHECK order id
  // useEffect(() => {
  //   const fetchOrderData = async () => {
  //     try {
  //       const orderResponse = await getUserOrders();
  //       const orderId = orderResponse[0].id;
  //       console.log("This order's response: ", orderResponse);
  //       console.log("This order's ID: ", orderId);
  //     } catch (error) {
  //       console.error("Error fetching order data:", error);
  //     }
  //   };

  //   fetchOrderData();
  // }, []);

  const handleProceedToPayment = async () => {
    if (!addresses) {
      alert("Please add an address before proceeding to payment.");
      return;
    }

    if (selectedAddressId) {
      try {
        // Step 1: Fetch the Shipping Address
        // console.log("selectedAddressId:", selectedAddressId);
        const shippingAddressData = await getShippingAddress(selectedAddressId);
        // console.log("shippingAddressData:", shippingAddressData);
        const shippingAddress = shippingAddressData.address_single_line;

        const orderData = {
          shipping_cost: shippingCost,
          shipping_address: shippingAddress,
        };

        // Step 2: Create Order
        await createOrder(orderData);

        const orderResponse = await getUserOrders();
        // console.log("GET ORDER:", orderResponse);

        const sortedOrders = orderResponse.sort((a, b) => b.id - a.id); // Sort in descending order
        const latestOrder = sortedOrders[0];
        const orderId = latestOrder.id;
        // console.log("GET ORDER ID:", orderId);

        const orderShippingCost = Math.round(
          orderResponse[0].shipping_cost * 100
        );
        // console.log("GET ORDER SHIPPING COST:", orderShippingCost);

        const totalAmount = Math.round(orderResponse[0].total * 100);
        // console.log("Total Amount:", totalAmount);

        // Step 3: Fetch Order Details
        const orderDetails = await getOrderDetails(orderId);
        // console.log("Order Details: ", orderDetails);

        // Prepare the order items for the session
        const orderItems = orderDetails.order_items.map((item) => ({
          name: item.name,
          price: Math.round(parseFloat(item.price) * 100),
          quantity: item.quantity,
        }));

        // console.log("Order Items:", orderItems);

        // Step 4: Create Stripe Checkout Session
        const sessionResponse = await createCheckoutSession({
          total_amount: totalAmount,
          order_items: orderItems,
          order_id: orderId,
          shipping_cost: orderShippingCost,
        });

        // Clear the cart before redirecting
        await clearCart();
        // Step 5: Redirect to Stripe checkout page
        window.location.href = sessionResponse.url;
      } catch (error) {
        console.error("Error during payment process:", error);
      }
    } else {
      alert("Please select an address before proceeding to payment.");
    }
  };

  if (loading) {
    return (
      <Container className="cart-container mt-4">
        <Row className="justify-content-center mb-2">
          <Col md={10}>
            <h4>Checkout</h4>
          </Col>
        </Row>
        <div className="text-center mt-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      </Container>
    );
  }
  const handleContinueShopping = () => {
    navigate("/store");
  };
  const textStyle = {
    fontFamily: "Montserrat, sans-serif",
    fontOpticalSizing: "auto",
    fontWeight: "400",
    fontStyle: "normal",
  };

  // console.log("Cart Items: ", cartItems);

  return (
    <Container className="checkout-container mt-4">
      <Row className="justify-content-center mb-2">
        <Col md={10}>
          <h4 className="mb-3">Checkout</h4>
          <p className="mb-1">
            <strong>Address</strong>
            <span style={textStyle}> ————— </span>
            Payment
          </p>
        </Col>
      </Row>

      {/* Check if cart is empty */}
      {!cartItems ? (
        <Row className="justify-content-center">
          <Col md={10}>
            <p>Your cart is empty.</p>
            <Button
              variant="info"
              className="button_custom mt-3"
              onClick={handleContinueShopping}
            >
              Continue Shopping
            </Button>
          </Col>
        </Row>
      ) : (
        <Row className="justify-content-center">
          <Col md={5} className="mb-4">
            <Card className="mb-4">
              <Card.Body>
                <AddressForm
                  addresses={addresses}
                  setAddresses={setAddresses}
                  setSelectedAddressId={setSelectedAddressId}
                />
              </Card.Body>
            </Card>
          </Col>

          <Col md={5}>
            {cartItems.map((item) => (
              <CartProductCard
                key={item.product_id}
                product={item}
                isCheckout={true}
              />
            ))}
            <Card.Body>
              <hr />
              <div className="d-flex justify-content-between">
                <span>Subtotal:</span>
                <span>${totalCart}</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Shipping:</span>
                <span>${shippingCost}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <p>
                  <strong>Total:</strong>
                </p>
                <p>
                  <strong>${totalOrder}</strong>
                </p>
              </div>

              <Button
                variant="info"
                className="button_custom mt-3 mb-5"
                onClick={handleProceedToPayment}
              >
                Proceed to Payment
              </Button>

              <div style={{ color: "red" }}>
                <strong>
                  Note: This is a test app do not input your actual credit card
                  details in the payment page.
                </strong>
              </div>
              <div>
                <strong>
                  Use this stripe test card for credit card details on the next
                  page
                </strong>
              </div>
              <div>Card Number: 4242 4242 4242 4242</div>
              <div>CVC: Any 3 digits</div>
              <div>Date: Any future date</div>
              <a
                href="https://docs.stripe.com/testing"
                style={{ color: "blue" }}
              >
                https://docs.stripe.com/testing
              </a>
            </Card.Body>
          </Col>
        </Row>
      )}
      {/* {orderCreated && <CheckoutForm />} */}
    </Container>
  );
};

export default CheckoutPage;
