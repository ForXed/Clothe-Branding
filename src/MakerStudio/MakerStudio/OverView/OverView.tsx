import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './OverView.module.css';

interface OverviewData {
  revenue?: number;
  totalOrders?: number;
  totalProducts?: number;
  totalViews?: number;
}

interface UserData {
  name: string;
  email: string;
  avatar: string;
  verified?: boolean;
  status?: 'online' | 'away' | 'offline';
}

interface OrderData {
  id: string;
  customer: string;
  productImage?: string;
  productName?: string;
  amount: number;
  status: string;
  date?: string;
}

interface ChartItem {
  day: string;
  value: number;
}

interface OverViewProps {
  overview?: OverviewData;
  products?: any[];
  orders?: OrderData[];
  user?: UserData;
  loading?: boolean;
  unreadMessages?: number;
}

const OverView: React.FC<OverViewProps> = ({ 
  overview, 
  products, 
  orders, 
  user, 
  loading,
  unreadMessages = 0 
}) => {
  const navigate = useNavigate();
  const [activePeriod, setActivePeriod] = useState<'24h' | '7d' | '30d' | '90d'>('7d');

  // 🎯 Chart data now actually changes based on period
  const chartData = useMemo((): ChartItem[] => {
    switch (activePeriod) {
      case '24h':
        return Array.from({ length: 12 }, (_, i) => ({
          day: `${(i * 2).toString().padStart(2, '0')}:00`,
          value: Math.floor(Math.random() * 5000) + 1000
        }));
      case '7d':
        return [
          { day: 'Mon', value: 42000 }, 
          { day: 'Tue', value: 38000 }, 
          { day: 'Wed', value: 51000 },
          { day: 'Thu', value: 47000 }, 
          { day: 'Fri', value: 62000 }, 
          { day: 'Sat', value: 78000 }, 
          { day: 'Sun', value: 54000 }
        ];
      case '30d':
        return Array.from({ length: 15 }, (_, i) => ({
          day: `Day ${i * 2 + 1}`,
          value: Math.floor(Math.random() * 15000) + 5000
        }));
      case '90d':
        return [
          { day: 'Month 1', value: 450000 }, 
          { day: 'Month 2', value: 620000 }, 
          { day: 'Month 3', value: 780000 }
        ];
      default:
        return [];
    }
  }, [activePeriod]);

  const maxValue = useMemo(() => Math.max(...chartData.map(d => d.value)), [chartData]);

  // 🇳🇬 Fixed currency to Naira
  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  const stats = [
    { 
      label: 'Total Revenue', 
      value: formatCurrency(overview?.revenue || 0), 
      change: '+23%', 
      positive: true, 
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>),
      onClick: () => navigate('/studio/transactions')
    },
    { 
      label: 'Total Orders', 
      value: overview?.totalOrders || 0, 
      change: '+12%', 
      positive: true, 
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="22" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/></svg>),
      onClick: () => navigate('/studio/orders')
    },
    { 
      label: 'Products', 
      value: overview?.totalProducts || 0, 
      change: '+3', 
      positive: true, 
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>),
      onClick: () => navigate('/studio/products')
    },
    { 
      label: 'Total Views', 
      value: `${((overview?.totalViews || 0) / 1000).toFixed(1)}K`, 
      change: '-5%', 
      positive: false, 
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
      onClick: () => navigate('/studio/analytics')
    },
  ];

  const recentOrders = orders?.slice(0, 5) || [];

  // 📅 Format order dates
  const formatOrderDate = (dateString?: string): string => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

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

  const currentUser: UserData = user || { 
    name: 'Aura Studio', 
    email: 'hello@aurastudio.com', 
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    verified: true,
    status: 'online'
  };

  return (
    <div className={styles.container}>
      {/* Header with Simple Profile Display */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2>Dashboard</h2>
          <p>Welcome back! Here's what's happening with your store.</p>
        </div>
        
        {/* 🎨 Simple Profile Display - No Dropdown */}
        <div 
          className={styles.profileSection}
          onClick={() => navigate('/studio/settings')}
          role="button"
          tabIndex={0}
          aria-label="Go to settings"
        >
          <div className={styles.profileAvatar}>
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name} 
              className={styles.avatarImg} 
              onError={(e) => { 
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100'; 
              }} 
            />
            {/* Status dot */}
            <div 
              className={`${styles.statusDot} ${styles[currentUser.status || 'online']}`}
              title={currentUser.status || 'Online'}
            />
            {/* Verification badge */}
            {currentUser.verified && (
              <div className={styles.verifiedBadge} title="Verified Maker">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
            )}
          </div>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>{currentUser.name}</span>
            <span className={styles.profileStatus}>
              {currentUser.status === 'online' ? '● Online' : 
               currentUser.status === 'away' ? '● Away' : '● Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid - Now clickable */}
      <div className={styles.statsGrid}>
        {stats.map((stat, idx) => (
          <div 
            key={idx} 
            className={styles.statCard}
            onClick={stat.onClick}
            role="button"
            tabIndex={0}
          >
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
                  type="button" 
                  className={`${styles.periodBtn} ${activePeriod === period ? styles.active : ''}`}
                  onClick={() => setActivePeriod(period as any)}
                  aria-label={`Show ${period} data`}
                  aria-pressed={activePeriod === period}
                >
                  {period}
                </button>
              ))}
            </div>
            <button 
              type="button" 
              className={styles.fullReportBtn} 
              onClick={() => navigate('/studio/analytics')}
            >
              View Full Report
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </div>
        </div>
        
        {/* Empty state for chart */}
        {chartData.length === 0 ? (
          <div className={styles.emptyChart}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M3 3v18h18"/>
              <path d="M7 16l4-4 4 4 5-5"/>
            </svg>
            <p>No revenue data for this period</p>
          </div>
        ) : (
          <div className={styles.chart}>
            <div className={styles.chartBars}>
              {chartData.map((item, idx) => (
                <div key={idx} className={styles.barContainer}>
                  <div 
                    className={styles.bar} 
                    style={{ height: `${(item.value / maxValue) * 100}%` }}
                    role="img"
                    aria-label={`${item.day}: ${formatCurrency(item.value)}`}
                  >
                    <span className={styles.barValue}>{formatCurrency(item.value)}</span>
                  </div>
                  <span className={styles.barLabel}>{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className={styles.twoColumn}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Recent Orders</h3>
            <button 
              type="button" 
              className={styles.viewAll} 
              onClick={() => navigate('/studio/orders')}
            >
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
                  <span className={styles.orderDate}>{formatOrderDate(order.date)}</span>
                </div>
                <div className={styles.productCell}>
                  {order.productImage && (
                    <img 
                      src={order.productImage} 
                      alt={order.productName} 
                      className={styles.orderProductImg} 
                    />
                  )}
                  <div className={styles.productDetails}>
                    <span className={styles.customer}>{order.customer}</span>
                    <span className={styles.productName}>{order.productName}</span>
                  </div>
                </div>
                <span className={styles.amount}>{formatCurrency(order.amount)}</span>
                <span className={`${styles.orderStatus} ${styles[order.status]}`}>
                  {order.status}
                </span>
              </div>
            )) : (
              <div className={styles.emptyState}>
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                </svg>
                <p>No recent orders found</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Quick Actions</h3>
          </div>
          <div className={styles.quickActions}>
            <button 
              type="button" 
              className={styles.quickBtn} 
              onClick={() => navigate('/studio/add-product')}
            >
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
              </div>
              <span>Add Product</span>
            </button>
            <button 
              type="button" 
              className={styles.quickBtn} 
              onClick={() => navigate('/studio/orders')}
            >
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="3" width="22" height="18" rx="2" ry="2"/>
                  <line x1="3" y1="9" x2="21" y2="9"/>
                </svg>
              </div>
              <span>Orders</span>
            </button>
            <button 
              type="button" 
              className={styles.quickBtn} 
              onClick={() => navigate('/studio/messages')}
            >
              <div className={styles.quickIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-14 8.38 8.38 0 0 1 3.8.9L21 3z"/>
                </svg>
              </div>
              <span>Messages</span>
              {unreadMessages > 0 && (
                <span className={styles.msgBadge}>{unreadMessages}</span>
              )}
            </button>
            <button 
              type="button" 
              className={styles.quickBtn} 
              onClick={() => navigate('/studio/transactions')}
            >
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