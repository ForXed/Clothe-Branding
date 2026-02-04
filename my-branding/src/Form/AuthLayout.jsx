import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './AuthLayout.module.css';

gsap.registerPlugin(TextPlugin);

const AuthLayout = ({ children, phrases }) => {
  const textRef = useRef();
  const cursorRef = useRef();
  const container = useRef();

  useGSAP(() => {
    // Background Lines
    gsap.utils.toArray(`.${styles.line}`).forEach((line, i) => {
      gsap.to(line, { x: i % 2 === 0 ? 80 : -80, opacity: 0.2, duration: 10 + i, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });

    // Typewriter
    let masterTl = gsap.timeline({ repeat: -1 });
    phrases.forEach((phrase) => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 2 });
      tl.to(textRef.current, { duration: phrase.length * 0.05, text: { value: phrase, delimiter: "" }, ease: "none" });
      masterTl.add(tl);
    });
    gsap.to(cursorRef.current, { opacity: 0, ease: "steps(1)", repeat: -1, duration: 0.5 });
  }, { scope: container });

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>{children}</div>
      <div className={styles.brandSection}>
        <div className={styles.line} style={{top: '20%', left: '10%', width: '300px'}} />
        <div className={styles.line} style={{bottom: '30%', right: '15%', width: '400px'}} />
        <div className={styles.typewriterBox}>
          <h2 className={styles.typewriterText}>
            <span ref={textRef}></span>
            <span ref={cursorRef} className={styles.cursor}>|</span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;