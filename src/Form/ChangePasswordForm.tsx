import React, { useState } from 'react';
import { authService } from '../services/authService';
import styles from './ChangePasswordForm.module.css';

interface ChangePasswordFormProps {
  onClose: () => void;
  onSuccess?: () => void;
  notify?: (message: string, type: 'success' | 'error' | 'info') => void;
}

interface FormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  currentPassword?: string | null;
  newPassword?: string | null;
  confirmPassword?: string | null;
}

const ChangePasswordForm: React.FC<ChangePasswordFormProps> = ({ onClose, onSuccess, notify }) => {
  const [formData, setFormData] = useState<FormData>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showCurrent, setShowCurrent] = useState<boolean>(false);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword = 'Must contain uppercase, lowercase, and number';
    }
    
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsLoading(true);
    
    try {
      await authService.changePassword(formData.currentPassword, formData.newPassword);
      
      setIsLoading(false);
      if (notify) notify('Password updated successfully', 'success');
      onSuccess?.();
      onClose();
    } catch (err: any) {
      setIsLoading(false);
      const message = err.response?.data?.message || 'Failed to update password. Please check your current password.';
      if (notify) notify(message, 'error');
      
      // If current password is wrong, highlight that field
      if (message.toLowerCase().includes('current') || err.response?.status === 401) {
        setErrors({ currentPassword: 'Current password is incorrect' });
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose} disabled={isLoading}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>

        <div className={styles.header}>
          <h3>Change Password</h3>
          <p>Ensure your account stays secure with a strong password</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Current Password</label>
            <div className={styles.inputWrapper}>
              <input
                type={showCurrent ? 'text' : 'password'}
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                disabled={isLoading}
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowCurrent(!showCurrent)}
                disabled={isLoading}
              >
                {showCurrent ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                )}
              </button>
            </div>
            {errors.currentPassword && <span className={styles.errorMsg}>{errors.currentPassword}</span>}
          </div>

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
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowNew(!showNew)}
                disabled={isLoading}
              >
                {showNew ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
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
              />
              <button
                type="button"
                className={styles.toggleVisibility}
                onClick={() => setShowConfirm(!showConfirm)}
                disabled={isLoading}
              >
                {showConfirm ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                )}
              </button>
            </div>
            {errors.confirmPassword && <span className={styles.errorMsg}>{errors.confirmPassword}</span>}
          </div>

          <div className={styles.buttonGroup}>
            <button type="button" className={styles.btnSecondary} onClick={onClose} disabled={isLoading}>Cancel</button>
            <button type="submit" className={styles.btnPrimary} disabled={isLoading}>
              {isLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordForm;