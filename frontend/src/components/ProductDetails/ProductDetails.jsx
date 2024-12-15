import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaRegHeart, FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { incrementCartCount } from "../../redux/cartSlice.js";

function ProductDetails() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [showReviewForm, setShowReviewForm] = useState(false);

  const isAuthenticated = !!localStorage.getItem("authToken");
  const cartCount = useSelector((state) => state.cart.cartCount);
  const dispatch = useDispatch();

  const fetchProductDetails = async () => {
    const token = localStorage.getItem("authToken");

    try {
      setLoading(true);
      const response = await fetch(`https://shopplus-ecom-backend.onrender.com/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch product details");

      const data = await response.json();
      setProduct(data.product);
      setReviews(data.product.reviews || []);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch(`https://shopplus-ecom-backend.onrender.com/reviews/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to fetch reviews");

      const data = await response.json();
      setReviews(data.filter((item) => item.productId.toString() === productId));
    } catch (error) {
      // toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchProductDetails();
    fetchReviews();
  }, [productId]);

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

      dispatch(incrementCartCount());
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

  const handleAddToWishlist = async () => {
    if (!isAuthenticated) {
      toast.error("You need to be logged in to add to wishlist");
      return;
    }

    const token = localStorage.getItem("authToken");

    try {
      // Assuming there's an API endpoint to add to wishlist
      const response = await fetch(`https://shopplus-ecom-backend.onrender.com/wishlist/${productId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Failed to add to wishlist");

      toast.success("Successfully added to wishlist!", {
        position: "top-center",
        autoClose: 2000,
      });
    } catch (error) {
      toast.error("Error adding to wishlist", {
        position: "top-center",
      });
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId");

    if (!userId || !token) {
      toast.error("You need to be logged in to submit a review");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please provide a rating between 1 and 5.");
      return;
    }

    if (!reviewText.trim()) {
      toast.error("Please write a review before submitting.");
      return;
    }

    try {
      const response = await fetch("https://shopplus-ecom-backend.onrender.com/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId,
          rating,
          review: reviewText,
          userId,
        }),
      });

      if (!response.ok) throw new Error("Failed to submit review");

      fetchReviews();
      setRating(0);
      setReviewText("");
      setShowReviewForm(false);
      toast.success("Review submitted successfully!", {
        position: "top-center"
      });
    } catch (error) {
      toast.error("Failed to submit review");
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

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className={styles.productDetail}>
      <div className={styles.imageWrapper}>
        <img
          src={product?.image}
          alt={product?.name}
          className={styles.productImage}
        />
        <div className={styles.thumbnailContainer}>
          {product?.thumbnails?.map((thumbnail, index) => (
            <img
              key={index}
              src={thumbnail}
              alt={`Thumbnail ${index + 1}`}
              className={styles.thumbnail}
            />
          ))}
        </div>
      </div>
      <div className={styles.productInfo}>
        <h1 className={styles.productName}>{product?.name}</h1>
        <p className={styles.productDescription}>{product?.description}</p>
        <p className={styles.productPrice}>${product?.price}</p>
        <p className={styles.productCategory}>Category: {product?.category}</p>
        <p className={styles.productStock}>
          In Stock: {product?.stock}
        </p>
        <div className={styles.productRating}>
          {renderStars(product?.rating)}
          <span>({product?.rating?.toFixed(1) || "No Rating"})</span>
        </div>
        <button
          className={`${styles.addToCartBtn} ${styles.btn}`}
          onClick={() => handleAddToCart(product._id)}
        >
          Add to Cart
        </button>
        
      </div>

      <div className={styles.reviewsSection}>
        <h2>Customer Reviews</h2>
        {reviews.length > 0 ? (
          <>
            <p className={styles.averageRating}>
              Average Rating:{" "}
              {(
                reviews.reduce((sum, review) => sum + review.rating, 0) /
                reviews.length
              ).toFixed(1)}{" "}
              / 5
            </p>
            <div className={styles.reviewList}>
              {reviews.map((review) => (
                <div key={review._id} className={styles.reviewCard}>
                  <div className={styles.reviewHeader}>
                    <img
                      src={review.userAvatar || "/default-avatar.png"}
                      alt={review.user}
                      className={styles.userAvatar}
                    />
                    <span className={styles.userName}>{review.user}</span>
                    <span className={styles.reviewRating}>
                      {renderStars(review.rating)}
                    </span>
                  </div>
                  <p className={styles.reviewText}>{review.review}</p>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>No reviews yet. Be the first to review this product!</p>
        )}

        {isAuthenticated ? (
          <>
            <button
              className={styles.addReviewButton}
              onClick={() => setShowReviewForm(!showReviewForm)}
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
            {showReviewForm && (
              <form className={styles.reviewForm} onSubmit={handleReviewSubmit}>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Write your review here..."
                ></textarea>
                <div>
                  <label>Rating:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                  />
                </div>
                <button type="submit" className={styles.submitReviewBtn}>
                  Submit Review
                </button>
              </form>
            )}
          </>
        ) : (
          <p>
            Please{" "}
            <a href="/login" className={styles.loginLink}>
              log in
            </a>{" "}
            to write a review.
          </p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default ProductDetails;
