import { useState, useEffect } from "react";
import { Button, Table, Image } from "react-bootstrap";
import {
  getAllOrders,
  updateStatusShipped,
  getOrderItemsByOrderId,
} from "../services/ordersService";
import { format } from "date-fns";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [orderItemsMap, setOrderItemsMap] = useState({});

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const ordersData = await getAllOrders();
      // console.log("ordersData", ordersData);

      const sortedOrders = ordersData.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setOrders(sortedOrders);
      // console.log("Sorted Orders: ", sortedOrders);

      for (let order of sortedOrders) {
        await fetchOrderItems(order.order_id);
      }
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    }
  };

  const fetchOrderItems = async (orderId) => {
    try {
      const itemsData = await getOrderItemsByOrderId(orderId);
      setOrderItemsMap((prev) => ({ ...prev, [orderId]: itemsData }));
      // console.log("Fetched items for order", orderId, itemsData);
    } catch (error) {
      console.error("Error fetching order items:", error.message);
    }
  };

  const handleSetShippedStatus = async (orderId) => {
    try {
      await updateStatusShipped(orderId);
      fetchOrders();
      alert("SHIPPED");
    } catch (error) {
      console.error("Error updating order status to shipped:", error.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <h5 className="mb-3">Orders Management</h5>

      <Table className="list-font" striped bordered hover>
        <thead>
          <tr>
            <th style={{ width: "8%" }}>Created At</th>
            <th style={{ width: "5%" }}>Order ID</th>
            <th style={{ width: "5%" }}>User ID</th>
            <th style={{ width: "5%" }}>Shipping Cost</th>
            <th style={{ width: "5%" }}>Total Item Price</th>
            <th style={{ width: "15%" }}>Shipping Address</th>

            <th style={{ width: "30%" }}>Order Items</th>
            <th style={{ width: "10%" }}>Status</th>
            <th style={{ width: "5%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="9">No orders available</td>
            </tr>
          ) : (
            orders.map((order) => (
              <tr key={order.order_id}>
                <td>{format(new Date(order.created_at), "dd MMM yyyy")}</td>
                <td>{order.order_id}</td>
                <td>{order.user_id}</td>
                <td>${order.shipping_cost}</td>
                <td>${order.total}</td>
                <td>{order.shipping_address}</td>

                <td>
                  {orderItemsMap[order.order_id] &&
                  orderItemsMap[order.order_id].length > 0 ? (
                    <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                      {orderItemsMap[order.order_id].map((item) => (
                        <li key={item.id}>
                          <div style={{ display: "flex", gap: "10px" }}>
                            {item.image_url && (
                              <Image
                                src={item.image_url}
                                alt={item.name}
                                thumbnail
                                style={{ width: "50px", height: "50px" }}
                              />
                            )}

                            <div>
                              <p style={{ fontSize: "0.8em" }}>
                                <strong>{item.name}</strong>
                                <br />
                                Quantity: {item.quantity}
                                <br />
                                Price: ${item.price}
                              </p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>No items found for this order.</p>
                  )}
                </td>
                <td>{order.status}</td>
                <td>
                  {order.status === "Order Confirmed" && (
                    <Button
                      className="button_custom"
                      size="sm"
                      style={{ fontSize: "0.9em" }}
                      onClick={() => handleSetShippedStatus(order.order_id)}
                    >
                      <span className="material-icons">local_shipping</span>
                    </Button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default OrderManager;
