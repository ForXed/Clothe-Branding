import React from 'react';
import styles from './LandingPageFooter.module.css';

const LandingPageFooter = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        
        {/* Top Section: 4 Columns */}
        <div className={styles.grid}>
          
          {/* Column 1: Brand Info */}
          <div className={styles.col}>
            <h3 className={styles.brandName}>brutige</h3>
            <p className={styles.tagline}>
              Premium clothing branding and customization platform.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className={styles.col}>
            <h4 className={styles.heading}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><a href="#home">Home</a></li>
              <li><a href="#portfolio">Portfolio</a></li>
              <li><a href="#customize">Customize</a></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div className={styles.col}>
            <h4 className={styles.heading}>Support</h4>
            <ul className={styles.linkList}>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#shipping">Shipping</a></li>
              <li><a href="#returns">Returns</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div className={styles.col}>
            <h4 className={styles.heading}>Contact</h4>
            <div className={styles.contactInfo}>
              <a href="mailto:support@brutige.com">support@brutige.com</a>
              <p>+234 XXX XXX XXXX</p>
            </div>
          </div>

        </div>

        {/* Divider Line */}
        <hr className={styles.divider} />

        {/* Bottom Section: Copyright */}
        <div className={styles.copyright}>
          <p>&copy; 2024 Brutige. All rights reserved.</p>
        </div>

      </div>
    </footer>
  );
};

export default LandingPageFooter;