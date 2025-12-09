import React from 'react';
import styles from './LandingPageHero.module.css';
import heroImage from '../../assets/image2.jpg';

const LandingPageHero = () => {
  return (
    <section className={styles.hero}>
        <div className={styles.content}>
            <h1 className={styles.headline}>
                Design Your Vision, <br/>
                <span className={styles.italic}>We Brand It.</span>
            </h1>
            <p className={styles.subtext}>
                The premium infrastructure for clothing brands. 
                Upload your sketches, select fabrics, and launch your collection 
                with our network of elite makers.
            </p>
            <div className={styles.ctaGroup}>
                <button className={styles.primaryBtn}>Start Designing &rarr;</button>
                <button className={styles.secondaryBtn}>View Catalog</button>
            </div>
            
            <div className={styles.stats}>
                <div><strong>12k+</strong><br/><span>Makers</span></div>
                <div><strong>400+</strong><br/><span>Fabrics</span></div>
            </div>
        </div>
        
        <div className={styles.imageContainer}>
             {/* Abstract Fashion / Fabric Image */}
            <img 
                src={heroImage} 
                alt="Fabric texture" 
                className={styles.heroImage} 
            />
        </div>
    </section>
  );
};

export default LandingPageHero;