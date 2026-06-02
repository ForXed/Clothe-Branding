import React, { useState, useRef, useEffect } from 'react';
import styles from './TwoFactorSetup.module.css';

const TwoStepSetup = ({ onClose, onSuccess }) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef([]);

  // Focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;

    const newCode = [...code];
    newCode[index] = element.value;
    setCode(newCode);
    setError('');

    // Auto-focus next input
    if (element.value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move back on backspace if empty
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pastedData.every(char => !isNaN(char))) {
      const newCode = [...code];
      pastedData.forEach((char, i) => {
        if (i < 6) newCode[i] = char;
      });
      setCode(newCode);
      // Focus last filled or next empty
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    
    if (fullCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsLoading(true);
    
    // Simulate API verification
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    onSuccess?.();
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className={styles.iconWrapper}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </div>

        <h3 className={styles.title}>Two-Factor Authentication</h3>
        <p className={styles.subtitle}>Scan the QR code with your authenticator app (Google Authenticator, Authy, etc.) and enter the 6-digit code below.</p>

        {/* Mock QR Code */}
        <div className={styles.qrContainer}>
          <svg width="120" height="120" viewBox="0 0 100 100" fill="black">
            <rect x="0" y="0" width="30" height="30"/>
            <rect x="70" y="0" width="30" height="30"/>
            <rect x="0" y="70" width="30" height="30"/>
            <rect x="40" y="40" width="20" height="20"/>
            <rect x="10" y="10" width="10" height="10" fill="white"/>
            <rect x="80" y="10" width="10" height="10" fill="white"/>
            <rect x="10" y="80" width="10" height="10" fill="white"/>
            <rect x="45" y="45" width="10" height="10" fill="white"/>
            {/* Random noise to look like QR */}
            <rect x="35" y="10" width="5" height="5"/>
            <rect x="50" y="10" width="5" height="5"/>
            <rect x="65" y="10" width="5" height="5"/>
            <rect x="35" y="25" width="5" height="5"/>
            <rect x="50" y="25" width="5" height="5"/>
            <rect x="65" y="25" width="5" height="5"/>
            <rect x="35" y="65" width="5" height="5"/>
            <rect x="50" y="65" width="5" height="5"/>
            <rect x="65" y="65" width="5" height="5"/>
            <rect x="10" y="35" width="5" height="5"/>
            <rect x="25" y="35" width="5" height="5"/>
            <rect x="10" y="50" width="5" height="5"/>
            <rect x="25" y="50" width="5" height="5"/>
          </svg>
        </div>

        <div className={styles.secretCode}>
          XJKL-9234-MNPR-8765
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.codeInputContainer}>
            {code.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={styles.codeDigit}
              />
            ))}
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
            {isLoading ? 'Verifying...' : 'Verify & Enable'}
          </button>
          
          <button type="button" className={styles.btnText} onClick={onClose}>
            Cancel
          </button>

          <div className={styles.backupNote}>
            <strong>Save this secret key:</strong> Store it in a safe place. You'll need it if you lose access to your device.
          </div>
        </form>
      </div>
    </div>
  );
};

export default TwoStepSetup;