import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './ProfileView.module.css';

const ProfileView = ({ userAvatar, setUserAvatar, onProductClick }) => {
  const { makerId } = useParams();
  const navigate = useNavigate();
  
  const currentMakerId = makerId || 'me';
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  // Mock Database
  const MAKERS_DB = {
    'julian-v-studio': {
      id: 'julian-v-studio',
      name: "Julian V.",
      handle: "@julianv_studio",
      bio: "Creative director specializing in heavyweight blanks & techwear aesthetics. Based in Berlin. Available for custom production runs ranging from 50-500 units.",
      location: "Berlin, DE",
      joined: "2023",
      stats: { products: 6, rating: 4.9, sales: 128, responseTime: "2h" },
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
      cover: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
      verified: true,
      products: [
        { id: 101, title: "450GSM Heavyweight Tee", price: "$89", category: "Tees", stock: 45, img: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400" },
        { id: 102, title: "Techwear Cargo V2", price: "$145", category: "Bottoms", stock: 12, img: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400" },
        { id: 103, title: "Oversized Hoodie - Black", price: "$120", category: "Layering", stock: 8, img: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400" },
        { id: 104, title: "Structured Cap", price: "$45", category: "Accessories", stock: 120, img: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400" },
      ]
    },
    'me': {
      id: 'me',
      name: "My Profile",
      handle: "@my_brand",
      bio: "You haven't set up your maker profile yet. Go to Settings to upgrade!",
      location: "Unknown",
      joined: "2024",
      stats: { products: 0, rating: 0, sales: 0 },
      avatar: userAvatar,
      verified: false,
      products: []
    }
  };

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const data = MAKERS_DB[currentMakerId] || MAKERS_DB['julian-v-studio'];
      setProfileData(data);
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [currentMakerId, userAvatar]);

  const handleProductClick = (product) => {
    if (onProductClick) onProductClick(product);
  };

  // Direct Navigation Handler to Chat
  const handleContactMaker = () => {
    if (!profileData) return;
    
    // CRITICAL FIX: Force scroll to top BEFORE navigation
    // This prevents the Chat Room from inheriting the Profile's scroll position
    window.scrollTo(0, 0);
    document.body.scrollTop = 0; // For Safari
    
    // Small delay ensures the scroll happens before React Router changes the view
    setTimeout(() => {
      navigate('/platform/chat', { 
        state: { 
          newConversation: {
            id: profileData.id, 
            name: profileData.name,
            avatar: profileData.avatar,
            role: profileData.location, 
            initialMessage: `Hi ${profileData.name.split(' ')[0]}, I'm interested in your work.`
          }
        } 
      });
    }, 50); // Increased delay slightly to ensure scroll registers
  };

  if (loading) {
    return (
      <div className={styles.loadingState}>
        <div className={styles.spinner}></div>
        <p>Loading Infrastructure...</p>
      </div>
    );
  }

  if (!profileData) return null;

  const isOwnProfile = currentMakerId === 'me';
  const catalog = profileData.products;

  return (
    <div className={styles.profileContainer}>
      <div className={styles.coverBackground} style={{ backgroundImage: `url(${profileData.cover || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200'})` }} />
      
      <div className={styles.container}>
        {/* --- MAKER HEADER --- */}
        <div className={styles.makerHeader}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {profileData.avatar ? (
                <img src={profileData.avatar} alt={profileData.name} className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
              )}
            </div>
            
            {!isOwnProfile && profileData.verified && (
              <div className={styles.verifiedBadge} title="Verified Maker">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
            )}
          </div>

          <div className={styles.infoSection}>
            <div className={styles.nameRow}>
              <h1 className={styles.makerName}>{profileData.name}</h1>
              {!isOwnProfile && profileData.verified && (
                 <span className={styles.verifiedText}>Verified</span>
              )}
            </div>
            <span className={styles.makerHandle}>{profileData.handle}</span>
            
            <p className={styles.makerBio}>{profileData.bio}</p>
            
            <div className={styles.metaRow}>
              <span className={styles.metaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                {profileData.location}
              </span>
              <span className={styles.metaDivider}>•</span>
              <span className={styles.metaItem}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                Joined {profileData.joined}
              </span>
              {!isOwnProfile && (
                <>
                  <span className={styles.metaDivider}>•</span>
                  <span className={styles.metaItem}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                    Resp. {profileData.stats.responseTime}
                  </span>
                </>
              )}
            </div>

            <div className={styles.statsRow}>
              <div className={styles.stat}>
                <strong>{profileData.stats.products}</strong>
                <span>Products</span>
              </div>
              <div className={styles.stat}>
                <strong>{profileData.stats.rating > 0 ? profileData.stats.rating : '-'}</strong>
                <span>Rating</span>
              </div>
              <div className={styles.stat}>
                <strong>{profileData.stats.sales}</strong>
                <span>Sales</span>
              </div>
            </div>

            {!isOwnProfile && (
              <div className={styles.actionRow}>
                <button 
                  className={styles.messageBtn}
                  onClick={handleContactMaker}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
                  </svg>
                  Contact Maker
                </button>
              </div>
            )}
          </div>
        </div>

        {/* --- PRODUCT CATALOG --- */}
        <div className={styles.catalogSection}>
          <div className={styles.sectionHeader}>
            <h2>Available Infrastructure</h2>
            <span className={styles.itemCount}>{catalog.length} items</span>
          </div>

          {catalog.length === 0 ? (
            <div className={styles.emptyCatalog}>
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{opacity: 0.3, marginBottom: '16px'}}>
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
              </svg>
              <p>No products available yet.</p>
              {isOwnProfile && (
                <button className={styles.setupBtn} onClick={() => navigate('/studio')}>
                  Setup Your Studio
                </button>
              )}
            </div>
          ) : (
            <div className={styles.productGrid}>
              {catalog.map(product => (
                <div 
                  key={product.id} 
                  className={styles.productCard}
                  onClick={() => handleProductClick(product)}
                >
                  <div className={styles.productImage}>
                    <img src={product.img} alt={product.title} loading="lazy" />
                    <div className={styles.cardOverlay}>
                      <button className={styles.overlayBtn} title="Quick View">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </div>
                    {product.stock < 20 && (
                      <span className={styles.stockTag}>Low Stock ({product.stock})</span>
                    )}
                  </div>
                  <div className={styles.productDetails}>
                    <div className={styles.productCategory}>{product.category}</div>
                    <h3 className={styles.productTitle}>{product.title}</h3>
                    <div className={styles.productFooter}>
                      <span className={styles.productPrice}>{product.price}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileView;