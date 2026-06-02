import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MakerApplication.module.css';

const MakerApplication = ({ notify }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    studioName: '',
    website: '',
    instagram: '',
    specialty: '',
    capacity: '',
    bio: ''
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    // Simulate API submission
    if(notify) notify('Application submitted! We will review within 48h.', 'success');
    navigate('/platform/settings');
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>← Back</button>
        
        <div className={styles.header}>
          <h1>Maker Application</h1>
          <p>Join the Brutige network of verified producers.</p>
        </div>

        <div className={styles.progress}>
          <div className={styles.bar} style={{width: `${step * 33}%`}}></div>
          <span>Step {step} of 3</span>
        </div>

        {step === 1 && (
          <div className={styles.step}>
            <h3>Studio Basics</h3>
            <div className={styles.formGroup}>
              <label>Studio / Brand Name</label>
              <input name="studioName" value={formData.studioName} onChange={handleChange} placeholder="e.g. Julian V. Studio" />
            </div>
            <div className={styles.formGroup}>
              <label>Website (Optional)</label>
              <input name="website" value={formData.website} onChange={handleChange} placeholder="https://" />
            </div>
            <div className={styles.formGroup}>
              <label>Instagram Handle</label>
              <input name="instagram" value={formData.instagram} onChange={handleChange} placeholder="@yourhandle" />
            </div>
            <button className={styles.btnPrimary} onClick={() => setStep(2)}>Next</button>
          </div>
        )}

        {step === 2 && (
          <div className={styles.step}>
            <h3>Production Capacity</h3>
            <div className={styles.formGroup}>
              <label>Primary Specialty</label>
              <select name="specialty" value={formData.specialty} onChange={handleChange}>
                <option value="">Select...</option>
                <option value="cut-sew">Cut & Sew (Knits/Wovens)</option>
                <option value="techwear">Technical Outerwear</option>
                <option value="denim">Denim Production</option>
                <option value="accessories">Accessories & Bags</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label>Monthly Capacity (Units)</label>
              <input name="capacity" type="number" value={formData.capacity} onChange={handleChange} placeholder="e.g. 500" />
            </div>
            <div className={styles.btnRow}>
              <button className={styles.btnText} onClick={() => setStep(1)}>Back</button>
              <button className={styles.btnPrimary} onClick={() => setStep(3)}>Next</button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className={styles.step}>
            <h3>About Your Studio</h3>
            <div className={styles.formGroup}>
              <label>Brief Bio</label>
              <textarea name="bio" rows="5" value={formData.bio} onChange={handleChange} placeholder="Tell us about your equipment, team, and experience..." />
            </div>
            <div className={styles.btnRow}>
              <button className={styles.btnText} onClick={() => setStep(2)}>Back</button>
              <button className={styles.btnPrimary} onClick={handleSubmit}>Submit Application</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MakerApplication;