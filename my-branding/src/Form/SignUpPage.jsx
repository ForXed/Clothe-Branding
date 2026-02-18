import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { validateEmail } from '../App';
import styles from './SignUpPage.module.css';

gsap.registerPlugin(TextPlugin);

const BrutigeLogo = ({ color = "black" }) => (
  <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
    <circle cx="50" cy="50" r="50" fill={color}/>
    <path d="M48 25L48 65L25 80L48 25Z" fill={color === "black" ? "white" : "black"} fillOpacity="0.8"/>
    <path d="M52 25L52 65L75 80L52 25Z" fill={color === "black" ? "white" : "black"}/>
  </svg>
);

const SignUpPage = () => {
  const container = useRef();
  const textRef = useRef();
  const cursorRef = useRef();
  const navigate = useNavigate();

  // FORM STATE
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });

  const phrases = [
    "brutige: join the infrastructure.",
    "design the future of fashion.",
    "your brand, engineered.",
    "access elite maker networks.",
    "from vision to storefront."
  ];

  useGSAP(() => {
    gsap.from(`.${styles.formWrapper} > *`, { opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: "expo.out" });
    const lines = gsap.utils.toArray(`.${styles.line}`);
    lines.forEach((line, i) => {
      gsap.to(line, { x: i % 2 === 0 ? 80 : -80, opacity: 0.2, duration: 10 + i, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });
    let masterTl = gsap.timeline({ repeat: -1 });
    phrases.forEach((phrase) => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 2 });
      tl.to(textRef.current, { duration: phrase.length * 0.05, text: { value: phrase, delimiter: "" }, ease: "none" });
      masterTl.add(tl);
    });
    gsap.to(cursorRef.current, { opacity: 0, ease: "steps(1)", repeat: -1, duration: 0.5 });
  }, { scope: container });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.length < 2) return alert("Full name is required.");
    if (!validateEmail(formData.email)) return alert("Invalid professional email.");
    if (formData.password.length < 8) return alert("Security requires 8+ characters.");
    
    // SUCCESS: Route to 6-digit Verify
    navigate("/verify");
  };

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logoHeader} onClick={() => navigate('/')} style={{cursor: 'pointer'}}>
            <BrutigeLogo color="black" />
            <span className={styles.brandName}>brutige</span>
          </div>
          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>Start building your brand infrastructure today.</p>
          <div className={styles.socialGrid}>
            <button className={styles.socialBtn}><img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" />Google</button>
            <button className={styles.socialBtn}><img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="" />Apple</button>
          </div>
          <div className={styles.divider}><span className={styles.dividerLine}></span><span className={styles.dividerText}>OR</span><span className={styles.dividerLine}></span></div>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}><label>Full Name</label>
              <input type="text" onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="Alexander McQueen" />
            </div>
            <div className={styles.inputGroup}><label>Professional Email</label>
              <input type="email" onChange={(e) => setFormData({...formData, email: e.target.value})} placeholder="name@company.com" />
            </div>
            <div className={styles.inputGroup}><label>Password</label>
              <input type="password" onChange={(e) => setFormData({...formData, password: e.target.value})} placeholder="••••••••" />
            </div>
            <button type="submit" className={styles.submitBtn}>Initialize &rarr;</button>
          </form>
          <p className={styles.footerLink}>Already a member? <Link to="/login">Sign In</Link></p>
        </div>
      </div>
      <div className={styles.brandSection}>
        <div className={styles.line} style={{top: '15%', left: '10%', width: '250px'}} />
        <div className={styles.line} style={{bottom: '30%', left: '20%', width: '200px'}} />
        <div className={styles.typewriterBox}><h2 className={styles.typewriterText}><span ref={textRef}></span><span ref={cursorRef} className={styles.cursor}>|</span></h2></div>
      </div>
    </div>
  );
};
export default SignUpPage;