import React from 'react';
import styles from './LandingPageMasonryHero.module.css';

// High-quality fashion/branding images (Grayscale via CSS)
const images = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&q=80", // Model
  "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=400&q=80", // Streetwear
  "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=400&q=80", // Fabric
  "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=400&q=80", // Black Shirt
  "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80", // White Shirt
  "https://images.unsplash.com/photo-1490481651871-ab68ddd25721?w=400&q=80", // Texture
  "https://images.unsplash.com/photo-1551232864-3f0890e580d9?w=400&q=80", // Bag/Accessory
  "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=400&q=80", // Rack
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400&q=80", // Editorial
  "https://images.unsplash.com/photo-1556906781-9a412961d289?w=400&q=80", // Sneaker
];

// Duplicate the array to ensure seamless infinite scrolling
const gridItems = [...images, ...images, ...images];

const LandingPageMasonryHero = () => {
  return (
    <section className={styles.hero}>
        
        {/* --- Background: Scrolling Masonry --- */}
        <div className={styles.masonryContainer}>
            <div className={styles.masonryGrid}>
                {gridItems.map((src, index) => (
                    <div key={index} className={styles.masonryItem}>
                        <img src={src} alt="Fashion Item" />
                    </div>
                ))}
            </div>
        </div>

        {/* --- Overlay: Gradient to make text readable --- */}
        <div className={styles.overlay}></div>

        {/* --- Foreground: Content --- */}
        <div className={styles.content}>
            <h1 className={styles.headline}>
                Turn your <span className={styles.highlight}>ideas</span><br/>
                into branded reality.
            </h1>
            <p className={styles.subtext}>
                Design custom clothing with your logo, branding, and unique style.
            </p>
            
            {/* Search Bar Input */}
            <div className={styles.searchWrapper}>
                <input 
                    type="text" 
                    placeholder="Search for hoodies, t-shirts, caps..." 
                    className={styles.searchInput}
                />
                <button className={styles.searchButton}>Search</button>
            </div>

            {/* CTA Link */}
            <button className={styles.ctaButton}>
                Start Designing Now &rarr;
            </button>
        </div>
    </section>
  );
};

export default LandingPageMasonryHero;