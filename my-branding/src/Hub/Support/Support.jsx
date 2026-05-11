import React, { useState } from 'react';
import styles from './Support.module.css';
import { validateEmail } from '../../App'; // Import your global validator

// Icon Components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const BoxIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const RulerIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12h20"></path>
    <path d="M2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6"></path>
    <path d="M2 12V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6"></path>
    <line x1="6" y1="12" x2="6" y2="15"></line>
    <line x1="10" y1="12" x2="10" y2="15"></line>
    <line x1="14" y1="12" x2="14" y2="15"></line>
    <line x1="18" y1="12" x2="18" y2="15"></line>
  </svg>
);

const TruckIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="3" width="15" height="13"></rect>
    <polygon points="16 8 20 8 23 11 23 16 16 16 8"></polygon>
    <circle cx="5.5" cy="18.5" r="2.5"></circle>
    <circle cx="18.5" cy="18.5" r="2.5"></circle>
  </svg>
);

const DollarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const AttachmentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
  </svg>
);

// Expanded Data with Actual Articles
const topicsData = [
  { 
    id: 1, 
    category: 'Shipping',
    title: 'Order Tracking', 
    desc: 'Track your production run and shipping status.', 
    icon: <TruckIcon />,
    articles: [
      { id: 101, title: 'How to track my order?', content: 'Once your order ships, you will receive an email with a tracking number. You can enter this number on our carrier\'s website (DHL/FedEx) to see real-time location updates.' },
      { id: 102, title: 'International Shipping Times', content: 'Standard international shipping takes 5-7 business days. Express options are available at checkout for 2-3 day delivery.' },
      { id: 103, title: 'Customs & Duties', content: 'We ship DDP (Delivered Duty Paid) for most countries, meaning taxes are pre-paid. For remote regions, local customs fees may apply upon arrival.' }
    ]
  },
  { 
    id: 2, 
    category: 'Sizing',
    title: 'Sizing & Measurements', 
    desc: 'Detailed size charts and grading rules.', 
    icon: <RulerIcon />,
    articles: [
      { id: 201, title: 'Understanding GSM & Fit', content: 'GSM (Grams per Square Meter) indicates fabric weight. Higher GSM (300+) means heavier, boxier fits. Lower GSM (180-220) is lighter and more draped.' },
      { id: 202, title: 'Size Chart Guide', content: 'Our sizes run true to streetwear standards. Measure a garment you own that fits well and compare it to our flat lay measurements in the product description.' }
    ]
  },
  { 
    id: 3, 
    category: 'Billing',
    title: 'Billing & Payments', 
    desc: 'Invoices, payment methods, and refunds.', 
    icon: <DollarIcon />,
    articles: [
      { id: 301, title: 'Refund Policy', content: 'Custom production items are non-refundable once manufacturing begins. Stock items can be returned within 14 days of delivery.' },
      { id: 302, title: 'Invoice Requests', content: 'All invoices are automatically emailed to your registered address upon payment. You can also download them from your Account > Orders page.' }
    ]
  },
  { 
    id: 4, 
    category: 'Product',
    title: 'Product Care', 
    desc: 'How to wash and maintain your garments.', 
    icon: <BoxIcon />,
    articles: [
      { id: 401, title: 'Washing Instructions', content: 'Turn garments inside out. Wash cold (30°C) on a gentle cycle. Do not bleach. Tumble dry low or hang dry to preserve print quality.' },
      { id: 402, title: 'Storage Tips', content: 'Store in a cool, dry place. Avoid direct sunlight for long periods to prevent fading. Use padded hangers for heavy hoodies to maintain shoulder shape.' }
    ]
  },
];

