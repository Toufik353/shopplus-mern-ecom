import React from "react";
import styles from "./Home.module.css";
import { Link } from "react-router-dom";

function Home() {
    return (
        <div className={styles.home}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1>Welcome to ShopPlus!</h1>
                <p>Discover amazing deals and exclusive offers every day.</p>
                <button className={styles.exploreBtn}>
                    <Link to="/products">Explore Now</Link>
                </button>
            </section>

            {/* Call-to-Action Section */}
            <section className={styles.cta}>
                <h2>Why Choose Us?</h2>
                <p>
                    ShopGlobe offers a wide range of products at unbeatable prices, 
                    lightning-fast delivery, and exceptional customer service. Join our 
                    community today and experience shopping like never before.
                </p>
                <button className={styles.joinBtn}>Join Now</button>
            </section>
        </div>
    );
}

export default Home;
