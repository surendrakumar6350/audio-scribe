import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const TranslateButton = ({
  onClick,
  disabled,
  isTranslating
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isTranslating}
      className={`
        px-6 py-3 rounded-xl transition-all-300 font-medium
        flex items-center justify-center gap-2 w-full
        ${disabled || isTranslating
          ? 'bg-muted text-muted-foreground cursor-not-allowed'
          : 'bg-primary text-primary-foreground hover:translate-y-[-2px] hover:shadow-lg active:translate-y-[0px]'
        }
      `}
    >
      {isTranslating ? (
        <>
          <LoadingSpinner size="sm" className="text-current" />
          <span>Translating...</span>
        </>
      ) : (
        <span>Translate</span>
      )}
    </button>
  );
};

export default TranslateButton;
