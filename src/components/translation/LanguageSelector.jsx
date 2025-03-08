import React from 'react';
import { Check, ChevronDown } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';


const LanguageSelector = ({
  languages,
  selectedLanguage,
  onSelectLanguage,
  isLoading
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const ref = React.useRef(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedLanguageName = React.useMemo(() => {
    if (!selectedLanguage) return 'Select language';
    const found = languages.find(lang => lang.code === selectedLanguage);
    return found ? found.language : 'Select language';
  }, [selectedLanguage, languages]);

  return (
    <div className="relative w-full" ref={ref}>
      <button
        type="button"
        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border bg-card text-left transition-all-300 ${
          isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-md focus:ring-2 focus:ring-primary/30'
        }`}
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        disabled={isLoading}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate">
          {isLoading && languages.length === 0 ? (
            <span className="text-muted-foreground">Loading languages...</span>
          ) : (
            selectedLanguageName
          )}
        </span>
        {isLoading && languages.length === 0 ? (
          <LoadingSpinner size="sm" />
        ) : (
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        )}
      </button>

      {isOpen && languages.length > 0 && (
        <div 
          className="absolute z-10 w-full mt-1 py-2 bg-card rounded-xl shadow-lg border animate-scale-in overflow-hidden"
          style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
          <ul className="py-1" role="listbox">
            {languages.map(({ code, language }) => (
              <li
                key={code}
                role="option"
                aria-selected={selectedLanguage === code}
                className={`
                  select-item flex items-center justify-between
                  ${selectedLanguage === code ? 'bg-primary/10 text-primary' : ''}
                `}
                onClick={() => {
                  onSelectLanguage(code);
                  setIsOpen(false);
                }}
              >
                <span>{language}</span>
                {selectedLanguage === code && <Check className="w-4 h-4" />}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LanguageSelector;