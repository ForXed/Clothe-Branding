// src/Transform/Quotes/QuotesView.tsx
// 
// 📋 PURPOSE:
// Placeholder view for makers to track quotes they've sent.
// Shows quote status, pricing, production timeline, and links to briefs.
// 
// 🔄 BACKEND INTEGRATION:
// When API is ready, replace mockQuotes import with real fetch call.

import React, { useState } from 'react';
import { mockQuotes } from '../../data/mockTransform';
import type { Quote } from '../../data/mockTransform';

const QuotesView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter quotes based on status
  const filteredQuotes = mockQuotes.filter(quote => {
    return statusFilter === 'all' || quote.status === statusFilter;
  });

  // Format currency in Nigerian Naira
  const formatCurrency = (amount: number): string => {
    return `₦${amount.toLocaleString('en-NG')}`;
  };

  // Format date nicely
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-NG', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Get status badge color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return '#f59e0b'; // amber
      case 'accepted': return '#10b981'; // green
      case 'rejected': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          My Quotes
        </h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          Track the status of quotes you've sent to clients.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ 
        display: 'flex', 
        gap: '0.5rem', 
        marginBottom: '2rem',
        borderBottom: '1px solid #e0e0e0',
        paddingBottom: '1rem'
      }}>
        {['all', 'pending', 'accepted', 'rejected'].map(status => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: statusFilter === status ? '#000' : 'transparent',
              color: statusFilter === status ? '#fff' : '#666',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.9rem',
              fontWeight: '600',
              cursor: 'pointer',
              textTransform: 'capitalize',
              transition: 'all 0.2s ease'
            }}
          >
            {status === 'all' ? 'All' : status}
            {status === 'all' && ` (${mockQuotes.length})`}
          </button>
        ))}
      </div>

      {/* Quotes List */}
      {filteredQuotes.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#999' 
        }}>
          <p>No quotes found with this status.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQuotes.map((quote: Quote) => (
            <div
              key={quote.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '1.5rem',
                backgroundColor: '#fff',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
                e.currentTarget.style.borderColor = '#000';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e0e0e0';
              }}
            >
              {/* Header Row */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <div style={{ flex: '1' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: '0', fontSize: '1.2rem', fontWeight: '600' }}>
                      Quote for Brief {quote.briefId}
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getStatusColor(quote.status),
                      color: '#fff',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {quote.status}
                    </span>
                  </div>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                    Quote ID: {quote.id} • Sent {formatDate(quote.createdAt)}
                  </p>
                </div>
              </div>

              {/* Quote Details Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                    Quoted Price
                  </p>
                  <p style={{ margin: '0', fontSize: '1.3rem', fontWeight: '700', color: '#10b981' }}>
                    {formatCurrency(quote.quotedPriceNgn)}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                    Production Time
                  </p>
                  <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>
                    {quote.productionTimeDays} days
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                    Maker
                  </p>
                  <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>
                    {quote.makerName}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {quote.notes && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#fffbeb',
                  borderLeft: '3px solid #f59e0b',
                  borderRadius: '6px'
                }}>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#92400e', fontWeight: '600' }}>
                    Notes to Client:
                  </p>
                  <p style={{ margin: '0', color: '#333', fontSize: '0.95rem', lineHeight: '1.5' }}>
                    {quote.notes}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    cursor: 'pointer'
                  }}
                >
                  View Brief Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuotesView;