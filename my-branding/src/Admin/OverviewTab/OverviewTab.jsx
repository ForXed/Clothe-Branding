import React, { useState, useEffect } from 'react';
import styles from './OverviewTab.module.css';

const OverviewTab = () => {
  // Calendar State
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
  const [endDate, setEndDate] = useState(new Date());
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Helper: Format Date for Display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Helper: Generate Calendar Days
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const days = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    return { days, firstDay };
  };

  const { days, firstDay } = getDaysInMonth(currentMonth);

  // Handle Day Click
  const handleDayClick = (day) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    
    if (!startDate || (startDate && endDate)) {
      // Start new selection
      setStartDate(clickedDate);
      setEndDate(null);
    } else if (clickedDate < startDate) {
      // Clicked before start, make it new start
      setStartDate(clickedDate);
    } else {
      // Complete range
      setEndDate(clickedDate);
      setIsCalendarOpen(false);
    }
  };

  // Quick Presets
  const applyPreset = (daysAgo) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - daysAgo);
    setStartDate(start);
    setEndDate(end);
    setIsCalendarOpen(false);
  };

  // Mock Data
  const stats = [
    { 
      id: 1, label: 'Total Revenue', value: '$48,295.00', trend: '+12.5%', isPositive: true,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
    },
    { 
      id: 2, label: 'Total Orders', value: '1,482', trend: '+8.2%', isPositive: true,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
    },
    { 
      id: 3, label: 'Active Makers', value: '342', trend: '+4.1%', isPositive: true,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
    },
    { 
      id: 4, label: 'Pending Verifications', value: '18', trend: '-2.4%', isPositive: false,
      icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
    },
  ];

  const recentActivities = [
    { id: 1, type: 'order', text: 'New order #BRU-9921 received ($120.00)', time: '2 mins ago' },
    { id: 2, type: 'maker', text: 'New maker application from "UrbanThread"', time: '15 mins ago' },
    { id: 3, type: 'alert', text: 'Dispute opened for Order #BRU-9800', time: '1 hour ago' },
    { id: 4, type: 'system', text: 'Daily backup completed successfully', time: '3 hours ago' },
    { id: 5, type: 'order', text: 'Payout processed for Maker ID #442', time: '5 hours ago' },
  ];

  return (
    <div className={styles.container}>
      
      {/* Header with Custom Calendar UI */}
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Dashboard Overview</h2>
          <p className={styles.pageSubtitle}>Real-time platform metrics and activity</p>
        </div>
        
        <div className={styles.calendarWrapper}>
          <button 
            className={styles.dateTrigger} 
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            type="button"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>{formatDate(startDate)} - {endDate ? formatDate(endDate) : '...'}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>

          {/* Calendar Popover */}
          {isCalendarOpen && (
            <div className={styles.calendarPopover}>
              <div className={styles.calendarHeader}>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))} type="button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span>{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                <button onClick={() => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))} type="button">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
              
              <div className={styles.calendarGrid}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                  <div key={d} className={styles.calDayName}>{d}</div>
                ))}
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className={styles.calDayEmpty}></div>
                ))}
                {Array.from({ length: days }).map((_, i) => {
                  const day = i + 1;
                  const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                  const isSelected = (startDate && currentDate.getTime() === startDate.getTime()) || (endDate && currentDate.getTime() === endDate.getTime());
                  const inRange = startDate && endDate && currentDate > startDate && currentDate < endDate;
                  
                  return (
                    <button 
                      key={day} 
                      className={`${styles.calDay} ${isSelected ? styles.selected : ''} ${inRange ? styles.inRange : ''}`}
                      onClick={() => handleDayClick(day)}
                      type="button"
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className={styles.calendarPresets}>
                <span>Quick Select:</span>
                <div className={styles.presetButtons}>
                  <button onClick={() => applyPreset(7)} type="button">Last 7 Days</button>
                  <button onClick={() => applyPreset(30)} type="button">Last 30 Days</button>
                  <button onClick={() => applyPreset(90)} type="button">Last 90 Days</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.id} className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statTitle}>{stat.label}</span>
              <div className={`${styles.statIcon} ${stat.id === 1 ? styles.revenue : stat.id === 2 ? styles.orders : stat.id === 3 ? styles.users : styles.makers}`}>
                {stat.icon}
              </div>
            </div>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={`${styles.statTrend} ${stat.isPositive ? styles.trendUp : styles.trendDown}`}>
              {stat.isPositive ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline></svg>
              )}
              <span>{stat.trend} vs last period</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content: Chart & Actions */}
      <div className={styles.mainContent}>
        <div className={styles.chartSection}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Revenue Analytics</h3>
            <button className={styles.viewReportBtn}>View Full Report</button>
          </div>
          <div className={styles.chartPlaceholder}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="20" x2="18" y2="10"></line>
              <line x1="12" y1="20" x2="12" y2="4"></line>
              <line x1="6" y1="20" x2="6" y2="14"></line>
            </svg>
            <p>Detailed Revenue Visualization Module</p>
            <span className={styles.hint}>Component loading...</span>
          </div>
        </div>

        <div className={styles.sidePanel}>
          <div className={styles.actionsCard}>
            <h3 className={styles.sectionTitle}>Quick Actions</h3>
            <div className={styles.actionGrid}>
              <button className={styles.actionBtn}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>Add Admin</button>
              <button className={styles.actionBtn}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>Edit Policies</button>
              <button className={styles.actionBtn}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>Upload Asset</button>
              <button className={styles.actionBtn}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>Send Broadcast</button>
            </div>
          </div>

          <div className={styles.statusCard}>
            <h3 className={styles.sectionTitle}>System Health</h3>
            <div className={styles.statusItem}><span className={styles.statusLabel}>API Status</span><span className={`${styles.statusBadge} ${styles.statusOk}`}>Operational</span></div>
            <div className={styles.statusItem}><span className={styles.statusLabel}>Database Load</span><span className={`${styles.statusBadge} ${styles.statusOk}`}>12%</span></div>
            <div className={styles.statusItem}><span className={styles.statusLabel}>Storage</span><span className={`${styles.statusBadge} ${styles.statusWarn}`}>78% Used</span></div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className={styles.activitySection}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Recent Activity</h3>
          <button className={styles.textBtn}>View All Logs</button>
        </div>
        <div className={styles.activityList}>
          {recentActivities.map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={`${styles.activityIcon} ${activity.type === 'order' ? styles.order : activity.type === 'maker' ? styles.user : activity.type === 'alert' ? styles.alert : styles.system}`}>
                {activity.type === 'order' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>}
                {activity.type === 'maker' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>}
                {activity.type === 'alert' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>}
                {activity.type === 'system' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>}
              </div>
              <div className={styles.activityContent}>
                <p className={styles.activityText}>{activity.text}</p>
                <span className={styles.activityTime}>{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;