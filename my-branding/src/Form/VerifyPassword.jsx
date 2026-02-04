import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './VerifyPassword.module.css';

gsap.registerPlugin(TextPlugin);

const VerifyPassword = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const container = useRef();
  const textRef = useRef();
  const cursorRef = useRef();
  const navigate = useNavigate();

  useGSAP(() => {
    // 1. Form entrance
    gsap.from(`.${styles.formWrapper} > *`, { opacity: 0, y: 30, stagger: 0.1, duration: 1, ease: "expo.out" });

    // 2. Typewriter Logic
    let masterTl = gsap.timeline({ repeat: -1 });
    ["verify your access.", "authenticating identity.", "securing the infrastructure."].forEach((phrase) => {
      let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 2 });
      tl.to(textRef.current, { duration: phrase.length * 0.05, text: { value: phrase, delimiter: "" }, ease: "none" });
      masterTl.add(tl);
    });

    // 3. Cursor
    gsap.to(cursorRef.current, { opacity: 0, ease: "steps(1)", repeat: -1, duration: 0.5 });
  }, { scope: container });

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Auto-focus next input
    if (element.value !== "" && element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    if (otp.join("").length < 6) return alert("Enter the full 6-digit code.");
    alert("Verification Successful.");
    navigate("/login");
  };

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div className={styles.logoHeader}>
             <svg width="40" height="40" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="black"/><path d="M48 25L48 65L25 80L48 25Z" fill="white" fillOpacity="0.8"/><path d="M52 25L52 65L75 80L52 25Z" fill="white"/></svg>
             <span className={styles.brandName}>brutige</span>
          </div>
          <h1 className={styles.title}>Identity Check</h1>
          <p className={styles.subtitle}>Enter the code sent to your professional email.</p>
          
          <form className={styles.form} onSubmit={handleVerify}>
            <div className={styles.otpContainer}>
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className={styles.otpInput}
                  value={data}
                  onChange={e => handleChange(e.target, index)}
                  onKeyDown={e => handleKeyDown(e, index)}
                />
              ))}
            </div>
            <button type="submit" className={styles.submitBtn}>Verify Access</button>
          </form>
        </div>
      </div>
      <div className={styles.brandSection}>
        <div className={styles.typewriterBox}>
            <h2 className={styles.typewriterText}><span ref={textRef}></span><span ref={cursorRef}>|</span></h2>
        </div>
      </div>
    </div>
  );
};

export default VerifyPassword;