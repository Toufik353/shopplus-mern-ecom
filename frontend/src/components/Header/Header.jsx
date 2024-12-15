import React from "react";
import { FaShoppingCart, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { incrementCartCount, clearCartCount } from "../../redux/cartSlice.js";
import styles from "./Header.module.css";

function Header({ searchTerm, handleSearchChange }) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [userName, setUserName] = React.useState("");
  const cartCount = useSelector((state) => state.cart.cartCount);
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("cartCount");

      dispatch(clearCartCount());

    navigate("/login", { replace: true });
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      const name = localStorage.getItem("userName");
      if (name) {
        setUserName(name);
      }
    }
  }, [isAuthenticated]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleClearSearch = () => {
    handleSearchChange("");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <h1>
          <Link to="/">ShopPlus</Link>
        </h1>
      </div>

      <div className={styles.searchWrapper}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {searchTerm && (
          <button className={styles.clearButton} onClick={handleClearSearch}>
            &times;
          </button>
        )}
        <div className={styles.searchIcon}>
          <FaSearch />
        </div>
      </div>

      <div className={styles.hamburger} onClick={toggleMenu}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>

      <nav className={`${styles.nav} ${isMenuOpen ? styles.open : ""}`}>
        <ul className={styles.navList}>
          <li onClick={closeMenu}>
            <Link to="/">Home</Link>
          </li>
          <li onClick={closeMenu}>
            <Link to="/products">Products</Link>
          </li>
          {isAuthenticated && (
            <li onClick={closeMenu}>
              <Link to="/profile">Profile</Link>
            </li>
          )}
          {isAuthenticated && (
            <li onClick={closeMenu}>
              <Link to="/wishlist">Wishlist</Link>
            </li>
          )}
          {isAuthenticated && (
            <li onClick={closeMenu}>
              <Link to="/order-history">Order History</Link>
            </li>
          )}
        </ul>

        <div className={styles.cart}>
          <Link to="/cart">
            <FaShoppingCart />
          </Link>
          {cartCount > 0 ? (
            <span className={styles.cartCount}>{cartCount}</span>
          ) : (
            <span className={styles.cartCount}>0</span>
          )}
        </div>

        {isAuthenticated ? (
          <div className={styles.userName}>
            <span>{userName}</span>
                      <button onClick={handleLogout} className={styles.authButton}>Logout</button>
          </div>
        ) : (
          <div className={styles.authButtonContainer}>
            <Link to="/login">
              <button className={styles.authButton}>Login</button>
            </Link>
            <Link to="/signup">
              <button className={styles.authButton}>Register</button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Header;
