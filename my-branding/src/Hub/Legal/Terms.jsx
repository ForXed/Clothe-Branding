import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import styles from './Terms.module.css';

const Terms = () => {
  const [activeSection, setActiveSection] = useState('intro');
  const sectionRefs = useRef({});

  const sections = [
    { id: 'intro', label: '1. Introduction' },
    { id: 'accounts', label: '2. Accounts & Eligibility' },
    { id: 'brands', label: '3. For Brands (Customers)' },
    { id: 'makers', label: '4. For Makers (Providers)' },
    { id: 'ip', label: '5. Intellectual Property' },
    { id: 'payments', label: '6. Payments & Escrow' },
    { id: 'liability', label: '7. Liability & Disputes' },
    { id: 'termination', label: '8. Termination' },
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
        {/* Sticky Sidebar Navigation */}
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
            <p>Need help?</p>
            <Link to="/hub/support" className={styles.supportLink}>Contact Support →</Link>
          </div>
        </aside>

        {/* Main Content */}
        <article className={styles.content}>
          <header className={styles.header}>
            <h1 className={styles.title}>Terms of Service</h1>
            <p className={styles.updated}>Last Updated: October 24, 2024</p>
            <div className={styles.alertBox}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>
              </svg>
              <p>By accessing Brutige, you agree to these terms for both <strong>Brand</strong> and <strong>Maker</strong> activities.</p>
            </div>
          </header>

          <section id="intro" ref={(el) => (sectionRefs.current.intro = el)} className={styles.section}>
            <h2>1. Introduction</h2>
            <p>Welcome to Brutige. These Terms of Service ("Terms") govern your access to and use of the Brutige platform, including our website, software, and services (collectively, the "Service"). Brutige is a dual-sided marketplace connecting <strong>Brands</strong> (customers seeking production) with <strong>Makers</strong> (providers of manufacturing services).</p>
            <p>By creating an account or using the Service, you agree to be bound by these Terms. If you do not agree, please do not use the Service.</p>
          </section>

          <section id="accounts" ref={(el) => (sectionRefs.current.accounts = el)} className={styles.section}>
            <h2>2. Accounts & Eligibility</h2>
            <p>You must be at least 18 years old to use this Service. When you sign up, you will select an account type: <strong>Brand</strong> or <strong>Maker</strong>. You may hold both types of accounts, but each requires separate verification.</p>
            <ul className={styles.list}>
              <li><strong>Accuracy:</strong> You agree to provide accurate, current, and complete information during registration.</li>
              <li><strong>Security:</strong> You are responsible for safeguarding your password and for all activities that occur under your account.</li>
              <li><strong>Verification:</strong> Maker accounts require additional business verification before accepting orders.</li>
            </ul>
          </section>

          <section id="brands" ref={(el) => (sectionRefs.current.brands = el)} className={styles.section}>
            <h2>3. For Brands (Customers)</h2>
            <p>As a Brand, you use Brutige to source manufacturers, request quotes, and manage production runs.</p>
            <h3>3.1 Orders & Contracts</h3>
            <p>When you place an order, you are entering a binding contract with the Maker. Brutige facilitates this transaction but is not a party to the manufacturing contract itself.</p>
            <h3>3.2 Payments</h3>
            <p>Payments are held in escrow by Brutige until you confirm receipt and quality of the goods. You agree to pay the agreed-upon price plus any service fees charged by Brutige.</p>
            <h3>3.3 Specifications</h3>
            <p>You are responsible for providing clear Tech Packs, designs, and specifications. Brutige is not liable for production errors resulting from ambiguous or incorrect files provided by you.</p>
          </section>

          <section id="makers" ref={(el) => (sectionRefs.current.makers = el)} className={styles.section}>
            <h2>4. For Makers (Providers)</h2>
            <p>As a Maker, you use Brutige to showcase your capabilities, receive orders, and manage production workflows.</p>
            <h3>4.1 Performance Standards</h3>
            <p>You agree to meet the quality standards, timelines, and specifications agreed upon with the Brand. Failure to deliver may result in refunds, penalties, or account suspension.</p>
            <h3>4.2 Pricing & Fees</h3>
            <p>You set your own pricing for services. Brutige charges a commission fee on completed transactions, which will be deducted from your payout.</p>
            <h3>4.3 Communication</h3>
            <p>All communication regarding orders must take place through the Brutige platform to ensure protection under our Dispute Resolution policy.</p>
          </section>

          <section id="ip" ref={(el) => (sectionRefs.current.ip = el)} className={styles.section}>
            <h2>5. Intellectual Property</h2>
            <p><strong>Brands retain all ownership</strong> of their designs, logos, and intellectual property uploaded to the platform. Makers are granted a limited license to use these assets solely for the purpose of fulfilling the specific order.</p>
            <p>Makers retain ownership of their proprietary manufacturing techniques and machinery, but cannot resell or reuse a Brand's specific design for other clients without explicit written consent.</p>
          </section>

          <section id="payments" ref={(el) => (sectionRefs.current.payments = el)} className={styles.section}>
            <h2>6. Payments & Escrow</h2>
            <p>Brutige uses a secure escrow system:</p>
            <ol className={styles.list}>
              <li>The Brand deposits funds into Escrow upon order confirmation.</li>
              <li>The Maker produces and ships the goods.</li>
              <li>The Brand inspects the goods and confirms acceptance.</li>
              <li>Funds are released to the Maker (minus Brutige fees).</li>
            </ol>
            <p>If a dispute arises, funds remain frozen until resolution via our Support team.</p>
          </section>

          <section id="liability" ref={(el) => (sectionRefs.current.liability = el)} className={styles.section}>
            <h2>7. Liability & Disputes</h2>
            <p>Brutige acts as a facilitator. While we strive for quality, we are not liable for:</p>
            <ul className={styles.list}>
              <li>Production delays caused by force majeure (natural disasters, supply chain breakdowns).</li>
              <li>Minor variations in color or texture inherent to natural materials.</li>
              <li>Disputes between Brands and Makers that are resolved outside our platform.</li>
            </ul>
            <p>Any legal disputes must be resolved in the courts of San Francisco, CA.</p>
          </section>

          <section id="termination" ref={(el) => (sectionRefs.current.termination = el)} className={styles.section}>
            <h2>8. Termination</h2>
            <p>We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.</p>
          </section>

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