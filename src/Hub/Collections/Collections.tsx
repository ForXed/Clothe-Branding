import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Collections.module.css';

// Mock Data for Both Audiences
const brandCollections = [
  { id: 1, title: 'Heavyweight Basics', count: '12 Blanks', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', tag: 'Best Seller', specs: '450GSM • 100% Cotton' },
  { id: 2, title: 'Techwear Shell', count: '8 Variants', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', tag: 'New Drop', specs: 'Waterproof • Ripstop' },
  { id: 3, title: 'Denim Blueprint', count: '5 Washes', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', tag: 'Limited', specs: '14oz • Selvedge' },
  { id: 4, title: 'Organic Loop', count: '20 Colors', image: 'https://images.unsplash.com/photo-1509551388413-e18d0ac5d493?w=600', tag: 'Sustainable', specs: 'GOTS Certified' },
];

const makerCollections = [
  { id: 101, title: 'Bulk Cotton Orders', count: '12 Requests', image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=600', tag: 'High Volume', specs: 'MOQ: 500+ units' },
  { id: 102, title: 'Technical Outerwear', count: '8 Projects', image: 'https://images.unsplash.com/photo-1559582798-678dfc71ccd9?w=600', tag: 'Complex Build', specs: 'Bonded Fabrics' },
  { id: 103, title: 'Premium Denim Run', count: '5 Batches', image: 'https://images.unsplash.com/photo-1582552966377-98e490e940d4?w=600', tag: 'Sourcing Needed', specs: 'Japanese Mills' },
  { id: 104, title: 'Sustainable Dyeing', count: '20 Jobs', image: 'https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?w=600', tag: 'Eco-Friendly', specs: 'Low Water Usage' },
];

const Collections = () => {
  const navigate = useNavigate();
  // Default to 'brand' but allow switching
  const [viewMode, setViewMode] = useState('brand'); 
  const [activeFilter, setActiveFilter] = useState('All');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const data = viewMode === 'brand' ? brandCollections : makerCollections;
  const filters = viewMode === 'brand' 
    ? ['All', 'Best Seller', 'New Drop', 'Sustainable'] 
    : ['All', 'High Volume', 'Complex Build', 'Sourcing'];

  const filteredData = activeFilter === 'All' 
    ? data 
    : data.filter(item => item.tag === activeFilter);

  const handleExplore = () => {
    setShowAuthModal(true);
  };

  const handleLoginRedirect = () => {
    setShowAuthModal(false);
    navigate('/login');
  };

  const handleSignupRedirect = () => {
    setShowAuthModal(false);
    navigate('/signup');
  };

  return (
    <div className={styles.container}>
      {/* Auth Modal Overlay */}
      {showAuthModal && (
        <div className={styles.modalOverlay} onClick={() => setShowAuthModal(false)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeModal} onClick={() => setShowAuthModal(false)}>✕</button>
            <h2 className={styles.modalTitle}>Access the Infrastructure</h2>
            <p className={styles.modalText}>
              {viewMode === 'brand' 
                ? "Create a brand account to view tech packs, check real-time stock, and start production runs." 
                : "Join as a Maker to see factory capacity, bid on production requests, and manage orders."}
            </p>
            <div className={styles.modalActions}>
              <button className={styles.modalBtnSecondary} onClick={handleLoginRedirect}>Log In</button>
              <button className={styles.modalBtnPrimary} onClick={handleSignupRedirect}>
                {viewMode === 'brand' ? 'Start Brand Account' : 'Apply as Maker'}
              </button>
            </div>
          </div>
        </div>
      )}

      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>
            {viewMode === 'brand' ? 'Brand Collections' : 'Maker Opportunities'}
          </h1>
          <p className={styles.subtitle}>
            {viewMode === 'brand' 
              ? 'Curated blanks and components ready for your next drop.' 
              : 'Active production requests and sourcing needs from top brands.'}
          </p>
        </div>

        {/* Dual Path Toggle */}
        <div className={styles.modeToggle}>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'brand' ? styles.active : ''}`}
            onClick={() => { setViewMode('brand'); setActiveFilter('All'); }}
          >
            For Brands
          </button>
          <button 
            className={`${styles.toggleBtn} ${viewMode === 'maker' ? styles.active : ''}`}
            onClick={() => { setViewMode('maker'); setActiveFilter('All'); }}
          >
            For Makers
          </button>
        </div>
      </header>

      {/* Filters */}
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

      {/* Grid */}
      <div className={styles.grid}>
        {filteredData.map((item) => (
          <div key={item.id} className={styles.card}>
            <div className={styles.imageWrapper}>
              <img src={item.image} alt={item.title} loading="lazy" />
              <div className={styles.overlay}>
                <span className={styles.tag}>{item.tag}</span>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.metaRow}>
                <h3 className={styles.cardTitle}>{item.title}</h3>
                <span className={styles.count}>{item.count}</span>
              </div>
              <p className={styles.specs}>{item.specs}</p>
              <button className={styles.exploreBtn} onClick={handleExplore}>
                {viewMode === 'brand' ? 'View Tech Pack →' : 'Bid on Project →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Collections;