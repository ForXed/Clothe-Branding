import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './MakerSignUp.module.css';

gsap.registerPlugin(TextPlugin);

const MakerSignUp = () => {
  const navigate = useNavigate();
  const container = useRef();
  const textRef = useRef();
  const cursorRef = useRef();
  
  // Form State
  const [formData, setFormData] = useState({ name: '', studio: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New State

  // 1. ANIMATIONS
  useGSAP(() => {
    gsap.from(`.${styles.formWrapper} > *`, { opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: "expo.out" });
    
    gsap.utils.toArray(`.${styles.line}`).forEach((line, i) => {
      gsap.to(line, { x: i % 2 === 0 ? 80 : -80, opacity: 0.2, duration: 10 + i, repeat: -1, yoyo: true, ease: "sine.inOut" });
    });

    const phrases = ["brutige: artisan onboarding.", "engineer your atelier.", "global infrastructure access."];
    let masterTl = gsap.timeline({ repeat: -1 });
    phrases.forEach((phrase) => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 2 });
      tl.to(textRef.current, { duration: phrase.length * 0.05, text: { value: phrase, delimiter: "" }, ease: "none" });
      masterTl.add(tl);
    });
    gsap.to(cursorRef.current, { opacity: 0, ease: "power2.inOut", repeat: -1, duration: 0.8 });
  }, { scope: container });

  // 2. VALIDATION LOGIC
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.length < 3) return triggerError("Full name is required.");
    if (formData.studio.length < 2) return triggerError("Studio name is required.");
    if (!validateEmail(formData.email)) return triggerError("Invalid professional email.");
    if (formData.password.length < 8) return triggerError("Password must be at least 8 characters.");

    navigate("/verify");
  };

  const triggerError = (msg) => {
    setError(msg);
    setTimeout(() => setError(''), 4000);
  };

  // 3. INLINE LOGO SVG
  const BrutigeLogo = ({ color = "black" }) => (
    <svg width="40" height="40" viewBox="0 0 100 100" fill="none">
      <circle cx="50" cy="50" r="50" fill={color}/>
      <path d="M48 25L48 65L25 80L48 25Z" fill={color === "black" ? "white" : "black"} fillOpacity="0.8"/>
      <path d="M52 25L52 65L75 80L52 25Z" fill={color === "black" ? "white" : "black"}/>
    </svg>
  );

  // Eye Icons
  const EyeOpen = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  );
  const EyeClosed = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
  );

  return (
    <div ref={container} className={styles.mainWrapper}>
      {/* FLOATING ERROR MESSAGE */}
      {error && (
        <div className={styles.floatingError}>
          <div className={styles.errorIcon}>!</div>
          <span>{error}</span>
        </div>
      )}

      {/* LEFT: THE FORM (WHITE) */}
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logoHeader} onClick={() => navigate('/')}>
            <BrutigeLogo color="black" />
            <span className={styles.brandName}>brutige</span>
          </div>

          <h1 className={styles.title}>Maker Access</h1>
          <p className={styles.subtitle}>Join the network of elite ateliers and brand engineers.</p>

          <div className={styles.socialGrid}>
            <button type="button" className={styles.socialBtn}>
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" />
              <span>GOOGLE</span>
            </button>
            <button type="button" className={styles.socialBtn}>
              <img src="https://www.svgrepo.com/show/511330/apple-173.svg" alt="Apple" className={styles.appleIcon} />
              <span>APPLE</span>
            </button>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>OR</span>
            <span className={styles.dividerLine}></span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label>FULL NAME</label>
              <input type="text" placeholder="e.g. Elena Rossi" onChange={e => setFormData({...formData, name: e.target.value})} />
            </div>
            <div className={styles.inputGroup}>
              <label>STUDIO NAME</label>
              <input type="text" placeholder="e.g. Milan Pattern Studio" onChange={e => setFormData({...formData, studio: e.target.value})} />
            </div>
            <div className={styles.inputGroup}>
              <label>PROFESSIONAL EMAIL</label>
              <input type="email" placeholder="atelier@brutige.com" onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            
            {/* Password with Toggle */}
            <div className={styles.inputGroup}>
              <label>PASSWORD</label>
              <div className={styles.passwordWrapper}>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={e => setFormData({...formData, password: e.target.value})} 
                />
                <button 
                  type="button" 
                  className={styles.passwordToggle} 
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? <EyeClosed /> : <EyeOpen />}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>Initialize Atelier &rarr;</button>
          </form>

          <p className={styles.footerLink}>Looking for branding? <Link to="/signup">Customer Signup</Link></p>
        </div>
      </div>

      {/* RIGHT: THE BRANDING (BLACK) */}
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

export default MakerSignUp;