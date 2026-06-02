import React, { useState, useEffect } from 'react';
import styles from './PromoBanner.module.css';

const PromoBanner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Promo Data
  const slides = [
    {
      id: 1,
      title: "New Infrastructure Drop",
      subtitle: "450GSM Heavyweight Collection",
      cta: "Shop Now",
      image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800",
      bgGradient: "linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 100%)"
    },
    {
      id: 2,
      title: "Maker Studio Pro",
      subtitle: "Launch your brand in minutes",
      cta: "Start Building",
      image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800",
      bgGradient: "linear-gradient(90deg, rgba(20,20,20,0.9) 0%, rgba(20,20,20,0.3) 100%)"
    },
    {
      id: 3,
      title: "Global Shipping Active",
      subtitle: "Now delivering to 52 countries",
      cta: "View Zones",
      image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=800",
      bgGradient: "linear-gradient(90deg, rgba(10,10,10,0.85) 0%, rgba(10,10,10,0.2) 100%)"
    }
  ];

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // Change every 5 seconds
    return () => clearInterval(timer);
  }, [slides.length]);

  const handleDotClick = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className={styles.bannerContainer}>
      <div className={styles.sliderWrapper}>
        {slides.map((slide, index) => (
          <div 
            key={slide.id} 
            className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className={styles.overlay} style={{ background: slide.bgGradient }} />
            <div className={styles.content}>
              <h2 className={styles.slideTitle}>{slide.title}</h2>
              <p className={styles.slideSubtitle}>{slide.subtitle}</p>
              <button className={styles.slideBtn}>{slide.cta}</button>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Dots */}
      <div className={styles.dots}>
        {slides.map((_, index) => (
          <button
            key={index}
            className={`${styles.dot} ${index === currentSlide ? styles.activeDot : ''}`}
            onClick={() => handleDotClick(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default PromoBanner;