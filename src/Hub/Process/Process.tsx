import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './Process.module.css';

gsap.registerPlugin(ScrollTrigger);

// 👇 FIXED: Changed JSX.Element to React.ReactNode
interface ProcessStep { id: number; title: string; desc: string; icon: React.ReactNode; }

const processSteps: Record<'customer' | 'maker', ProcessStep[]> = {
  customer: [
    { id: 1, title: 'Upload Design & Specs', desc: 'Submit your tech packs...', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>) },
    { id: 2, title: 'Match with Maker', desc: 'Our algorithm connects you...', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>) },
    { id: 3, title: 'Sample & Approve', desc: 'Receive a digital or physical prototype...', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>) },
    { id: 4, title: 'Production & Delivery', desc: 'Once approved, full-scale production begins...', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>) }
  ],
  maker: [
    { id: 1, title: 'Receive Order Request', desc: 'Get matched with brands...', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>) },
    { id: 2, title: 'Confirm & Schedule', desc: 'Accept the job, confirm the timeline...', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>) },
    { id: 3, title: 'Produce & QC', desc: 'Manufacture the goods following the approved specs...', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/><circle cx="12" cy="12" r="10"/></svg>) },
    { id: 4, title: 'Ship & Get Paid', desc: 'Label and ship directly to the brand...', icon: (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>) }
  ]
};

const Process: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'customer' | 'maker'>('customer');
  const containerRef = useRef<HTMLDivElement>(null);
  const steps = processSteps[activeTab];

  useGSAP(() => {
    gsap.from(`.${styles.stepCard}`, {
      scrollTrigger: { trigger: containerRef.current, start: "top 75%", toggleActions: "play none none reverse" },
      y: 50, opacity: 0, stagger: 0.2, duration: 0.8, ease: "power3.out"
    });
    gsap.from(`.${styles.connectorLine}`, {
      scrollTrigger: { trigger: containerRef.current, start: "top 80%" },
      height: 0, duration: 1.2, ease: "power2.inOut"
    });
  }, { scope: containerRef, dependencies: [activeTab] });

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>How It Works</h1>
          <p className={styles.subtitle}>A seamless infrastructure connecting visionary brands with elite manufacturing ateliers.</p>
        </div>
        <div className={styles.toggleContainer}>
          <button type="button" className={`${styles.toggleBtn} ${activeTab === 'customer' ? styles.active : ''}`} onClick={() => setActiveTab('customer')}>For Brands</button>
          <button type="button" className={`${styles.toggleBtn} ${activeTab === 'maker' ? styles.active : ''}`} onClick={() => setActiveTab('maker')}>For Makers</button>
        </div>
      </header>

      <div ref={containerRef} className={styles.timelineWrapper}>
        <div className={styles.connectorLine}></div>
        <div className={styles.stepsGrid}>
          {steps.map((step, index) => (
            <div key={step.id} className={styles.stepCard}>
              <div className={styles.stepNumber}>{index + 1}</div>
              <div className={styles.iconBox}>{step.icon}</div>
              <div className={styles.contentBox}>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>{activeTab === 'customer' ? 'Ready to launch your collection?' : 'Ready to grow your atelier?'}</h2>
          <p className={styles.ctaText}>{activeTab === 'customer' ? 'Join hundreds of brands producing high-quality garments.' : 'Connect with global brands and fill your production capacity.'}</p>
          <div className={styles.ctaActions}>
            {activeTab === 'customer' ? (
              <Link to="/signup" className={styles.primaryBtn}>Start Your First Run</Link>
            ) : (
              <>
                <Link to="/maker-signup" className={styles.primaryBtn}>Apply as a Maker</Link>
                <Link to="/login" className={styles.secondaryBtn}>Maker Login</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Process;