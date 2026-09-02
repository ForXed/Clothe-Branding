import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { validateEmail } from '../utils/validators';
import { authService } from '../services/authService';
import styles from './SignUpPage.module.css';

gsap.registerPlugin(TextPlugin);

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface SignUpPageProps {
  notify?: NotifyFunction;
}

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

const EyeOffIcon: React.FC = () => (
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

const SignUpPage: React.FC<SignUpPageProps> = ({ notify }) => {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const phrases: string[] = [
    'brutige: join the infrastructure.',
    'design the future of fashion.',
    'your brand, engineered.',
    'access elite maker networks.',
    'from vision to storefront.',
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
          x: i % 2 === 0 ? 80 : -80,
          opacity: 0.2,
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
        ease: 'steps(1)',
        repeat: -1,
        duration: 0.5,
      });
    },
    { scope: container },
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (formData.firstName.trim().length < 2) {
      if (notify) notify('Please enter your first name.', 'error');
      return;
    }
    if (formData.lastName.trim().length < 2) {
      if (notify) notify('Please enter your last name.', 'error');
      return;
    }
    if (!validateEmail(formData.email)) {
      if (notify) notify('Please enter a valid email address.', 'error');
      return;
    }
    if (formData.password.length < 8) {
      if (notify) notify('Password must be at least 8 characters.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.register({
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email,
        password: formData.password,
      });

      if (notify) {
        notify(
          'Account created! Please check your email to verify your account.',
          'success'
        );
      }
      
      // Navigate to login page after successful signup
      setTimeout(() => navigate('/login'), 1500);
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Registration failed. Please try again.';
      if (notify) notify(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
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

          <h1 className={styles.title}>Create Account</h1>
          <p className={styles.subtitle}>
            Start building your brand infrastructure today.
          </p>

          <div className={styles.socialGrid}>
            <button 
              type='button' 
              className={styles.socialBtn}
              onClick={handleGoogleSignUp}
            >
              <img
                src='https://www.svgrepo.com/show/475656/google-color.svg'
                alt='Google'
              />
              <span>Continue with Google</span>
            </button>
          </div>

          <div className={styles.divider}>
            <span className={styles.dividerLine}></span>
            <span className={styles.dividerText}>OR</span>
            <span className={styles.dividerLine}></span>
          </div>

          <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <div className={styles.nameRow}>
              <div className={styles.inputGroup}>
                <label>First Name</label>
                <input
                  type='text'
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  placeholder='Alexander'
                  disabled={isLoading}
                  required
                />
              </div>
              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input
                  type='text'
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  placeholder='McQueen'
                  disabled={isLoading}
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type='email'
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
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
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder='Minimum 8 characters'
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
              {isLoading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <div className={styles.authFooter}>
            <p className={styles.footerLink}>
              Already have an account? <Link to='/login'>Sign In</Link>
            </p>
          </div>
        </div>
      </div>

      <div className={styles.brandSection}>
        <div
          className={styles.line}
          style={{ top: '15%', left: '10%', width: '250px' }}
        />
        <div
          className={styles.line}
          style={{ bottom: '30%', left: '20%', width: '200px' }}
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

export default SignUpPage;