import React from 'react';
import styles from './LandingPageCommunity.module.css';

const brands = [
  "AVANT-GARDE", "STREETWEAR", "COUTURE", "SUSTAINABLE", "DENIM", "MINIMALIST", 
  "TECHWEAR", "VINTAGE", "LUXURY", "BASICS"
];

// Duplicate list for smooth infinite scroll
const marqueeList = [...brands, ...brands, ...brands, ...brands];

const LandingPageCommunity = () => {
  return (
    <section className={styles.section}>
        <div className={styles.container}>
            <h2 className={styles.heading}>The Infrastructure of Fashion</h2>
            <p className={styles.subtext}>
                Powering the next generation of global brands. 
                From sketch to storefront, we handle the heavy lifting.
            </p>

            {/* Statistics Row */}
            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.number}>2k+</span>
                    <span className={styles.label}>Brands Launched</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.number}>14</span>
                    <span className={styles.label}>Days Turnaround</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.number}>50+</span>
                    <span className={styles.label}>Countries Shipped</span>
                </div>
            </div>
        </div>

        {/* Scrolling Marquee */}
        <div className={styles.marqueeContainer}>
            <div className={styles.marqueeTrack}>
                {marqueeList.map((item, index) => (
                    <span key={index} className={styles.marqueeItem}>
                        {item} <span className={styles.dot}>•</span>
                    </span>
                ))}
            </div>
        </div>
    </section>
  );
};

export default LandingPageCommunity;