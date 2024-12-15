import React, { useState, useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import styles from "./CheckoutPage.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CheckoutPage = ({ clientSecret, cart, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const price = item.productId?.price || 0;
      const quantity = item.quantity || 0;
      return total + price * quantity;
    }, 0);
  };

  // Fetch all addresses for the user
  useEffect(() => {
    const fetchAddresses = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("https://shopplus-ecom-backend.onrender.com/addaddress", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const addressesData = await response.json();
        console.log("Fetched Addresses:", addressesData);

        if (Array.isArray(addressesData)) {
          const sortedAddresses = addressesData.sort((a, b) => b.isDefault - a.isDefault);
          setAddresses(sortedAddresses);

          const defaultAddress = sortedAddresses.find((addr) => addr.isDefault) || sortedAddresses[0];
          setSelectedAddress(defaultAddress);
        } else {
          throw new Error("Invalid address data");
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
        toast.error("Failed to fetch addresses", {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: true,
          theme: "colored",
        });
      }
    };

    fetchAddresses();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError("Payment processing is unavailable. Please try again.");
      return;
    }

    if (!selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }

    setIsProcessing(true);

    const { error: stripeError } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (stripeError) {
      setError(stripeError.message);
      toast.error(stripeError.message, {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });
    } else {
      setIsProcessing(false);
      toast.success("Payment successful!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        theme: "colored",
      });

      const orderDetails = {
        items: cart.items,
        total: calculateTotal() + calculateTotal() * 0.2 + 15,
        shippingAddress: selectedAddress,
      };

      localStorage.setItem("orderData", JSON.stringify(orderDetails));
      localStorage.removeItem("cart");
      onPaymentSuccess();

      setTimeout(() => {
      navigate('/order-confirmation');
    }, 4000);
    }
  };

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.title}>Secure Checkout</h1>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.addressSection}>
            <h2 className={styles.sectionTitle}>Select Delivery Address</h2>
            {addresses.length === 0 ? (
              <p>No addresses found. Please add one in your profile.</p>
            ) : (
              <>
                <div className={styles.addressList}>
                  {addresses.map((address) => (
                    <div
                      key={address._id}
                      className={`${styles.addressItem} ${
                        selectedAddress?._id === address._id ? styles.selected : ""
                      }`}
                      onClick={() => setSelectedAddress(address)}
                    >
                      <p>
                        {`${address.fullName}, ${address.flat}, ${address.area}, ${address.city}, ${address.state}, ${address.pincode}`}
                      </p>
                    </div>
                  ))}
                </div>
               
              </>
            )}
          </div>

          <div className={styles.paymentSection}>
            <h2 className={styles.sectionTitle}>Payment Information</h2>
            <div className={styles.cardInput}>
              <label htmlFor="card-element">Credit or Debit Card</label>
              <CardElement id="card-element" className={styles.cardElement} />
            </div>
          </div>

          <div className={styles.orderSummary}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <table className={styles.summaryTable}>
              <tbody>
                <tr>
                  <td>Subtotal:</td>
                  <td>${calculateTotal().toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Tax (20%):</td>
                  <td>${(calculateTotal() * 0.2).toFixed(2)}</td>
                </tr>
                <tr>
                  <td>Shipping:</td>
                  <td>$15.00</td>
                </tr>
                <tr className={styles.totalRow}>
                  <td>Total:</td>
                  <td>${(calculateTotal() + calculateTotal() * 0.2 + 15).toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {error && <div className={styles.errorAlert}>{error}</div>}
          <button
            disabled={isProcessing}
            type="submit"
            className={styles.submitButton}
          >
            {isProcessing ? "Processing..." : "Complete Purchase"}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CheckoutPage;
