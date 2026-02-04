import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { validateEmail } from '../App';
import styles from './SignInPage.module.css';

gsap.registerPlugin(TextPlugin);

const ForgottenPassword = () => {
  const container = useRef();
  const textRef = useRef();
  const cursorRef = useRef();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const phrases = ["brutige: recover identity.", "securing your design gateway.", "re-authenticating credentials."];

  useGSAP(() => {
    gsap.from(`.${styles.formWrapper} > *`, { opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: "expo.out" });
    let masterTl = gsap.timeline({ repeat: -1 });
    phrases.forEach((phrase) => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 2 });
      tl.to(textRef.current, { duration: phrase.length * 0.05, text: { value: phrase, delimiter: "" }, ease: "none" });
      masterTl.add(tl);
    });
  }, { scope: container });

  const handleReset = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return alert("Professional email required.");
    navigate("/verify");
  };

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Reset Access</h1>
          <p className={styles.subtitle}>Enter your email to recover your design workspace.</p>
          <form className={styles.form} onSubmit={handleReset}>
            <div className={styles.inputGroup}><label>Professional Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@branding.com" />
            </div>
            <button type="submit" className={styles.submitBtn}>Send Recovery Link &rarr;</button>
          </form>
          <p className={styles.footerLink}><Link to="/login">Back to Sign In</Link></p>
        </div>
      </div>
      <div className={styles.brandSection}>
        <div className={styles.line} style={{top: '40%', left: '5%', width: '350px'}} />
        <div className={styles.typewriterBox}><h2 className={styles.typewriterText}><span ref={textRef}></span>|</h2></div>
      </div>
    </div>
  );
};
export default ForgottenPassword;