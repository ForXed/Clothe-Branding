import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Cookies.module.css';

interface Section { id: string; label: string; }
interface CookieData { name: string; type: string; purpose: string; duration: string; }

const Cookies: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sections: Section[] = [
    { id: 'intro', label: '1. What are Cookies?' }, { id: 'types', label: '2. How We Use Them' },
    { id: 'inventory', label: '3. Cookie Inventory' }, { id: 'control', label: '4. Your Controls' }, { id: 'updates', label: '5. Updates' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActiveSection(entry.target.id); });
    }, { rootMargin: '-15% 0px -50% 0px' });

    Object.values(sectionRefs.current).forEach((ref) => { if (ref) observer.observe(ref); });
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = sectionRefs.current[id];
    if (element) {
      const offset = 100; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const offsetPosition = (elementRect - bodyRect) - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const cookieData: CookieData[] = [
    { name: 'brutige_session', type: 'Essential', purpose: 'Maintains your login session and security.', duration: 'Session' },
    { name: 'brutige_cart', type: 'Essential', purpose: 'Stores items in your production cart.', duration: '30 Days' },
    { name: 'brutige_theme', type: 'Functional', purpose: 'Remembers your light/dark mode preference.', duration: '1 Year' },
    { name: '_ga', type: 'Analytics', purpose: 'Distinguishes unique users for traffic analysis.', duration: '2 Years' },
    { name: '_gid', type: 'Analytics', purpose: 'Tracks user behavior patterns on the platform.', duration: '24 Hours' },
    { name: 'fbp', type: 'Marketing', purpose: 'Delivers relevant ads on Facebook.', duration: '3 Months' },
  ];

  return (
    <div className={styles.container}>
      <nav className={styles.tocNavMobile}>
        {sections.map((section) => (
          <button key={section.id} type="button" onClick={() => scrollToSection(section.id)} className={`${styles.tocLinkMobile} ${activeSection === section.id ? styles.active : ''}`}>{section.label}</button>
        ))}
      </nav>

      <article className={styles.content}>
        <aside className={styles.tocDesktop}>
          <h4 className={styles.tocTitle}>Table of Contents</h4>
          <div className={styles.tocList}>
            {sections.map((section) => (
              <button key={section.id} type="button" onClick={() => scrollToSection(section.id)} className={`${styles.tocLink} ${activeSection === section.id ? styles.active : ''}`}>{section.label}</button>
            ))}
          </div>
        </aside>

        <div className={styles.mainText}>
          <header className={styles.header}>
            <h1 className={styles.title}>Cookie Policy</h1>
            <p className={styles.updated}>Last Updated: October 24, 2024</p>
            <div className={styles.alertBox}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg><p>We use cookies to ensure our production infrastructure runs smoothly.</p></div>
          </header>

          {/* 👇 FIXED REFS BELOW */}
          <section id="intro" ref={(el) => { sectionRefs.current.intro = el; }} className={styles.section}><h2>1. What are Cookies?</h2><p>Cookies are small text files stored on your device when you visit Brutige.</p></section>
          <section id="types" ref={(el) => { sectionRefs.current.types = el; }} className={styles.section}><h2>2. How We Use Them</h2><div className={styles.gridCards}><div className={styles.card}><h3>Essential</h3><p>Required for core functions.</p></div><div className={styles.card}><h3>Functional</h3><p>Remember your settings.</p></div><div className={styles.card}><h3>Analytics</h3><p>Help us understand usage.</p></div></div></section>
          <section id="inventory" ref={(el) => { sectionRefs.current.inventory = el; }} className={styles.section}>
            <h2>3. Cookie Inventory</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.cookieTable}>
                <thead><tr><th>Name</th><th>Type</th><th>Purpose</th><th>Duration</th></tr></thead>
                <tbody>{cookieData.map((cookie, index) => (<tr key={index}><td><code>{cookie.name}</code></td><td><span className={`${styles.badge} ${styles[cookie.type.toLowerCase()]}`}>{cookie.type}</span></td><td>{cookie.purpose}</td><td>{cookie.duration}</td></tr>))}</tbody>
              </table>
            </div>
          </section>
          <section id="control" ref={(el) => { sectionRefs.current.control = el; }} className={styles.section}><h2>4. Your Controls</h2><p>You have full control over non-essential cookies via your browser settings.</p></section>
          <section id="updates" ref={(el) => { sectionRefs.current.updates = el; }} className={styles.section}><h2>5. Updates to This Policy</h2><p>We may update this policy as our infrastructure evolves.</p></section>

          <div className={styles.actionArea}>
            <h3>Manage Preferences</h3>
            <div className={styles.btnGroup}>
              <button type="button" className={styles.btnPrimary}>Open Consent Manager</button>
              <Link to="/hub/privacy" className={styles.btnSecondary}>Read Privacy Policy</Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
export default Cookies;