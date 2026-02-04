import React, { useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import styles from './FAQSection.module.css';

gsap.registerPlugin(ScrollTrigger);

const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const container = useRef();
  const accordionRefs = useRef([]);

  // 1. Initial Reveal Animation on Scroll
  useGSAP(() => {
    gsap.from(`.${styles.faqItem}`, {
      scrollTrigger: {
        trigger: container.current,
        start: "top 80%",
      },
      y: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 1,
      ease: "power4.out"
    });
  }, { scope: container });

  // 2. Accordion Logic using GSAP
  const toggleFAQ = (index) => {
    const isOpening = openIndex !== index;
    const content = accordionRefs.current[index];
    const icon = content.parentElement.querySelector(`.${styles.faqIcon}`);

    // Close the previous one if it exists
    if (openIndex !== null) {
      const prevContent = accordionRefs.current[openIndex];
      const prevIcon = prevContent.parentElement.querySelector(`.${styles.faqIcon}`);
      gsap.to(prevContent, { height: 0, duration: 0.5, ease: "power3.inOut" });
      gsap.to(prevIcon, { rotate: 0, duration: 0.5 });
    }

    // Open the new one
    if (isOpening) {
      gsap.to(content, { height: "auto", duration: 0.6, ease: "elastic.out(1, 0.8)" });
      gsap.to(icon, { rotate: 45, duration: 0.5 });
      setOpenIndex(index);
    } else {
      setOpenIndex(null);
    }
  };

  const faqs = [
    { q: "What is the Minimum Order Quantity?", a: "Brutige is built for scale. We operate with zero minimums, allowing you to prototype a single vision or manufacture a global collection." },
    { q: "What is the standard production cycle?", a: "Our infrastructure is engineered for speed. Standard turnaround is 14 days, with 7-day priority lanes available for elite partners." },
    { q: "Can I integrate my own supply chain?", a: "Yes. While we provide a premium network of makers, our platform allows you to plug in your own verified suppliers while using our tracking tech." },
    { q: "How do you handle global logistics?", a: "We manage everything from duty-paid shipping to last-mile delivery across 50+ countries, ensuring your brand stays borderless." }
  ];

  return (
    <section ref={container} className={styles.faqSection}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>
          COMMON <br /> <span className={styles.outline}>QUERIES</span>
        </h2>
        
        <div className={styles.faqList}>
          {faqs.map((faq, idx) => (
            <div key={idx} className={styles.faqItem} onClick={() => toggleFAQ(idx)}>
              <div className={styles.faqQuestion}>
                <h3>{faq.q}</h3>
                <span className={styles.faqIcon}>+</span>
              </div>
              
              <div 
                ref={el => accordionRefs.current[idx] = el} 
                className={styles.answerWrapper}
              >
                <div className={styles.faqAnswer}>
                  <p>{faq.a}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;