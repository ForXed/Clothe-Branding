import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './LandingPageGrid.module.css';

// Importing your local assets
import image4 from '../../assets/image4.jpg';
import image5 from '../../assets/image5.jpg';
import image6 from '../../assets/image6.jpg';
import image7 from '../../assets/image7.jpg';
import image8 from '../../assets/image8.jpg';
import image9 from '../../assets/image9.jpg';
import image10 from '../../assets/image10.jpg';
import image1 from '../../assets/image1.jpg';

gsap.registerPlugin(ScrollTrigger);

const items = [
  { size: 'tall', src: image4, title: "Avant-Garde" },
  { size: 'wide', src: image5, title: "Streetwear Identity" },
  { size: 'small', src: image6, title: "Minimalist Loop" },
  { size: 'small', src: image7, title: "Couture Blueprints" },
  { size: 'small', src: image8, title: "Sustainable Fiber" },
  { size: 'tall', src: image9, title: "Luxury Basics" },
  { size: 'small', src: image10, title: "Techwear Infrastructure" },
  { size: 'wide', src: image1, title: "Modern Heritage" },
];

const LandingPageGrid = () => {
  const containerRef = useRef();

  useGSAP(() => {
    // Refined Entrance: Staggered fade up with a slight scale from below
    gsap.from(`.${styles.card}`, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 85%",
        toggleActions: "play none none reverse"
      },
      y: 60,
      scale: 0.96,
      opacity: 0,
      stagger: 0.08,
      duration: 1.2,
      ease: "power3.out"
    });

    // Refined Image Hover: Subtle scale and color reveal
    const cards = gsap.utils.toArray(`.${styles.card}`);
    
    cards.forEach(card => {
      const img = card.querySelector(`.${styles.image}`);
      const frame = card.querySelector(`.${styles.frame}`);
      
      const tl = gsap.timeline({ paused: true });

      tl.to(img, {
        scale: 1,
        filter: "grayscale(0%)",
        duration: 0.7,
        ease: "power2.out"
      })
      .to(frame, {
        opacity: 1,
        duration: 0.4,
        ease: "power2.out"
      }, "-=0.5");

      card.addEventListener("mouseenter", () => tl.play());
      card.addEventListener("mouseleave", () => tl.reverse());
    });

  }, { scope: containerRef });

  return (
    <section className={styles.wrapper}>
      <div className={styles.header}>
        <h2 className={styles.title}>Selected Works <br/> <span className={styles.outline}>By Our Makers</span></h2>
        <p className={styles.subtitle}>Curated fashion and branding projects built on Brutige infrastructure.</p>
      </div>

      <div ref={containerRef} className={styles.gridContainer}>
        {items.map((item, index) => (
          <div key={index} className={`${styles.card} ${styles[item.size]}`}>
            {/* Animated Frame Overlay */}
            <div className={styles.frame}></div>
            
            <img src={item.src} alt={item.title} className={styles.image} />
            
            {/* Minimal Title - Only visible on hover/focus if desired, or always subtle */}
            <div className={styles.minimalLabel}>
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingPageGrid;