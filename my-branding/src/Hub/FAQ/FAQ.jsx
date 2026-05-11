import React, { useState } from 'react';
import styles from './FAQ.module.css';

const faqData = [
  {
    id: 1,
    category: 'Production',
    question: 'What is the minimum order quantity (MOQ)?',
    answer: 'Our MOQ starts at just 50 units per style for most categories like tees and hoodies. For complex outerwear or denim, the MOQ may be slightly higher (100 units) to ensure cost-efficiency in production runs.'
  },
  {
    id: 2,
    category: 'Production',
    question: 'How long does production take?',
    answer: 'Standard production turnaround is 14-21 days after sample approval. Rush options are available for an additional fee, potentially reducing this to 7-10 days depending on factory capacity.'
  },
  {
    id: 3,
    category: 'Shipping',
    question: 'Do you ship internationally?',
    answer: 'Yes, we offer global logistics solutions. We handle customs clearance and DDP (Delivered Duty Paid) shipping to over 50 countries, ensuring your goods arrive without unexpected fees.'
  },
  {
    id: 4,
    category: 'Design',
    question: 'Can you help with tech packs?',
    answer: 'Absolutely. If you don\'t have a tech pack, our design team can create one from your sketches or references. This service is included in our Pro plan or available as a one-off add-on.'
  },
  {
    id: 5,
    category: 'Samples',
    question: 'How do sampling works?',
    answer: 'Before full production, we create a prototype sample for your approval. You can request fit adjustments, fabric changes, or color corrections. Once you sign off digitally, we begin the mass production run.'
  },
  {
    id: 6,
    category: 'Billing',
    question: 'What payment methods do you accept?',
    answer: 'We accept major credit cards, bank transfers, and secure escrow payments via our platform. For large enterprise orders, net-30 terms may be available upon credit approval.'
  }
];

const categories = ['All', 'Production', 'Shipping', 'Design', 'Samples', 'Billing'];

const FAQ = () => {
  const [activeId, setActiveId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const toggleItem = (id) => {
    setActiveId(activeId === id ? null : id);
  };

  const filteredData = selectedCategory === 'All' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Frequently Asked Questions</h1>
        <p className={styles.subtitle}>Everything you need to know about the production process.</p>
        
        <div className={styles.filterBar}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${selectedCategory === cat ? styles.active : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.accordion}>
        {filteredData.map((item) => (
          <div 
            key={item.id} 
            className={`${styles.item} ${activeId === item.id ? styles.active : ''}`}
          >
            <button 
              className={styles.question} 
              onClick={() => toggleItem(item.id)}
            >
              <span className={styles.qText}>{item.question}</span>
              <span className={styles.icon}>
                {activeId === item.id ? (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                ) : (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                )}
              </span>
            </button>
            
            <div className={styles.answerWrapper}>
              <div className={styles.answerContent}>
                <span className={styles.categoryTag}>{item.category}</span>
                <p>{item.answer}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredData.length === 0 && (
        <div className={styles.emptyState}>
          <p>No questions found in this category.</p>
        </div>
      )}

      <div className={styles.ctaSection}>
        <h3>Still have questions?</h3>
        <p>Our support team is ready to help you navigate your production journey.</p>
        <a href="/hub/support" className={styles.ctaBtn}>Contact Support →</a>
      </div>
    </div>
  );
};

export default FAQ;