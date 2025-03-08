import React from 'react';

const SourceTextInput = ({
  textElement,
  onTextChange,
  isDisabled
}) => {
  return (
    <div className="w-full">
      <textarea
        className={`
          w-full rounded-xl border bg-card p-6 shadow-sm
          min-h-[140px] resize-none transition-all-300 focus:outline-none focus:ring-2 focus:ring-primary/30
          ${isDisabled ? 'opacity-70 cursor-not-allowed' : ''}
        `}
        placeholder="Enter text to translate..."
        value={textElement}
        onChange={(e) => onTextChange(e.target.value)}
        disabled={isDisabled}
      />
    </div>
  );
};

export default SourceTextInput;