const Support = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success
  const [activeArticle, setActiveArticle] = useState(null); // For modal
  const [file, setFile] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({ email: '', subject: '', message: '' });
  const [errors, setErrors] = useState({});

  // Filter topics based on search
  const filteredTopics = topicsData.filter(topic => 
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
    topic.articles.some(art => art.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    
    if (!formData.subject) newErrors.subject = 'Please select a subject';
    if (!formData.message) newErrors.message = 'Message cannot be empty';
    else if (formData.message.length < 10) newErrors.message = 'Message must be at least 10 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ email: '', subject: '', message: '' });
      setFile(null);
      setTimeout(() => setFormStatus('idle'), 4000);
    }, 1500);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  return (
    <div className={styles.container}>
      {/* Hero Search */}
      <section className={styles.hero}>
        <h1 className={styles.title}>How can we help?</h1>
        <div className={styles.searchWrapper}>
          <SearchIcon />
          <input 
            type="text" 
            placeholder="Search articles (e.g., 'shipping', 'GSM', 'refund')" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </section>

      {/* Topics Grid */}
      <section className={styles.topicsSection}>
        {filteredTopics.length > 0 ? (
          <div className={styles.grid}>
            {filteredTopics.map((topic) => (
              <div key={topic.id} className={styles.card}>
                <div className={styles.iconWrapper}>{topic.icon}</div>
                <h3 className={styles.cardTitle}>{topic.title}</h3>
                <p className={styles.cardDesc}>{topic.desc}</p>
                
                {/* List Articles inside Card if searched, or show button */}
                {searchTerm && topic.articles.some(a => a.title.toLowerCase().includes(searchTerm.toLowerCase())) ? (
                  <div className={styles.searchResults}>
                    {topic.articles
                      .filter(a => a.title.toLowerCase().includes(searchTerm.toLowerCase()))
                      .map(art => (
                        <button 
                          key={art.id} 
                          className={styles.resultLink}
                          onClick={() => setActiveArticle(art)}
                        >
                          📄 {art.title}
                        </button>
                    ))}
                  </div>
                ) : (
                  <div className={styles.articleList}>
                    <p className={styles.articleCount}>{topic.articles.length} articles available</p>
                    {topic.articles.slice(0, 2).map(art => (
                      <button 
                        key={art.id} 
                        className={styles.miniLink}
                        onClick={() => setActiveArticle(art)}
                      >
                        {art.title}
                      </button>
                    ))}
                    <button className={styles.linkBtn} onClick={() => setActiveArticle(topic.articles[0])}>
                      View All Articles <ArrowRightIcon />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>No articles found for "{searchTerm}". Try submitting a ticket below.</p>
          </div>
        )}
      </section>

      {/* Contact Form */}
      <section className={styles.contactSection}>
        <div className={styles.formContainer}>
          <div className={styles.formHeader}>
            <h2>Still need help?</h2>
            <p>Submit a ticket and our team will get back to you within 24 hours.</p>
          </div>

          {formStatus === 'success' ? (
            <div className={styles.successMessage}>
              <div className={styles.successIcon}><CheckIcon /></div>
              <h3>Ticket Submitted</h3>
              <p>We've received your request. Check your email for confirmation.</p>
              <button className={styles.resetBtn} onClick={() => setFormStatus('idle')}>Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@brand.com" 
                    className={errors.email ? styles.errorInput : ''}
                  />
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>
                
                <div className={styles.inputGroup}>
                  <label>Subject</label>
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={errors.subject ? styles.errorInput : ''}
                  >
                    <option value="">Select a topic...</option>
                    <option value="order">Order Issue</option>
                    <option value="product">Product Quality</option>
                    <option value="billing">Billing Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.subject && <span className={styles.errorText}>{errors.subject}</span>}
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Message</label>
                <textarea 
                  rows="5" 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your issue in detail..." 
                  className={errors.message ? styles.errorInput : ''}
                ></textarea>
                {errors.message && <span className={styles.errorText}>{errors.message}</span>}
              </div>

              {/* File Upload */}
              <div className={styles.fileUpload}>
                <label className={styles.fileLabel}>
                  <input type="file" onChange={handleFileChange} hidden />
                  <div className={styles.fileBox}>
                    <AttachmentIcon />
                    <span>{file ? file.name : 'Attach screenshot or file (Optional)'}</span>
                  </div>
                </label>
                {file && <button type="button" className={styles.removeFile} onClick={() => setFile(null)}>×</button>}
              </div>

              <button type="submit" className={styles.submitBtn} disabled={formStatus === 'submitting'}>
                {formStatus === 'submitting' ? 'Sending...' : 'Submit Ticket'}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Article Modal */}
      {activeArticle && (
        <div className={styles.modalOverlay} onClick={() => setActiveArticle(null)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setActiveArticle(null)}>
              <CloseIcon />
            </button>
            <div className={styles.modalBody}>
              <span className={styles.modalCategory}>Article</span>
              <h2 className={styles.modalTitle}>{activeArticle.title}</h2>
              <div className={styles.modalText}>{activeArticle.content}</div>
              <div className={styles.modalFooter}>
                <p>Was this helpful?</p>
                <div className={styles.feedbackBtns}>
                  <button className={styles.feedbackYes}>Yes</button>
                  <button className={styles.feedbackNo}>No</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Support;