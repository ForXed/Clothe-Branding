import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Pricing.module.css';

const Pricing = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Maker',
      price: isAnnual ? '0' : '0',
      period: '/forever',
      description: 'Perfect for testing your first collection.',
      features: [
        'Up to 5 Active Products',
        'Basic Sales Analytics',
        'Standard Community Support',
        '2% Transaction Fee',
        'Access to Basic Blanks',
        'Brutige Branding on Packaging'
      ],
      cta: 'Start Selling Free',
      highlighted: false,
      color: '#666'
    },
    {
      name: 'Pro Atelier',
      price: isAnnual ? '29' : '39',
      period: '/month',
      description: 'For serious brands ready to scale.',
      features: [
        'Unlimited Products & Collections',
        'Advanced Revenue Analytics',
        'Priority 24/7 Support',
        '0% Transaction Fees',
        'Access to Premium Blanks',
        'Custom Branding on Packaging',
        'Early Access to New Features',
        'Staff Accounts (up to 3)'
      ],
      cta: 'Start 14-Day Free Trial',
      highlighted: true,
      color: 'var(--brut-text)'
    },
    {
      name: 'Enterprise',
      price: isAnnual ? '99' : '129',
      period: '/month',
      description: 'Full infrastructure for large houses.',
      features: [
        'Everything in Pro Atelier',
        'Dedicated Account Manager',
        'Custom API Access',
        'White-label Dashboard',
        'Bulk Order Discounts',
        'Unlimited Team Members',
        'SLA Guarantee',
        'Custom Contract Terms'
      ],
      cta: 'Contact Sales',
      highlighted: false,
      color: '#666'
    }
  ];

  return (
    <div className={styles.pricingContainer}>
      {/* Hero Section */}
      <div className={styles.header}>
        <div className={styles.badge}>For Makers & Brands</div>
        <h1>Invest in your infrastructure.</h1>
        <p className={styles.subtext}>
          Start selling for free. Upgrade as you grow. <br />
          <span className={styles.highlight}>Customers never pay subscription fees.</span>
        </p>
        
        <div className={styles.toggleContainer}>
          <span className={!isAnnual ? styles.active : ''}>Monthly Billing</span>
          <button 
            className={`${styles.toggle} ${isAnnual ? styles.active : ''}`} 
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle billing period"
          >
            <div className={styles.toggleKnob}></div>
          </button>
          <span className={isAnnual ? styles.active : ''}>
            Yearly Billing <span className={styles.saveBadge}>Save 20%</span>
          </span>
        </div>
      </div>

      {/* Plans Grid */}
      <div className={styles.grid}>
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            className={`${styles.card} ${plan.highlighted ? styles.highlighted : ''}`}
            style={{ borderColor: plan.highlighted ? plan.color : 'var(--brut-border)' }}
          >
            {plan.highlighted && <div className={styles.popularBadge}>Most Popular</div>}
            
            <div className={styles.cardHeader}>
              <h3>{plan.name}</h3>
              <div className={styles.price}>
                <span className={styles.currency}>$</span>
                {plan.price}
                <span className={styles.period}>{plan.period}</span>
              </div>
              <p className={styles.description}>{plan.description}</p>
            </div>

            <ul className={styles.features}>
              {plan.features.map((feature, fIdx) => (
                <li key={fIdx} className={styles.featureItem}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={plan.highlighted ? 'var(--brut-bg)' : 'var(--brut-text)'} strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {feature}
                </li>
              ))}
            </ul>

            <button 
              className={`${styles.ctaBtn} ${plan.highlighted ? styles.primary : ''}`}
              onClick={() => navigate('/studio/settings')}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Comparison Table */}
      <div className={styles.comparisonSection}>
        <h2>Compare Infrastructure</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Maker</th>
                <th>Pro Atelier</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Product Limit</td>
                <td>5</td>
                <td>Unlimited</td>
                <td>Unlimited</td>
              </tr>
              <tr>
                <td>Transaction Fee</td>
                <td>2%</td>
                <td>0%</td>
                <td>0%</td>
              </tr>
              <tr>
                <td>Analytics</td>
                <td>Basic</td>
                <td>Advanced</td>
                <td>Custom Reports</td>
              </tr>
              <tr>
                <td>Support</td>
                <td>Email</td>
                <td>Priority 24/7</td>
                <td>Dedicated Agent</td>
              </tr>
              <tr>
                <td>Custom Branding</td>
                <td>—</td>
                <td>✓</td>
                <td>✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* FAQ Section */}
      <div className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          <div className={styles.faqItem}>
            <h4>Can I sell without a subscription?</h4>
            <p>Yes. The Maker plan is free forever. You can list up to 5 products and start selling immediately. We only charge a small 2% fee on successful sales.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>Do customers pay extra fees?</h4>
            <p>No. Customers only pay the price of the product and shipping. There are no hidden fees or subscriptions for buyers on Brutige.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>Can I change plans later?</h4>
            <p>Absolutely. You can upgrade or downgrade your plan at any time from your studio settings. Changes take effect immediately.</p>
          </div>
          <div className={styles.faqItem}>
            <h4>What happens if I exceed the product limit?</h4>
            <p>If you are on the free plan and try to add a 6th product, we will prompt you to upgrade to Pro Atelier to continue expanding your collection.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;