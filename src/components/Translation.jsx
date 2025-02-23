import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Translation(props) {
  const { toLanguage, translating, textElement, setToLanguage } = props;
  const [languages, setLanguages] = useState([]);
  const [translatedText, setTranslatedText] = useState('');

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const options = {
          method: 'GET',
          url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages',
          headers: {
            'x-rapidapi-key': 'c653844f29mshb76f19ec161e2c7p113f73jsncaafc098a089',
            'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
          },
        };
        const response = await axios.request(options);
        setLanguages(response.data);
      } catch (error) {
        console.error('Error fetching languages:', error);
      }
    };

    fetchLanguages();
  }, []);

  const translateText = async () => {
    if (!textElement || !toLanguage) return;

    const truncatedText = typeof textElement === 'string'
      ? textElement.slice(0, 1037299)
      : textElement.join(' ').slice(0, 1037299);

    const options = {
      method: 'POST',
      url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
      headers: {
        'x-rapidapi-key': 'c653844f29mshb76f19ec161e2c7p113f73jsncaafc098a089',
        'x-rapidapi-host': 'google-translate113.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      data: {
        from: 'auto',
        to: toLanguage,
        text: truncatedText
      }
    };

    try {
      const response = await axios.request(options);
      setTranslatedText(response.data.trans || 'Translation failed');
    } catch (error) {
      console.error('Error translating text:', error);
    }
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
          {languages.map(({ code, language }) => (
            <option key={code} value={code}>
              {language}
            </option>
          ))}
        </select>
        <button
          onClick={translateText}
          disabled={translating || !toLanguage}
          className={
            'px-4 py-2 rounded duration-200 ' +
            (translating || !toLanguage
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-blue-400 text-white hover:bg-blue-500')
          }
        >
          Translate
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow min-h-[100px]">
        {translatedText || 'Translation will appear here...'}
      </div>
    </div>
  );
}
