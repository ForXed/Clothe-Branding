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
  // Step 1: Studio Basics
  studioName: string;
  specialty: string;
  experience: string;
  capacity: string;
  equipment: string;
  
  // Step 2: Security & Verification
  fullName: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  idType: string;
  idNumber: string;
  
  // Step 3: Portfolio & Bio
  bio: string;
  portfolioUrl: string;
  certifications: string;
}

const MakerApplication: React.FC<MakerApplicationProps> = ({ notify }) => {
  const navigate = useNavigate();
  const container = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);
  
  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    studioName: '',
    specialty: '',
    experience: '',
    capacity: '',
    equipment: '',
    
    // Step 2
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    idType: '',
    idNumber: '',
    
    // Step 3
    bio: '',
    portfolioUrl: '',
    certifications: ''
  });

  const phrases: string[] = [
    'brutige: artisan verification.',
    'authenticating your craft.',
    'building the maker registry.',
    'infrastructure for producers.',
  ];

  // GSAP Animations
  useGSAP(() => {
    // Entrance animation for form elements
    gsap.from(`.${styles.formWrapper} > *`, {
      opacity: 0,
      y: 30,
      stagger: 0.1,
      duration: 1,
      ease: 'expo.out',
    });

    // Background architectural line drift
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

    // Typewriter effect
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

    // Cursor blink
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
  };

  const validateStep = (): boolean => {
    if (step === 1) {
      if (!formData.studioName.trim()) {
        if (notify) notify('Studio name is required', 'error');
        return false;
      }
      if (!formData.specialty) {
        if (notify) notify('Please select your specialty', 'error');
        return false;
      }
      if (!formData.experience) {
        if (notify) notify('Please specify your experience', 'error');
        return false;
      }
      return true;
    }
    
    if (step === 2) {
      if (!formData.fullName.trim()) {
        if (notify) notify('Full legal name is required', 'error');
        return false;
      }
      if (!formData.phone.trim()) {
        if (notify) notify('Phone number is required', 'error');
        return false;
      }
      if (!formData.address.trim() || !formData.city.trim() || !formData.country.trim()) {
        if (notify) notify('Complete address is required', 'error');
        return false;
      }
      if (!formData.idType || !formData.idNumber.trim()) {
        if (notify) notify('ID verification is required', 'error');
        return false;
      }
      return true;
    }
    
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleSubmit = () => {
    if (!validateStep()) return;
    
    // Simulate API submission
    if (notify) {
      notify('Application submitted! We will review within 48h.', 'success');
    }
    navigate('/platform/settings');
  };

  return (
    <div ref={container} className={styles.mainWrapper}>
      {/* Form Section */}
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

          {/* Progress Bar */}
          <div className={styles.progress}>
            <div className={styles.bar} style={{width: `${(step / 3) * 100}%`}}></div>
            <div className={styles.progressSteps}>
              <div className={`${styles.stepDot} ${step >= 1 ? styles.active : ''}`}>
                <span>1</span>
                <label>Studio</label>
              </div>
              <div className={`${styles.stepDot} ${step >= 2 ? styles.active : ''}`}>
                <span>2</span>
                <label>Security</label>
              </div>
              <div className={`${styles.stepDot} ${step >= 3 ? styles.active : ''}`}>
                <span>3</span>
                <label>Portfolio</label>
              </div>
            </div>
          </div>

          {/* Step 1: Studio Basics */}
          {step === 1 && (
            <div className={styles.step}>
              <h3>Studio Information</h3>
              <p className={styles.stepDesc}>Tell us about your production capabilities.</p>
              
              <div className={styles.formGroup}>
                <label>Studio / Brand Name *</label>
                <input 
                  name="studioName" 
                  value={formData.studioName} 
                  onChange={handleChange} 
                  placeholder="e.g. Julian V. Studio" 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Primary Specialty *</label>
                <select 
                  name="specialty" 
                  value={formData.specialty} 
                  onChange={handleChange}
                >
                  <option value="">Select your specialty...</option>
                  <option value="cut-sew">Cut & Sew (Knits/Wovens)</option>
                  <option value="techwear">Technical Outerwear</option>
                  <option value="denim">Denim Production</option>
                  <option value="leather">Leather Goods</option>
                  <option value="accessories">Accessories & Bags</option>
                  <option value="footwear">Footwear</option>
                  <option value="embroidery">Embroidery & Printing</option>
                  <option value="pattern">Pattern Making</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Years of Experience *</label>
                <select 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange}
                >
                  <option value="">Select experience level...</option>
                  <option value="0-2">0-2 years</option>
                  <option value="3-5">3-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="10+">10+ years</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Monthly Production Capacity (Units)</label>
                <input 
                  name="capacity" 
                  type="number" 
                  value={formData.capacity} 
                  onChange={handleChange} 
                  placeholder="e.g. 500" 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Equipment & Machinery</label>
                <textarea 
                  name="equipment" 
                  rows={3} 
                  value={formData.equipment} 
                  onChange={handleChange} 
                  placeholder="List your main equipment (e.g., Industrial sewing machines, cutting tables, embroidery machines...)" 
                />
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnPrimary} onClick={handleNext}>
                  Continue to Security →
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Security & Verification */}
          {step === 2 && (
            <div className={styles.step}>
              <h3>Security & Verification</h3>
              <p className={styles.stepDesc}>We verify all makers for platform security. Your information is encrypted and secure.</p>
              
              <div className={styles.formGroup}>
                <label>Full Legal Name *</label>
                <input 
                  name="fullName" 
                  value={formData.fullName} 
                  onChange={handleChange} 
                  placeholder="As it appears on your ID" 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number *</label>
                <input 
                  name="phone" 
                  type="tel"
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+234 800 000 0000" 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Street Address *</label>
                <input 
                  name="address" 
                  value={formData.address} 
                  onChange={handleChange} 
                  placeholder="Studio/Workshop address" 
                />
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>City *</label>
                  <input 
                    name="city" 
                    value={formData.city} 
                    onChange={handleChange} 
                    placeholder="e.g. Lagos" 
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Country *</label>
                  <input 
                    name="country" 
                    value={formData.country} 
                    onChange={handleChange} 
                    placeholder="e.g. Nigeria" 
                  />
                </div>
              </div>

              <div className={styles.securityNote}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                <span>ID verification is required to ensure platform security and prevent fraud.</span>
              </div>

              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>ID Type *</label>
                  <select 
                    name="idType" 
                    value={formData.idType} 
                    onChange={handleChange}
                  >
                    <option value="">Select ID type...</option>
                    <option value="national">National ID Card</option>
                    <option value="passport">International Passport</option>
                    <option value="drivers">Driver's License</option>
                    <option value="voters">Voter's Card</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <label>ID Number *</label>
                  <input 
                    name="idNumber" 
                    value={formData.idNumber} 
                    onChange={handleChange} 
                    placeholder="Enter ID number" 
                  />
                </div>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnText} onClick={() => setStep(1)}>← Back</button>
                <button className={styles.btnPrimary} onClick={handleNext}>
                  Continue to Portfolio →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Portfolio & Bio */}
          {step === 3 && (
            <div className={styles.step}>
              <h3>Portfolio & About</h3>
              <p className={styles.stepDesc}>Showcase your work and tell us about your studio.</p>
              
              <div className={styles.formGroup}>
                <label>About Your Studio</label>
                <textarea 
                  name="bio" 
                  rows={5} 
                  value={formData.bio} 
                  onChange={handleChange} 
                  placeholder="Tell us about your team, expertise, and what makes your studio unique..." 
                />
              </div>

              <div className={styles.formGroup}>
                <label>Portfolio / Website URL</label>
                <input 
                  name="portfolioUrl" 
                  type="url"
                  value={formData.portfolioUrl} 
                  onChange={handleChange} 
                  placeholder="https://your-portfolio.com" 
                />
                <span className={styles.hint}>Optional: Link to your portfolio, Instagram, or website</span>
              </div>

              <div className={styles.formGroup}>
                <label>Certifications & Awards</label>
                <textarea 
                  name="certifications" 
                  rows={3} 
                  value={formData.certifications} 
                  onChange={handleChange} 
                  placeholder="List any relevant certifications, awards, or notable clients..." 
                />
              </div>

              <div className={styles.termsBox}>
                <label className={styles.checkboxLabel}>
                  <input type="checkbox" required />
                  <span>
                    I confirm that all information provided is accurate and I agree to Brutige's 
                    <a href="/terms" target="_blank" rel="noopener noreferrer"> Terms of Service</a> and 
                    <a href="/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>.
                  </span>
                </label>
              </div>

              <div className={styles.btnRow}>
                <button className={styles.btnText} onClick={() => setStep(2)}>← Back</button>
                <button className={styles.btnPrimary} onClick={handleSubmit}>
                  Submit Application ✓
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Brand Section with GSAP Animation */}
      <div className={styles.brandSection}>
        <div 
          className={styles.line}
          style={{ top: '20%', left: '10%', width: '300px' }}
        />
        <div 
          className={styles.line}
          style={{ bottom: '30%', right: '15%', width: '400px' }}
        />
        <div 
          className={styles.line}
          style={{ top: '60%', left: '20%', width: '250px' }}
        />

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