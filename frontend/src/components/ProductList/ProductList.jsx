import React, { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import styles from "./ProductList.module.css";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from 'react-redux';
import { incrementCartCount } from '../../redux/cartSlice';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [wishlist, setWishlist] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const { searchTerm: contextSearchTerm } = useOutletContext();

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("https://shopplus-ecom-backend.onrender.com/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch products.");
        }
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchWishlist = async () => {
      const token = localStorage.getItem("authToken");
      try {
        const response = await fetch("https://shopplus-ecom-backend.onrender.com/wishlist", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setWishlist(data.wishlist || []);
      } catch (error) {
        console.error("Error fetching wishlist:", error);
      }
    };

    fetchWishlist();
  }, []);

  const handleAddToCart = async (productId) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    const quantity = 1;

    try {
      const response = await fetch("https://shopplus-ecom-backend.onrender.com/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, productId, quantity }),
      });

      if (!response.ok) throw new Error("Failed to add product to cart");

      dispatch(incrementCartCount(1));

      toast.success("Successfully added to the cart!", {
        position: "top-center",
        autoClose: 2000,
      });
        
    } catch (error) {
      toast.error("Error adding to cart", {
        position: "top-center",
      });
    }
  };

  const handleAddToWishlist = async (productId) => {
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");
    if (!token) {
      toast.error("Login to add the item to the wishlist.", {
        position: "top-center"
      });
      return;
    }

    try {
      const isInWishlist = wishlist.includes(productId);
      const url = isInWishlist ? "https://shopplus-ecom-backend.onrender.com/wishlist/remove" : "https://shopplus-ecom-backend.onrender.com/wishlist/";
      const method = isInWishlist ? "DELETE" : "POST"; 

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, productId }),
      });

      const data = await response.json();
      if (response.ok) {
        setWishlist((prevWishlist) => {
          if (isInWishlist) {
            return prevWishlist.filter((id) => id !== productId);
          } else {
            return [...prevWishlist, productId];
          }
        });
        toast.success(isInWishlist ? "Removed from wishlist!" : "Added to wishlist!", {
          position: "top-center",
        });
      } else {
        toast.error(data.message || "Error updating wishlist.", {
          position: "top-center",
        });
      }
    } catch (error) {
      toast.error("Error updating wishlist.", {
        position: "top-center",
      });
    }
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<FaStar key={i} color="#ffc107" />);
      } else if (i - 0.5 <= rating) {
        stars.push(<FaStarHalfAlt key={i} color="#ffc107" />);
      } else {
        stars.push(<FaRegStar key={i} color="#ffc107" />);
      }
    }
    return stars;
  };

  const categories = ["All", ...new Set(products.map((product) => product.category))];

  const handleCategoryChange = (category) => {
    setSelectedCategories((prev) =>
      category === "All"
        ? []
        : prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase() || contextSearchTerm.toLowerCase());
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.filterBar}>
        <div className={styles.categoryFilter}>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`${styles.categoryButton} ${
                selectedCategories.includes(category) ? styles.selected : ""
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.productList}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product._id} className={styles.productCard}>
              <Link to={`/products/${product._id}`} className={styles.imageWrapper}>
                <img src={product.image} alt={product.name} className={styles.productImage} />
              </Link>
              <div className={styles.productInfo}>
                <h3 className={styles.productName}>{product.name}</h3>
                <div className={styles.productRating}>
                  {renderStars(product.rating)}
                  <span>({product.rating?.toFixed(1) || "No Rating"})</span>
                </div>
                <p className={styles.productDescription}>{product.description}</p>
                <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                <div className={styles.buttonContainer}>
                  <button onClick={() => handleAddToCart(product._id)} className={styles.addToCartBtn}>
                    Add to Cart
                  </button>
                  <button onClick={() => handleAddToWishlist(product._id)} className={styles.addToWishlistBtn}>
                    {wishlist.includes(product._id) ? (
                      <FaHeart />
                    ) : (
                      <FaRegHeart />
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>

      <ToastContainer />
    </div>
  );
}

export default ProductList;
