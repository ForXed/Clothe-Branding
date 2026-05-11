import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Privacy.module.css';

const Privacy = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const sectionRefs = useRef({});

  const sections = [
    { id: 'intro', label: '1. Introduction' },
    { id: 'collection', label: '2. Data Collection' },
    { id: 'usage', label: '3. How We Use Data' },
    { id: 'sharing', label: '4. Data Sharing' },
    { id: 'security', label: '5. Security' },
    { id: 'rights', label: '6. Your Rights' },
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
      { rootMargin: '-20% 0px -60% 0px' }
    );

    Object.values(sectionRefs.current).forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = sectionRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Sidebar Navigation */}
        <aside className={styles.tocSidebar}>
          <h4 className={styles.tocTitle}>Table of Contents</h4>
          <nav className={styles.tocNav}>
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`${styles.tocLink} ${activeSection === section.id ? styles.active : ''}`}
              >
                {section.label}
              </button>
            ))}
          </nav>
          
          <div className={styles.tocFooter}>
            <p>Questions?</p>
            <Link to="/hub/support" className={styles.supportLink}>Contact Support →</Link>
          </div>
        </aside>

        {/* Main Content */}
        <article className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.updated}>Last Updated: October 24, 2024</p>
            <div className={styles.alertBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
              </svg>
              <p>Your privacy is critical to our infrastructure. We collect only what is necessary to facilitate production and secure payments.</p>
            </div>
          </header>

          <section id="intro" ref={(el) => (sectionRefs.current.intro = el)} className={styles.section}>
            <h2>1. Introduction</h2>
            <p>Brutige ("we", "our", "us") operates a dual-sided marketplace connecting Brands with Makers. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our platform or use our production services.</p>
            <p>By using Brutige, you consent to the data practices described in this policy.</p>
          </section>

          <section id="collection" ref={(el) => (sectionRefs.current.collection = el)} className={styles.section}>
            <h2>2. Data Collection</h2>
            <p>We collect information that you provide directly to us and information collected automatically when you use the platform.</p>
            
            <div className={styles.gridCards}>
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </div>
                <h3>Personal Information</h3>
                <p>Name, email, phone number, business address, and payment details provided during registration and order placement.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                </div>
                <h3>Technical Data</h3>
                <p>IP address, browser type, device information, and usage patterns collected via cookies and analytics tools.</p>
              </div>
              <div className={styles.card}>
                <div className={styles.cardIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                </div>
                <h3>Production Files</h3>
                <p>Tech packs, design files, logos, and specifications uploaded for manufacturing purposes. These are stored securely.</p>
              </div>
            </div>
          </section>

          <section id="usage" ref={(el) => (sectionRefs.current.usage = el)} className={styles.section}>
            <h2>3. How We Use Data</h2>
            <p>We use the collected information for the following purposes:</p>
            <ul className={styles.list}>
              <li><strong>Order Fulfillment:</strong> To process production orders, manage escrow payments, and coordinate shipping between Brands and Makers.</li>
              <li><strong>Platform Improvement:</strong> To analyze usage trends, optimize our tools, and develop new features.</li>
              <li><strong>Communication:</strong> To send transactional emails, project updates, and important policy changes.</li>
              <li><strong>Security:</strong> To detect fraud, verify identities, and protect the integrity of our marketplace.</li>
            </ul>
          </section>

          <section id="sharing" ref={(el) => (sectionRefs.current.sharing = el)} className={styles.section}>
            <h2>4. Data Sharing</h2>
            <p>We do not sell your personal data. We share information only in the following scenarios:</p>
            <ul className={styles.list}>
              <li><strong>With Makers/Brands:</strong> Necessary contact and project details are shared between parties to fulfill a specific order.</li>
              <li><strong>Service Providers:</strong> With third-party vendors who perform services on our behalf (e.g., payment processing, cloud hosting, shipping logistics).</li>
              <li><strong>Legal Requirements:</strong> If required by law or in response to valid requests by public authorities.</li>
            </ul>
          </section>

          <section id="security" ref={(el) => (sectionRefs.current.security = el)} className={styles.section}>
            <h2>5. Security</h2>
            <p>We implement robust security measures to protect your data:</p>
            <ul className={styles.list}>
              <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted via SSL/TLS.</li>
              <li><strong>Access Control:</strong> Strict access controls limit employee access to personal data on a need-to-know basis.</li>
              <li><strong>Regular Audits:</strong> We conduct regular security audits and vulnerability assessments to maintain high standards.</li>
            </ul>
          </section>

          <section id="rights" ref={(el) => (sectionRefs.current.rights = el)} className={styles.section}>
            <h2>6. Your Rights</h2>
            <p>Depending on your location, you may have the following rights regarding your personal data:</p>
            <ul className={styles.list}>
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data under certain conditions.</li>
              <li><strong>Opt-Out:</strong> Opt-out of marketing communications at any time.</li>
            </ul>
            <p>To exercise these rights, please contact us at <a href="mailto:privacy@brutige.com" className={styles.link}>privacy@brutige.com</a>.</p>
          </section>

          <div className={styles.actionArea}>
            <h3>Stay Protected</h3>
            <div className={styles.btnGroup}>
              <Link to="/hub/terms" className={styles.btnPrimary}>Read Terms of Service</Link>
              <Link to="/hub/cookies" className={styles.btnSecondary}>Cookie Policy</Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
};

export default Privacy;