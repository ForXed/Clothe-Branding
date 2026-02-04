import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import styles from './LandingPageNavbar.module.css';

// The Brand Logo from your image
const BrutigeLogo = () => (
  <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="25" fill="black"/>
    <path d="M24.6 13L24.6 30.5L14 36.5L24.6 13Z" fill="white"/>
    <path d="M25.4 13L25.4 30.5L36 36.5L25.4 13Z" fill="white"/>
  </svg>
);

const LandingPageNavbar = () => {
  const navRef = useRef();

  // GSAP Entrance Animation
  useGSAP(() => {
    gsap.from(navRef.current, {
      y: -100,
      opacity: 0,
      duration: 1.2,
      ease: "power4.out",
    });
  }, { scope: navRef });

  return (
    <nav ref={navRef} className={styles.navbar}>
      <div className={styles.logoWrapper}>
          <BrutigeLogo />
          <span className={styles.brandName}>brutige</span>
      </div>

      <ul className={styles.navLinks}>
          <li><a href="#how-it-works">How it Works</a></li>
          <li><a href="#designers">For Designers</a></li>
          <li><a href="#pricing">Pricing</a></li>
      </ul>

      <div className={styles.authButtons}>
        <button className={styles.loginBtn}>Log In</button>
        <button className={styles.startBtn}>Get Started</button>
      </div>
    </nav>
  );
};

export default LandingPageNavbar;