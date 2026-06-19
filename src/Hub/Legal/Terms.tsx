import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Terms.module.css';

interface Section { id: string; label: string; }

const Terms: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sections: Section[] = [
    { id: 'intro', label: '1. Introduction' }, { id: 'accounts', label: '2. Accounts & Eligibility' },
    { id: 'brands', label: '3. For Brands (Customers)' }, { id: 'makers', label: '4. For Makers (Providers)' },
    { id: 'ip', label: '5. Intellectual Property' }, { id: 'payments', label: '6. Payments & Escrow' },
    { id: 'liability', label: '7. Liability & Disputes' }, { id: 'termination', label: '8. Termination' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: '-20% 0px -60% 0px' });
    Object.values(sectionRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        <aside className={styles.tocSidebar}>
          <h4 className={styles.tocTitle}>Table of Contents</h4>
          <nav className={styles.tocNav}>
            {sections.map((section) => (<button key={section.id} type="button" onClick={() => scrollToSection(section.id)} className={`${styles.tocLink} ${activeSection === section.id ? styles.active : ''}`}>{section.label}</button>))}
          </nav>
          <div className={styles.tocFooter}><p>Need help?</p><Link to="/hub/support" className={styles.supportLink}>Contact Support →</Link></div>
        </aside>

        <article className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.updated}>Last Updated: October 24, 2024</p>
            <div className={styles.alertBox}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg><p>By accessing Brutige, you agree to these terms.</p></div>
          </header>

          {/* 👇 FIXED REFS BELOW */}
          <section id="intro" ref={(el) => { sectionRefs.current.intro = el; }} className={styles.section}><h2>1. Introduction</h2><p>Welcome to Brutige. These Terms govern your access to the platform.</p></section>
          <section id="accounts" ref={(el) => { sectionRefs.current.accounts = el; }} className={styles.section}><h2>2. Accounts & Eligibility</h2><p>You must be at least 18 years old to use this Service.</p></section>
          <section id="brands" ref={(el) => { sectionRefs.current.brands = el; }} className={styles.section}><h2>3. For Brands (Customers)</h2><p>As a Brand, you use Brutige to source manufacturers.</p></section>
          <section id="makers" ref={(el) => { sectionRefs.current.makers = el; }} className={styles.section}><h2>4. For Makers (Providers)</h2><p>As a Maker, you use Brutige to showcase your capabilities.</p></section>
          <section id="ip" ref={(el) => { sectionRefs.current.ip = el; }} className={styles.section}><h2>5. Intellectual Property</h2><p>Brands retain all ownership of their designs.</p></section>
          <section id="payments" ref={(el) => { sectionRefs.current.payments = el; }} className={styles.section}><h2>6. Payments & Escrow</h2><p>Brutige uses a secure escrow system.</p></section>
          <section id="liability" ref={(el) => { sectionRefs.current.liability = el; }} className={styles.section}><h2>7. Liability & Disputes</h2><p>Brutige acts as a facilitator.</p></section>
          <section id="termination" ref={(el) => { sectionRefs.current.termination = el; }} className={styles.section}><h2>8. Termination</h2><p>We reserve the right to suspend your account.</p></section>

          <div className={styles.actionArea}>
            <h3>Ready to proceed?</h3>
            <div className={styles.btnGroup}>
              <Link to="/signup" className={styles.btnPrimary}>Create Account</Link>
              <Link to="/hub/support" className={styles.btnSecondary}>Contact Support</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};
export default Terms;