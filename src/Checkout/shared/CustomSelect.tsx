import React, { useState, useRef, useEffect } from 'react';
import styles from './CustomSelect.module.css';

interface Option {
  value: string;
  label: string;
  sub?: string;
  flag?: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  disabled?: boolean;
  name?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchable = false,
  disabled = false,
  name
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const isTouchingRef = useRef(false);

  const selectedOption = options.find(opt => opt.value === value);

  // ✅ Simple scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ✅ Close on outside click - ONLY for mouse, not touch
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Ignore if we're currently touching (prevents scroll from closing)
      if (isTouchingRef.current) return;
      
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    if (isOpen) {
      setTimeout(() => {
        document.addEventListener('mousedown', handleClickOutside);
      }, 100); // ✅ Delay to prevent immediate close
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Track touch state
  useEffect(() => {
    const handleTouchStart = () => {
      isTouchingRef.current = true;
    };
    
    const handleTouchEnd = () => {
      setTimeout(() => {
        isTouchingRef.current = false;
      }, 300); // ✅ Reset after 300ms
    };
    
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  // Close on escape
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const filteredOptions = searchable
    ? options.filter(opt => 
        opt.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  // ✅ Handle option click - prevent double firing
  const handleOptionClick = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchTerm('');
  };

  // ✅ Handle trigger click - prevent double firing on mobile
  const handleTriggerClick = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div 
      className={`${styles.customSelectWrapper} ${isOpen ? styles.open : ''}`}
      ref={wrapperRef}
    >
      <button
        type="button"
        className={styles.customSelectTrigger}
        onClick={handleTriggerClick}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={styles.selectedValue}>
          {selectedOption ? (
            <>
              {selectedOption.flag && <span className={styles.countryFlag}>{selectedOption.flag}</span>}
              {selectedOption.label}
            </>
          ) : placeholder}
        </span>
        <svg 
          className={styles.selectChevron}
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {isOpen && (
        <>
          {/* ✅ Backdrop - only on mobile */}
          <div 
            className={styles.backdrop}
            onClick={() => {
              setIsOpen(false);
              setSearchTerm('');
            }}
          />
          
          {/* ✅ Dropdown - toast style on desktop, modal on mobile */}
          <div className={styles.customDropdown} role="listbox">
            {searchable && (
              <div className={styles.dropdownSearch}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
            )}
            
            <div className={styles.dropdownList}>
              {filteredOptions.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={`${styles.dropdownOption} ${option.value === value ? styles.activeOption : ''}`}
                  onClick={() => handleOptionClick(option.value)}
                  role="option"
                  aria-selected={option.value === value}
                >
                  {option.flag && <span className={styles.countryFlag}>{option.flag}</span>}
                  <span className={styles.optionText}>{option.label}</span>
                  {option.sub && <span className={styles.optionSub}>{option.sub}</span>}
                </button>
              ))}
              
              {filteredOptions.length === 0 && (
                <div className={styles.dropdownOption} style={{ opacity: 0.5, cursor: 'default' }}>
                  No options found
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CustomSelect;