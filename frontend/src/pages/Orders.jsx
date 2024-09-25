import { useEffect, useState } from "react";
import { getUserOrders, getOrderDetails } from "../services/ordersService";
import { ListGroup, Container, Row, Col, Button } from "react-bootstrap";
import { format } from "date-fns";
import CartProductCard from "../components/CartProductCard";
import { createCheckoutSession } from "../services/paymentService";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userOrders = await getUserOrders();
        console.log("userOrders: ", userOrders);
        setOrders(userOrders);

        // Fetch order details sequentially
        for (const order of userOrders) {
          const details = await getOrderDetails(order.id);
          console.log("Order ID: ", order);
          setOrderDetails((prevDetails) => ({
            ...prevDetails,
            [order.id]: details,
          }));
        }
        console.log("orderDetails", orderDetails);
      } catch (error) {
        console.error("Error fetching orders or details:", error);
      }
    };

    fetchOrders();
  }, []);

  const handleMakePayment = async (order) => {
    try {
      const orderDetails = await getOrderDetails(order.id);
      const orderItems = orderDetails.order_items.map((item) => ({
        name: item.name,
        price: Math.round(parseFloat(item.price) * 100),
        quantity: item.quantity,
      }));

      const sessionResponse = await createCheckoutSession({
        total_amount: Math.round((order.total + order.shipping_cost) * 100),
        order_items: orderItems,
        order_id: order.id,
        shipping_cost: Math.round(order.shipping_cost * 100),
      });

      window.location.href = sessionResponse.url;
    } catch (error) {
      console.error("Error creating payment session:", error);
    }
  };

  const formatShippingAddress = (address) => {
    if (!address) return "No shipping address available";
    return address.split(",").map((line, index) => (
      <span key={index}>
        {line.trim()}
        <br />
      </span>
    ));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, "dd MMMM yyyy");
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending Payment":
        return { color: "white", backgroundColor: "#ef5350 " };
      case "Order Confirmed":
        return { color: "white", backgroundColor: "#26a69a " };
      default:
        return { color: "black" };
    }
  };

  return (
    <Container className="mb-4" style={{ marginTop: "10rem" }}>
      <h4>Your Orders</h4>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ListGroup>
          {orders.map((order) => (
            <ListGroup.Item key={order.id}>
              <Row className="order-status">
                <p style={getStatusColor(order.status)}>
                  <strong>Status:</strong> {order.status}
                </p>
              </Row>
              <Row className="me-2 ms-2 mt-2">
                <Col md={6}>
                  <div>
                    <p>
                      <strong>Order Date:</strong>{" "}
                      {formatDate(order.created_at)}
                    </p>
                    <hr />
                    <p>
                      <strong>Item Total:</strong> ${order.total}
                    </p>
                    <p>
                      <strong>Shipping Cost:</strong> ${order.shipping_cost}
                    </p>
                    <p>
                      <strong>Total:</strong> $
                      {Number(order.total) + Number(order.shipping_cost)}
                    </p>
                    <hr />
                    <p>
                      <strong>Shipping Address:</strong> <br />
                      {formatShippingAddress(order.shipping_address)}
                    </p>
                    {order.status === "Pending Payment" && (
                      <Button
                        variant="info"
                        className="button_custom mb-3"
                        size="sm"
                        onClick={() => handleMakePayment(order)}
                      >
                        Make Payment
                      </Button>
                    )}
                  </div>
                </Col>

                <Col md={6}>
                  <div className="mb-2">
                    <strong>Ordered Items</strong>
                  </div>
                  {orderDetails[order.id] &&
                  orderDetails[order.id].order_items ? (
                    <div>
                      {orderDetails[order.id].order_items.map((item) => (
                        <CartProductCard
                          key={item.id}
                          product={item}
                          isCheckout={true}
                        />
                      ))}
                    </div>
                  ) : (
                    <p>Loading items...</p>
                  )}
                </Col>
              </Row>
            </ListGroup.Item>
          ))}
        </ListGroup>
      )}
    </Container>
  );
};

export default OrdersPage;
