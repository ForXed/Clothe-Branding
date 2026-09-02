import React, { useState, useRef, useEffect } from 'react';
import styles from './StudioSettings.module.css';
// import { makerAPI } from '../../../services/MakerService'; // 👈 TODO: Import when backend is ready

// ✅ UPDATED: Import the shared 2FA component from the global Form folder
import TwoFactorSetup from '../../Form/TwoFactorSetup';

interface StudioSettingsProps {
  isPro?: boolean;
  onUpgradeClick?: () => void;
  notify?: (message: string, type: 'success' | 'error') => void; // 👈 Added for toasts
}

interface SettingsData {
  businessName: string; 
  handle: string; 
  contactEmail: string; 
  bio: string;
  brandColor: string; 
  accentColor: string; 
  currency: string; 
  timezone: string;
  lowStockThreshold: string; 
  defaultStatus: string; 
  shippingOrigin: string;
  freeShippingThreshold: string; 
  flatRate: string; 
  autoFulfill: boolean; 
  taxRate: string;
  returnPolicy: string; 
  shippingPolicy: string; 
  termsOfService: string;
  newOrderAlerts: boolean; 
  weeklyReports: boolean;
  messageRequests: boolean; // 👈 NEW: For custom order requests & messages
}

const StudioSettings: React.FC<StudioSettingsProps> = ({ isPro, onUpgradeClick, notify }) => {
  const [activeTab, setActiveTab] = useState<string>('profile');
  const [show2FA, setShow2FA] = useState<boolean>(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(false);
  
  // 👈 NEW: Backend loading states
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profileImage, setProfileImage] = useState<string>('https://via.placeholder.com/200?text=Logo');

  // 👈 UPDATED: Nigerian defaults and new messageRequests field
  const [settings, setSettings] = useState<SettingsData>({
    businessName: '', 
    handle: '', 
    contactEmail: '',
    bio: '',
    brandColor: '#1a1a1a',
    accentColor: '#8b5cf6', // Brutige accent
    currency: 'NGN', // 👈 Nigerian Default
    timezone: 'Africa/Lagos', // 👈 Nigerian Default
    lowStockThreshold: '5',
    defaultStatus: 'draft', 
    shippingOrigin: 'Lagos, Nigeria', // 👈 Nigerian Default
    freeShippingThreshold: '50000', // 👈 ₦50,000
    flatRate: '2500', // 👈 ₦2,500
    autoFulfill: false, 
    taxRate: '0',
    returnPolicy: 'Custom items are non-refundable. Ready-to-wear items can be returned within 7 days.',
    shippingPolicy: 'Orders are processed within 3-5 business days.',
    termsOfService: 'All transactions are protected by Brutige\'s escrow and dispute resolution policies.',
    newOrderAlerts: true, 
    weeklyReports: true,
    messageRequests: true, // 👈 NEW: Default to true
  });

  // 👈 TODO: Backend - Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // const data = await makerAPI.getSettings();
        // setSettings(data);
        
        // Simulating network delay for now
        setTimeout(() => setIsLoading(false), 800);
      } catch (error) {
        console.error('Failed to load settings', error);
        notify?.('Failed to load settings', 'error');
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [notify]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setSettings(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(URL.createObjectURL(e.target.files[0]));
      // 👈 TODO: Backend - Upload image to cloud storage here and get URL
    }
  };

  // 👈 TODO: Backend - Handle actual save
  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      // await makerAPI.updateSettings(settings);
      
      // Simulating network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      notify?.('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Failed to save settings', error);
      notify?.('Failed to save settings. Please try again.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handle2FAEnabled = () => { 
    setTwoFactorEnabled(true); 
    setShow2FA(false); 
    notify?.('Two-Factor Authentication enabled!', 'success');
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>
          <div className={styles.spinner}></div>
          <p>Loading studio settings...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
    { id: 'branding', label: 'Branding', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg> },
    { id: 'general', label: 'General', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg> },
    { id: 'products', label: 'Products', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg> },
    { id: 'shipping', label: 'Shipping', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> },
    { id: 'payments', label: 'Payments', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg> },
    { id: 'policies', label: 'Policies', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg> },
    { id: 'notifications', label: 'Notifications', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg> },
    { id: 'security', label: 'Security', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.settingsLayout}>
        <div className={styles.tabsSidebar}>
          {tabs.map(tab => (
            <button key={tab.id} type="button" className={`${styles.tabBtn} ${activeTab === tab.id ? styles.active : ''}`} onClick={() => setActiveTab(tab.id)}>
              <span className={styles.tabIcon}>{tab.icon}</span><span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className={styles.content}>
          <form onSubmit={handleSave} className={styles.form}>
            {activeTab === 'profile' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}><h3>Profile & Identity</h3><p>Manage how your brand appears to customers</p></div>
                <div className={styles.profileUploadArea}>
                  <div className={styles.avatarWrapper}>
                    <img src={profileImage} alt="Profile" className={styles.avatarPreview} />
                    <div className={styles.avatarOverlay}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg></div>
                  </div>
                  <div className={styles.uploadActions}>
                    <button type="button" className={styles.uploadBtn} onClick={() => fileInputRef.current?.click()}>Change Logo</button>
                    <button type="button" className={styles.removeBtn} onClick={() => setProfileImage('https://via.placeholder.com/200?text=Logo')}>Reset</button>
                  </div>
                  <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageChange} />
                  <p className={styles.uploadHint}>Recommended: 500x500px PNG or JPG</p>
                </div>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}><label>Business Name</label><input type="text" name="businessName" value={settings.businessName} onChange={handleChange} required /></div>
                  <div className={styles.inputGroup}><label>Public Handle</label><input type="text" name="handle" value={settings.handle} onChange={handleChange} placeholder="@yourstore" required /></div>
                </div>
                <div className={styles.inputGroup}><label>Contact Email</label><input type="email" name="contactEmail" value={settings.contactEmail} onChange={handleChange} required /></div>
                <div className={styles.inputGroup}><label>Bio / Description</label><textarea name="bio" value={settings.bio} onChange={handleChange} rows={4} placeholder="Tell customers about your brand..." /></div>
              </div>
            )}

            {activeTab === 'branding' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}><h3>Brand Appearance</h3><p>Customize your store colors</p></div>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Primary Brand Color</label>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                      <input type="color" name="brandColor" value={settings.brandColor} onChange={handleChange} style={{width: '50px', padding: '0', border: 'none', height: '44px', cursor: 'pointer'}} />
                      <input type="text" value={settings.brandColor} readOnly style={{flex: 1, padding: '14px', background: 'var(--brut-card)', border: '1px solid var(--brut-border)', borderRadius: '12px'}} />
                    </div>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Accent Color</label>
                    <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                      <input type="color" name="accentColor" value={settings.accentColor} onChange={handleChange} style={{width: '50px', padding: '0', border: 'none', height: '44px', cursor: 'pointer'}} />
                      <input type="text" value={settings.accentColor} readOnly style={{flex: 1, padding: '14px', background: 'var(--brut-card)', border: '1px solid var(--brut-border)', borderRadius: '12px'}} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'general' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}><h3>General Settings</h3><p>Basic store configuration</p></div>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
                    <label>Currency</label>
                    <select name="currency" value={settings.currency} onChange={handleChange}>
                      <option value="NGN">NGN - Nigerian Naira (₦)</option>
                      <option value="USD">USD - US Dollar ($)</option>
                      <option value="GBP">GBP - British Pound (£)</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Timezone</label>
                    <select name="timezone" value={settings.timezone} onChange={handleChange}>
                      <option value="Africa/Lagos">Lagos, Nigeria (WAT, GMT+1)</option>
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="Europe/London">London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}><h3>Product Defaults</h3><p>Inventory and listing preferences</p></div>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}><label>Low Stock Threshold</label><input type="number" name="lowStockThreshold" value={settings.lowStockThreshold} onChange={handleChange} min="0" /></div>
                  <div className={styles.inputGroup}><label>New Product Status</label><select name="defaultStatus" value={settings.defaultStatus} onChange={handleChange}><option value="draft">Draft (Hidden)</option><option value="active">Active (Visible)</option></select></div>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}><h3>Shipping & Delivery</h3><p>Define your shipping rules</p></div>
                <div className={styles.inputGroup}><label>Shipping Origin</label><input type="text" name="shippingOrigin" value={settings.shippingOrigin} onChange={handleChange} /></div>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}><label>Free Shipping Threshold (₦)</label><input type="number" name="freeShippingThreshold" value={settings.freeShippingThreshold} onChange={handleChange} min="0" step="100" /></div>
                  <div className={styles.inputGroup}><label>Flat Rate (₦)</label><input type="number" name="flatRate" value={settings.flatRate} onChange={handleChange} min="0" step="100" /></div>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}><h3>Payments & Checkout</h3><p>Configure how you get paid</p></div>
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}><span>Auto-fulfill Orders</span><p>Automatically mark digital/ready-to-wear orders as fulfilled</p></div>
                  <label className={styles.toggle}><input type="checkbox" name="autoFulfill" checked={settings.autoFulfill} onChange={handleChange} /><span className={styles.toggleSlider}></span></label>
                </div>
                <div className={styles.inputGroup} style={{ marginTop: '20px' }}><label>Sales Tax / VAT Rate (%)</label><input type="number" name="taxRate" value={settings.taxRate} onChange={handleChange} step="0.1" min="0" max="100" /></div>
                {!isPro && (
                  <div className={styles.proFeature}>
                    <div className={styles.proFeatureIcon}><svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg></div>
                    <div className={styles.proFeatureContent}><h4>Advanced Payments</h4><p>Unlock multiple gateways and lower transaction fees.</p></div>
                    <button type="button" className={styles.proFeatureBtn} onClick={onUpgradeClick}>Upgrade Pro</button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'policies' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h3>Store Policies</h3>
                  <p>Legal text displayed at checkout. <em>Note: These must align with Brutige's overarching Platform Policies.</em></p>
                </div>
                <div className={styles.inputGroup}><label>Return Policy</label><textarea name="returnPolicy" value={settings.returnPolicy} onChange={handleChange} rows={5} placeholder="Explain your return process..." /></div>
                <div className={styles.inputGroup}><label>Shipping Policy</label><textarea name="shippingPolicy" value={settings.shippingPolicy} onChange={handleChange} rows={5} placeholder="Explain shipping times and costs..." /></div>
                <div className={styles.inputGroup}><label>Terms of Service</label><textarea name="termsOfService" value={settings.termsOfService} onChange={handleChange} rows={5} placeholder="Your specific store terms..." /></div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}><h3>Email Notifications</h3><p>Choose what alerts you receive</p></div>
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}><span>New Order Alerts</span><p>Get emailed instantly when an order is placed</p></div>
                  <label className={styles.toggle}><input type="checkbox" name="newOrderAlerts" checked={settings.newOrderAlerts} onChange={handleChange} /><span className={styles.toggleSlider}></span></label>
                </div>
                {/* 👈 NEW: Message/Request Notifications */}
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}><span>Custom Requests & Messages</span><p>Get notified when a customer sends a custom order request or direct message</p></div>
                  <label className={styles.toggle}><input type="checkbox" name="messageRequests" checked={settings.messageRequests} onChange={handleChange} /><span className={styles.toggleSlider}></span></label>
                </div>
                <div className={styles.toggleRow}>
                  <div className={styles.toggleLabel}><span>Weekly Reports</span><p>Receive a summary of sales and performance every Monday</p></div>
                  <label className={styles.toggle}><input type="checkbox" name="weeklyReports" checked={settings.weeklyReports} onChange={handleChange} /><span className={styles.toggleSlider}></span></label>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className={styles.section}>
                <div className={styles.sectionHeader}><h3>Security</h3><p>Protect your account access</p></div>
                <div className={styles.securityOption}>
                  <div className={styles.securityInfo}>
                    <div className={styles.securityIcon}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></div>
                    <div><h4>Two-Factor Authentication</h4><p>Add an extra layer of security to your business account</p></div>
                  </div>
                  <button type="button" className={`${styles.securityBtn} ${twoFactorEnabled ? styles.enabled : ''}`} onClick={() => setShow2FA(true)}>{twoFactorEnabled ? 'Enabled' : 'Enable'}</button>
                </div>
                <div className={styles.dangerZone}>
                  <h4>Danger Zone</h4>
                  <div className={styles.dangerOption}>
                    <div><h5>Delete Studio</h5><p>Permanently delete your maker profile and store data</p></div>
                    <button type="button" className={styles.deleteBtn}>Delete Studio</button>
                  </div>
                </div>
              </div>
            )}

            <div className={styles.actions}>
              <button type="submit" className={styles.saveBtn} disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* ✅ UPDATED: Use the shared TwoFactorSetup component */}
      {show2FA && (
        <TwoFactorSetup 
          onClose={() => setShow2FA(false)} 
          onSuccess={handle2FAEnabled} 
        />
      )}
    </div>
  );
};

export default StudioSettings;