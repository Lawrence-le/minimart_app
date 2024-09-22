// frontend/src/pages/Checkout.jsx

import { useEffect, useState } from "react";
import { Button, Row, Col, Card, Container, Spinner } from "react-bootstrap";
import { getCartProducts, getCartTotal } from "../services/cartsService";
import { getAddresses } from "../services/addressesService";
import CartProductCard from "../components/CartProductCard";
import AddressForm from "../components/AddressForm";
import { useCart } from "../context/CartContext";
import { createOrder } from "../services/ordersService";
import CheckoutForm from "../components/Payment";
import { useNavigate } from "react-router-dom";
import { getOrderDetails, getUserOrders } from "../services/ordersService";
import { createCheckoutSession } from "../services/paymentService";

import "../styles/cartStyles.css";

const CheckoutPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalCart, setTotalCart] = useState(0);
  const [totalOrder, setTotalOrder] = useState(0);
  const { shippingCost } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orderCreated, setOrderCreated] = useState(false);
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
    if (!addresses.length) {
      alert("Please add an address before proceeding to payment.");
      return;
    }

    if (selectedAddressId) {
      const orderData = {
        shipping_address_id: selectedAddressId,
      };
      try {
        // Step 1: Create Order
        await createOrder(orderData);

        const orderResponse = await getUserOrders();
        // const orderId = orderResponse.id;
        const orderId = orderResponse[0].id;

        console.log("This order's ID: ", orderId);

        // Step 2: Fetch Order Details
        const orderDetails = await getOrderDetails(orderId);

        // Step 3: Create Stripe Checkout Session
        const sessionResponse = await createCheckoutSession({
          total_amount: orderDetails.order.total * 100,
          shipping_address: orderDetails.order.shipping_address_id,
        });

        // Step 4: Redirect to Stripe checkout page
        window.location.href = sessionResponse.url;
      } catch (error) {
        console.error("Error during payment process:", error);
      }
    } else {
      alert("Please select an address before proceeding to payment.");
    }
  };
  // const handleProceedToPayment = async () => {
  //   if (!addresses.length) {
  //     alert("Please add an address before proceeding to payment.");
  //     return;
  //   }

  //   if (selectedAddressId) {
  //     const orderData = {
  //       shipping_address_id: selectedAddressId,
  //     };
  //     console.log("selected address: ", selectedAddressId);
  //     try {
  //       const orderResponse = await createOrder(orderData);
  //       console.log("Order created successfully:", orderResponse);
  //       setOrderCreated(true);
  //       navigate("/payment", { state: { totalOrder, shippingCost } });
  //     } catch (error) {
  //       console.error("Error creating order:", error);
  //     }
  //   } else {
  //     alert("Please select an address before proceeding to payment.");
  //   }
  // };

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
          <Col md={6} className="mb-4">
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

          <Col md={4}>
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
            </Card.Body>
          </Col>
        </Row>
      )}
      {orderCreated && <CheckoutForm />}
    </Container>
  );
};

export default CheckoutPage;
