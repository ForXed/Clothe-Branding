import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfileSettings.module.css';
import { countryCodes, searchCountryCodes } from "../../data/countryCodes";
import { languages } from '../../data/languages';
import { timezones } from '../../data/timezones';

// Import Modal Components
import ChangePasswordForm from '../../Form/ChangePasswordForm';
import TwoStepSetup from '../../Form/TwoFactorSetup';

// Import Brand Vault
import BrandVault from '../BrandVault/BrandVault';

const ProfileSettings = ({ userProfile, setUserProfile, userType = 'customer' }) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  
  const [activeSection, setActiveSection] = useState('account');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
  // Modal State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [show2FAModal, setShow2FAModal] = useState(false);
  
  // --- DROPDOWN STATES ---
  // Country
  const [countrySearch, setCountrySearch] = useState('');
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  
  // Language
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const [langSearch, setLangSearch] = useState('');
  
  // Timezone
  const [showTzDropdown, setShowTzDropdown] = useState(false);
  const [tzSearch, setTzSearch] = useState('');
  
  // Location state
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  // Account Data
  const [accountData, setAccountData] = useState({
    firstName: userProfile?.firstName || '',
    lastName: userProfile?.lastName || '',
    displayName: userProfile?.displayName || '',
    username: userProfile?.username || '',
    email: userProfile?.email || '',
    phoneNumber: userProfile?.phoneNumber || '',
    location: userProfile?.location || '',
    timezone: userProfile?.timezone || 'UTC',
    language: userProfile?.language || 'en',
    bio: userProfile?.bio || '',
    avatar: userProfile?.avatar || null
  });

  // Security Data
  const [securityData, setSecurityData] = useState({
    twoFactor: false,
    publicProfile: true,
    loginAlerts: true,
    activeSessions: [
      { device: 'Chrome on Windows', location: 'New York, USA', lastActive: 'Now', current: true },
      { device: 'Safari on iPhone', location: 'New York, USA', lastActive: '2 hours ago', current: false }
    ]
  });

  // Notification Preferences
  const [notificationPrefs, setNotificationPrefs] = useState({
    orders: { email: true, push: true, sms: false },
    messages: { email: true, push: true, sms: false },
    marketing: { email: false, push: false, sms: false },
    system: { email: true, push: true, sms: false }
  });

  // Billing Data
  const [billingData, setBillingData] = useState({
    paymentMethods: [
      { id: 1, type: 'card', last4: '4242', brand: 'Visa', expiry: '12/25', default: true },
      { id: 2, type: 'paypal', email: 'user@example.com', default: false }
    ],
    history: userType === 'customer' ? [
      { id: 1, date: 'Oct 24, 2024', description: 'Order #BRU-9921 (Oversized Hoodie)', amount: 85.00, status: 'paid', invoice: 'ORD-9921' },
      { id: 2, date: 'Sep 12, 2024', description: 'Order #BRU-8832 (Techwear Cargo)', amount: 120.00, status: 'paid', invoice: 'ORD-8832' }
    ] : [
      { id: 1, date: 'Oct 01, 2024', description: 'Pro Plan - Monthly Subscription', amount: 29.00, status: 'paid', invoice: 'INV-001' },
      { id: 2, date: 'Sep 01, 2024', description: 'Pro Plan - Monthly Subscription', amount: 29.00, status: 'paid', invoice: 'INV-002' }
    ]
  });

  const filteredCountries = countrySearch ? searchCountryCodes(countrySearch) : countryCodes;
  
  // Filter helpers for Lang and TZ
  const filteredLanguages = langSearch 
    ? languages.filter(l => l.name.toLowerCase().includes(langSearch.toLowerCase()) || l.nativeName.toLowerCase().includes(langSearch.toLowerCase()))
    : languages;

  const filteredTimezones = tzSearch
    ? timezones.filter(t => t.label.toLowerCase().includes(tzSearch.toLowerCase()) || t.value.toLowerCase().includes(tzSearch.toLowerCase()))
    : timezones;

  // --- SECTIONS CONFIGURATION ---
  const getSections = () => {
    const baseSections = [
      { id: 'account', label: 'Account', icon: <UserIcon /> },
      { id: 'security', label: 'Security', icon: <ShieldIcon /> },
      { id: 'notifications', label: 'Notifications', icon: <BellIcon /> },
      { id: 'billing', label: userType === 'customer' ? 'Order History' : 'Billing & Plans', icon: <CreditCardIcon /> },
      { id: 'support', label: 'Support', icon: <HelpIcon /> }
    ];

    if (userType === 'customer') {
      baseSections.splice(4, 0, { id: 'brand-vault', label: 'Brand Vault', icon: <BoxIcon /> });
    }
    if (userType === 'maker') {
      baseSections.splice(1, 0, { id: 'business', label: 'Business Studio', icon: <BriefcaseIcon /> });
    }
    return baseSections;
  };

  // --- Icons ---
  const UserIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
  const ShieldIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  const BellIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
  const CreditCardIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
  const HelpIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>;
  const BriefcaseIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>;
  const BoxIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
  const ChevronDown = () => <svg width="12" height="8" viewBox="0 0 12 8" fill="none"><path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

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
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`);
          const data = await response.json();
          if (data && data.display_name) {
            const address = data.address;
            const city = address.city || address.town || address.village || '';
            const country = address.country || '';
            setAccountData(prev => ({ ...prev, location: `${city}, ${country}` }));
          }
        } catch (error) {
          setLocationError('Could not fetch location');
        }
        setIsGettingLocation(false);
      },
      (error) => {
        setLocationError('Permission denied or unavailable');
        setIsGettingLocation(false);
      }
    );
  };

  const handleInputChange = (field, value) => {
    setAccountData(prev => {
      const updated = { ...prev, [field]: value };
      if (setUserProfile) setUserProfile(updated);
      return updated;
    });
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setCountrySearch('');
  };

  const handlePhoneChange = (value) => {
    const cleaned = value.replace(/[^\d+]/g, '');
    handleInputChange('phoneNumber', cleaned);
  };

  const handleSave = async (section) => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    console.log(`Saving ${section}...`);
    setIsLoading(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleNotificationChange = (category, method, value) => {
    setNotificationPrefs(prev => ({
      ...prev,
      [category]: { ...prev[category], [method]: value }
    }));
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => handleInputChange('avatar', reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(`.${styles.phoneInputWrapper}`)) {
        setShowCountryDropdown(false);
      }
      if (!e.target.closest(`.${styles.customSelectWrapper}`)) {
        setShowLangDropdown(false);
        setShowTzDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const sections = getSections();

  return (
    <div className={styles.container}>
      {saveSuccess && (
        <div className={styles.successToast}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Changes saved successfully!
        </div>
      )}

      {showPasswordModal && (
        <ChangePasswordForm 
          onClose={() => setShowPasswordModal(false)} 
          onSuccess={() => {
            setShowPasswordModal(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
          }}
        />
      )}
      
      {show2FAModal && (
        <TwoStepSetup 
          onClose={() => setShow2FAModal(false)} 
          onSuccess={() => {
            setSecurityData(prev => ({ ...prev, twoFactor: true }));
            setShow2FAModal(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
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
                className={`${styles.navItem} ${activeSection === section.id ? styles.activeNav : ''}`}
                onClick={() => setActiveSection(section.id)}
              >
                {section.icon}
                <span>{section.label}</span>
              </button>
            ))}
            
            {userType === 'customer' && !sections.some(s => s.id === 'business') && (
              <button
                className={`${styles.navItem} ${styles.upgradeNav}`}
                onClick={() => setActiveSection('business')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                <span>Become a Maker</span>
              </button>
            )}
          </nav>
        </aside>

        <main className={styles.settingsContent}>
          
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
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                      </div>
                    )}
                    <div className={styles.avatarOverlay}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </div>
                  </div>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleFileChange} />
                </div>

                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>First Name</label>
                    <input type="text" value={accountData.firstName} onChange={(e) => handleInputChange('firstName', e.target.value)} placeholder="First name" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Last Name</label>
                    <input type="text" value={accountData.lastName} onChange={(e) => handleInputChange('lastName', e.target.value)} placeholder="Last name" />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Display Name</label>
                    <input type="text" value={accountData.displayName} onChange={(e) => handleInputChange('displayName', e.target.value)} placeholder="Public name" />
                    <span className={styles.hint}>Visible on your profile</span>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Username</label>
                    <div className={styles.inputWithPrefix}>
                      <span className={styles.prefix}>@</span>
                      <input type="text" value={accountData.username} onChange={(e) => handleInputChange('username', e.target.value.replace(/[^a-zA-Z0-9_]/g, ''))} placeholder="username" />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email Address</label>
                    <input type="email" value={accountData.email} onChange={(e) => handleInputChange('email', e.target.value)} placeholder="your@email.com" disabled />
                    <span className={styles.hint}>Contact support to change email</span>
                  </div>
                  
                  <div className={styles.formGroup}>
                    <label>Phone Number</label>
                    <div className={styles.phoneInputWrapper}>
                      <button className={styles.countryCodeBtn} onClick={() => setShowCountryDropdown(!showCountryDropdown)} type="button">
                        <span>{selectedCountry.flag}</span>
                        <span>{selectedCountry.code}</span>
                        <ChevronDown />
                      </button>
                      
                      {showCountryDropdown && (
                        <div className={`${styles.customDropdown} ${styles.countryDropdown}`}>
                          <div className={styles.dropdownSearch}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input type="text" placeholder="Search country..." value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} autoFocus />
                          </div>
                          <div className={styles.dropdownList}>
                            {filteredCountries.map((country, idx) => (
                              <button key={`${country.code}-${idx}`} className={styles.dropdownOption} onClick={() => handleCountrySelect(country)} type="button">
                                <span className={styles.countryFlag}>{country.flag}</span>
                                <span className={styles.optionText}>{country.country}</span>
                                <span className={styles.optionCode}>{country.code}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <input type="tel" value={accountData.phoneNumber} onChange={(e) => handlePhoneChange(e.target.value)} placeholder="Phone number" className={styles.phoneInput} />
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Location</label>
                    <div className={styles.locationInputWrapper}>
                      <input type="text" value={accountData.location} onChange={(e) => handleInputChange('location', e.target.value)} placeholder="City, Country" />
                      <button className={styles.locationBtn} onClick={getExactLocation} disabled={isGettingLocation} type="button">
                        {isGettingLocation ? <span className={styles.spinner} /> : <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>}
                      </button>
                    </div>
                    {locationError && <span className={styles.errorText}>{locationError}</span>}
                  </div>

                  {/* LANGUAGE DROPDOWN */}
                  <div className={styles.formGroup}>
                    <label>Language</label>
                    <div className={styles.customSelectWrapper}>
                      <button 
                        className={styles.customSelectTrigger} 
                        type="button"
                        onClick={() => {
                          setShowLangDropdown(!showLangDropdown);
                          setShowTzDropdown(false);
                        }}
                      >
                        <span className={styles.selectedValue}>
                          {languages.find(l => l.code === accountData.language)?.nativeName || 'Select Language'}
                        </span>
                        <ChevronDown />
                      </button>

                      {showLangDropdown && (
                        <div className={`${styles.customDropdown} ${styles.langDropdown}`}>
                          <div className={styles.dropdownSearch}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input type="text" placeholder="Search language..." value={langSearch} onChange={(e) => setLangSearch(e.target.value)} autoFocus />
                          </div>
                          <div className={styles.dropdownList}>
                            {filteredLanguages.map((lang) => (
                              <button 
                                key={lang.code} 
                                className={`${styles.dropdownOption} ${accountData.language === lang.code ? styles.activeOption : ''}`} 
                                onClick={() => {
                                  handleInputChange('language', lang.code);
                                  setShowLangDropdown(false);
                                  setLangSearch('');
                                }} 
                                type="button"
                              >
                                <span className={styles.optionText}>{lang.nativeName}</span>
                                <span className={styles.optionSub}>{lang.name}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* TIMEZONE DROPDOWN */}
                  <div className={styles.formGroup}>
                    <label>Timezone</label>
                    <div className={styles.customSelectWrapper}>
                      <button 
                        className={styles.customSelectTrigger} 
                        type="button"
                        onClick={() => {
                          setShowTzDropdown(!showTzDropdown);
                          setShowLangDropdown(false);
                        }}
                      >
                        <span className={styles.selectedValue}>
                          {timezones.find(t => t.value === accountData.timezone)?.label || 'Select Timezone'}
                        </span>
                        <ChevronDown />
                      </button>

                      {showTzDropdown && (
                        <div className={`${styles.customDropdown} ${styles.tzDropdown}`}>
                          <div className={styles.dropdownSearch}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                            <input type="text" placeholder="Search city or zone..." value={tzSearch} onChange={(e) => setTzSearch(e.target.value)} autoFocus />
                          </div>
                          <div className={styles.dropdownList}>
                            {filteredTimezones.map((tz, index) => (
                              <button 
                                key={`${tz.value}-${index}`} 
                                className={`${styles.dropdownOption} ${accountData.timezone === tz.value ? styles.activeOption : ''}`} 
                                onClick={() => {
                                  handleInputChange('timezone', tz.value);
                                  setShowTzDropdown(false);
                                  setTzSearch('');
                                }} 
                                type="button"
                              >
                                <span className={styles.optionText}>{tz.label}</span>
                                <span className={styles.optionCode}>{tz.offset}</span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroupFull}>
                    <label>Bio</label>
                    <textarea rows="3" value={accountData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} placeholder="Tell us about yourself..." className={styles.textarea} />
                  </div>
                </div>
                
                <div className={styles.formActions}>
                  <button className={styles.btnPrimary} onClick={() => handleSave('account')} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Changes'}</button>
                  <button className={styles.btnText}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {/* BRAND VAULT SECTION */}
          {activeSection === 'brand-vault' && userType === 'customer' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Brand Vault</h3>
                <span className={styles.sectionDesc}>Your saved aesthetics and inspiration</span>
              </div>
              <BrandVault />
            </div>
          )}

          {/* BUSINESS / UPGRADE SECTION */}
          {activeSection === 'business' && userType === 'maker' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Business Studio</h3>
                <span className={styles.sectionDesc}>Manage your maker presence</span>
              </div>
              <div className={styles.card}>
                <div className={styles.upgradeContent}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.upgradeIcon}><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                  <h4>Maker Studio Dashboard</h4>
                  <p>Access your production dashboard, manage tech packs, and view analytics.</p>
                  <button className={styles.btnPrimary} onClick={() => navigate('/studio')}>Go to Studio</button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'business' && userType === 'customer' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Become a Maker</h3>
                <span className={styles.sectionDesc}>Start selling on Brutige</span>
              </div>
              <div className={styles.card}>
                <div className={styles.upgradeContent}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={styles.upgradeIcon}><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
                  <h4>Unlock Business Features</h4>
                  <p>Upgrade your account to create products, manage orders, and access the Maker Studio.</p>
                  <ul className={styles.featureList}>
                    <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Create and manage unlimited products</li>
                    <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Access Maker Studio & Analytics</li>
                    <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Process secure escrow payments</li>
                    <li><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg> Generate Tech Packs automatically</li>
                  </ul>
                  <button className={styles.btnPrimary} onClick={() => navigate('/maker-signup')}>Start Application</button>
                  <p className={styles.upgradeNote}>Free to apply. Verification takes 24-48 hours.</p>
                </div>
              </div>
            </div>
          )}

          {/* SECURITY SECTION */}
          {activeSection === 'security' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>Security</h3>
                <span className={styles.sectionDesc}>Protect your account</span>
              </div>

              <div className={styles.settingsList}>
                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h4>Two-Factor Authentication</h4>
                    <p>Add an extra layer of security to your login</p>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={securityData.twoFactor} onChange={(e) => e.target.checked ? setShow2FAModal(true) : null} />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h4>Public Profile</h4>
                    <p>Make your profile visible to other users</p>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={securityData.publicProfile} onChange={(e) => setSecurityData(prev => ({ ...prev, publicProfile: e.target.checked }))} />
                    <span className={styles.slider}></span>
                  </label>
                </div>

                <div className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <h4>Login Alerts</h4>
                    <p>Get notified of new sign-ins</p>
                  </div>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={securityData.loginAlerts} onChange={(e) => setSecurityData(prev => ({ ...prev, loginAlerts: e.target.checked }))} />
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
                      {!session.current && <button className={styles.btnText}>Revoke</button>}
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
                  <button className={styles.btnSecondary} onClick={() => setShowPasswordModal(true)}>Update Password</button>
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
                  <span className={styles.channelLabel}>Email</span>
                  <span className={styles.channelLabel}>Push</span>
                  <span className={styles.channelLabel}>SMS</span>
                </div>
                {Object.entries(notificationPrefs).map(([category, methods]) => (
                  <div key={category} className={styles.notificationRow}>
                    <div className={styles.notificationCategory}>
                      <h4>{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                      <p>{category === 'orders' ? 'New orders, shipping updates' : category === 'messages' ? 'Direct messages' : category === 'marketing' ? 'Tips and offers' : 'Security alerts'}</p>
                    </div>
                    <label className={styles.checkbox}><input type="checkbox" checked={methods.email} onChange={(e) => handleNotificationChange(category, 'email', e.target.checked)} /><span className={styles.checkmark}></span></label>
                    <label className={styles.checkbox}><input type="checkbox" checked={methods.push} onChange={(e) => handleNotificationChange(category, 'push', e.target.checked)} /><span className={styles.checkmark}></span></label>
                    <label className={styles.checkbox}><input type="checkbox" checked={methods.sms} onChange={(e) => handleNotificationChange(category, 'sms', e.target.checked)} /><span className={styles.checkmark}></span></label>
                  </div>
                ))}
                <div className={styles.formActions} style={{ marginTop: '24px' }}>
                  <button className={styles.btnPrimary} onClick={() => handleSave('notifications')} disabled={isLoading}>{isLoading ? 'Saving...' : 'Save Preferences'}</button>
                </div>
              </div>
            </div>
          )}

          {/* BILLING / ORDER HISTORY SECTION */}
          {activeSection === 'billing' && (
            <div className={styles.section}>
              <div className={styles.sectionHeader}>
                <h3 className={styles.sectionTitle}>{userType === 'customer' ? 'Order History' : 'Billing & Plans'}</h3>
                <span className={styles.sectionDesc}>{userType === 'customer' ? 'Track your past purchases' : 'Manage payment methods and invoices'}</span>
              </div>

              {(userType === 'maker' || billingData.paymentMethods.length > 0) && (
                <div className={styles.card}>
                  <div className={styles.cardHeaderRow}>
                    <h4 className={styles.subSectionTitle}>Payment Methods</h4>
                    <button className={styles.btnSecondary}>Add Payment Method</button>
                  </div>
                  <div className={styles.paymentList}>
                    {billingData.paymentMethods.map(method => (
                      <div key={method.id} className={styles.paymentItem}>
                        <div className={styles.paymentIcon}>
                          {method.type === 'card' ? (
                            <svg width="32" height="24" viewBox="0 0 32 24" fill="none"><rect width="32" height="24" rx="4" fill="currentColor"/><rect x="2" y="4" width="28" height="4" fill="var(--brut-bg)" opacity="0.3"/></svg>
                          ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 11v8a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1h3a4 4 0 0 1 4 4v5"/><circle cx="17.5" cy="7.5" r="2.5"/></svg>
                          )}
                        </div>
                        <div className={styles.paymentDetails}>
                          <h5>{method.type === 'card' ? `•••• ${method.last4}` : method.email} {method.default && <span className={styles.defaultBadge}>Default</span>}</h5>
                          <p>{method.type === 'card' ? `Expires ${method.expiry}` : 'PayPal Account'}</p>
                        </div>
                        <button className={styles.btnText}>{method.default ? 'Edit' : 'Set Default'}</button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={styles.card} style={{ marginTop: '24px' }}>
                <div className={styles.cardHeaderRow}>
                  <h4 className={styles.subSectionTitle}>{userType === 'customer' ? 'Past Orders' : 'Billing History'}</h4>
                  <button className={styles.btnText}>Download All</button>
                </div>
                <div className={styles.billingList}>
                  {billingData.history.map(item => (
                    <div key={item.id} className={styles.billingItem}>
                      <div className={styles.billingInfo}>
                        <div className={styles.billingDesc}>{item.description}</div>
                        <div className={styles.billingDate}>{item.date} • {item.invoice}</div>
                      </div>
                      <div className={styles.billingAmount}>
                        <span>${item.amount.toFixed(2)}</span>
                        <span className={`${styles.statusBadge} ${styles[item.status]}`}>{item.status}</span>
                        <button className={styles.btnText} style={{fontSize: '0.75rem', marginLeft: '10px'}}>
                          {userType === 'customer' ? 'View' : 'Invoice'}
                        </button>
                      </div>
                    </div>
                  ))}
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
                      <li><a href="/collections">Collections</a></li>
                      <li><a href="/how-it-works">How it Works</a></li>
                      <li><a href="/pricing">Pricing</a></li>
                      <li><a href="/showcase">Showcase</a></li>
                      <li><a href="/templates">Templates</a></li>
                    </ul>
                  </div>
                  
                  <div className={styles.supportCol}>
                    <h4>Resources</h4>
                    <ul>
                      <li><a href="/faq">FAQ</a></li>
                      <li><a href="/blog">Blog</a></li>
                      <li><a href="/guides">Design Guides</a></li>
                      <li><a href="/api-docs">API Documentation</a></li>
                      <li><a href="/community">Community Forum</a></li>
                    </ul>
                  </div>
                  
                  <div className={styles.supportCol}>
                    <h4>Contact</h4>
                    <ul>
                      <li><a href="mailto:hello@brutige.com">hello@brutige.com</a></li>
                      <li><a href="tel:+15551234567">+1 (555) 123-4567</a></li>
                      <li><span>San Francisco, CA</span></li>
                      <li><a href="/contact">Contact Form</a></li>
                      <li><a href="/status">System Status</a></li>
                    </ul>
                  </div>
                </div>

                <div className={styles.legalSection}>
                  <div className={styles.legalLinks}>
                    <a href="/privacy">Privacy Policy</a>
                    <a href="/terms">Terms of Service</a>
                    <a href="/cookies">Cookie Policy</a>
                    <a href="/accessibility">Accessibility</a>
                  </div>
                  <p className={styles.copyright}>&copy; 2024 Brutige. All rights reserved.</p>
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