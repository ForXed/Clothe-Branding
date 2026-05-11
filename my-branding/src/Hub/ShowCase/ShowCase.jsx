import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ShowCase.module.css';

// Mock Data: Mixed portfolio of Brand Launches and Maker Productions
const projects = [
  { 
    id: 1, 
    title: 'Nexus Techwear V1', 
    category: 'Streetwear', 
    role: 'Brand Launch', 
    maker: 'Julian V. Studio',
    location: 'Berlin, DE',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800', 
    tags: ['Waterproof', 'Modular', 'Heavyweight'],
    type: 'brand'
  },
  { 
    id: 2, 
    title: 'Organic Cotton Loop', 
    category: 'Sustainable', 
    role: 'Maker Production', 
    maker: 'EcoTextiles Ltd',
    location: 'Lisbon, PT',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 
    tags: ['GOTS Certified', 'Low Impact Dye', 'Knit'],
    type: 'maker'
  },
  { 
    id: 3, 
    title: 'Denim Blueprint Raw', 
    category: 'Denim', 
    role: 'Brand Launch', 
    maker: 'Osaka Denim Co',
    location: 'Osaka, JP',
    image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=800', 
    tags: ['Selvedge', 'Unsanforized', '14oz'],
    type: 'brand'
  },
  { 
    id: 4, 
    title: 'Shell Jacket Prototype', 
    category: 'Outerwear', 
    role: 'Maker Production', 
    maker: 'Alpine Mfg',
    location: 'Seattle, USA',
    image: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd9?w=800', 
    tags: ['Gore-Tex', 'Seam Sealed', 'Technical'],
    type: 'maker'
  },
  { 
    id: 5, 
    title: 'Minimalist Basics Kit', 
    category: 'Essentials', 
    role: 'Brand Launch', 
    maker: 'Foundry Studio',
    location: 'Copenhagen, DK',
    image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d493?w=800', 
    tags: ['Peruvian Cotton', 'Boxy Fit', 'Neutral'],
    type: 'brand'
  },
  { 
    id: 6, 
    title: 'Leather Accents Run', 
    category: 'Accessories', 
    role: 'Maker Production', 
    maker: 'Tannery & Co',
    location: 'Florence, IT',
    image: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd9?w=800', // Placeholder reuse
    tags: ['Vegetable Tanned', 'Hand Stitched', 'Full Grain'],
    type: 'maker'
  },
];

const filters = ['All', 'Streetwear', 'Sustainable', 'Denim', 'Outerwear', 'Essentials'];

const ShowCase = () => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState('All');
  const [userMode, setUserMode] = useState('all'); // 'all', 'brand', 'maker'

  // Filter Logic
  const filteredProjects = projects.filter(project => {
    const matchesCategory = activeFilter === 'All' || project.category === activeFilter;
    const matchesMode = userMode === 'all' 
      ? true 
      : (userMode === 'brand' ? project.type === 'brand' : project.type === 'maker');
    
    return matchesCategory && matchesMode;
  });

  const handleViewBlueprint = (project) => {
    // In a real app, check auth here. If not logged in, show modal.
    // For now, we simulate a gate or direct to detail view
    console.log("Viewing blueprint for:", project.title);
    // navigate(`/hub/showcase/${project.id}`); 
  };

  return (
    <div className={styles.container}>
      {/* Header Section */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>ShowCase</h1>
          <p className={styles.subtitle}>
            Real infrastructure in action. Explore successful brand launches and maker productions built on Brutige.
          </p>
        </div>

        {/* Dual Path Toggle */}
        <div className={styles.modeToggle}>
          <button 
            className={`${styles.toggleBtn} ${userMode === 'all' ? styles.active : ''}`}
            onClick={() => setUserMode('all')}
          >
            All Work
          </button>
          <button 
            className={`${styles.toggleBtn} ${userMode === 'brand' ? styles.active : ''}`}
            onClick={() => setUserMode('brand')}
          >
            For Brands
          </button>
          <button 
            className={`${styles.toggleBtn} ${userMode === 'maker' ? styles.active : ''}`}
            onClick={() => setUserMode('maker')}
          >
            For Makers
          </button>
        </div>
      </header>

      {/* Category Filters */}
      <div className={styles.filterBar}>
        {filters.map(filter => (
          <button
            key={filter}
            className={`${styles.filterBtn} ${activeFilter === filter ? styles.active : ''}`}
            onClick={() => setActiveFilter(filter)}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Masonry Grid */}
      <div className={styles.grid}>
        {filteredProjects.map((project) => (
          <div key={project.id} className={`${styles.card} ${styles[project.type]}`}>
            <div className={styles.imageWrapper}>
              <img src={project.image} alt={project.title} loading="lazy" />
              <div className={styles.metaTag}>
                <span className={styles.role}>{project.role}</span>
                <span className={styles.maker}>{project.maker}</span>
              </div>
            </div>
            
            <div className={styles.info}>
              <div className={styles.infoHeader}>
                <div>
                  <h3 className={styles.cardTitle}>{project.title}</h3>
                  <span className={styles.location}>{project.location}</span>
                </div>
                <span className={styles.categoryBadge}>{project.category}</span>
              </div>
              
              <div className={styles.tags}>
                {project.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>

              <button 
                className={styles.blueprintBtn}
                onClick={() => handleViewBlueprint(project)}
              >
                View Blueprint
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className={styles.emptyState}>
          <p>No projects found matching your criteria.</p>
          <button className={styles.resetBtn} onClick={() => {setActiveFilter('All'); setUserMode('all');}}>
            Reset Filters
          </button>
        </div>
      )}

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>Ready to be featured?</h2>
          <p>Whether you're launching a brand or scaling production, start your journey today.</p>
          <div className={styles.ctaActions}>
            <button className={styles.primaryBtn} onClick={() => navigate('/signup')}>Start Brand</button>
            <button className={styles.secondaryBtn} onClick={() => navigate('/maker-signup')}>Become Maker</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowCase;