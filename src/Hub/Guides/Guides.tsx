import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import hook
import styles from './Guides.module.css';

const guides = [
  { 
    id: 1, 
    slug: 'gsm-handbook',
    title: 'The GSM Handbook', 
    category: 'Fabrics', 
    time: '5 min read', 
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600',
    description: 'Understand fabric weight and how it affects drape, durability, and seasonality.',
    pdfUrl: '/guides/gsm-handbook.pdf' 
  },
  { 
    id: 2, 
    slug: 'tech-pack-essentials',
    title: 'Tech Pack Essentials', 
    category: 'Production', 
    time: '12 min read', 
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600',
    description: 'Learn how to create a manufacturer-ready tech pack that minimizes errors.',
    pdfUrl: '/guides/tech-pack-essentials.pdf'
  },
  { 
    id: 3, 
    slug: 'grading-rules-101',
    title: 'Grading Rules 101', 
    category: 'Measurements', 
    time: '8 min read', 
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1550920444-0944e1e58b3f?w=600',
    description: 'Master the art of scaling patterns across sizes while maintaining fit.',
    pdfUrl: '/guides/grading-rules-101.pdf'
  },
  { 
    id: 4, 
    slug: 'sustainable-dyeing',
    title: 'Sustainable Dyeing', 
    category: 'Sustainability', 
    time: '10 min read', 
    level: 'Intermediate',
    image: 'https://images.unsplash.com/photo-1520699697851-3dc68aa3a474?w=600',
    description: 'Explore eco-friendly dyeing processes and water conservation techniques.',
    pdfUrl: '/guides/sustainable-dyeing.pdf'
  },
  { 
    id: 5, 
    slug: 'fabric-sourcing-guide',
    title: 'Fabric Sourcing Guide', 
    category: 'Fabrics', 
    time: '15 min read', 
    level: 'Beginner',
    image: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?w=600',
    description: 'Navigate global fabric markets and find the right suppliers for your needs.',
    pdfUrl: '/guides/fabric-sourcing-guide.pdf'
  },
  { 
    id: 6, 
    slug: 'quality-control-checklist',
    title: 'Quality Control Checklist', 
    category: 'Production', 
    time: '6 min read', 
    level: 'Advanced',
    image: 'https://images.unsplash.com/photo-1581093450021-4a7360e9a6b5?w=600',
    description: 'A comprehensive checklist to ensure every unit meets your standards.',
    pdfUrl: '/guides/quality-control-checklist.pdf'
  },
];

const categories = ['All', 'Fabrics', 'Measurements', 'Production', 'Sustainability'];

const Guides = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredGuides = activeCategory === 'All' 
    ? guides 
    : guides.filter(g => g.category === activeCategory);

  const handleReadGuide = (slug) => {
    navigate(`/hub/guides/${slug}`);
  };

  const handleDownload = (pdfUrl, title) => {
    // In a real app, this would trigger a download from your server or S3 bucket
    // For now, we simulate it or open the link if it exists in /public
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title}.pdf`;
    link.target = '_blank';
    link.click();
    
    // Optional: Show a toast notification here if download fails
    console.log(`Downloading ${title}...`);
  };

  const handleRequestGuide = () => {
    // Redirect to support page with pre-filled subject
    navigate('/hub/support?subject=Guide Request&message=I would like to request a new design guide about...');
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Design Guides</h1>
          <p className={styles.subtitle}>
            Technical resources, tutorials, and industry knowledge to help you build better products.
          </p>
        </div>
        
        <div className={styles.filterBar}>
          {categories.map(cat => (
            <button
              key={cat}
              className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.grid}>
        {filteredGuides.map((guide) => (
          <article key={guide.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={guide.image} alt={guide.title} loading="lazy" />
              <div className={styles.badge}>{guide.level}</div>
            </div>
            
            <div className={styles.content}>
              <div className={styles.meta}>
                <span className={styles.category}>{guide.category}</span>
                <span className={styles.time}>{guide.time}</span>
              </div>
              
              <h3 className={styles.guideTitle}>{guide.title}</h3>
              <p className={styles.description}>{guide.description}</p>
              
              <div className={styles.actions}>
                <button 
                  className={styles.readBtn}
                  onClick={() => handleReadGuide(guide.slug)}
                >
                  Read Guide
                </button>
                <button 
                  className={styles.downloadBtn}
                  onClick={() => handleDownload(guide.pdfUrl, guide.title)}
                  title={`Download ${guide.title} PDF`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className={styles.emptyState}>
          <p>No guides found in this category.</p>
        </div>
      )}

      <div className={styles.requestSection}>
        <h3>Missing a topic?</h3>
        <p>We're constantly adding new resources. Let us know what you need.</p>
        <button className={styles.requestBtn} onClick={handleRequestGuide}>
          Request a Guide
        </button>
      </div>
    </div>
  );
};

export default Guides;