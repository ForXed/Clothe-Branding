import React from 'react';
import styles from './LandingPageGrid.module.css';
import image4 from '../../assets/image4.jpg';
import image5 from '../../assets/image5.jpg';
import image6 from '../../assets/image6.jpg';
import image7 from '../../assets/image7.jpg';
import image8 from '../../assets/image8.jpg';
import image9 from '../../assets/image9.jpg';
import image10 from '../../assets/image10.jpg';
import image1 from '../../assets/image1.jpg';

const items = [
  { size: 'tall', src: image4 },
  { size: 'wide', src: image5 },
  { size: 'small', src: image6 },
  { size: 'small', src: image7 },
  { size: 'small',  src: image8 },
  { size: 'tall', src: image9},
  { size: 'small', src: image10 },
  { size: 'wide', src: image1 },
  
];

const LandingPageGrid = () => {
  return (
    <div className={styles.gridContainer}>
      {items.map((item, index) => (
        <div key={index} className={`${styles.card} ${styles[item.size]}`}>
          <img src={item.src} alt="" className={styles.image} />
          <div className={styles.overlay}>
             <button className={styles.saveBtn}>Save</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LandingPageGrid;