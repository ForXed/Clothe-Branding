// src/MakerDiscovery/MakerDiscoveryView.tsx
// 
// 📋 PURPOSE:
// Placeholder view for customers to browse and discover makers.
// Eventually will have: search, filters (specialty, location, MOQ), maker cards.
// 
// 🔄 BACKEND INTEGRATION:
// When API is ready, replace mockMakers import with real fetch call.

import React, { useState } from 'react';
import { mockMakers } from '../../data/mockTransform';
import type { Maker } from '../../data/mockTransform';

const MakerDiscoveryView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  // Filter makers based on search and specialty
  const filteredMakers = mockMakers.filter(maker => {
    const matchesSearch = maker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         maker.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         maker.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty === 'all' || 
                            maker.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase());
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          Discover Makers
        </h1>
        <p style={{ color: '#666', fontSize: '1rem' }}>
          Browse verified ateliers and find the perfect production partner for your brand.
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '1rem', 
        marginBottom: '2rem',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="Search makers, specialties, locations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: '1',
            minWidth: '250px',
            padding: '0.75rem 1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '0.95rem'
          }}
        />
        <select
          value={selectedSpecialty}
          onChange={(e) => setSelectedSpecialty(e.target.value)}
          style={{
            padding: '0.75rem 1rem',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '0.95rem',
            minWidth: '200px'
          }}
        >
          <option value="all">All Specialties</option>
          <option value="streetwear">Streetwear</option>
          <option value="tailoring">Tailoring</option>
          <option value="outerwear">Outerwear</option>
          <option value="adire">Adire & Textile</option>
        </select>
      </div>

      {/* Makers Grid */}
      {filteredMakers.length === 0 ? (
        <div style={{ 
          textAlign: 'center', 
          padding: '3rem', 
          color: '#999' 
        }}>
          <p>No makers found matching your criteria.</p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
          gap: '1.5rem' 
        }}>
          {filteredMakers.map((maker: Maker) => (
            <div
              key={maker.id}
              style={{
                border: '1px solid #e0e0e0',
                borderRadius: '12px',
                padding: '1.5rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer',
                backgroundColor: '#fff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <img
                  src={maker.avatarUrl}
                  alt={maker.name}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem', fontWeight: '600' }}>
                    {maker.name}
                  </h3>
                  <p style={{ margin: '0', color: '#666', fontSize: '0.85rem' }}>
                    {maker.handle}
                  </p>
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#333' }}>
                  <strong>Specialty:</strong> {maker.specialty}
                </p>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#333' }}>
                  <strong>Location:</strong> {maker.location}
                </p>
                <p style={{ margin: '0', fontSize: '0.9rem', color: '#333' }}>
                  <strong>Min Order:</strong> {maker.minOrderQuantity} units
                </p>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                paddingTop: '1rem',
                borderTop: '1px solid #f0f0f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <span style={{ color: '#f59e0b' }}>★</span>
                  <span style={{ fontWeight: '600' }}>{maker.rating}</span>
                </div>
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
                  View Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MakerDiscoveryView;