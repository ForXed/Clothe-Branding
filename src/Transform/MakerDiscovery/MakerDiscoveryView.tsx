// src/Transform/MakerDiscovery/MakerDiscoveryView.tsx

import React, { useState, useRef, useEffect } from 'react';
import { mockMakers } from '../../data/mockTransform';
import type { Maker } from '../../data/mockTransform';
import styles from './MakerDiscoveryView.module.css';

// ===== ICONS =====
const GridIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);

const TeeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
  </svg>
);

const ScissorsIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

const DropletIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);

const JacketIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3v3M9 6l-5 2v13h16V8l-5-2-3 3-3-3z"/>
    <path d="M12 6v15"/>
  </svg>
);

const NeedleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 3l-6.5 6.5M14.5 9.5 8 16a2.83 2.83 0 0 1-4-4l6.5-6.5"/>
    <path d="M3 21c3-1 4-2 5-5"/>
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// ===== SPECIALTY OPTIONS =====
const SPECIALTIES = [
  { value: 'all', label: 'All Specialties', icon: <GridIcon /> },
  { value: 'streetwear', label: 'Streetwear', icon: <TeeIcon /> },
  { value: 'cut-and-sew', label: 'Cut-and-Sew', icon: <ScissorsIcon /> },
  { value: 'adire', label: 'Adire & Textile', icon: <DropletIcon /> },
  { value: 'outerwear', label: 'Technical Outerwear', icon: <JacketIcon /> },
  { value: 'embroidery', label: 'Embroidery & Print', icon: <NeedleIcon /> },
];

const MakerDiscoveryView: React.FC = () => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (value: string) => {
    setSelectedSpecialty(value);
    setIsDropdownOpen(false);
  };

  const selectedOption = SPECIALTIES.find(s => s.value === selectedSpecialty);

  // ✅ FIXED: Normalize both strings by stripping all non-alphanumeric chars
  // for bulletproof matching (handles hyphens, ampersands, spaces, etc.)
  // "Cut-and-Sew" → "cutandsew" | "Adire & Textile" → "adiretextile"
  const normalize = (str: string) => str.toLowerCase().replace(/[^a-z0-9]/g, '');

  const filteredMakers = mockMakers.filter(maker => {
    if (selectedSpecialty === 'all') return true;
    return normalize(maker.specialty).includes(normalize(selectedSpecialty));
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Discover Makers</h1>
        <p className={styles.subtitle}>
          Browse verified ateliers and find the perfect production partner for your brand.
        </p>
      </div>

      {/* Filter Bar */}
      <div className={styles.filterBar}>
        <div className={styles.filterLeft}>
          <span className={styles.filterLabel}>Filter by specialty</span>

          {/* Custom Dropdown */}
          <div className={styles.dropdownWrapper} ref={dropdownRef}>
            <button
              type="button"
              className={`${styles.dropdownTrigger} ${isDropdownOpen ? styles.dropdownTriggerOpen : ''}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              aria-haspopup="listbox"
              aria-expanded={isDropdownOpen}
            >
              <span className={styles.dropdownIcon}>{selectedOption?.icon}</span>
              <span className={styles.dropdownLabel}>{selectedOption?.label}</span>
              <span className={`${styles.dropdownChevron} ${isDropdownOpen ? styles.chevronOpen : ''}`}>
                <ChevronDownIcon />
              </span>
            </button>

            {isDropdownOpen && (
              <div className={styles.dropdownPanel} role="listbox">
                {SPECIALTIES.map(spec => (
                  <button
                    key={spec.value}
                    type="button"
                    role="option"
                    aria-selected={spec.value === selectedSpecialty}
                    className={`${styles.dropdownOption} ${spec.value === selectedSpecialty ? styles.dropdownOptionSelected : ''}`}
                    onClick={() => handleSelect(spec.value)}
                  >
                    <span className={styles.optionIcon}>{spec.icon}</span>
                    <span className={styles.optionLabel}>{spec.label}</span>
                    {spec.value === selectedSpecialty && (
                      <span className={styles.optionCheck}><CheckIcon /></span>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.filterCount}>
          <span className={styles.countNumber}>{filteredMakers.length}</span>
          <span className={styles.countLabel}>{filteredMakers.length === 1 ? 'maker' : 'makers'} found</span>
        </div>
      </div>

      {/* Makers Grid */}
      {filteredMakers.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No makers found matching your criteria.</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {filteredMakers.map((maker: Maker) => (
            <div key={maker.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <img src={maker.avatarUrl} alt={maker.name} className={styles.avatar} />
                <div className={styles.makerInfo}>
                  <h3 className={styles.makerName}>{maker.name}</h3>
                  <p className={styles.handle}>{maker.handle}</p>
                </div>
              </div>

              <div className={styles.info}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Specialty</span>
                  <span className={styles.infoValue}>{maker.specialty}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Location</span>
                  <span className={styles.infoValue}>{maker.location}</span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Min Order</span>
                  <span className={styles.infoValue}>{maker.minOrderQuantity} units</span>
                </div>
              </div>

              <div className={styles.footer}>
                <button className={styles.actionBtn}>View Profile</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MakerDiscoveryView;