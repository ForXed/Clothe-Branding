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
    {/* Animation lives in the stylesheet below so it can respect prefers-reduced-motion. */}
    <span className="brutige-spinner" />
    <span style={{ fontSize: 14 }}>Loading…</span>
    <style>{`
      .brutige-spinner {
        display: block;
        width: 28px;
        height: 28px;
        border-radius: 50%;
        border: 3px solid #e2e8f0;
        border-top-color: #6C47FF;
        animation: brutige-spin 0.8s linear infinite;
      }
      @media (prefers-reduced-motion: reduce) {
        .brutige-spinner {
          animation: none;
          border-top-color: #cbd5e1;
        }
      }
      @keyframes brutige-spin {
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  </div>
);

export default RouteFallback;
