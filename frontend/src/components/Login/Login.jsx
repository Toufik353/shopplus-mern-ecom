import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { incrementCartCount } from '../../redux/cartSlice';

const Login = () => {
  const [emailOrMobile, setEmailOrMobile] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!emailOrMobile || !password) {
      setError('Please fill out both fields for login.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://shopplus-ecom-backend.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailOrMobile,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data.user._id);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('userId', data.user._id);

        const cartResponse = await fetch("https://shopplus-ecom-backend.onrender.com/cart", {
          headers: {
            Authorization: `Bearer ${data.token}`,
          },
        });

        if (cartResponse.ok) {
          const cartData = await cartResponse.json();
          const quantityTotal = cartData.cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

          localStorage.setItem("cartCount", quantityTotal);
          dispatch(incrementCartCount(quantityTotal));

          toast.success("Successfully logged in!", {
            position: 'top-center',
            autoClose: 1000,
          });

          setTimeout(() => navigate('/products'), 2000);
        } else if (cartResponse.status === 404) {
          localStorage.setItem("cartCount", 0);
          dispatch(incrementCartCount(0));
          toast.success("Successfully logged in! No cart found.", {
            position: 'top-center',
            autoClose: 1000,
          });

          setTimeout(() => navigate('/products'), 2000);
        } else {
          const cartError = await cartResponse.json();
          setError(cartError.message || 'Failed to fetch cart information.');
        }
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Login</h2>

      <form onSubmit={handleLogin} className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="Email or Mobile Number"
          value={emailOrMobile}
          onChange={(e) => setEmailOrMobile(e.target.value)}
        />
        <input
          className={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className={styles.button} type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className={styles.links}>
        <Link to="/signup">Don't have an account? Sign Up</Link>
        <Link to="/forgot-password">Forgot Password?</Link>
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <ToastContainer />
    </div>
  );
};

export default Login;
