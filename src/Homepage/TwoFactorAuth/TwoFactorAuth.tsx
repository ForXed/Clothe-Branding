import React, { useState, useRef } from 'react';
import styles from './TwoFactorAuth.module.css';

const TwoFactorAuth = ({ onClose, onEnable }) => {
  const [step, setStep] = useState(1); // 1: Intro, 2: QR Code, 3: Verify, 4: Success
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  // Generate QR code (mock)
  const generateQR = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock data - in real app, this comes from backend
    setQrCode('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==');
    setSecret('JBSWY3DPEHPK3PXP');
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
    
    // Auto-focus next input
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
    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock success - in real app, verify with backend
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

  // Render different steps
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={styles.stepContent}>
            <div className={styles.iconLarge}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <h3>Enable Two-Factor Authentication</h3>
            <p>Add an extra layer of security to your account by requiring a verification code in addition to your password.</p>
            <ul className={styles.benefitsList}>
              <li>Protect against unauthorized access</li>
              <li>Secure your products and sales</li>
              <li>Easy to set up with any authenticator app</li>
            </ul>
            <div className={styles.buttonGroup}>
              <button 
                className={styles.btnPrimary}
                onClick={generateQR}
                disabled={isLoading}
              >
                {isLoading ? 'Setting up...' : 'Get Started'}
              </button>
              <button className={styles.btnText} onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={styles.stepContent}>
            <h3>Scan QR Code</h3>
            <p>Open your authenticator app and scan the QR code below:</p>
            
            <div className={styles.qrContainer}>
              <div className={styles.qrCode}>
                <svg width="160" height="160" viewBox="0 0 160 160">
                  <rect width="160" height="160" fill="white"/>
                  <rect x="20" y="20" width="40" height="40" fill="black"/>
                  <rect x="100" y="20" width="40" height="40" fill="black"/>
                  <rect x="20" y="100" width="40" height="40" fill="black"/>
                  <rect x="30" y="30" width="20" height="20" fill="white"/>
                  <rect x="110" y="30" width="20" height="20" fill="white"/>
                  <rect x="30" y="110" width="20" height="20" fill="white"/>
                  <rect x="35" y="35" width="10" height="10" fill="black"/>
                  <rect x="115" y="35" width="10" height="10" fill="black"/>
                  <rect x="35" y="115" width="10" height="10" fill="black"/>
                  {/* Random pattern */}
                  <rect x="70" y="20" width="10" height="10" fill="black"/>
                  <rect x="70" y="40" width="10" height="10" fill="black"/>
                  <rect x="70" y="70" width="10" height="10" fill="black"/>
                  <rect x="70" y="100" width="10" height="10" fill="black"/>
                  <rect x="70" y="130" width="10" height="10" fill="black"/>
                  <rect x="100" y="70" width="10" height="10" fill="black"/>
                  <rect x="120" y="70" width="10" height="10" fill="black"/>
                  <rect x="100" y="100" width="40" height="40" fill="black"/>
                  <rect x="110" y="110" width="20" height="20" fill="white"/>
                  <rect x="115" y="115" width="10" height="10" fill="black"/>
                </svg>
              </div>
            </div>
            
            <div className={styles.manualEntry}>
              <p>Can't scan? Enter this code manually:</p>
              <div className={styles.secretCode}>
                <code>{secret}</code>
                <button onClick={copySecret} className={styles.copyBtn}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                </button>
              </div>
            </div>
            
            <div className={styles.buttonGroup}>
              <button 
                className={styles.btnPrimary}
                onClick={() => setStep(3)}
              >
                Continue
              </button>
              <button className={styles.btnText} onClick={() => setStep(1)}>
                Back
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className={styles.stepContent}>
            <h3>Verify Code</h3>
            <p>Enter the 6-digit code from your authenticator app:</p>
            
            <div className={styles.codeInput}>
              {verificationCode.map((digit, index) => (
                <input
                  key={index}
                  ref={el => inputRefs.current[index] = el}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className={styles.codeDigit}
                />
              ))}
            </div>
            
            {error && <p className={styles.error}>{error}</p>}
            
            <div className={styles.buttonGroup}>
              <button 
                className={styles.btnPrimary}
                onClick={verifyCode}
                disabled={isLoading || verificationCode.some(d => !d)}
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </button>
              <button className={styles.btnText} onClick={() => setStep(2)}>
                Back
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className={styles.stepContent}>
            <div className={styles.successIcon}>
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3>2FA Enabled!</h3>
            <p>Your account is now protected with two-factor authentication.</p>
            <p className={styles.backupHint}>Make sure to save your backup codes in a safe place.</p>
            <div className={styles.buttonGroup}>
              <button className={styles.btnPrimary} onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
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
        
        {renderStep()}
      </div>
    </div>
  );
};

export default TwoFactorAuth;