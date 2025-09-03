'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';

// Language configuration
const languages = [
  {
    code: 'en',
    name: 'English',
    flag: '🇬🇧',
  },
  {
    code: 'si',
    name: 'සිංහල',
    flag: '🇱🇰',
  },
  {
    code: 'ta',
    name: 'தமிழ்',
    flag: '🇱🇰',
  },
] as const;

type LanguageCode = typeof languages[number]['code'];

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLanguage = languages.find(lang => lang.code === language) || languages[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
    setIsOpen(false);

    // Optional: Save language preference to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferredLanguage', langCode);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg border transition-colors ${theme === 'dark'
          ? 'bg-gray-800 border-gray-600 text-gray-200 hover:bg-gray-700'
          : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        aria-label="Select Language"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="hidden sm:inline">{currentLanguage.name}</span>
        <svg
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          className={`absolute mt-2 w-48 rounded-lg shadow-lg border z-50 ${theme === 'dark'
            ? 'bg-gray-800 border-gray-600'
            : 'bg-white border-gray-300'
            } right-0`}
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-selector-button"
        >
          <div className="py-1">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={`flex items-center gap-3 w-full px-4 py-2 text-sm text-left transition-colors ${language === lang.code
                  ? theme === 'dark'
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-50 text-blue-700'
                  : theme === 'dark'
                    ? 'text-gray-200 hover:bg-gray-700'
                    : 'text-gray-700 hover:bg-gray-50'
                  }`}
                role="menuitem"
              >
                <span>{lang.name}</span>
                {language === lang.code && (
                  <svg
                    className="w-4 h-4 ml-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;