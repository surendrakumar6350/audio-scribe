/**
 * Translation Component
 * 
 * This component provides translation functionality using the Google Translate API.
 * It allows users to select a target language and translate text from any source language.
 * 
 * @param {Object} props - Component props
 * @param {string} props.toLanguage - The target language code for translation
 * @param {boolean} props.translating - Flag indicating if translation is in progress
 * @param {string|string[]} props.textElement - The text to be translated
 * @param {Function} props.setToLanguage - Function to update the target language
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Translation(props) {
  // Destructure props for easier access
  const { toLanguage, translating, textElement, setToLanguage } = props;
  // State to store available languages from the API
  const [languages, setLanguages] = useState([]);
  // State to store the translated text result
  const [translatedText, setTranslatedText] = useState('');

  /**
   * Effect hook to fetch available languages when component mounts
   * Makes an API call to get all supported languages for translation
   */
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

  /**
   * Function to handle the translation process
   * Makes an API call to translate the provided text to the selected language
   * Truncates text if it exceeds the API length limit
   */
  const translateText = async () => {
    // Return early if no text or target language is provided
    if (!textElement || !toLanguage) return;

    // Truncate text to avoid API limitations (maximum character limit)
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
        from: 'auto', // Auto-detect source language
        to: toLanguage, // Target language selected by user
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

  /**
   * Component UI rendering
   * Includes language selector dropdown, translate button, and results display area
   */
  return (
    <div className="flex flex-col gap-4">
      {/* Language selection and translation controls */}
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
      {/* Translation results display area */}
      <div className="bg-white p-4 rounded-lg shadow min-h-[100px]">
        {translatedText || 'Translation will appear here...'}
      </div>
    </div>
  );
}