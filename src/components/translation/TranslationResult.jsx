import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const TranslationResult = ({
  translatedText,
  isTranslating
}) => {
  return (
    <div 
      className={`
        w-full rounded-xl bg-card p-6 shadow-sm border
        min-h-[140px] transition-all-300
        ${isTranslating ? 'opacity-70' : 'opacity-100'}
      `}
    >
      {isTranslating ? (
        <div className="flex flex-col items-center justify-center h-full gap-3">
          <LoadingSpinner size="md" className="text-primary" />
          <p className="text-muted-foreground animate-pulse-soft">Translating...</p>
        </div>
      ) : (
        <div className="h-full animate-fade-in">
          {translatedText ? (
            <p className="text-foreground">{translatedText}</p>
          ) : (
            <p className="text-muted-foreground">Translation will appear here...</p>
          )}
        </div>
      )}
    </div>
  );
};

export default TranslationResult;
