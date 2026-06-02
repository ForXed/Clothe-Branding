import React from 'react';
import { Link } from 'react-router-dom'; // Using Link for internal navigation
import styles from './LandingPageFooter.module.css';

const BrutigeLogo = () => (
  <svg width="36" height="36" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="25" cy="25" r="25" fill="white"/>
    <path d="M24.6 13L24.6 30.5L14 36.5L24.6 13Z" fill="black"/>
    <path d="M25.4 13L25.4 30.5L36 36.5L25.4 13Z" fill="black"/>
  </svg>
);

// Social Icons Components
const InstagramIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
);
const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
);
const TwitterXIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
);
const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
);

const LandingPageFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          
          {/* Column 1: Brand Info + Logo */}
          <div className={styles.col}>
            <div className={styles.brandWrapper}>
              <BrutigeLogo />
              <h3 className={styles.brandName}>brutige</h3>
            </div>
            <p className={styles.tagline}>
              Premium clothing design and production platform for the next generation of brands.
            </p>
          </div>

          {/* Column 2: Platform (Linked to Hub) */}
          <div className={styles.col}>
            <h4 className={styles.heading}>Platform</h4>
            <ul className={styles.linkList}>
              <li><Link to="/hub/collections">Collections</Link></li>
              <li><Link to="/hub/process">How it Works</Link></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><Link to="/hub/showcase">Showcase</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources (Linked to Hub) */}
          <div className={styles.col}>
            <h4 className={styles.heading}>Resources</h4>
            <ul className={styles.linkList}>
              <li><Link to="/hub/faq">FAQ</Link></li>
              <li><Link to="/hub/blog">Blog</Link></li>
              <li><Link to="/hub/guides">Design Guides</Link></li>
              <li><Link to="/hub/support">Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Connect (Socials) */}
          <div className={styles.col}>
            <h4 className={styles.heading}>Connect</h4>
            <div className={styles.socialGrid}>
              <a href="https://www.instagram.com/thebrutige/" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="TikTok">
                <TikTokIcon />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="X">
                <TwitterXIcon />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Facebook">
                <FacebookIcon />
              </a>
            </div>
            <div style={{marginTop: '20px'}}>
                <ul className={styles.linkList}>
                    <li><a href="mailto:hello@brutige.com">hello@brutige.com</a></li>
                    <li><p className={styles.contactText}>San Francisco, CA</p></li>
                </ul>
            </div>
          </div>
        </div>

        {/* Divider Line */}
        <hr className={styles.divider} />

        {/* Bottom Section */}
        <div className={styles.footerBottom}>
          <p className={styles.copyright}>&copy; 2024 Brutige. All rights reserved.</p>
          <div className={styles.legalLinks}>
            <Link to="/hub/privacy">Privacy</Link>
            <Link to="/hub/terms">Terms</Link>
            <Link to="/hub/cookies">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default LandingPageFooter;