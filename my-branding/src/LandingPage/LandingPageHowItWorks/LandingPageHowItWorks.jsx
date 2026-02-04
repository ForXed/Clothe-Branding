import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './LandingPageHowItWorks.module.css';

gsap.registerPlugin(ScrollTrigger);

const steps = [
  { num: "01", title: "Design", desc: "Upload sketches or use our design canvas to create your vision." },
  { num: "02", title: "Customize", desc: "Select artisan fabrics, weights, and premium branding options." },
  { num: "03", title: "Produce", desc: "Our vetted master-makers bring your designs to life." },
  { num: "04", title: "Ship", desc: "Receive your collection in 14 days, ready for the storefront." }
];

const LandingPageHowItWorks = () => {
  const sectionRef = useRef();

  useGSAP(() => {
    // 1. Reveal the cards one by one
    gsap.from(`.${styles.card}`, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
      },
      y: 60,
      opacity: 0,
      stagger: 0.2,
      duration: 1,
      ease: "power4.out"
    });

    // 2. Animate the connecting lines (Drawing effect)
    gsap.from(`.${styles.stepLine}`, {
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
      },
      scaleX: 0,
      transformOrigin: "left center",
      stagger: 0.2,
      duration: 1.5,
      ease: "expo.inOut"
    });
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className={styles.section} id="process">
      <div className={styles.container}>
        <h2 className={styles.heading}>
            From Concept <br /> 
            <span className={styles.outline}>to Closet</span>
        </h2>
        
        <div className={styles.grid}>
          {steps.map((step, idx) => (
            <div key={idx} className={styles.card}>
              <div className={styles.stepNumber}>{step.num}</div>
              <h3 className={styles.title}>{step.title}</h3>
              <p className={styles.desc}>{step.desc}</p>
              {/* The line only appears between cards or below them in a Brutalist style */}
              <div className={styles.stepLine}></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LandingPageHowItWorks;