import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { validateEmail } from '../App';
import styles from './SignInPage.module.css';

gsap.registerPlugin(TextPlugin);

const BrutigeLogo = ({ color = "black" }) => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="50" fill={color}/>
    <path d="M48 25L48 65L25 80L48 25Z" fill={color === "black" ? "white" : "black"} fillOpacity="0.8"/>
    <path d="M52 25L52 65L75 80L52 25Z" fill={color === "black" ? "white" : "black"}/>
  </svg>
);

const SignInPage = () => {
  const container = useRef();
  const textRef = useRef();
  const cursorRef = useRef();
  const navigate = useNavigate();

  // FORM STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const phrases = [
    "brutige: access your workspace.",
    "infrastructure for the bold.",
    "raw vision. refined reality.",
    "the bridge to premium labels.",
    "architecture of the new age."
  ];

  useGSAP(() => {
    gsap.from(`.${styles.formWrapper} > *`, { opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: "expo.out" });
    const lines = gsap.utils.toArray(`.${styles.line}`);
    lines.forEach((line, i) => {
      gsap.to(line, { x: i % 2 === 0 ? 100 : -100, opacity: 0.3, duration: 10 + i, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });
    let masterTl = gsap.timeline({ repeat: -1 });
    phrases.forEach((phrase) => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 2 });
      tl.to(textRef.current, { duration: phrase.length * 0.05, text: { value: phrase, delimiter: "" }, ease: "none" });
      masterTl.add(tl);
    });
    gsap.to(cursorRef.current, { opacity: 0, ease: "power2.inOut", repeat: -1 });
  }, { scope: container });

const handleLogin = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) return alert("Invalid email.");
    if (password.length < 6) return alert("Password must be 6+ characters.");
    
    // REDIRECT TO PLATFORM
    navigate("/platform/shop"); 
  };

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logoHeader} onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <BrutigeLogo color="black" />
            <span className={styles.brandName}>brutige</span>
          </div>
          <h1 className={styles.title}>Secure Access</h1>
          <p className={styles.subtitle}>Sign in to your branding infrastructure.</p>
          <div className={styles.socialGrid}>
            <button className={styles.socialBtn}><img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" />Google</button>
            <button className={styles.socialBtn}><img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="" />Apple</button>
          </div>
          <div className={styles.divider}><span className={styles.dividerLine}></span><span className={styles.dividerText}>OR</span><span className={styles.dividerLine}></span></div>
          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label>Professional Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
            </div>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" className={styles.submitBtn}>Continue &rarr;</button>
          </form>
          <p className={styles.footerLink}>New here? <Link to="/signup">Request Access</Link></p>
        </div>
      </div>
      <div className={styles.brandSection}>
        <div className={styles.line} style={{top: '20%', left: '10%', width: '300px'}} />
        <div className={styles.line} style={{top: '50%', right: '10%', width: '400px'}} />
        <div className={styles.typewriterBox}><h2 className={styles.typewriterText}><span ref={textRef}></span><span ref={cursorRef} className={styles.cursor}>|</span></h2></div>
      </div>
    </div>
  );
};
export default SignInPage;