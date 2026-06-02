import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Cookies.module.css';

const Cookies = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const sectionRefs = useRef({});

  const sections = [
    { id: 'intro', label: '1. What are Cookies?' },
    { id: 'types', label: '2. How We Use Them' },
    { id: 'inventory', label: '3. Cookie Inventory' },
    { id: 'control', label: '4. Your Controls' },
    { id: 'updates', label: '5. Updates' },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-15% 0px -50% 0px' } // Adjusted for better mobile detection
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = sectionRefs.current[id];
    if (element) {
      // Offset for the fixed mobile header
      const offset = 100; 
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const cookieData = [
    { name: 'brutige_session', type: 'Essential', purpose: 'Maintains your login session and security.', duration: 'Session' },
    { name: 'brutige_cart', type: 'Essential', purpose: 'Stores items in your production cart.', duration: '30 Days' },
    { name: 'brutige_theme', type: 'Functional', purpose: 'Remembers your light/dark mode preference.', duration: '1 Year' },
    { name: '_ga', type: 'Analytics', purpose: 'Distinguishes unique users for traffic analysis.', duration: '2 Years' },
    { name: '_gid', type: 'Analytics', purpose: 'Tracks user behavior patterns on the platform.', duration: '24 Hours' },
    { name: 'fbp', type: 'Marketing', purpose: 'Delivers relevant ads on Facebook.', duration: '3 Months' },
  ];

  return (
    <div className={styles.container}>
      {/* NO INTERNAL GRID LAYOUT ANYMORE. Just a single content stream. */}
      
      {/* Mobile/Tablet TOC (Horizontal Scroll) */}
      <nav className={styles.tocNavMobile}>
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => scrollToSection(section.id)}
            className={`${styles.tocLinkMobile} ${activeSection === section.id ? styles.active : ''}`}
          >
            {section.label}
          </button>
        ))}
      </nav>

      <article className={styles.content}>
        {/* Desktop TOC (Sticky Side within the content flow) */}
        <aside className={styles.tocDesktop}>
          <h4 className={styles.tocTitle}>Table of Contents</h4>
          <div className={styles.tocList}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`${styles.tocLink} ${activeSection === section.id ? styles.active : ''}`}
              >
                {section.label}
              </button>
            ))}
          </div>
        </aside>

        <div className={styles.mainText}>
          <header className={styles.header}>
            <h1 className={styles.title}>Cookie Policy</h1>
            <p className={styles.updated}>Last Updated: October 24, 2024</p>
            <div className={styles.alertBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
              <p>We use cookies to ensure our production infrastructure runs smoothly.</p>
            </div>
          </header>

          <section id="intro" ref={(el) => (sectionRefs.current.intro = el)} className={styles.section}>
            <h2>1. What are Cookies?</h2>
            <p>Cookies are small text files stored on your device when you visit Brutige. They help us remember your preferences, keep you logged in, and understand how brands and makers interact with our tools.</p>
          </section>

          <section id="types" ref={(el) => (sectionRefs.current.types = el)} className={styles.section}>
            <h2>2. How We Use Them</h2>
            <div className={styles.gridCards}>
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                </div>
                <h3>Essential</h3>
                <p>Required for core functions like logging in and processing escrow payments.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </div>
                <h3>Functional</h3>
                <p>Remember your settings, such as theme preference and language.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </div>
                <h3>Analytics</h3>
                <p>Help us understand how brands and makers use the platform.</p>
              </div>
            </div>
          </section>

          <section id="inventory" ref={(el) => (sectionRefs.current.inventory = el)} className={styles.section}>
            <h2>3. Cookie Inventory</h2>
            <div className={styles.tableWrapper}>
              <table className={styles.cookieTable}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Purpose</th>
                    <th>Duration</th>
                  </tr>
                </thead>
                <tbody>
                  {cookieData.map((cookie, index) => (
                    <tr key={index}>
                      <td><code>{cookie.name}</code></td>
                      <td><span className={`${styles.badge} ${styles[cookie.type.toLowerCase()]}`}>{cookie.type}</span></td>
                      <td>{cookie.purpose}</td>
                      <td>{cookie.duration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="control" ref={(el) => (sectionRefs.current.control = el)} className={styles.section}>
            <h2>4. Your Controls</h2>
            <p>You have full control over non-essential cookies via your browser settings.</p>
            <ul className={styles.list}>
              <li><strong>Browser Settings:</strong> Refuse or delete cookies via your browser menu.</li>
              <li><strong>Consent Manager:</strong> Click "Cookie Settings" in our footer anytime.</li>
              <li><strong>Impact:</strong> Disabling essential cookies prevents login and orders.</li>
            </ul>
          </section>

          <section id="updates" ref={(el) => (sectionRefs.current.updates = el)} className={styles.section}>
            <h2>5. Updates to This Policy</h2>
            <p>We may update this policy as our infrastructure evolves. Significant changes will be notified via email.</p>
          </section>

          <div className={styles.actionArea}>
            <h3>Manage Preferences</h3>
            <div className={styles.btnGroup}>
              <button className={styles.btnPrimary}>Open Consent Manager</button>
              <Link to="/hub/privacy" className={styles.btnSecondary}>Read Privacy Policy</Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default Cookies;