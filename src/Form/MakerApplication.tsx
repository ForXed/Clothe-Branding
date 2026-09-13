import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { TextPlugin } from 'gsap/TextPlugin';
import { makerService } from '../services/makerService';
import type { Maker } from '../types/maker';
import { Link } from 'react-router-dom';
import styles from './MakerApplication.module.css';

gsap.registerPlugin(TextPlugin);

type NotifyFunction = (message: string, type: 'success' | 'error' | 'info') => void;

interface MakerApplicationProps {
  notify?: NotifyFunction;
}

interface FormData {
  // Step 1: Basic Info
  studioName: string;
  specialty: string;
  fullName: string;
  email: string;
  phone: string;
  // Step 2: Profile
  profileImage: string | null;
  bio: string;
}

interface FormErrors {
  [key: string]: string;
}

const SPECIALTIES = [
  { value: 'cut-sew', label: 'Cut & Sew (Knits/Wovens)' },
  { value: 'techwear', label: 'Technical Outerwear' },
  { value: 'adire', label: 'Adire & Textile Dyeing' },
  { value: 'leather', label: 'Leather Goods' },
  { value: 'accessories', label: 'Accessories & Bags' },
  { value: 'embroidery', label: 'Embroidery & Printing' },
  { value: 'beads', label: 'Beadwork & Accessories' },
  { value: 'tailoring', label: 'Bespoke Tailoring' },
];

