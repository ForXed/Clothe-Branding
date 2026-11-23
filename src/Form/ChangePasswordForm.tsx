import React, { useEffect, useState } from 'react';
import { authService } from '../services/authService';
import { toApiError } from '../services/apiClient';
import styles from './ChangePasswordForm.module.css';

/**
 * Changing a password goes through the reset flow: the API has no
 * `change-password` endpoint (that call never existed on the backend). So the
 * form asks for the new password, emails a 6-digit code to the signed-in user,
 * then verifies the code and resets.
 */
interface ChangePasswordFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  notify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface FormData {
  newPassword: string;
  confirmPassword: string;
  otp: string;
}

interface FormErrors {
  newPassword?: string | null;
  confirmPassword?: string | null;
  otp?: string | null;
}

type Step = 'password' | 'code';

const PASSWORD_PATTERN = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose, onSuccess, notify }) => {
  const [step, setStep] = useState<Step>('password');
  const [email, setEmail] = useState<string>('');
  const [formData, setFormData] = useState<FormData>({ newPassword: '', confirmPassword: '', otp: '' });
  const [errors, setErrors] = useState<FormErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  // The reset endpoints need the account email; the session knows it, the form does not.
  useEffect(() => {
    let cancelled = false;
    authService
      .getMe()
      .then((me) => {
        if (!cancelled) setEmail(me.email);
      })
      .catch(() => {
        if (!cancelled) setFormError('We could not load your account. Please sign in again.');
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const validatePasswordStep = (): boolean => {
    const next: FormErrors = {};
    if (!formData.newPassword) {
      next.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      next.newPassword = 'Password must be at least 8 characters';
    } else if (!PASSWORD_PATTERN.test(formData.newPassword)) {
      next.newPassword = 'Must contain uppercase, lowercase, and number';
    }
    if (formData.newPassword !== formData.confirmPassword) {
      next.confirmPassword = 'Passwords do not match';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const requestCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    if (!validatePasswordStep()) return;
    if (!email) {
      setFormError('We could not load your account. Please sign in again.');
      return;
    }

    setIsLoading(true);
    try {
      await authService.forgotPassword(email);
      setStep('code');
      notify?.(`We emailed a 6-digit code to ${email}`, 'info');
    } catch (err) {
      setFormError(toApiError(err).message);
    } finally {
      setIsLoading(false);
    }
  };

  const submitCode = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const otp = formData.otp.trim();
    if (!/^\d{6}$/.test(otp)) {
      setErrors({ otp: 'Enter the 6-digit code from the email' });
      return;
    }

    setIsLoading(true);
    try {
      await authService.verifyForgottenPasswordOtp(email, otp);
      await authService.resetPassword({ email, otp, password: formData.newPassword });
      notify?.('Password updated successfully', 'success');
      onSuccess?.();
      onClose();
    } catch (err) {
      const apiError = toApiError(err);
      if (apiError.code === 'VALIDATION_FAILED' && apiError.firstFieldError) {
        setErrors({ otp: apiError.firstFieldError });
      } else {
        setErrors({ otp: apiError.message });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} disabled={isLoading} type="button">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className={styles.header}>
          <h3>Change Password</h3>
          <p>
            {step === 'password'
              ? 'Choose a new password — we will email you a code to confirm'
              : `Enter the 6-digit code we sent to ${email}`}
          </p>
        </div>

        {formError && <p className={styles.errorMsg}>{formError}</p>}

        {step === 'password' ? (
          <form onSubmit={requestCode}>
            <div className={styles.formGroup}>
              <label>New Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showNew ? 'text' : 'password'}
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={() => setShowNew(!showNew)}
                  disabled={isLoading}
                >
                  {showNew ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  )}
                </button>
              </div>
              {errors.newPassword && <span className={styles.errorMsg}>{errors.newPassword}</span>}
            </div>

            <div className={styles.formGroup}>
              <label>Confirm New Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.toggleVisibility}
                  onClick={() => setShowConfirm(!showConfirm)}
                  disabled={isLoading}
                >
                  {showConfirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
            </div>

            <div className={styles.buttonGroup}>
              <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={isLoading}>
                Cancel
              </button>
              <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
                {isLoading ? 'Sending code...' : 'Send code'}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={submitCode}>
            <div className={styles.formGroup}>
              <label>Verification Code</label>
              <div className={styles.inputWrapper}>
                <input
                  type="text"
                  name="otp"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="6-digit code"
                  inputMode="numeric"
                  maxLength={6}
                  disabled={isLoading}
                  autoComplete="one-time-code"
                />
              </div>
              {errors.otp && <span className={styles.errorMsg}>{errors.otp}</span>}
            </div>

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.btnSecondary}
                onClick={() => {
                  setStep('password');
                  setFormData((prev) => ({ ...prev, otp: '' }));
                  setErrors({});
                  setFormError(null);
                }}
                disabled={isLoading}
              >
                Back
              </button>
              <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ChangePasswordForm;
