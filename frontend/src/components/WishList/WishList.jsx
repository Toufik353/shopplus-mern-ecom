import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./WishList.module.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { incrementCartCount } from '../../redux/cartSlice.js';

function WishList() {
    const dispatch = useDispatch()
  const [wishlistItems, setWishlistItems] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchWishlistItems = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        setIsAuthenticated(true);

        const res = await fetch("https://shopplus-ecom-backend.onrender.com/wishlist", {
          headers: { Authorization: `Bearer ${authToken}` },
        });

        if (!res.ok) {
          console.error("Failed to fetch wishlist:", res.status, res.statusText);
          return;
        }

        const data = await res.json();
          setWishlistItems(data.wishlist || []);
      } else {
        setIsAuthenticated(false);
        console.log("User is not authenticated.");
      }
    } catch (err) {
      console.error("Error fetching wishlist:", err.message);
    }
  };

  useEffect(() => {
    fetchWishlistItems();
  }, []);

  const handleAddToCart = async (productId) => {
    const authToken = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId")
    if (!authToken) {
      alert("Please log in to add items to the cart.");
      return;
    }
       dispatch(incrementCartCount(1))
    try {
      const response = await fetch("https://shopplus-ecom-backend.onrender.com/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });

      if (!response.ok) {
        console.error("Failed to add to cart:", response.status, response.statusText);
        alert("Failed to add item to cart.");
        return;
      }

      const data = await response.json();
      toast.success("Successfully added the Product to the cart!", {
          position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error.message);
      alert("Error adding item to cart.");
    }
  };

  const handleRemoveFromWishlist = async (productId) => {
    const authToken = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId")
    if (!authToken) {
      alert("Please log in to manage your wishlist.");
      return;
    }

    try {
      const response = await fetch("https://shopplus-ecom-backend.onrender.com/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error("Failed to remove item from wishlist.");
      }

      toast.success("Item removed from wishlist successfully!", {
          position: "top-center",
        autoClose: 2000,
      });

      setWishlistItems(prevItems => prevItems.filter(item => item.productId._id !== productId));

    } catch (err) {
      console.error("Error removing from wishlist:", err.message);
      alert("Error removing item from wishlist.");
    }
  };

  return (
    <div className={styles.wishlist}>
      <h1>My Wishlist</h1>
      {isAuthenticated ? (
        <div className={styles.wishlistContainer}>
          {wishlistItems.length > 0 ? (
            wishlistItems.map((item) => (
              <div className={styles.wishlistItem} key={item.productId._id}>
                <img src={item.productId.image} alt={item.productId.name} />
                <div>
                  <h3>{item.productId.name}</h3>
                  <p>Price: ${item.productId.price}</p>
                  <button onClick={() => handleAddToCart(item.productId._id)}>Add to Cart</button>
                  <button
                    className={styles.removeButton}
                    onClick={() => handleRemoveFromWishlist(item.productId._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>Your wishlist is empty.</p>
          )}
        </div>
      ) : (
        <p>
          Please <Link to="/login">log in</Link> to view your wishlist.
        </p>
      )}
      <ToastContainer />
    </div>
  );
}

export default WishList;