const MakerApplication: React.FC<MakerApplicationProps> = ({ notify }) => {
  const navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState<number>(1);
  const [errors, setErrors] = useState<FormErrors>({});
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedMaker, setSubmittedMaker] = useState<Maker | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const [formData, setFormData] = useState<FormData>({
    studioName: '',
    specialty: '',
    fullName: '',
    email: '',
    phone: '',
    profileImage: null,
    bio: ''
  });

  const phrases: string[] = [
    'brutige: artisan verification.',
    'authenticating your craft.',
    'building the maker registry.',
    'infrastructure for producers.',
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      if (!formData.fullName.trim()) {
        newErrors.fullName = 'Full name is required';
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
    }

    if (step === 2) {
      if (!formData.profileImage) {
        newErrors.profileImage = 'Profile picture is required';
      }
      if (!formData.bio.trim()) {
        newErrors.bio = 'Short bio is required';
      } else if (formData.bio.trim().length < 10) {
        newErrors.bio = 'Please write at least 10 characters about your studio';
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

  // ✅ WIRED TO REAL BACKEND
  const handleSubmit = async () => {
    if (!validateStep()) {
      const firstError = Object.values(errors)[0] || 'Please check your input';
      if (notify) {
        notify(firstError, 'error');
      }
      return;
    }

    setIsSubmitting(true);
    try {
      // Map form fields to contract shape
      const applyData = {
        brandName: formData.studioName,
        bio: formData.bio,
        specializations: [formData.specialty], // contract expects array
        location: 'Nigeria', // default, user can update later in profile
        leadTimeDays: 14, // reasonable defaults, user updates after approval
        minBatch: 50,
        maxBatch: 500,
      };

      const createdMaker = await makerService.apply(applyData);

      // Store locally so app knows they have a pending application
      localStorage.setItem('brutige_maker_application', JSON.stringify(createdMaker));

      // Show success state (Step 3)
      setSubmittedMaker(createdMaker);
      setStep(3);
      if (notify) {
        notify('Application submitted successfully! Status: PENDING', 'success');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        'Failed to submit application. Please try again.';
      if (notify) notify(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
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

          {/* Progress Bar - 3 steps */}
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
                <label>Basic Info</label>
              </div>
              <div className={`${styles.stepDot} ${step >= 2 ? styles.active : ''} ${step > 2 ? styles.completed : ''}`}>
                <span>
                  {step > 2 ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  ) : '2'}
                </span>
                <label>Profile</label>
              </div>
              <div className={`${styles.stepDot} ${step >= 3 ? styles.active : ''}`}>
                <span>3</span>
                <label>Submitted</label>
              </div>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className={styles.step}>
              <h3>Basic Information</h3>
              <p className={styles.stepDesc}>Tell us about you and your studio. You can add more details later.</p>

              <div className={`${styles.formGroup} ${errors.studioName ? styles.hasError : ''}`}>
                <label>Studio / Brand Name *</label>
                <input
                  name="studioName"
                  value={formData.studioName}
                  onChange={handleChange}
                  placeholder="e.g. Julian V. Studio"
                  disabled={isSubmitting}
                />
                {errors.studioName && <span className={styles.errorMsg}>{errors.studioName}</span>}
              </div>

              {/* 🎨 Custom Dropdown */}
              <div className={`${styles.formGroup} ${errors.specialty ? styles.hasError : ''}`}>
                <label>Primary Specialty *</label>

                <div className={styles.customDropdown} ref={dropdownRef}>
                  <button
                    type="button"
                    className={`${styles.dropdownTrigger} ${isDropdownOpen ? styles.dropdownTriggerOpen : ''}`}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isSubmitting}
                  >
                    <span className={!formData.specialty ? styles.dropdownTriggerPlaceholder : ''}>
                      {formData.specialty
                        ? SPECIALTIES.find(s => s.value === formData.specialty)?.label
                        : 'Select your specialty...'}
                    </span>
                    <span className={`${styles.dropdownChevron} ${isDropdownOpen ? styles.chevronOpen : ''}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div className={styles.dropdownPanel}>
                      {SPECIALTIES.map(spec => (
                        <div
                          key={spec.value}
                          className={`${styles.dropdownOption} ${formData.specialty === spec.value ? styles.dropdownOptionSelected : ''}`}
                          onClick={() => {
                            setFormData(prev => ({ ...prev, specialty: spec.value }));
                            setIsDropdownOpen(false);
                            if (errors.specialty) {
                              setErrors(prev => {
                                const newErrors = { ...prev };
                                delete newErrors.specialty;
                                return newErrors;
                              });
                            }
                          }}
                        >
                          <span>{spec.label}</span>
                          {formData.specialty === spec.value && (
                            <span className={styles.dropdownOptionCheck}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {errors.specialty && <span className={styles.errorMsg}>{errors.specialty}</span>}
              </div>

              <div className={`${styles.formGroup} ${errors.fullName ? styles.hasError : ''}`}>
                <label>Full Name *</label>
                <input
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Your full name"
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                />
                {errors.phone && <span className={styles.errorMsg}>{errors.phone}</span>}
              </div>

              <div className={styles.infoNote}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>After approval, you'll set up your full profile with production details, ID verification, and more.</span>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnPrimary} onClick={handleNext} disabled={isSubmitting}>
                  Continue to Profile &rarr;
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Profile */}
          {step === 2 && (
            <div className={styles.step}>
              <h3>Your Profile</h3>
              <p className={styles.stepDesc}>Add a picture and tell customers about your studio.</p>

              <div className={`${styles.formGroup} ${errors.profileImage ? styles.hasError : ''}`}>
                <label>Profile / Studio Picture *</label>
                <div className={styles.imageUpload} onClick={() => !isSubmitting && fileInputRef.current?.click()}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    hidden
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={isSubmitting}
                  />
                  {formData.profileImage ? (
                    <div className={styles.imagePreview}>
                      <img src={formData.profileImage} alt="Profile" />
                      {!isSubmitting && (
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
                      )}
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
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Briefly describe your studio, expertise, and what you offer..."
                  maxLength={300}
                  disabled={isSubmitting}
                />
                <span className={styles.charCount}>{formData.bio.length}/300</span>
                {errors.bio && <span className={styles.errorMsg}>{errors.bio}</span>}
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
                    disabled={isSubmitting}
                  />
               <span>
                  I confirm that all information provided is accurate and I agree to Brutige's{' '}
                  <Link to="/hub/terms" target="_blank" rel="noopener noreferrer">Terms of Service</Link>{' '}
                  and{' '}
                  <Link to="/hub/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</Link>.
                </span>
                </label>
                {errors.terms && <span className={styles.errorMsg}>{errors.terms}</span>}
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnText} onClick={handleBack} disabled={isSubmitting}>&larr; Back</button>
                <button className={styles.btnPrimary} onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application ✓'}
                </button>
              </div>
            </div>
          )}

          {/* ✅ Step 3: Success Confirmation */}
          {step === 3 && submittedMaker && (
            <div className={styles.step}>
              <div className={styles.successIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                  <polyline points="22 4 12 14.01 9 11.01"/>
                </svg>
              </div>
              <h3>Application Submitted!</h3>
              <p className={styles.stepDesc}>
                Your maker application for <strong>{submittedMaker.brandName}</strong> is now under review.
              </p>

              <div className={styles.statusCard}>
                <div className={styles.statusRow}>
                  <span className={styles.statusLabel}>Status</span>
                  <span className={styles.statusBadge}>
                    {submittedMaker.verificationStatus}
                  </span>
                </div>
                <div className={styles.statusRow}>
                  <span className={styles.statusLabel}>Application ID</span>
                  <span className={styles.statusValue}>{submittedMaker.id}</span>
                </div>
                <div className={styles.statusRow}>
                  <span className={styles.statusLabel}>Submitted</span>
                  <span className={styles.statusValue}>
                    {new Date(submittedMaker.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className={styles.infoNote}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="16" x2="12" y2="12"/>
                  <line x1="12" y1="8" x2="12.01" y2="8"/>
                </svg>
                <span>Our team will review your application within 48 hours. You'll receive an email once approved.</span>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnPrimary} onClick={() => navigate('/platform/discovery')}>
                  Continue to Discovery &rarr;
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