import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './LandingPageCommunity.module.css';

gsap.registerPlugin(ScrollTrigger);

const brands = [
  "AVANT-GARDE", "STREETWEAR", "COUTURE", "SUSTAINABLE", "DENIM", "MINIMALIST", 
  "TECHWEAR", "VINTAGE", "LUXURY", "BASICS"
];

// Duplicate for seamless loop
const marqueeList = [...brands, ...brands];

const LandingPageCommunity = () => {
  const sectionRef = useRef();
  const containerRef = useRef();

  useGSAP(() => {
    // 1. Reveal Animation for the entire container
    gsap.from(containerRef.current, {
      y: 100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 80%",
      }
    });

    // 2. GSAP Number Counting Effect
    const stats = gsap.utils.toArray(`.${styles.number}`);
    stats.forEach((stat) => {
      const targetValue = parseInt(stat.getAttribute('data-target'));
      gsap.fromTo(stat, 
        { innerText: 0 }, 
        { 
          innerText: targetValue, 
          duration: 2.5, 
          ease: "power2.out",
          snap: { innerText: 1 }, // Ensures whole numbers
          scrollTrigger: {
            trigger: stat,
            start: "top 90%",
          },
          onUpdate: function() {
            // Re-adding the + sign after the count
            if(stat.getAttribute('data-suffix')) {
                stat.innerHTML = Math.ceil(this.targets()[0].innerText) + stat.getAttribute('data-suffix');
            }
          }
        }
      );
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section}>
        <div ref={containerRef} className={styles.container}>
            <h2 className={styles.heading}>The Infrastructure <br/> of Fashion</h2>
            <p className={styles.subtext}>
                Powering the next generation of global brands. 
                From sketch to storefront, we handle the heavy lifting.
            </p>

            <div className={styles.statsGrid}>
                <div className={styles.statItem}>
                    <span className={styles.number} data-target="2000" data-suffix="+">0+</span>
                    <span className={styles.label}>Brands Launched</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.number} data-target="14" data-suffix="">0</span>
                    <span className={styles.label}>Days Turnaround</span>
                </div>
                <div className={styles.statItem}>
                    <span className={styles.number} data-target="50" data-suffix="+">0+</span>
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