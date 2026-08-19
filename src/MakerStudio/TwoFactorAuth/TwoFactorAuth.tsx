import React, { useState, useRef } from 'react';
import styles from './TwoFactorAuth.module.css';

const TwoFactorAuth = ({ onClose, onEnable }) => {
  const [step, setStep] = useState(1); // 1: Intro, 2: QR Code, 3: Verify, 4: Success
  const [qrCode] = useState('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
  const [secret] = useState('JBSWY3DPEHPK3PXP');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  // Generate QR code (mock)
  const generateQR = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setStep(2);
  };

  // Handle verification code input
  const handleCodeChange = (index, value) => {
    if (value.length > 1) return;
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    setError('');
    
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Verify code
  const verifyCode = async () => {
    const code = verificationCode.join('');
    if (code.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }
    
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (code === '123456') {
      setIsLoading(false);
      setStep(4);
      onEnable?.();
    } else {
      setIsLoading(false);
      setError('Invalid code. Please try again.');
      setVerificationCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  // Copy secret to clipboard
  const copySecret = () => {
    navigator.clipboard.writeText(secret);
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
            <button className={styles.primaryBtn} onClick={generateQR} disabled={isLoading}>
              {isLoading ? 'Setting up...' : 'Get Started'}
            </button>
          </div>
        )}

        {/* Step 2: QR Code */}
        {step === 2 && (
          <div className={styles.step}>
            <div className={styles.qrContainer}>
              <img src={qrCode} alt="QR Code" className={styles.qrCode} />
            </div>
            <p className={styles.qrDesc}>Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)</p>
            
            <div className={styles.manualEntry}>
              <p>Can't scan? Enter this code manually:</p>
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
              {verificationCode.map((digit, idx) => (
                <input
                  key={idx}
                  ref={el => inputRefs.current[idx] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className={styles.codeDigit}
                />
              ))}
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <button 
              className={styles.primaryBtn} 
              onClick={verifyCode}
              disabled={isLoading}
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
            <button className={styles.primaryBtn} onClick={onClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TwoFactorAuth;
