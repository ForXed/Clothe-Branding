import React from 'react';

/**
 * Shown while a route's chunk downloads. Once the chunk is cached, later navigations to
 * that section render immediately, so this mostly appears on a first visit.
 */
const RouteFallback: React.FC = () => (
  <div
    role="status"
    aria-live="polite"
    style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      color: '#64748b',
      fontFamily: 'inherit',
    }}
  >
    <span
      style={{
        width: 28,
        height: 28,
        borderRadius: '50%',
        border: '3px solid #e2e8f0',
        borderTopColor: '#6C47FF',
        animation: 'brutige-spin 0.8s linear infinite',
      }}
    />
    <span style={{ fontSize: 14 }}>Loading…</span>
    <style>{'@keyframes brutige-spin { to { transform: rotate(360deg); } }'}</style>
  </div>
);

export default RouteFallback;
