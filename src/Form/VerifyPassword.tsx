import React, { useRef, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { authService } from '../services/authService';
import styles from './VerifyPassword.module.css';

gsap.registerPlugin(TextPlugin);

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface VerifyPasswordProps {
  notify?: NotifyFunction;
}

const VerifyPassword: React.FC<VerifyPasswordProps> = ({ notify }) => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check if there's a token in the URL (from email link verification)
  const tokenFromUrl = searchParams.get('token');

  const phrases: string[] = [
    'verify your access.',
    'authenticating identity.',
    'securing the infrastructure.',
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

  // If token is in the URL, verify it automatically on mount
  React.useEffect(() => {
    if (tokenFromUrl) {
      handleTokenVerification(tokenFromUrl);
    }
  }, [tokenFromUrl]);

  const handleTokenVerification = async (token: string) => {
    setIsLoading(true);
    setError('');
    try {
      await authService.verifyEmail(token);
      if (notify) notify('Email verified successfully! You can now sign in.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Verification failed. The link may have expired.';
      setError(message);
      if (notify) notify(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    setError('');

    // Auto-focus next input
    if (element.value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6).split('');
    if (pastedData.every(char => !isNaN(Number(char)))) {
      const newOtp = [...otp];
      pastedData.forEach((char, i) => {
        if (i < 6) newOtp[i] = char;
      });
      setOtp(newOtp);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleVerify = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fullCode = otp.join('');

    if (fullCode.length < 6) {
      setError('Please enter the complete 6-digit code.');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await authService.verifyEmail(fullCode);
      if (notify) notify('Email verified successfully! You can now sign in.', 'success');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Invalid code. Please check and try again.';
      setError(message);
      if (notify) notify(message, 'error');
      // Clear inputs for retry
      setOtp(new Array(6).fill(''));
      inputRefs.current[0]?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <h1 className={styles.title}>Verify Your Email</h1>
          <p className={styles.subtitle}>
            {tokenFromUrl
              ? 'Verifying your email address...'
              : 'Enter the 6-digit code we sent to your email.'}
          </p>

          {!tokenFromUrl && (
            <form className={styles.form} onSubmit={handleVerify}>
              <div className={styles.otpContainer}>
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => {
                      inputRefs.current[index] = el;
                    }}
                    type='text'
                    inputMode='numeric'
                    maxLength={1}
                    className={styles.otpInput}
                    value={digit}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onPaste={handlePaste}
                    onFocus={(e) => e.target.select()}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {error && <p className={styles.errorMsg}>{error}</p>}

              <button
                type='submit'
                className={styles.submitBtn}
                disabled={isLoading}
              >
                {isLoading ? 'Verifying...' : 'Verify Email →'}
              </button>
            </form>
          )}

          {tokenFromUrl && error && (
            <div className={styles.errorBox}>
              <p className={styles.errorMsg}>{error}</p>
              <button
                type='button'
                className={styles.submitBtn}
                onClick={() => navigate('/signup')}
              >
                Sign Up Again
              </button>
            </div>
          )}

          <div className={styles.authFooter}>
            <p className={styles.footerLink}>
              <Link to='/login'>Back to Sign In</Link>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.brandSection}>
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

export default VerifyPassword;