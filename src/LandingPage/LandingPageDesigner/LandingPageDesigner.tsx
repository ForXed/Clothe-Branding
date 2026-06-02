import React from 'react';
import styles from './LandingPageDesigner.module.css';
import image3 from '../../assets/image3.jpg';

const LandingPageDesigner = () => {
  return (
    <section className={styles.container}>
        <div className={styles.imageWrapper}>
            <img src={image3} alt="Sewing Machine" />
        </div>
        <div className={styles.textWrapper}>
            <h2 className={styles.heading}>For Professional Makers</h2>
            <ul className={styles.list}>
                <li>
                    <strong>Brand White-labelling</strong>
                    <p>Your logo, your tags, our infrastructure.</p>
                </li>
                <li>
                    <strong>Inventory Management</strong>
                    <p>Real-time tracking of fabrics and finished goods.</p>
                </li>
                <li>
                    <strong>Global Shipping</strong>
                    <p>We handle logistics to over 50 countries.</p>
                </li>
            </ul>
        </div>
    </section>
  );
};

export default LandingPageDesigner;