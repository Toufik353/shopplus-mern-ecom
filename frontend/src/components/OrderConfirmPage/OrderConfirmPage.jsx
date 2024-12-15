import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OrderConfirmationPage.module.css';
import { useDispatch } from 'react-redux';
import { clearCartCount } from "../../redux/cartSlice.js"
const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const [orderDetails, setOrderDetails] = useState({
    items: [],
    total: 0,
    shippingAddress: '',
  });
  const navigate = useNavigate();
  useEffect(() => {
    const orderData = JSON.parse(localStorage.getItem('orderData'));
    if (orderData) {
      const total = calculateTotal(orderData.items);
      setOrderDetails({
        ...orderData,
        total,
      });
        localStorage.removeItem('cart');
        localStorage.removeItem('cartCount');
      createOrder(orderData);
    } else {
        navigate('/');
    }
  }, [navigate]);
  const calculateTotal = (items) => {
    return items.reduce((total, item) => {
      return total + (item.productId.price || 0) * (item.quantity || 0);
    }, 0);
  };
  const createOrder = async (orderData) => {
    try {
      const token = localStorage.getItem('authToken');
      const userId = localStorage.getItem('userId');
      if (!token) {
        navigate('/login');
        return;
      }
      const response = await fetch('https://shopplus-ecom-backend.onrender.com/order-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          items: orderData.items.map(item => ({
            productId: item.productId._id || item.productId, // Ensure correct ID
            quantity: item.quantity,
            amount: item.productId.price * item.quantity, // Compute the total for the item
          })),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        const deleteCartResponse = await fetch('https://shopplus-ecom-backend.onrender.com/cart/clear', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
        if (deleteCartResponse.ok) {
          console.log('Cart removed successfully from backend');
          localStorage.removeItem('cart');
          localStorage.removeItem('cartCount');
          dispatch(clearCartCount());
        } else {
          console.error('Failed to clear cart on the backend');
        }
      } else {
        console.error('Failed to create order:', data.message);
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };
  if (!orderDetails || !orderDetails.items.length) {
    return <div>Loading...</div>;
  }
  return (
    <div className={styles.orderConfirmationContainer}>
      <h1 className={styles.confirmationTitle}>Order Confirmation</h1>
      <div className={styles.confirmationMessage}>
        <h2>Thank you for your order!</h2>
        <p>Your order has been successfully placed.</p>
      </div>
      <div className={styles.orderSummary}>
        <h3>Order Details</h3>
        <ul>
          {orderDetails?.items.map((item, index) => (
            <li key={index} className={styles.orderItem}>
              <p>Product: {item.productId.name || 'Unknown Item'}</p>
              <p>Quantity: {item.quantity || 0}</p>
              <p>Price: ${item.productId.price ? item.productId.price.toFixed(2) : '0.00'}</p>
            </li>
          ))}
        </ul>
        <div className={styles.total}>
          <strong>Total Amount Paid: ${orderDetails.total ? orderDetails.total.toFixed(2) : '0.00'}</strong>
        </div>
      </div>
    
    </div>
  );
};
export default OrderConfirmationPage;