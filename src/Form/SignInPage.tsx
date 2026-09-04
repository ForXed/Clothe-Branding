import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { validateEmail } from '../utils/validators';
import { authService } from '../services/authService';
import styles from './SignInPage.module.css';

gsap.registerPlugin(TextPlugin);

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface SignInPageProps {
  notify?: NotifyFunction;
}

interface BrutigeLogoProps {
  color?: string;
}

const BrutigeLogo: React.FC<BrutigeLogoProps> = ({ color = 'black' }) => (
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

const EyeIcon: React.FC = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z'></path>
    <circle cx='12' cy='12' r='3'></circle>
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
    <path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24'></path>
    <line x1='1' y1='1' x2='23' y2='23'></line>
  </svg>
);

const SignInPage: React.FC<SignInPageProps> = ({ notify }) => {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const phrases: string[] = [
    'brutige: access your workspace.',
    'infrastructure for the bold.',
    'raw vision. refined reality.',
    'the bridge to premium labels.',
    'architecture of the new age.',
  ];

  useGSAP(
    () => {
      gsap.from(`.${styles.formWrapper} > *`, {
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 1,
        ease: 'expo.out',
      });

      const lines = gsap.utils.toArray<HTMLElement>(`.${styles.line}`);
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

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      if (notify) notify('Please enter a valid email address.', 'error');
      return;
    }
    if (password.length < 6) {
      if (notify) notify('Password must be at least 6 characters.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const { user } = await authService.login(email, password);
      
      // Store user info for the app
      localStorage.setItem('brutige_user', JSON.stringify(user));
      
      if (notify) notify(`Welcome back, ${user.firstName || user.email}!`, 'success');
      
      // Navigate to discovery (the new B2B entry point)
      setTimeout(() => navigate('/platform/discovery'), 800);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed. Please check your credentials.';
      if (notify) notify(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authService.getGoogleOAuthUrl();
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

          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>
            Sign in to manage your brand and production orders.
          </p>

          <div className={styles.socialGrid}>
            <button 
              type='button' 
              className={styles.socialBtn}
              onClick={handleGoogleLogin}
            >
              <img src='https://www.svgrepo.com/show/475656/google-color.svg' alt='Google' />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>OR</span>
            <span className={styles.dividerLine}></span>
          </div>

          <form className={styles.form} onSubmit={handleLogin} noValidate>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='name@company.com'
                disabled={isLoading}
                required
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
                  disabled={isLoading}
                  required
                />
                <button
                  type='button'
                  className={styles.togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            <button 
              type='submit' 
              className={styles.submitBtn}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In →'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p className={styles.footerLink}>
              New to Brutige? <Link to='/signup'>Create Account</Link>
            </p>
            <p className={styles.footerLink}>
              <Link to='/forgot-password' style={{ opacity: 0.5 }}>
                Forgot password?
              </Link>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.brandSection}>
        <div className={styles.line} style={{ top: '20%', left: '10%', width: '300px' }} />
        <div className={styles.line} style={{ top: '50%', right: '10%', width: '400px' }} />
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

export default SignInPage;