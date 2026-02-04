import React from 'react';
import styles from './LandingPageFooter.module.css';

const BrutigeLogo = () => (
  <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="25" fill="black"/>
    {/* The Tiny Gap Arrow */}
    <path d="M24.6 13L24.6 30.5L14 36.5L24.6 13Z" fill="white"/>
    <path d="M25.4 13L25.4 30.5L36 36.5L25.4 13Z" fill="white"/>
  </svg>
);

const LandingPageFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Column 1: Brand Info + Logo */}
          <div className={styles.col}>
            <div className={styles.brandWrapper}>
              <BrutigeLogo color="white" size={32} />
              <h3 className={styles.brandName}>brutige</h3>
            </div>
            <p className={styles.tagline}>
              Premium clothing design and production platform for the next generation of brands.
            </p>
          </div>

          {/* Column 2: Platform */}
          <div className={styles.col}>
            <h4 className={styles.heading}>Platform</h4>
            <ul className={styles.linkList}>
              <li><a href="#collections">Collections</a></li>
              <li><a href="#process">How it Works</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#showcase">Showcase</a></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className={styles.col}>
            <h4 className={styles.heading}>Resources</h4>
            <ul className={styles.linkList}>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#blog">Blog</a></li>
              <li><a href="#guides">Design Guides</a></li>
              <li><a href="#support">Support</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className={styles.col}>
            <h4 className={styles.heading}>Contact</h4>
            <ul className={styles.linkList}>
              <li><a href="mailto:hello@brutige.com">hello@brutige.com</a></li>
              <li><p className={styles.contactText}>+1 (555) 123-4567</p></li>
              <li><p className={styles.contactText}>San Francisco, CA</p></li>
            </ul>
          </div>
        </div>

        {/* Divider Line */}
        <hr className={styles.divider} />

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>&copy; 2024 Brutige. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#cookies">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;