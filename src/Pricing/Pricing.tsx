import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Pricing.module.css';

interface Plan {
  name: string;
  price: string;
  annualPrice: string;
  period: string;
  description: string;
  features: string[];
  cta: string;
  highlighted: boolean;
  color: string;
  badge?: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState<boolean>(false);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const plans: Plan[] = [
    {
      name: 'Maker',
      price: '0',
      annualPrice: '0',
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
      price: '19,500',
      annualPrice: '15,600',
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
      color: 'var(--brut-text)',
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: '89,000',
      annualPrice: '71,200',
      period: '/month',
      description: 'Full infrastructure for large fashion houses.',
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

  const faqs: FAQItem[] = [
    {
      question: 'Can I sell without a subscription?',
      answer: 'Yes. The Maker plan is free forever. You can list up to 5 products and start selling immediately. We only charge a small 2% fee on successful sales.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major Nigerian payment methods including Paystack (cards, bank transfers, USSD), direct bank transfers to our escrow account, and international cards. All transactions are secured with bank-level encryption.'
    },
    {
      question: 'Are prices in Naira? Can I pay in USD?',
      answer: 'All prices are displayed in Nigerian Naira (₦). Currently, we only accept Naira payments as we focus on the Nigerian market. International currency support will be added when we expand globally.'
    },
    {
      question: 'Is VAT included in the pricing?',
      answer: 'Prices shown exclude the 7.5% Nigerian VAT, which will be added at checkout as required by law. Business customers with valid TIN can claim VAT credits.'
    },
    {
      question: 'Do customers pay extra fees?',
      answer: 'No. Customers only pay the price of the product and shipping. There are no hidden fees or subscriptions for buyers on Brutige.'
    },
    {
      question: 'Can I change plans later?',
      answer: 'Absolutely. You can upgrade or downgrade your plan at any time from your studio settings. Changes take effect immediately, and we\'ll prorate any differences.'
    },
    {
      question: 'What happens if I exceed the product limit?',
      answer: 'If you are on the free plan and try to add a 6th product, we will prompt you to upgrade to Pro Atelier to continue expanding your collection.'
    },
    {
      question: 'Is there a money-back guarantee?',
      answer: 'Yes! All paid plans come with a 14-day money-back guarantee. If you\'re not satisfied, contact our support team within 14 days for a full refund, no questions asked.'
    }
  ];

  const comparisonFeatures = [
    { feature: 'Product Limit', maker: '5', pro: 'Unlimited', enterprise: 'Unlimited' },
    { feature: 'Transaction Fee', maker: '2%', pro: '0%', enterprise: '0%' },
    { feature: 'Analytics', maker: 'Basic', pro: 'Advanced', enterprise: 'Custom Reports' },
    { feature: 'Support', maker: 'Email', pro: 'Priority 24/7', enterprise: 'Dedicated Agent' },
    { feature: 'Staff Accounts', maker: '1', pro: 'Up to 3', enterprise: 'Unlimited' },
    { feature: 'Custom Branding', maker: false, pro: true, enterprise: true },
    { feature: 'API Access', maker: false, pro: false, enterprise: true },
    { feature: 'White-label Dashboard', maker: false, pro: false, enterprise: true },
    { feature: 'SLA Guarantee', maker: false, pro: false, enterprise: true },
    { feature: 'Bulk Discounts', maker: false, pro: false, enterprise: true }
  ];

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const renderCellValue = (value: string | boolean, isPro: boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isPro ? 'var(--brut-bg)' : 'var(--brut-text)'} strokeWidth="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      ) : (
        <span style={{ opacity: 0.3 }}>—</span>
      );
    }
    return value;
  };

  // Helper function to calculate annual savings
  const calculateAnnualSavings = (price: string, annualPrice: string): string => {
    const monthlyPrice = parseInt(price.replace(/,/g, ''));
    const monthlyAnnual = parseInt(annualPrice.replace(/,/g, ''));
    const yearlySavings = (monthlyPrice - monthlyAnnual) * 12;
    return yearlySavings.toLocaleString();
  };

  return (
    <div className={styles.pricingContainer}>
      <div className={styles.header}>
        <div className={styles.badge}>For Makers & Brands</div>
        <h1>Invest in your infrastructure.</h1>
        <p className={styles.subtext}>
          Start selling for free. Upgrade as you grow. <br />
          <span className={styles.highlight}>Customers never pay subscription fees.</span>
        </p>
        
        <div className={styles.toggleContainer}>
          <span className={!isAnnual ? styles.active : ''}>Monthly</span>
          <button 
            type="button"
            className={`${styles.toggle} ${isAnnual ? styles.active : ''}`} 
            onClick={() => setIsAnnual(!isAnnual)}
            aria-label="Toggle billing period"
          >
            <div className={styles.toggleKnob}></div>
          </button>
          <span className={isAnnual ? styles.active : ''}>
            Annual <span className={styles.saveBadge}>Save 20%</span>
          </span>
        </div>

        <div className={styles.guaranteeBadge}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
          <span>14-Day Money-Back Guarantee · No Hidden Fees · Cancel Anytime</span>
        </div>
      </div>

      <div className={styles.grid}>
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            className={`${styles.card} ${plan.highlighted ? styles.highlighted : ''}`}
            style={{ borderColor: plan.highlighted ? plan.color : 'var(--brut-border)' }}
          >
            {plan.badge && <div className={styles.popularBadge}>{plan.badge}</div>}
            
            <div className={styles.cardHeader}>
              <h3>{plan.name}</h3>
              <div className={styles.price}>
                <span className={styles.currency}>₦</span>
                {isAnnual ? plan.annualPrice : plan.price}
                <span className={styles.period}>{plan.period}</span>
              </div>
              {isAnnual && plan.price !== '0' && (
                <div className={styles.annualNote}>
                  Billed annually · Save ₦{calculateAnnualSavings(plan.price, plan.annualPrice)}/year
                </div>
              )}
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
              type="button"
              className={`${styles.ctaBtn} ${plan.highlighted ? styles.primary : ''}`}
              onClick={() => navigate('/studio/settings')}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      {/* Payment Methods Section */}
      <div className={styles.paymentSection}>
        <p className={styles.paymentTitle}>Trusted Payment Methods</p>
        <div className={styles.paymentMethods}>
          <div className={styles.paymentMethod}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
              <line x1="1" y1="10" x2="23" y2="10"/>
            </svg>
            <span>Cards</span>
          </div>
          <div className={styles.paymentMethod}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 21h18"/>
              <path d="M3 10h18"/>
              <path d="M5 6l7-3 7 3"/>
              <path d="M4 10v11"/>
              <path d="M20 10v11"/>
              <path d="M8 14v3"/>
              <path d="M12 14v3"/>
              <path d="M16 14v3"/>
            </svg>
            <span>Bank Transfer</span>
          </div>
          <div className={styles.paymentMethod}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
            <span>USSD</span>
          </div>
          <div className={styles.paymentMethod}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span>Paystack Secure</span>
          </div>
        </div>
      </div>

      <div className={styles.comparisonSection}>
        <h2>Compare Infrastructure</h2>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Maker</th>
                <th className={styles.proHeader}>Pro Atelier</th>
                <th>Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.feature}</td>
                  <td>{renderCellValue(row.maker, false)}</td>
                  <td className={styles.proCell}>{renderCellValue(row.pro, true)}</td>
                  <td>{renderCellValue(row.enterprise, false)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className={styles.faqSection}>
        <h2>Frequently Asked Questions</h2>
        <div className={styles.faqGrid}>
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`${styles.faqItem} ${openFAQ === idx ? styles.faqOpen : ''}`}
            >
              <button 
                type="button"
                className={styles.faqQuestion}
                onClick={() => toggleFAQ(idx)}
              >
                <h4>{faq.question}</h4>
                <svg 
                  width="20" 
                  height="20" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  className={styles.faqIcon}
                >
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </button>
              <div className={styles.faqAnswer}>
                <p>{faq.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.ctaSection}>
        <h3>Still have questions?</h3>
        <p>Our team is here to help you choose the right plan for your brand.</p>
        <button 
          type="button"
          className={styles.contactBtn}
          onClick={() => navigate('/hub/support')}
        >
          Talk to Sales
        </button>
      </div>
    </div>
  );
};

export default Pricing;