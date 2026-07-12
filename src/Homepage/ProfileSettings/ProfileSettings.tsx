import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileSettings.module.css';

import ChangePasswordForm from '../../Form/ChangePasswordForm';
import TwoStepSetup from '../../Form/TwoFactorSetup';
import BrandVault from '../BrandVault/BrandVault';

// --- TypeScript Interfaces ---
interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  avatar?: string | null;
}

interface Session {
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface SecurityData {
  loginAlerts: boolean;
  activeSessions: Session[];
}

interface NotificationMethods {
  inApp: boolean;
  email: boolean;
  browser: boolean;
}

interface NotificationPrefs {
  orders: NotificationMethods;
  messages: NotificationMethods;
  account: NotificationMethods;
  marketing: NotificationMethods;
}

interface PaymentMethod {
  id: number;
  type: 'card';
  last4?: string;
  brand?: string;
  expiry?: string;
  default: boolean;
}

interface AccountData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  location: string;
  avatar: string | null;
}

interface Section {
  id: string;
  label: string;
  icon: React.ReactNode;
}

interface ProfileSettingsProps {
  userProfile?: UserProfile | null;
  setUserProfile?: (data: Partial<UserProfile>) => void;
  notify?: (message: string, type?: 'success' | 'error' | 'info') => void;
}

// Icons
const UserIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

const BellIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const PackageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const BoxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
    <line x1="12" y1="22.08" x2="12" y2="12"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

const UpgradeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ 
  userProfile, 
  setUserProfile, 
  notify 
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [activeSection, setActiveSection] = useState<string>('account');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [isGettingLocation, setIsGettingLocation] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string>('');

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (notify) {
      notify(message, type);
    }
  };

  // ✅ Customer account data (no bio, no username, no display name)
  const [accountData, setAccountData] = useState<AccountData>({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    email: userProfile?.email || '',
    phoneNumber: userProfile?.phoneNumber || '',
    location: userProfile?.location || '',
    avatar: userProfile?.avatar || null
  });

  // ✅ Simplified security (no 2FA, no public profile)
  const [securityData, setSecurityData] = useState<SecurityData>({
    loginAlerts: true,
    activeSessions: [
      { device: 'Chrome on Windows', location: 'Lagos, Nigeria', lastActive: 'Now', current: true },
      { device: 'Safari on iPhone', location: 'Lagos, Nigeria', lastActive: '2 hours ago', current: false }
    ]
  });

  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPrefs>({
    orders: { inApp: true, email: true, browser: false },
    messages: { inApp: true, email: true, browser: false },
    account: { inApp: true, email: true, browser: true },
    marketing: { inApp: false, email: false, browser: false }
  });

  const [paymentMethods] = useState<PaymentMethod[]>([
    { id: 1, type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25', default: true }
  ]);

  // ✅ Customer sections (with BrandVault and Become a Maker)
  const sections: Section[] = [
    { id: 'account', label: 'Account', icon: <UserIcon /> },
    { id: 'brand-vault', label: 'Brand Vault', icon: <BoxIcon /> },
    { id: 'security', label: 'Security', icon: <ShieldIcon /> },
    { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
    { id: 'orders', label: 'Orders & Billing', icon: <PackageIcon /> },
    { id: 'support', label: 'Help & Support', icon: <HelpIcon /> }
  ];

  // --- Handlers ---
  const getExactLocation = () => {
    setIsGettingLocation(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation not supported');
      setIsGettingLocation(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
          );
          const data = await response.json();
          if (data && data.display_name) {
            const address = data.address;
            const city = address.city || address.town || address.village || '';
            const state = address.state || '';
            const locationStr = [city, state].filter(Boolean).join(', ');
            setAccountData(prev => ({ ...prev, location: locationStr }));
            showToast('Location updated!', 'success');
          }
        } catch (error) {
          setLocationError('Could not fetch location');
          showToast('Failed to get location', 'error');
        }
        setIsGettingLocation(false);
      },
      () => {
        setLocationError('Permission denied or unavailable');
        showToast('Location permission denied', 'error');
        setIsGettingLocation(false);
      }
    );
  };

  const handleInputChange = (field: keyof AccountData, value: string | null) => {
    setAccountData(prev => {
      const updated = { ...prev, [field]: value };
      if (setUserProfile) {
        setUserProfile({ [field]: value });
      }
      return updated;
    });
  };

  const handlePhoneChange = (value: string) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    handleInputChange('phoneNumber', cleaned);
  };

  const handleSave = async (section: string) => {
    if (section === 'Account') {
      if (!accountData.firstName.trim()) {
        showToast('First name is required', 'error');
        return;
      }
      if (!accountData.lastName.trim()) {
        showToast('Last name is required', 'error');
        return;
      }
      if (!accountData.phoneNumber.trim()) {
        showToast('Phone number is required', 'error');
        return;
      }
      const phoneClean = accountData.phoneNumber.replace(/\s/g, '');
      if (!phoneClean.match(/^(\+234|0)?[789][01]\d{8}$/)) {
        showToast('Please enter a valid Nigerian phone number', 'error');
        return;
      }
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsLoading(false);
    showToast(`${section} settings saved!`, 'success');
  };

  const handleNotificationChange = (
    category: keyof NotificationPrefs, 
    method: keyof NotificationMethods, 
    value: boolean
  ) => {
    if (method === 'browser' && value) {
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            setNotificationPrefs(prev => ({
              ...prev,
              [category]: { ...prev[category], [method]: value }
            }));
            showToast('Browser notifications enabled!', 'success');
          } else {
            showToast('Browser notifications were denied', 'error');
          }
        });
      } else {
        showToast('Browser notifications not supported', 'error');
      }
    } else {
      setNotificationPrefs(prev => ({
        ...prev,
        [category]: { ...prev[category], [method]: value }
      }));
    }
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image must be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        handleInputChange('avatar', reader.result as string);
        showToast('Profile photo updated!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      {showPasswordModal && (
        <ChangePasswordForm 
          onClose={() => setShowPasswordModal(false)} 
          onSuccess={() => {
            setShowPasswordModal(false);
            showToast('Password updated successfully!', 'success');
          }}
        />
      )}

      <div className={styles.settingsLayout}>
        <aside className={styles.settingsSidebar}>
          <h2 className={styles.mainTitle}>Settings</h2>
          <nav className={styles.navMenu}>
            {sections.map(section => (
              <button
                key={section.id}
                type="button"
                className={`${styles.navItem} ${activeSection === section.id ? styles.activeNav : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
            
            {/* ✅ Become a Maker upgrade button */}
            <button
              type="button"
              className={`${styles.navItem} ${styles.upgradeNav}`}
              onClick={() => navigate('/maker-signup')}
            >
              <UpgradeIcon />
              <span>Become a Maker</span>
            </button>
          </nav>
        </aside>

        <main className={styles.settingsContent}>
          
          {/* ACCOUNT SECTION */}
          {activeSection === 'account' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Account Information</h3>
                <span className={styles.sectionDesc}>Manage your personal details</span>
              </div>
              
              <div className={styles.card}>
                <div className={styles.avatarSection}>
                  <div className={styles.avatarWrapper} onClick={handleAvatarClick}>
                    {accountData.avatar ? (
                      <img src={accountData.avatar} alt="Profile" className={styles.avatar} />
                    ) : (
                      <div className={styles.avatarPlaceholder}>
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                          <circle cx="12" cy="7" r="4"/>
                        </svg>
                      </div>
                    )}
                    <div className={styles.avatarOverlay}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </div>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    hidden 
                    accept="image/*" 
                    onChange={handleFileChange} 
                  />
                  <p className={styles.avatarHint}>Click to upload (Max 5MB)</p>
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>First Name <span className={styles.required}>*</span></label>
                    <input 
                      type="text" 
                      value={accountData.firstName} 
                      onChange={(e) => handleInputChange('firstName', e.target.value)} 
                      placeholder="Enter your first name"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Last Name <span className={styles.required}>*</span></label>
                    <input 
                      type="text" 
                      value={accountData.lastName} 
                      onChange={(e) => handleInputChange('lastName', e.target.value)} 
                      placeholder="Enter your last name"
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      value={accountData.email} 
                      onChange={(e) => handleInputChange('email', e.target.value)} 
                      placeholder="your@email.com" 
                      disabled 
                    />
                    <span className={styles.hint}>Contact support to change email</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Phone Number <span className={styles.required}>*</span></label>
                    <div className={styles.phoneInputSimple}>
                      <span className={styles.phonePrefix}>+234</span>
                      <input 
                        type="tel" 
                        value={accountData.phoneNumber} 
                        onChange={(e) => handlePhoneChange(e.target.value)} 
                        placeholder="801 234 5678"
                        required
                      />
                    </div>
                    <span className={styles.hint}>Nigerian mobile number</span>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Location</label>
                    <div className={styles.locationInputWrapper}>
                      <input 
                        type="text" 
                        value={accountData.location} 
                        onChange={(e) => handleInputChange('location', e.target.value)} 
                        placeholder="City, State" 
                      />
                      <button 
                        className={styles.locationBtn} 
                        onClick={getExactLocation} 
                        disabled={isGettingLocation} 
                        type="button"
                        aria-label="Get current location"
                      >
                        {isGettingLocation ? (
                          <span className={styles.spinner} />
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        )}
                      </button>
                    </div>
                    {locationError && <span className={styles.errorText}>{locationError}</span>}
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button 
                    type="button" 
                    className={styles.btnPrimary} 
                    onClick={() => handleSave('Account')} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button 
                    type="button" 
                    className={styles.btnText}
                    onClick={() => {
                      setAccountData({
                        firstName: userProfile?.firstName || '',
                        lastName: userProfile?.lastName || '',
                        email: userProfile?.email || '',
                        phoneNumber: userProfile?.phoneNumber || '',
                        location: userProfile?.location || '',
                        avatar: userProfile?.avatar || null
                      });
                      showToast('Changes discarded', 'info');
                    }}
                  >
                    Discard Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ✅ BRAND VAULT SECTION */}
          {activeSection === 'brand-vault' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Brand Vault</h3>
                <span className={styles.sectionDesc}>Organize your designs and share them with makers instantly.</span>
              </div>
              <BrandVault showHeader={false} />
            </div>
          )}

          {/* SECURITY SECTION - ✅ Simplified (no 2FA, no public profile) */}
          {activeSection === 'security' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Security</h3>
                <span className={styles.sectionDesc}>Protect your account</span>
              </div>

              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h4>Login Alerts</h4>
                    <p>Get notified of new sign-ins</p>
                  </div>
                  <label className={styles.switch}>
                    <input 
                      type="checkbox" 
                      checked={securityData.loginAlerts} 
                      onChange={(e) => setSecurityData(prev => ({ ...prev, loginAlerts: e.target.checked }))} 
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.card} style={{ marginTop: '32px' }}>
                <h4 className={styles.subSectionTitle}>Active Sessions</h4>
                <div className={styles.sessionsList}>
                  {securityData.activeSessions.map((session, idx) => (
                    <div key={idx} className={styles.sessionItem}>
                      <div className={styles.sessionInfo}>
                        <div className={styles.sessionDevice}>{session.device}</div>
                        <div className={styles.sessionMeta}>
                          {session.location} • {session.lastActive}
                          {session.current && <span className={styles.currentBadge}>Current</span>}
                        </div>
                      </div>
                      {!session.current && (
                        <button 
                          type="button" 
                          className={styles.btnText}
                          onClick={() => {
                            setSecurityData(prev => ({
                              ...prev,
                              activeSessions: prev.activeSessions.filter((_, i) => i !== idx)
                            }));
                            showToast('Session revoked', 'success');
                          }}
                        >
                          Revoke
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.card} style={{ marginTop: '32px' }}>
                <h4 className={styles.subSectionTitle}>Password</h4>
                <div className={styles.settingItem} style={{ border: 'none', padding: '16px 0' }}>
                  <div className={styles.settingInfo}>
                    <h4>Change Password</h4>
                    <p>Update your password regularly for security</p>
                  </div>
                  <button 
                    type="button" 
                    className={styles.btnSecondary} 
                    onClick={() => setShowPasswordModal(true)}
                  >
                    Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS SECTION */}
          {activeSection === 'notifications' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Notifications</h3>
                <span className={styles.sectionDesc}>Choose how you want to be notified</span>
              </div>
              <div className={styles.card}>
                <div className={styles.notificationHeader}>
                  <span>Category</span>
                  <span className={styles.channelLabel}>In-App</span>
                  <span className={styles.channelLabel}>Email</span>
                  <span className={styles.channelLabel}>Browser</span>
                </div>
                {(Object.entries(notificationPrefs) as [keyof NotificationPrefs, NotificationMethods][]).map(([category, methods]) => (
                  <div key={category} className={styles.notificationRow}>
                    <div className={styles.notificationCategory}>
                      <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                      <p>
                        {category === 'orders' && 'Order updates, shipping, delivery'}
                        {category === 'messages' && 'Direct messages from makers'}
                        {category === 'account' && 'Security alerts, login notifications'}
                        {category === 'marketing' && 'Tips, offers, platform updates'}
                      </p>
                    </div>
                    <label className={styles.checkbox}>
                      <input 
                        type="checkbox" 
                        checked={methods.inApp} 
                        onChange={(e) => handleNotificationChange(category, 'inApp', e.target.checked)} 
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                    <label className={styles.checkbox}>
                      <input 
                        type="checkbox" 
                        checked={methods.email} 
                        onChange={(e) => handleNotificationChange(category, 'email', e.target.checked)} 
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                    <label className={styles.checkbox}>
                      <input 
                        type="checkbox" 
                        checked={methods.browser} 
                        onChange={(e) => handleNotificationChange(category, 'browser', e.target.checked)} 
                      />
                      <span className={styles.checkmark}></span>
                    </label>
                  </div>
                ))}
                <div className={styles.formActions} style={{ marginTop: '24px' }}>
                  <button 
                    type="button" 
                    className={styles.btnPrimary} 
                    onClick={() => handleSave('Notification')} 
                    disabled={isLoading}
                  >
                    {isLoading ? 'Saving...' : 'Save Preferences'}
                  </button>
                </div>
                <p className={styles.notificationNote}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="16" x2="12" y2="12"/>
                    <line x1="12" y1="8" x2="12.01" y2="8"/>
                  </svg>
                  Browser notifications require permission and work even when this tab is closed.
                </p>
              </div>
            </div>
          )}

          {/* ORDERS & BILLING SECTION */}
          {activeSection === 'orders' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Orders & Billing</h3>
                <span className={styles.sectionDesc}>Manage your orders and payment methods</span>
              </div>

              <div className={styles.card}>
                <div className={styles.ordersCard}>
                  <div className={styles.ordersIcon}>
                    <PackageIcon />
                  </div>
                  <div className={styles.ordersInfo}>
                    <h4>Order History</h4>
                    <p>Track your orders, confirm deliveries, view custom order quotes, and download invoices.</p>
                  </div>
                  <button 
                    type="button" 
                    className={styles.btnPrimary}
                    onClick={() => navigate('/platform/orders')}
                  >
                    View Orders
                    <ArrowRightIcon />
                  </button>
                </div>
              </div>

              <div className={styles.card} style={{ marginTop: '24px' }}>
                <div className={styles.cardHeaderRow}>
                  <h4 className={styles.subSectionTitle}>Payment Methods</h4>
                  <button 
                    type="button" 
                    className={styles.btnSecondary}
                    onClick={() => showToast('Add payment method coming soon!', 'info')}
                  >
                    Add Payment Method
                  </button>
                </div>
                
                {paymentMethods.length > 0 ? (
                  <div className={styles.paymentList}>
                    {paymentMethods.map(method => (
                      <div key={method.id} className={styles.paymentItem}>
                        <div className={styles.paymentIcon}>
                          <svg width="32" height="24" viewBox="0 0 32 24" fill="none">
                            <rect width="32" height="24" rx="4" fill="currentColor"/>
                            <rect x="2" y="4" width="28" height="4" fill="var(--brut-bg)" opacity="0.3"/>
                          </svg>
                        </div>
                        <div className={styles.paymentDetails}>
                          <h5>
                            {method.brand} •••• {method.last4}
                            {method.default && <span className={styles.defaultBadge}>Default</span>}
                          </h5>
                          <p>Expires {method.expiry}</p>
                        </div>
                        <button 
                          type="button" 
                          className={styles.btnText}
                          onClick={() => showToast('Edit payment method coming soon!', 'info')}
                        >
                          Edit
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyPayment}>
                    <p>No payment methods saved yet.</p>
                    <p className={styles.emptySubtext}>Add a payment method for faster checkout.</p>
                  </div>
                )}
              </div>

              <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Orders</span>
                  <span className={styles.statValue}>0</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Total Spent</span>
                  <span className={styles.statValue}>₦0</span>
                </div>
                <div className={styles.statCard}>
                  <span className={styles.statLabel}>Saved Items</span>
                  <span className={styles.statValue}>0</span>
                </div>
              </div>
            </div>
          )}

          {/* SUPPORT SECTION */}
          {activeSection === 'support' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Help & Support</h3>
                <span className={styles.sectionDesc}>Resources and assistance</span>
              </div>

              <div className={styles.supportCard}>
                <div className={styles.supportGrid}>
                  <div className={styles.supportCol}>
                    <h4>Platform</h4>
                    <ul>
                      <li><a href="/hub/collections">Collections</a></li>
                      <li><a href="/hub/process">How it Works</a></li>
                      <li><a href="/pricing">Pricing</a></li>
                      <li><a href="/hub/showcase">Showcase</a></li>
                    </ul>
                  </div>
                  
                  <div className={styles.supportCol}>
                    <h4>Resources</h4>
                    <ul>
                      <li><a href="/hub/faq">FAQ</a></li>
                      <li><a href="/hub/blog">Blog</a></li>
                      <li><a href="/hub/guides">Design Guides</a></li>
                      <li><a href="/hub/custom-order-policy">Custom Order Policy</a></li>
                    </ul>
                  </div>
                  
                  <div className={styles.supportCol}>
                    <h4>Contact</h4>
                    <ul>
                      <li><a href="mailto:hello@brutige.com">hello@brutige.com</a></li>
                      <li><a href="tel:+2348012345678">+234 801 234 5678</a></li>
                      <li><span>Lagos, Nigeria</span></li>
                      <li><a href="/hub/support">Contact Form</a></li>
                    </ul>
                  </div>
                </div>

                <div className={styles.legalSection}>
                  <div className={styles.legalLinks}>
                    <a href="/hub/privacy">Privacy Policy</a>
                    <a href="/hub/terms">Terms of Service</a>
                    <a href="/hub/cookies">Cookie Policy</a>
                    <a href="/hub/custom-order-policy">Custom Order Policy</a>
                  </div>
                  <p className={styles.copyright}>&copy; 2026 Brutige. All rights reserved.</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

export default ProfileSettings;