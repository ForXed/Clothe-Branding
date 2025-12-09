import React from 'react';
import styles from './LandingPageHowItWorks.module.css';

const steps = [
    { num: 1, title: "Design", desc: "Use our intuitive canvas to draft your custom clothing patterns." },
    { num: 2, title: "Source", desc: "Select from our library of 400+ premium sustainable fabrics." },
    { num: 3, title: "Produce", desc: "Our vetted makers bring your vision to life within 14 days." }
];

const LandingPageHowItWorks = () => {
  return (
    <section className={styles.section}>
        <h2 className={styles.heading}>From Concept to Closet</h2>
        <div className={styles.grid}>
            {steps.map((step) => (
                <div key={step.num} className={styles.card}>
                    <div className={styles.circle}>{step.num}</div>
                    <h3 className={styles.title}>{step.title}</h3>
                    <p className={styles.desc}>{step.desc}</p>
                </div>
            ))}
        </div>
    </section>
  );
};

export default LandingPageHowItWorks;