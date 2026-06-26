import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import styles from './MakerApplication.module.css';

gsap.registerPlugin(TextPlugin);

interface NotifyFunction {
  (message: string, type: 'success' | 'error' | 'info'): void;
}

interface MakerApplicationProps {
  notify?: NotifyFunction;
}

interface FormData {
  studioName: string;
  specialty: string;
  experience: string;
  capacity: string;
  moq: string;
  leadTime: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  idType: string;
  idNumber: string;
  profileImage: string | null;
  bio: string;
  languages: string;
  workingHours: string;
}

interface FormErrors {
  [key: string]: string;
}

const NIGERIAN_STATES = [
  'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno',
  'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'FCT - Abuja', 'Gombe',
  'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos',
  'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto',
  'Taraba', 'Yobe', 'Zamfara'
];

const MakerApplication: React.FC<MakerApplicationProps> = ({ notify }) => {
  const navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    studioName: '',
    specialty: '',
    experience: '',
    capacity: '',
    moq: '',
    leadTime: '',
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'Lagos',
    country: 'Nigeria',
    idType: '',
    idNumber: '',
    profileImage: null,
    bio: '',
    languages: 'English',
    workingHours: ''
  });

  const phrases: string[] = [
    'brutige: artisan verification.',
    'authenticating your craft.',
    'building the maker registry.',
    'infrastructure for producers.',
  ];

  useGSAP(() => {
    if (window.innerWidth <= 900) return;

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
        opacity: 0.2,
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
  }, { scope: container });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        if (notify) notify('Image must be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result as string }));
        if (errors.profileImage) {
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.profileImage;
            return newErrors;
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const validateEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string): boolean => {
    const clean = phone.replace(/\s|-/g, '');
    return /^(\+234|0)[789][01]\d{8}$/.test(clean) || /^234[789]\d{9}$/.test(clean);
  };

  const validateStep = (): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.studioName.trim()) {
        newErrors.studioName = 'Studio name is required';
      } else if (formData.studioName.trim().length < 2) {
        newErrors.studioName = 'Studio name must be at least 2 characters';
      }
      if (!formData.specialty) {
        newErrors.specialty = 'Please select your specialty';
      }
      if (!formData.experience) {
        newErrors.experience = 'Please specify your experience';
      }
      if (formData.capacity && (isNaN(Number(formData.capacity)) || Number(formData.capacity) < 0)) {
        newErrors.capacity = 'Please enter a valid number';
      }
      if (formData.moq && (isNaN(Number(formData.moq)) || Number(formData.moq) < 1)) {
        newErrors.moq = 'Please enter a valid number (minimum 1)';
      }
    }

    if (step === 2) {
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full legal name is required';
      } else if (formData.fullName.trim().length < 3) {
        newErrors.fullName = 'Name must be at least 3 characters';
      }
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
      if (!formData.phone.trim()) {
        newErrors.phone = 'Phone number is required';
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = 'Enter valid Nigerian phone (e.g., +2348123456789)';
      }
      if (!formData.address.trim()) {
        newErrors.address = 'Street address is required';
      }
      if (!formData.city.trim()) {
        newErrors.city = 'City is required';
      }
      if (!formData.state) {
        newErrors.state = 'Please select your state';
      }
      if (!formData.idType) {
        newErrors.idType = 'Please select ID type';
      }
      if (!formData.idNumber.trim()) {
        newErrors.idNumber = 'ID number is required';
      } else if (formData.idType === 'nin' && formData.idNumber.replace(/\D/g, '').length !== 11) {
        newErrors.idNumber = 'NIN must be exactly 11 digits';
      }
    }

    if (step === 3) {
      if (!formData.profileImage) {
        newErrors.profileImage = 'Profile picture is required';
      }
      if (!formData.bio.trim()) {
        newErrors.bio = 'Studio description is required';
      } else if (formData.bio.trim().length < 20) {
        newErrors.bio = 'Please write at least 20 characters about your studio';
      }
      if (!termsAccepted) {
        newErrors.terms = 'You must accept the terms to continue';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      const firstError = Object.values(errors)[0] || 'Please check your input';
      if (notify) {
        notify(firstError, 'error');
      }
    }
  };

  const handleBack = () => {
    setStep(step - 1);
    setErrors({});
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    if (!validateStep()) {
      const firstError = Object.values(errors)[0] || 'Please check your input';
      if (notify) {
        notify(firstError, 'error');
      }
      return;
    }

    if (notify) {
      notify('Application submitted! We will review within 48h.', 'success');
    }
    navigate('/platform/settings');
  };

  return (
    <div ref={container} className={styles.mainWrapper}>
      <div className={styles.formSection}>
        <div className={styles.formWrapper}>
          <button className={styles.backBtn} onClick={() => navigate(-1)}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back
          </button>

          <div className={styles.header}>
            <h1>Maker Application</h1>
            <p>Join the Brutige network of verified producers.</p>
          </div>

          <div className={styles.progress}>
            <div className={styles.bar}>
              <div className={styles.barFill} style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>
            <div className={styles.progressSteps}>
              <div className={`${styles.stepDot} ${step >= 1 ? styles.active : ''} ${step > 1 ? styles.completed : ''}`}>
                <span>
                  {step > 1 ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : '1'}
                </span>
                <label>Studio</label>
              </div>
              <div className={`${styles.stepDot} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
                <span>
                  {step > 2 ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : '2'}
                </span>
                <label>Security</label>
              </div>
              <div className={`${styles.stepDot} ${step >= 3 ? styles.active : ''}`}>
                <span>3</span>
                <label>Profile</label>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className={styles.step}>
              <h3>Studio Information</h3>
              <p className={styles.stepDesc}>Tell us about your production capabilities.</p>

              <div className={`${styles.formGroup} ${errors.studioName ? styles.hasError : ''}`}>
                <label>Studio / Brand Name *</label>
                <input
                  name="studioName"
                  value={formData.studioName}
                  onChange={handleChange}
                  placeholder="e.g. Julian V. Studio"
                />
                {errors.studioName && <span className={styles.errorMsg}>{errors.studioName}</span>}
              </div>

              <div className={`${styles.formGroup} ${errors.specialty ? styles.hasError : ''}`}>
                <label>Primary Specialty *</label>
                <div className={styles.selectWrapper}>
                  <select
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select your specialty...</option>
                    <option value="cut-sew">Cut & Sew (Knits/Wovens)</option>
                    <option value="techwear">Technical Outerwear</option>
                    <option value="adire">Adire & Textile Dyeing</option>
                    <option value="leather">Leather Goods</option>
                    <option value="accessories">Accessories & Bags</option>
                    <option value="embroidery">Embroidery & Printing</option>
                    <option value="beads">Beadwork & Accessories</option>
                    <option value="tailoring">Bespoke Tailoring</option>
                  </select>
                  <span className={styles.chevron}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                {errors.specialty && <span className={styles.errorMsg}>{errors.specialty}</span>}
              </div>

              <div className={`${styles.formGroup} ${errors.experience ? styles.hasError : ''}`}>
                <label>Years of Experience *</label>
                <div className={styles.selectWrapper}>
                  <select
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select experience level...</option>
                    <option value="1-2">1-2 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="6-10">6-10 years</option>
                    <option value="10+">10+ years</option>
                  </select>
                  <span className={styles.chevron}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                {errors.experience && <span className={styles.errorMsg}>{errors.experience}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${errors.capacity ? styles.hasError : ''}`}>
                  <label>Monthly Capacity (Units)</label>
                  <input
                    name="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={handleChange}
                    placeholder="e.g. 500"
                  />
                  {errors.capacity && <span className={styles.errorMsg}>{errors.capacity}</span>}
                </div>

                <div className={`${styles.formGroup} ${errors.moq ? styles.hasError : ''}`}>
                  <label>Min. Order Quantity</label>
                  <input
                    name="moq"
                    type="number"
                    value={formData.moq}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                  />
                  {errors.moq && <span className={styles.errorMsg}>{errors.moq}</span>}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Average Lead Time</label>
                <div className={styles.selectWrapper}>
                  <select
                    name="leadTime"
                    value={formData.leadTime}
                    onChange={handleChange}
                  >
                    <option value="" disabled>Select typical lead time...</option>
                    <option value="1-3">1-3 days</option>
                    <option value="4-7">4-7 days</option>
                    <option value="1-2w">1-2 weeks</option>
                    <option value="2-4w">2-4 weeks</option>
                    <option value="1-2m">1-2 months</option>
                    <option value="2m+">2+ months</option>
                  </select>
                  <span className={styles.chevron}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </span>
                </div>
                <span className={styles.hint}>How long it typically takes to complete an order</span>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnPrimary} onClick={handleNext}>
                  Continue to Security &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className={styles.step}>
              <h3>Security & Verification</h3>
              <p className={styles.stepDesc}>We verify all makers. Your information is encrypted & secure.</p>

              <div className={`${styles.formGroup} ${errors.fullName ? styles.hasError : ''}`}>
                <label>Full Legal Name *</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="As it appears on your ID"
                />
                {errors.fullName && <span className={styles.errorMsg}>{errors.fullName}</span>}
              </div>

              <div className={`${styles.formGroup} ${errors.email ? styles.hasError : ''}`}>
                <label>Email Address *</label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                />
                {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
              </div>

              <div className={`${styles.formGroup} ${errors.phone ? styles.hasError : ''}`}>
                <label>Phone Number *</label>
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+234 801 234 5678"
                />
                {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
              </div>

              <div className={`${styles.formGroup} ${errors.address ? styles.hasError : ''}`}>
                <label>Studio/Workshop Address *</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="e.g. 15 Allen Avenue, Ikeja"
                />
                {errors.address && <span className={styles.errorMsg}>{errors.address}</span>}
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${errors.city ? styles.hasError : ''}`}>
                  <label>City *</label>
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. Lagos"
                  />
                  {errors.city && <span className={styles.errorMsg}>{errors.city}</span>}
                </div>
                <div className={`${styles.formGroup} ${errors.state ? styles.hasError : ''}`}>
                  <label>State *</label>
                  <div className={styles.selectWrapper}>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select state...</option>
                      {NIGERIAN_STATES.map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    <span className={styles.chevron}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                  {errors.state && <span className={styles.errorMsg}>{errors.state}</span>}
                </div>
              </div>

              {/* 🔒 Country field - Locked to Nigeria */}
              <div className={styles.formGroup}>
                <label>Country</label>
                <div className={styles.lockedField}>
                  <span className={styles.lockedValue}>🇳🇬 Nigeria</span>
                  <span className={styles.lockIcon}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </span>
                </div>
                <span className={styles.hint}>Brutige is currently Nigeria-only. We're expanding soon.</span>
              </div>

              <div className={styles.securityNote}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>ID verification required. We accept Nigerian ID documents.</span>
              </div>

              <div className={styles.formRow}>
                <div className={`${styles.formGroup} ${errors.idType ? styles.hasError : ''}`}>
                  <label>ID Type *</label>
                  <div className={styles.selectWrapper}>
                    <select
                      name="idType"
                      value={formData.idType}
                      onChange={handleChange}
                    >
                      <option value="" disabled>Select ID type...</option>
                      <option value="nin">NIN</option>
                      <option value="nin-slip">NIN Slip</option>
                      <option value="passport">International Passport</option>
                      <option value="drivers">Driver's License</option>
                      <option value="voters">Voter's Card (PVC)</option>
                    </select>
                    <span className={styles.chevron}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                  {errors.idType && <span className={styles.errorMsg}>{errors.idType}</span>}
                </div>
                <div className={`${styles.formGroup} ${errors.idNumber ? styles.hasError : ''}`}>
                  <label>ID Number *</label>
                  <input
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder={
                      formData.idType === 'nin' ? '11-digit NIN' :
                      formData.idType === 'passport' ? 'e.g. A12345678' :
                      formData.idType === 'drivers' ? 'e.g. ABC-20250101-12345' :
                      formData.idType === 'voters' ? '909...12 (on your PVC)' :
                      'Enter ID number'
                    }
                  />
                  {errors.idNumber && <span className={styles.errorMsg}>{errors.idNumber}</span>}
                </div>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnText} onClick={handleBack}>&larr; Back</button>
                <button className={styles.btnPrimary} onClick={handleNext}>
                  Continue to Profile &rarr;
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className={styles.step}>
              <h3>Profile Setup</h3>
              <p className={styles.stepDesc}>Set up your public profile. You can edit these later in settings.</p>

              <div className={`${styles.formGroup} ${errors.profileImage ? styles.hasError : ''}`}>
                <label>Profile / Studio Picture *</label>
                <div className={styles.imageUpload} onClick={() => fileInputRef.current?.click()}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                  />
                  {formData.profileImage ? (
                    <div className={styles.imagePreview}>
                      <img src={formData.profileImage} alt="Profile" />
                      <button
                        type="button"
                        className={styles.removeImage}
                        onClick={(e) => {
                          e.stopPropagation();
                          setFormData(prev => ({ ...prev, profileImage: null }));
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className={styles.imagePlaceholder}>
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21 15 16 10 5 21"/>
                      </svg>
                      <span>Upload profile picture</span>
                      <small>JPG, PNG (Max 5MB)</small>
                    </div>
                  )}
                </div>
                {errors.profileImage && <span className={styles.errorMsg}>{errors.profileImage}</span>}
              </div>

              <div className={`${styles.formGroup} ${errors.bio ? styles.hasError : ''}`}>
                <label>About Your Studio *</label>
                <textarea
                  name="bio"
                  rows={5}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Tell customers about your team, expertise, and what makes your studio unique..."
                  maxLength={500}
                />
                <span className={styles.charCount}>{formData.bio.length}/500</span>
                {errors.bio && <span className={styles.errorMsg}>{errors.bio}</span>}
              </div>

              <div className={styles.formGroup}>
                <label>Languages Spoken</label>
                <input
                  name="languages"
                  value={formData.languages}
                  onChange={handleChange}
                  placeholder="e.g. English, Yoruba, Igbo, Pidgin"
                />
                <span className={styles.hint}>Helps customers communicate with you</span>
              </div>

              <div className={styles.formGroup}>
                <label>Working Hours</label>
                <input
                  name="workingHours"
                  value={formData.workingHours}
                  onChange={handleChange}
                  placeholder="e.g. Mon-Fri, 9AM-6PM (WAT)"
                />
                <span className={styles.hint}>Let customers know when you're available</span>
              </div>

              <div className={`${styles.termsBox} ${errors.terms ? styles.hasError : ''}`}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => {
                      setTermsAccepted(e.target.checked);
                      if (errors.terms) {
                        setErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.terms;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  <span>
                    I confirm that all information provided is accurate and I agree to Brutige's
                    <a href="/terms" target="_blank" rel="noopener noreferrer"> Terms of Service</a> and
                    <a href="/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
                  </span>
                </label>
                {errors.terms && <span className={styles.errorMsg}>{errors.terms}</span>}
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnText} onClick={handleBack}>&larr; Back</button>
                <button className={styles.btnPrimary} onClick={handleSubmit}>
                  Submit Application ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={styles.brandSection}>
        <div className={styles.line} style={{ top: '20%', left: '10%', width: '300px' }} />
        <div className={styles.line} style={{ bottom: '30%', right: '15%', width: '400px' }} />
        <div className={styles.line} style={{ top: '60%', left: '20%', width: '250px' }} />

        <div className={styles.typewriterBox}>
          <h2 className={styles.typewriterText}>
            <span ref={textRef}></span>
            <span ref={cursorRef} className={styles.cursor}>|</span>
          </h2>
        </div>

        <div className={styles.brandFooter}>
          <p>Verified makers only. Quality guaranteed.</p>
        </div>
      </div>
    </div>
  );
};

export default MakerApplication;