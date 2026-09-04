import React, { useState, useRef } from 'react';
import apiClient from '../services/apiClient';
import styles from './TwoFactorSetup.module.css';

interface TwoFactorSetupProps {
  onClose: () => void;
  onSuccess?: () => void;
}

const TwoFactorSetup: React.FC<TwoFactorSetupProps> = ({ onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Intro, 2: Setup Key, 3: Verify, 4: Success
  const [secret] = useState('JBSWY3DPEHPK3PXP'); // Mocked secret for UI display
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Handle code input
  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1 || isNaN(Number(value))) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError('');
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().slice(0, 6).split('');
    if (pastedData.every(char => !isNaN(Number(char)))) {
      const newCode = [...code];
      pastedData.forEach((char, i) => {
        if (i < 6) newCode[i] = char;
      });
      setCode(newCode);
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  // Verify code via real API
  const verifyCode = async () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      await apiClient.post('/auth/verify-2fa', { code: fullCode });
      setIsLoading(false);
      setStep(4);
    } catch (err: any) {
      setIsLoading(false);
      const message = err.response?.data?.message || 'Invalid code. Please try again.';
      setError(message);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  // Copy secret to clipboard
  const copySecret = () => {
    navigator.clipboard.writeText(secret);
  };

  const handleDone = () => {
    onSuccess?.();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        {/* Progress indicator */}
        <div className={styles.progress}>
          {[1, 2, 3, 4].map(s => (
            <div 
              key={s} 
              className={`${styles.progressDot} ${step >= s ? styles.active : ''}`}
            />
          ))}
        </div>

        {/* Step 1: Intro */}
        {step === 1 && (
          <div className={styles.step}>
            <div className={styles.icon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <h2>Enable Two-Factor Authentication</h2>
            <p>Add an extra layer of security to your account by requiring a verification code when logging in.</p>
            <button className={styles.primaryBtn} onClick={() => setStep(2)}>
              Get Started
            </button>
          </div>
        )}

        {/* Step 2: Setup Key (NO QR CODE) */}
        {step === 2 && (
          <div className={styles.step}>
            <div className={styles.icon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>
            </div>
            <h2>Setup Authenticator</h2>
            <p>Open your authenticator app (Google Authenticator, Authy, etc.) and enter this setup key to link your account.</p>
            
            <div className={styles.manualEntry}>
              <p>Setup Key</p>
              <div className={styles.secret}>
                <code>{secret}</code>
                <button onClick={copySecret} title="Copy">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
              </div>
            </div>

            <button className={styles.primaryBtn} onClick={() => setStep(3)}>
              Continue
            </button>
          </div>
        )}

        {/* Step 3: Verify */}
        {step === 3 && (
          <div className={styles.step}>
            <div className={styles.icon}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>Verify Your Setup</h2>
            <p>Enter the 6-digit code from your authenticator app to verify everything is working.</p>
            
            <div className={styles.codeInput}>
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => { inputRefs.current[idx] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  onPaste={handlePaste}
                  className={styles.codeDigit}
                  disabled={isLoading}
                />
              ))}
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button 
              className={styles.primaryBtn} 
              onClick={verifyCode}
              disabled={isLoading || code.join('').length !== 6}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 4 && (
          <div className={styles.step}>
            <div className={`${styles.icon} ${styles.successIcon}`}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h2>2FA Enabled!</h2>
            <p>Two-factor authentication has been successfully enabled on your account.</p>
            <button className={styles.primaryBtn} onClick={handleDone}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorSetup;