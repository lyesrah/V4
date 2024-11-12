import React, { useState, useRef, useEffect } from 'react';
import { useLanguageStore } from '../store/languageStore';
import { ChevronDown } from 'lucide-react';

const languages = {
  fr: {
    name: 'Français',
    flag: 'https://flagcdn.com/24x18/fr.png'
  },
  en: {
    name: 'English',
    flag: 'https://flagcdn.com/24x18/gb.png'
  },
  es: {
    name: 'Español',
    flag: 'https://flagcdn.com/24x18/es.png'
  },
  it: {
    name: 'Italiano',
    flag: 'https://flagcdn.com/24x18/it.png'
  }
};

export default function LanguageSelector() {
  const { currentLanguage, setLanguage } = useLanguageStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
      >
        <img
          src={languages[currentLanguage].flag}
          alt={languages[currentLanguage].name}
          className="w-5 h-4 rounded opacity-80"
        />
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700 py-1 z-50">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              onClick={() => {
                setLanguage(code as 'fr' | 'en' | 'es' | 'it');
                setIsOpen(false);
              }}
              className={`w-full flex items-center space-x-3 px-4 py-2 text-sm ${
                currentLanguage === code 
                  ? 'bg-blue-50 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              <img
                src={lang.flag}
                alt={lang.name}
                className="w-5 h-4 rounded opacity-80"
              />
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}