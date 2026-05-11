import React, { useState, useMemo } from 'react';
import styles from './Analytics.module.css';

// Mock Data Generator
const generateData = (period) => {
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 12;
  const labels = period === '12m' 
    ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    : Array.from({ length: days }, (_, i) => period === '7d' ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i] : `Day ${i + 1}`);
  
  const baseRevenue = period === '12m' ? 5000 : 1000;
  
  return {
    labels,
    revenue: Array.from({ length: days }, () => Math.floor(Math.random() * baseRevenue) + (baseRevenue / 2)),
    cost: Array.from({ length: days }, () => Math.floor(Math.random() * (baseRevenue * 0.4))),
    visitors: Array.from({ length: days }, () => Math.floor(Math.random() * 2000) + 500),
    orders: Array.from({ length: days }, () => Math.floor(Math.random() * 50) + 10),
  };
};

const Analytics = () => {
  const [period, setPeriod] = useState('7d');
  const [viewMode, setViewMode] = useState('revenue');
  const data = useMemo(() => generateData(period), [period]);

  // Calculate KPIs
  const totalRevenue = data.revenue.reduce((a, b) => a + b, 0);
  const totalCost = data.cost.reduce((a, b) => a + b, 0);
  const totalProfit = totalRevenue - totalCost;
  const totalOrders = data.orders.reduce((a, b) => a + b, 0);
  
  const displayValue = viewMode === 'revenue' ? totalRevenue : totalProfit;
  const avgOrderValue = totalRevenue / totalOrders || 0;
  const conversionRate = ((totalOrders / data.visitors.reduce((a, b) => a + b, 0)) * 100).toFixed(2);

  const lowStockItems = [
    { id: 1, name: "Oversized 'Brut' Tee", stock: 3, threshold: 5 },
    { id: 2, name: "Technical Vest", stock: 2, threshold: 5 },
  ];

  const topProducts = [
    { id: 1, name: "Oversized 'Brut' Tee", sales: 124, revenue: 5580, growth: 12 },
    { id: 2, name: "Infrastructure Hoodie", sales: 89, revenue: 7565, growth: -5 },
    { id: 3, name: "Essential Cargo", sales: 210, revenue: 19950, growth: 24 },
    { id: 4, name: "Technical Vest", sales: 34, revenue: 4590, growth: 8 },
  ];

  const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1>Advanced Analytics</h1>
          <p>Real-time infrastructure performance metrics.</p>
        </div>
        
        <div className={styles.headerControls}>
          <button className={styles.exportBtn} onClick={() => alert("Downloading CSV...")}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span>Export</span>
          </button>

          <div className={styles.periodToggle}>
            {['7d', '30d', '12m'].map(p => (
              <button
                key={p}
                className={`${styles.toggleBtn} ${period === p ? styles.active : ''}`}
                onClick={() => setPeriod(p)}
              >
                {p === '7d' ? 'Last 7 Days' : p === '30d' ? 'Last 30 Days' : 'Last 12 Months'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className={styles.alertBanner}>
          <div className={styles.alertIcon}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <div className={styles.alertContent}>
            <strong>Restock Needed:</strong> 
            <span>{lowStockItems.map(i => i.name).join(', ')} are running low.</span>
          </div>
          <button className={styles.alertAction} onClick={() => alert("Navigate to Products")}>
            Manage Stock
          </button>
        </div>
      )}

      {/* KPI Grid */}
      <div className={styles.kpiGrid}>
        <KPICard 
          title={viewMode === 'revenue' ? "Total Revenue" : "Total Profit"}
          value={fmt(displayValue)}
          trend="+12.5%" 
          positive={true}
          icon={<CurrencyIcon />}
        />
        <KPICard 
          title="Avg Order Value" 
          value={fmt(avgOrderValue)} 
          trend="+3.2%" 
          positive={true}
          icon={<CartIcon />}
        />
        <KPICard 
          title="Conversion Rate" 
          value={`${conversionRate}%`} 
          trend="-0.4%" 
          positive={false}
          icon={<EyeIcon />}
        />
        <KPICard 
          title="Total Orders" 
          value={totalOrders.toLocaleString()} 
          trend="+8.1%" 
          positive={true}
          icon={<BoxIcon />}
        />
      </div>

      {/* Main Chart Section */}
      <div className={styles.chartSection}>
        <div className={styles.sectionHeader}>
          <h3>Performance Overview</h3>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'revenue' ? styles.active : ''}`}
              onClick={() => setViewMode('revenue')}
            >
              Revenue
            </button>
            <button 
              className={`${styles.viewBtn} ${viewMode === 'profit' ? styles.active : ''}`}
              onClick={() => setViewMode('profit')}
            >
              Profit
            </button>
          </div>
        </div>
        
        <div className={styles.chartContainer}>
          <ResponsiveLineChart 
            data={viewMode === 'revenue' ? data.revenue : data.revenue.map((r, i) => r - data.cost[i])} 
            labels={data.labels} 
            color="var(--brut-text)" 
          />
        </div>
      </div>

      {/* Two Column Layout */}
      <div className={styles.twoColumn}>
        {/* Top Products */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Top Performing Products</h3>
            <button className={styles.viewAll} onClick={() => alert("View Full Report")}>View Report</button>
          </div>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Sales</th>
                  <th>Revenue</th>
                  <th>Growth</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map(product => (
                  <tr key={product.id}>
                    <td>
                      <div className={styles.productCell}>
                        <div className={styles.thumb}></div>
                        <span>{product.name}</span>
                      </div>
                    </td>
                    <td>{product.sales}</td>
                    <td>${product.revenue.toLocaleString()}</td>
                    <td>
                      <span className={`${styles.growth} ${product.growth >= 0 ? styles.positive : styles.negative}`}>
                        {product.growth > 0 ? '+' : ''}{product.growth}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Traffic Sources with NEW Colors */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h3>Traffic Sources</h3>
          </div>
          <div className={styles.donutContainer}>
            <CustomDonutChart />
            <div className={styles.donutLegend}>
              <div className={styles.legendRow}>
                {/* Electric Blue */}
                <span className={styles.colorDot} style={{ background: '#3b82f6' }}></span>
                <span>Direct (45%)</span>
              </div>
              <div className={styles.legendRow}>
                {/* Vibrant Violet */}
                <span className={styles.colorDot} style={{ background: '#8b5cf6' }}></span>
                <span>Social (30%)</span>
              </div>
              <div className={styles.legendRow}>
                {/* Bright Amber */}
                <span className={styles.colorDot} style={{ background: '#f59e0b' }}></span>
                <span>Search (25%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Sub-Components ---

const KPICard = ({ title, value, trend, positive, icon }) => (
  <div className={styles.kpiCard}>
    <div className={styles.kpiHeader}>
      <span className={styles.kpiIcon}>{icon}</span>
      <span className={`${styles.trend} ${positive ? styles.positive : styles.negative}`}>
        {trend}
      </span>
    </div>
    <div className={styles.kpiValue}>{value}</div>
    <div className={styles.kpiLabel}>{title}</div>
  </div>
);

const ResponsiveLineChart = ({ data, labels, color }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const max = Math.max(...data) * 1.1;
  
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  const fmt = (num) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(num);

  return (
    <div className={styles.lineChartWrapper}>
      {hoveredIndex !== null && (
        <div className={styles.tooltip} style={{ left: `${(hoveredIndex / (data.length - 1)) * 100}%` }}>
          <span className={styles.tooltipValue}>{fmt(data[hoveredIndex])}</span>
          <span className={styles.tooltipLabel}>{labels[hoveredIndex]}</span>
        </div>
      )}

      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className={styles.svgChart}>
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${points} 100,100`} fill="url(#chartGradient)" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
        
        {data.map((_, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - (data[i] / max) * 100;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="4"
              fill="transparent"
              onMouseEnter={() => setHoveredIndex(i)}
              onTouchStart={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={styles.hitSpot}
            />
          );
        })}
      </svg>

      <div className={styles.xLabels}>
        {labels.map((label, i) => (
          <span key={i} className={`${styles.xLabel} ${i === 0 || i === labels.length - 1 ? styles.visible : styles.hideMobile}`}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

// Updated Donut Chart with Vibrant Colors
const CustomDonutChart = () => (
  <div className={styles.donutChart}>
    <svg viewBox="0 0 36 36" className={styles.svgDonut}>
      {/* Grey Background Track */}
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#eee" strokeWidth="4" />
      
      {/* Direct - Electric Blue (45%) */}
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#3b82f6" strokeWidth="4" strokeDasharray="45, 100" />
      
      {/* Social - Vibrant Violet (30%) - Starts after 45% */}
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#8b5cf6" strokeWidth="4" strokeDasharray="30, 100" strokeDashoffset="-45" />
      
      {/* Search - Bright Amber (25%) - Starts after 75% (45+30) */}
      <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="25, 100" strokeDashoffset="-75" />
    </svg>
    <div className={styles.donutCenter}>
      <span>100%</span>
    </div>
  </div>
);

// Icons
const CurrencyIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
const CartIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>;
const EyeIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const BoxIcon = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>;

export default Analytics;