import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OverView.module.css';

const OverView = ({ overview, products, orders, user, loading }) => {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState('7d');

  // Mock chart data generator (In real app, this fetches based on activePeriod)
  const getChartData = (period) => {
    // This is mock logic. In real app, you'd filter data here.
    return [
      { day: 'Mon', value: 4200 },
      { day: 'Tue', value: 3800 },
      { day: 'Wed', value: 5100 },
      { day: 'Thu', value: 4700 },
      { day: 'Fri', value: 6200 },
      { day: 'Sat', value: 7800 },
      { day: 'Sun', value: 5400 },
    ];
  };

  const chartData = getChartData(activePeriod);
  const maxValue = Math.max(...chartData.map(d => d.value));

  const stats = [
    { 
      label: 'Total Revenue', 
      value: `$${(overview?.revenue || 0).toLocaleString()}`, 
      change: '+23%',
      positive: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="12" y1="1" x2="12" y2="23"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
      )
    },
    { 
      label: 'Total Orders', 
      value: overview?.totalOrders || 0, 
      change: '+12%',
      positive: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
          <line x1="3" y1="9" x2="21" y2="9"/>
          <line x1="9" y1="21" x2="9" y2="9"/>
        </svg>
      )
    },
    { 
      label: 'Products', 
      value: overview?.totalProducts || 0, 
      change: '+3',
      positive: true,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
        </svg>
      )
    },
    { 
      label: 'Total Views', 
      value: `${((overview?.totalViews || 0) / 1000).toFixed(1)}K`, 
      change: '-5%',
      positive: false,
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
          <circle cx="12" cy="12" r="3"/>
        </svg>
      )
    },
  ];

  const recentOrders = orders?.slice(0, 5) || []; // Take first 5 orders

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading Infrastructure...</p>
        </div>
      </div>
    );
  }

  // Default user data if not provided
  const currentUser = user || {
    name: 'Aura Studio',
    email: 'hello@aurastudio.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100'
  };

  return (
    <div className={styles.container}>
      {/* Header with Profile */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Dashboard</h2>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>
        
        {/* UPDATED DYNAMIC PROFILE SECTION */}
        <button className={styles.profileSection} onClick={() => navigate('/studio/settings')}>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{currentUser.name}</span>
            <span className={styles.profileEmail}>{currentUser.email}</span>
          </div>
          <div className={styles.profileAvatar}>
            <img 
              src={currentUser.avatar} 
              alt="Profile" 
              className={styles.avatarImg}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/100'; }} // Fallback image
            />
            <div className={styles.statusDot} title="Online"></div>
          </div>
        </button>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div key={idx} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statIcon}>{stat.icon}</span>
              <span className={`${styles.change} ${stat.positive ? styles.positive : styles.negative}`}>
                {stat.change}
              </span>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className={styles.chartSection}>
        <div className={styles.chartHeader}>
          <div>
            <h3>Revenue Overview</h3>
            <p>Your revenue for the selected period</p>
          </div>
          <div className={styles.chartActions}>
            <div className={styles.periodToggle}>
              {['24h', '7d', '30d', '90d'].map(period => (
                <button
                  key={period}
                  className={`${styles.periodBtn} ${activePeriod === period ? styles.active : ''}`}
                  onClick={() => setActivePeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>
            <button className={styles.fullReportBtn} onClick={() => navigate('/studio/analytics')}>
              View Full Report
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
        
        <div className={styles.chart}>
          <div className={styles.chartBars}>
            {chartData.map((item, idx) => (
              <div key={idx} className={styles.barContainer}>
                <div 
                  className={styles.bar} 
                  style={{ height: `${(item.value / maxValue) * 100}%` }}
                >
                  <span className={styles.barValue}>${item.value.toLocaleString()}</span>
                </div>
                <span className={styles.barLabel}>{item.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className={styles.twoColumn}>
        {/* Recent Orders - DYNAMIC */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Recent Orders</h3>
            <button className={styles.viewAll} onClick={() => navigate('/studio/orders')}>
              View All
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
          <div className={styles.ordersList}>
            {recentOrders.length > 0 ? recentOrders.map(order => (
              <div key={order.id} className={styles.orderRow}>
                <div className={styles.orderInfo}>
                  <span className={styles.orderId}>#{order.id}</span>
                  <span className={styles.customer}>{order.customer}</span>
                </div>
                
                {/* Dynamic Product Display */}
                <div className={styles.productCell}>
                  {order.productImage && (
                    <img src={order.productImage} alt={order.productName} className={styles.orderProductImg} />
                  )}
                  <span className={styles.productName}>{order.productName}</span>
                </div>

                <span className={styles.amount}>${order.amount}</span>
                <span className={`${styles.orderStatus} ${styles[order.status]}`}>
                  {order.status}
                </span>
              </div>
            )) : (
              <div className={styles.emptyState}>No recent orders found.</div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            <button className={styles.quickBtn} onClick={() => navigate('/studio/add-product')}>
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <span>Add Product</span>
            </button>
            <button className={styles.quickBtn} onClick={() => navigate('/studio/orders')}>
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                </svg>
              </div>
              <span>Orders</span>
            </button>
            <button className={styles.quickBtn} onClick={() => navigate('/studio/messages')}>
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
                </svg>
              </div>
              <span>Messages</span>
              <span className={styles.msgBadge}>2</span>
            </button>
            <button className={styles.quickBtn} onClick={() => navigate('/studio/transactions')}>
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="1" x2="12" y2="23"/>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <span>Sales</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverView;