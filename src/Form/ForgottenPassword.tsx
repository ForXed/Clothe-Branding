import React, { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { validateEmail } from '../utils/validators';
import { authService } from '../services/authService';
import styles from './ForgottenPassword.module.css';

gsap.registerPlugin(TextPlugin);

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface ForgottenPasswordProps {
  notify?: NotifyFunction;
}

const ForgottenPassword: React.FC<ForgottenPasswordProps> = ({ notify }) => {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();
  
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailSent, setEmailSent] = useState<boolean>(false);

  const phrases: string[] = [
    'brutige: recover identity.',
    'securing your design gateway.',
    're-authenticating credentials.',
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

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      if (notify) notify('Please enter a valid email address.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      
      setEmailSent(true);
      if (notify) {
        notify(
          'Password reset link sent! Check your email inbox.',
          'success'
        );
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        'Unable to send reset link. Please try again.';
      if (notify) notify(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>
            {emailSent ? 'Check Your Email' : 'Forgot Password'}
          </h1>
          <p className={styles.subtitle}>
            {emailSent
              ? `We've sent a password reset link to ${email}. Click the link in the email to reset your password.`
              : "Enter your email and we'll send you a link to reset your password."}
          </p>

          {!emailSent ? (
            <>
              {/* Added noValidate to disable browser popups and red borders */}
              <form className={styles.form} onSubmit={handleReset} noValidate>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input
                    type='text'
                    inputMode='email'
                    autoComplete='email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='name@company.com'
                    disabled={isLoading}
                  />
                </div>
                <button
                  type='submit'
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link →'}
                </button>
              </form>
              <p className={styles.footerLink}>
                <Link to='/login'>Back to Sign In</Link>
              </p>
            </>
          ) : (
            <>
              <div className={styles.successBox}>
                <p className={styles.successText}>
                  Didn't receive an email? Check your spam folder, or{' '}
                  <button
                    type='button'
                    onClick={() => setEmailSent(false)}
                    className={styles.resendBtn}
                  >
                    try a different email
                  </button>
                  .
                </p>
              </div>
              <p className={styles.footerLink}>
                <Link to='/login'>Back to Sign In</Link>
              </p>
            </>
          )}
        </div>
      </div>
      <div className={styles.brandSection}>
        <div
          className={styles.line}
          style={{ top: '40%', left: '5%', width: '350px' }}
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

export default ForgottenPassword;