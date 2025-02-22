import React from 'react';

export default function Translation(props) {
  const {
    toLanguage,
    translating,
    textElement,
    setToLanguage,
    generateTranslation
  } = props;

  const languages = {
    'fra_Latn': 'French',
    'deu_Latn': 'German',
    'spa_Latn': 'Spanish',
    'ita_Latn': 'Italian',
    'por_Latn': 'Portuguese',
    'nld_Latn': 'Dutch',
    'pol_Latn': 'Polish',
    'tur_Latn': 'Turkish'
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <select
          value={toLanguage}
          onChange={(e) => setToLanguage(e.target.value)}
          className="px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option disabled>Select language</option>
          {Object.entries(languages).map(([code, name]) => (
            <option key={code} value={code}>
              {name}
            </option>
          ))}
        </select>
        <button
          onClick={generateTranslation}
          disabled={translating || toLanguage === 'Select language'}
          className={'px-4 py-2 rounded duration-200 ' +
            (translating || toLanguage === 'Select language'
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-400 text-white hover:bg-blue-500')}
        >
          Translate
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow min-h-[100px]">
        {textElement || 'Translation will appear here...'}
      </div>
    </div>
  );
}