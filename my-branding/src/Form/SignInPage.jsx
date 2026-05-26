import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { validateEmail } from '../App';
import styles from './SignInPage.module.css';

gsap.registerPlugin(TextPlugin);

// --- Icons ---
const EyeIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
    <circle cx='12' cy='12' r='3'></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg
    width='20'
    height='20'
    viewBox='0 0 24 24'
    fill='none'
    stroke='currentColor'
    strokeWidth='2'
    strokeLinecap='round'
    strokeLinejoin='round'
  >
    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
    <line x1='1' y1='1' x2='23' y2='23'></line>
  </svg>
);

const BrutigeLogo = ({ color = 'black' }) => (
  <svg width='40' height='40' viewBox='0 0 100 100' fill='none'>
    <circle cx='50' cy='50' r='50' fill={color} />
    <path
      d='M48 25L48 65L25 80L48 25Z'
      fill={color === 'black' ? 'white' : 'black'}
      fillOpacity='0.8'
    />
    <path
      d='M52 25L52 65L75 80L52 25Z'
      fill={color === 'black' ? 'white' : 'black'}
    />
  </svg>
);

const SignInPage = ({ notify }) => {
  const container = useRef();
  const textRef = useRef();
  const cursorRef = useRef();
  const navigate = useNavigate();

  // FORM STATE
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // New State

  const phrases = [
    'brutige: access your workspace.',
    'infrastructure for the bold.',
    'raw vision. refined reality.',
    'the bridge to premium labels.',
    'architecture of the new age.',
  ];

  useGSAP(
    () => {
      // 1. Entrance Animation
      gsap.from(`.${styles.formWrapper} > *`, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 1,
        ease: 'expo.out',
      });

      // 2. Background Lines
      const lines = gsap.utils.toArray(`.${styles.line}`);
      lines.forEach((line, i) => {
        gsap.to(line, {
          x: i % 2 === 0 ? 100 : -100,
          opacity: 0.3,
          duration: 10 + i,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
        });
      });

      // 3. Typewriter
      let masterTl = gsap.timeline({ repeat: -1 });
      phrases.forEach((phrase) => {
        let tl = gsap.timeline({ repeat: 1, yoyo: true, repeatDelay: 2 });
        tl.to(textRef.current, {
          duration: phrase.length * 0.05,
          text: { value: phrase, delimiter: '' },
          ease: 'none',
        });
        masterTl.add(tl);
      });
      gsap.to(cursorRef.current, {
        opacity: 0,
        ease: 'power2.inOut',
        repeat: -1,
      });
    },
    { scope: container },
  );

  const handleLogin = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      notify('Authentication failed. Invalid email format.', 'error');
      return;
    }
    if (password.length < 6) {
      notify('Security requirement. Password too short.', 'error');
      return;
    }

    notify('Identity verified. Entering platform...', 'success');
    setTimeout(() => navigate('/platform/shop'), 1500);
  };

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <div
            className={styles.logoHeader}
            onClick={() => navigate('/')}
            style={{ cursor: 'pointer' }}
          >
            <BrutigeLogo color='black' />
            <span className={styles.brandName}>brutige</span>
          </div>

          <h1 className={styles.title}>Secure Access</h1>
          <p className={styles.subtitle}>
            Sign in to your branding infrastructure.
          </p>

          <div className={styles.socialGrid}>
            <button type='button' className={styles.socialBtn}>
              <img
                src='https://www.svgrepo.com/show/475656/google-color.svg'
                alt=''
              />
              <span>Google</span>
            </button>
            <button type='button' className={styles.socialBtn}>
              <img
                src='https://www.svgrepo.com/show/511330/apple-173.svg'
                className={styles.appleIcon}
                alt=''
              />
              <span>Apple</span>
            </button>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>OR</span>
            <span className={styles.dividerLine}></span>
          </div>

          <form className={styles.form} onSubmit={handleLogin}>
            <div className={styles.inputGroup}>
              <label>Professional Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='name@company.com'
              />
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.passwordWrapper}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder='••••••••'
                  className={styles.passwordInput}
                />
                <button
                  type='button'
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex='-1'
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button type='submit' className={styles.submitBtn}>
              Continue &rarr;
            </button>
          </form>

          <div className={styles.authFooter}>
            <p className={styles.footerLink}>
              New here? <Link to='/signup'>Request Access</Link>
            </p>
            <p className={styles.footerLink}>
              Artisan? <Link to='/maker-signup'>Join as a Maker</Link>
            </p>
            <p className={styles.footerLink}>
              <Link to='/forgot-password' style={{ opacity: 0.5 }}>
                Forgotten credentials?
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.brandSection}>
        <div
          className={styles.line}
          style={{ top: '20%', left: '10%', width: '300px' }}
        />
        <div
          className={styles.line}
          style={{ top: '50%', right: '10%', width: '400px' }}
        />
        <div className={styles.typewriterBox}>
          <h2 className={styles.typewriterText}>
            <span ref={textRef}></span>
            <span ref={cursorRef} className={styles.cursor}>
              |
            </span>
          </h2>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
