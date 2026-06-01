import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import styles from './Preloader.module.css';

const Preloader = ({ onComplete }) => {
  const containerRef = useRef();
  const logoRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => onComplete()
    });

    tl.fromTo(logoRef.current, 
      { scale: 0.8, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1, ease: "expo.out" }
    )
    .fromTo(textRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 0.5, duration: 0.8, ease: "power2.out" }, "-=0.5"
    )
    .to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
      delay: 1
    });
  }, [onComplete]);

  return (
    <div ref={containerRef} className={styles.preloader}>
      <div className={styles.content}>
        <div ref={logoRef} className={styles.logoBox}>
          {/* INLINE LOGO */}
          <svg width="80" height="80" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="50" fill="white"/>
            <path d="M48 25L48 65L25 80L48 25Z" fill="black"/>
            <path d="M52 25L52 65L75 80L52 25Z" fill="black"/>
          </svg>
        </div>
        <p ref={textRef} className={styles.status}>INITIALIZING INFRASTRUCTURE</p>
      </div>
    </div>
  );
};

export default Preloader;