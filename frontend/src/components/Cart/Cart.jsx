import React, { useEffect, useState } from "react";
import styles from "./Cart.module.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { FaTrash } from "react-icons/fa";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CheckoutPage from "../CheckoutPage/CheckoutPage";
import { useSelector, useDispatch } from 'react-redux';
import { incrementCartCount, clearCartCount } from "../../redux/cartSlice.js";
import { useNavigate } from "react-router-dom";

const stripePromise = loadStripe("pk_test_51QUjVGKkKrbP0tjiYejD4jpLDu8MDQoKIAHHglpYJZGWUQtgjLLIvQYGkaw9XSlko3Y5iW8qb1UMhhMP5qfeRuBF00Tc67HwQE");

const Cart = () => {
    const navigate = useNavigate()
  const [cart, setCart] = useState({ items: [] });
  const [error, setError] = useState(null);
  const [clientSecret, setClientSecret] = useState("");
  const [isCheckout, setIsCheckout] = useState(false);
  const cartCount = useSelector((state) => state.cart.cartCount);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch("https://shopplus-ecom-backend.onrender.com/cart", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setCart(data.cart || { items: [] });
          updateCartCount(data.cart.items.length);
      } else {
        throw new Error(data.message || "Failed to fetch cart data");
      }
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  const updateCartCount = (count) => {
    localStorage.setItem("cartCount", count);
      window.dispatchEvent(new Event("storage"));
  };

  const handlePayment = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("https://shopplus-ecom-backend.onrender.com/create-payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ cart }),
      });

      const data = await response.json();

      if (response.ok) {
        setClientSecret(data.clientSecret);
        setIsCheckout(true);
      } else {
        throw new Error(data.message || "Failed to create payment intent");
      }
    } catch (err) {
      console.error("Payment Error:", err.message);
      setError("Failed to initiate payment");
    }
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    const token = localStorage.getItem("authToken");
      if (newQuantity <= 0) return;

    try {
      const response = await fetch("https://shopplus-ecom-backend.onrender.com/cart/", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity: newQuantity }),
      });

      if (response.ok) {
        setCart(prevCart => {
          const updatedItems = prevCart.items.map(item =>
            item.productId._id === productId ? { ...item, quantity: newQuantity } : item
          );
            updateCartCount(updatedItems.length);
          return { ...prevCart, items: updatedItems };
        });
        toast.success("Cart updated successfully!", {
          position: "top-center",
        });
      } else {
        const data = await response.json();
        throw new Error(data.message || "Failed to update cart");
      }
    } catch (err) {
      toast.error("Failed to update cart");
    }
  };

    const handleRemoveFromCart = async (productId) => {
      console.log("prid id",productId)
  const token = localStorage.getItem("authToken");
  try {
    const response = await fetch("https://shopplus-ecom-backend.onrender.com/cart/", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (response.ok) {
      setCart(prevCart => {
        const updatedItems = prevCart.items.filter(item => item.productId._id !== productId);
        updateCartCount(updatedItems.length);
        return { ...prevCart, items: updatedItems };
      });

      toast.success("Item removed from cart!", {
        position: "top-center",
      });
    } else {
      const data = await response.json();
      throw new Error(data.message || "Failed to remove item from cart");
    }
  } catch (err) {
    toast.error("Failed to remove item from cart");
  }
};


  const handlePaymentSuccess = () => {
    localStorage.setItem("orderData", JSON.stringify(cart));

      localStorage.removeItem("cart");
      setCart({ items: [] });

       navigate("/order-confirmation")
  };

  if (isCheckout) {
    return (
      <Elements stripe={stripePromise}>
        <CheckoutPage 
          clientSecret={clientSecret} 
          onPaymentSuccess={handlePaymentSuccess} 
          cart={cart}
        />
      </Elements>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <h1 className={styles.cartTitle}>Your Cart</h1>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.cartContent}>
        <div className={styles.cartItems}>
          {cart.items.length > 0 ? (
            cart.items.map((item) => {
              const product = item.productId || { name: "Unnamed Product", price: 0, imageUrl: "" };

              return (
                <div key={item._id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    <img src={product.image || "https://via.placeholder.com/150"} alt={product.name} />
                  </div>
                  <div className={styles.itemInfo}>
                    <h4>{product.name}</h4>
                    <p>Price: ${product.price ? product.price.toFixed(2) : "N/A"}</p>
                  </div>
                  <div className={styles.itemQuantity}>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => handleUpdateQuantity(product._id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity || 0}</span>
                    <button
                      className={styles.quantityBtn}
                      onClick={() => handleUpdateQuantity(product._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => handleRemoveFromCart(product._id)}
                  >
                    <FaTrash />
                  </button>
                </div>
              );
            })
          ) : (
            <p>Your cart is empty</p>
          )}
        </div>

        <div className={styles.cartSummary}>
          <h3>Total: ${calculateTotal().toFixed(2)}</h3>

          <button className={styles.checkoutBtn} onClick={handlePayment}>
            Proceed to Checkout
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Cart;