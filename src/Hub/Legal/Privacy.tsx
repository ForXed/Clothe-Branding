import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Privacy.module.css';

interface Section { id: string; label: string; }

const Privacy: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('intro');
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const sections: Section[] = [
    { id: 'intro', label: '1. Introduction' }, { id: 'collection', label: '2. Data Collection' },
    { id: 'usage', label: '3. How We Use Data' }, { id: 'sharing', label: '4. Data Sharing' },
    { id: 'security', label: '5. Security' }, { id: 'rights', label: '6. Your Rights' },
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
          <div className={styles.tocFooter}><p>Questions?</p><Link to="/hub/support" className={styles.supportLink}>Contact Support →</Link></div>
        </aside>

        <article className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>Privacy Policy</h1>
            <p className={styles.updated}>Last Updated: October 24, 2024</p>
            <div className={styles.alertBox}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg><p>Your privacy is critical to our infrastructure.</p></div>
          </header>

          {/* 👇 FIXED REFS BELOW */}
          <section id="intro" ref={(el) => { sectionRefs.current.intro = el; }} className={styles.section}><h2>1. Introduction</h2><p>Brutige operates a dual-sided marketplace connecting Brands with Makers.</p></section>
          <section id="collection" ref={(el) => { sectionRefs.current.collection = el; }} className={styles.section}><h2>2. Data Collection</h2><p>We collect information that you provide directly to us.</p></section>
          <section id="usage" ref={(el) => { sectionRefs.current.usage = el; }} className={styles.section}><h2>3. How We Use Data</h2><p>We use the collected information for order fulfillment and security.</p></section>
          <section id="sharing" ref={(el) => { sectionRefs.current.sharing = el; }} className={styles.section}><h2>4. Data Sharing</h2><p>We do not sell your personal data.</p></section>
          <section id="security" ref={(el) => { sectionRefs.current.security = el; }} className={styles.section}><h2>5. Security</h2><p>We implement robust security measures to protect your data.</p></section>
          <section id="rights" ref={(el) => { sectionRefs.current.rights = el; }} className={styles.section}><h2>6. Your Rights</h2><p>Depending on your location, you may have rights regarding your personal data.</p></section>

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