import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom'; // ✅ Added useSearchParams
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { authService } from '../services/authService';
import styles from './ResetPassword.module.css';

gsap.registerPlugin(TextPlugin);

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface ResetPasswordProps {
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

type ResetStep = 'email' | 'otp' | 'success';

const ResetPassword: React.FC<ResetPasswordProps> = ({ notify }) => {
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams(); // ✅ Read URL params

  // ✅ Read email from URL (redirected from /forgot-password)
  const emailFromUrl = searchParams.get('email') || '';

  // ✅ Start at OTP step if email came from URL, otherwise start at email step
  const [step, setStep] = useState<ResetStep>(emailFromUrl ? 'otp' : 'email');
  const [email, setEmail] = useState<string>(emailFromUrl);
  const [otp, setOtp] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const phrases: string[] = [
    'brutige: reset your access.',
    'security first. always.',
    'your infrastructure, protected.',
    'rebuild. restart. reclaim.',
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
        ease: 'steps(1)',
        repeat: -1,
        duration: 0.5,
      });
    },
    { scope: container }
  );

  // Step 1: Request OTP (only runs if user lands directly on /reset-password without email)
  const handleRequestOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !email.includes('@')) {
      if (notify) notify('Please enter a valid email address.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      if (notify) notify('6-digit code sent to your email.', 'success');
      setStep('otp');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to send reset code.';
      if (notify) notify(message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Step 2: Verify OTP + Set New Password (sends all 3 together per contract)
  const handleVerifyOtp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (otp.length !== 6) {
      if (notify) notify('Please enter the 6-digit code.', 'error');
      return;
    }

    if (newPassword.length < 8) {
      if (notify) notify('Password must be at least 8 characters.', 'error');
      return;
    }

    if (newPassword !== confirmPassword) {
      if (notify) notify('Passwords do not match.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(email, newPassword, otp);
      if (notify) notify('Password reset successfully! Please sign in.', 'success');
      setStep('success');
      setTimeout(() => navigate('/login'), 2000);
    } catch (error: any) {
      const message = error.response?.data?.message || 'Invalid code or reset failed.';
      if (notify) notify(message, 'error');
    } finally {
      setIsLoading(false);
    }
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

          {step === 'email' && (
            <>
              <h1 className={styles.title}>Reset Password</h1>
              <p className={styles.subtitle}>
                Enter your email and we'll send you a 6-digit reset code.
              </p>

              <form className={styles.form} onSubmit={handleRequestOtp} noValidate>
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

                <button
                  type='submit'
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending Code...' : 'Send Reset Code →'}
                </button>
              </form>
            </>
          )}

          {step === 'otp' && (
            <>
              <h1 className={styles.title}>Enter Code & New Password</h1>
              <p className={styles.subtitle}>
                We sent a 6-digit code to <strong>{email}</strong>. Enter it below along with your new password.
              </p>

              <form className={styles.form} onSubmit={handleVerifyOtp} noValidate>
                <div className={styles.inputGroup}>
                  <label>6-Digit Code</label>
                  <input
                    type='text'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder='123456'
                    maxLength={6}
                    disabled={isLoading}
                    required
                    style={{ letterSpacing: '0.5em', textAlign: 'center', fontSize: '1.5rem' }}
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>New Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
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

                <div className={styles.inputGroup}>
                  <label>Confirm New Password</label>
                  <div className={styles.passwordWrapper}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder='Re-enter your new password'
                      className={styles.passwordInput}
                      disabled={isLoading}
                      required
                    />
                  </div>
                </div>

                <button
                  type='submit'
                  className={styles.submitBtn}
                  disabled={isLoading}
                >
                  {isLoading ? 'Resetting...' : 'Reset Password →'}
                </button>

                <button
                  type='button'
                  className={styles.backBtn}
                  onClick={() => {
                    setStep('email');
                    setOtp('');
                    setNewPassword('');
                    setConfirmPassword('');
                  }}
                  disabled={isLoading}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#666',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    marginTop: '8px',
                    textDecoration: 'underline'
                  }}
                >
                  ← Use a different email
                </button>
              </form>
            </>
          )}

          {step === 'success' && (
            <>
              <h1 className={styles.title}>Success!</h1>
              <p className={styles.subtitle}>
                Your password has been reset. Redirecting to sign in...
              </p>
            </>
          )}

          <div className={styles.authFooter}>
            <p className={styles.footerLink}>
              Remember your password? <Link to='/login'>Sign In</Link>
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

export default ResetPassword;