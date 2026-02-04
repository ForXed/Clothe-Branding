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
  { size: 'small',  src: image8, title: "Sustainable Fiber" },
  { size: 'tall', src: image9, title: "Luxury Basics" },
  { size: 'small', src: image10, title: "Techwear Infrastructure" },
  { size: 'wide', src: image1, title: "Modern Heritage" },
];

const LandingPageGrid = () => {
  const containerRef = useRef();

  useGSAP(() => {
    gsap.from(`.${styles.card}`, {
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 80%",
      },
      scale: 0.9,
      opacity: 0,
      stagger: 0.1,
      duration: 1,
      ease: "power3.out"
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
            <img src={item.src} alt={item.title} className={styles.image} />
            <div className={styles.galleryOverlay}>
               <div className={styles.overlayContent}>
                  <h3>{item.title}</h3>
                  <button className={styles.viewBtn}>View Case</button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default LandingPageGrid;