// src/Briefs/BriefsView.tsx
// 
// 📋 PURPOSE:
// Placeholder view for managing manufacturing briefs.
// - Customer context: Shows briefs they've submitted
// - Maker context: Shows incoming briefs they need to respond to
// 
// 🔄 BACKEND INTEGRATION:
// When API is ready, replace mockBriefs import with real fetch call.

import React, { useState } from 'react';
import { mockBriefs } from '../../data/mockTransform';
import type { Brief } from '../../data/mockTransform';

const BriefsView: React.FC = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter briefs based on status
  const filteredBriefs = mockBriefs.filter(brief => {
    return statusFilter === 'all' || brief.status === statusFilter;
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
      case 'quoted': return '#3b82f6'; // blue
      case 'accepted': return '#10b981'; // green
      case 'rejected': return '#ef4444'; // red
      default: return '#6b7280'; // gray
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Manufacturing Briefs
        </h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          Track and manage your custom manufacturing requests.
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
        {['all', 'pending', 'quoted', 'accepted', 'rejected'].map(status => (
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
            {status === 'all' && ` (${mockBriefs.length})`}
          </button>
        ))}
      </div>

      {/* Briefs List */}
      {filteredBriefs.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#999' 
        }}>
          <p>No briefs found with this status.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredBriefs.map((brief: Brief) => (
            <div
              key={brief.id}
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
                      {brief.garmentType}
                    </h3>
                    <span style={{
                      padding: '0.25rem 0.75rem',
                      backgroundColor: getStatusColor(brief.status),
                      color: '#fff',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {brief.status}
                    </span>
                  </div>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.9rem' }}>
                    Brief ID: {brief.id} • Submitted {formatDate(brief.createdAt)}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p style={{ 
                margin: '0 0 1rem 0', 
                color: '#333', 
                fontSize: '0.95rem',
                lineHeight: '1.5'
              }}>
                {brief.description}
              </p>

              {/* Key Details Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
                gap: '1rem',
                padding: '1rem',
                backgroundColor: '#f9f9f9',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                    Quantity
                  </p>
                  <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>
                    {brief.quantity} units
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                    Budget
                  </p>
                  <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>
                    {formatCurrency(brief.budgetNgn)}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                    Deadline
                  </p>
                  <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>
                    {formatDate(brief.deadline)}
                  </p>
                </div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.75rem', color: '#999', textTransform: 'uppercase', fontWeight: '600' }}>
                    Client
                  </p>
                  <p style={{ margin: '0', fontSize: '1.1rem', fontWeight: '600' }}>
                    {brief.clientName}
                  </p>
                </div>
              </div>

              {/* Reference Images */}
              {brief.referenceImages.length > 0 && (
                <div>
                  <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#666', fontWeight: '600' }}>
                    Reference Images ({brief.referenceImages.length})
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {brief.referenceImages.map((img, idx) => (
                      <img
                        key={idx}
                        src={img}
                        alt={`Reference ${idx + 1}`}
                        style={{
                          width: '80px',
                          height: '80px',
                          objectFit: 'cover',
                          borderRadius: '6px',
                          border: '1px solid #e0e0e0'
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BriefsView;