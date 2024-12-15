import React, { useEffect, useState } from "react";
import styles from "./OrderHistoryPage.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  const fetchOrderHistory = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to view order history.");
      toast.error("You must be logged in to view order history.");
      return;
    }

    try {
      const response = await fetch("https://shopplus-ecom-backend.onrender.com/order-history", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        const uniqueOrders = data.orders.filter(
          (order, index, self) => index === self.findIndex((o) => o._id === order._id)
        );

        // Assign random status
        const statuses = ["Processing", "Shipped", "Delivered", "Pending"];
        const formattedOrders = uniqueOrders.map((order) => ({
          ...order,
          date: order.date ? new Date(order.date).toLocaleDateString() : "Invalid Date",
          totalAmount: order.totalAmount && !isNaN(order.totalAmount) ? order.totalAmount.toFixed(2) : "0.00",
          status: statuses[Math.floor(Math.random() * statuses.length)], // Random status
        }));

        setOrders(formattedOrders);
      } else {
        throw new Error(data.message || "Failed to fetch order history");
      }
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  };

  const getStatusClassName = (status) => {
    switch (status) {
      case "Processing":
        return styles.processing;
      case "Shipped":
        return styles.shipped;
      case "Delivered":
        return styles.delivered;
      default:
        return styles.pending;
    }
  };

  return (
    <div className={styles.orderHistoryContainer}>
      <h1 className={styles.pageTitle}>Order History</h1>

      {error && <p className={styles.error}>{error}</p>}

      {orders.length > 0 ? (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <h3>Order #{order._id}</h3>

              <div className={styles.trackingSection}>
                <p>
                  <strong>Status:</strong>
                  <span className={getStatusClassName(order.status)}>{order.status}</span>
                </p>
                {order.trackingNumber && (
                  <p>
                    <strong>Tracking Number:</strong> {order.trackingNumber}
                  </p>
                )}
              </div>

              <div className={styles.itemsSection}>
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item) => (
                    <li key={item.productId?._id || Math.random()}>
                      {item.productId?.name || "Unnamed Product"} - {item.quantity} x $
                      {item.productId?.price && !isNaN(item.productId.price)
                        ? item.productId.price.toFixed(2)
                        : "0.00"}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No orders found.</p>
      )}
      <ToastContainer />
    </div>
  );
};

export default OrderHistoryPage;
