import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerSection}>
          <h4>About Us</h4>
          <p>At Shoplus, we’re committed to making your shopping experience enjoyable, convenient, and personalized. We offer a diverse range of quality products from around the globe, ensuring you find exactly what you need. Trust, transparency, and customer satisfaction are at the core of everything we do. Join us today and discover a new level of online shopping.</p>
        </div>
        <div className={styles.footerSection}>
          <h4>Contact</h4>
          <ul>
            <li>Email: example@example.com</li>
            <li>Phone: +123 456 7890</li>
          </ul>
        </div>
        <div className={styles.footerSection}>
          <h4>Follow Us</h4>
          <ul className={styles.socialLinks}>
            <li><a href="#"><i className="fab fa-facebook"></i> Facebook</a></li>
            <li><a href="#"><i className="fab fa-twitter"></i> Twitter</a></li>
            <li><a href="#"><i className="fab fa-instagram"></i> Instagram</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
