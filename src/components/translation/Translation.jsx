import React, { useEffect, useState } from 'react';
import LanguageSelector from './LanguageSelector';
import TranslateButton from './TranslateButton';
import TranslationResult from './TranslationResult';
import SourceTextInput from './SourceTextInput';
import { translateText, fetchLanguages } from './translationApi';


const Translation = ({
  toLanguage,
  translating: propTranslating,
  textElement: propTextElement,
  setToLanguage
}) => {
  const [languages, setLanguages] = useState([]);
  const [translatedText, setTranslatedText] = useState('');
  const [isLoadingLanguages, setIsLoadingLanguages] = useState(true);
  const [isTranslating, setIsTranslating] = useState(false);
  const [sourceText, setSourceText] = useState(
    typeof propTextElement === 'string' ? propTextElement : propTextElement.join(' ')
  );

  // Fetch languages on component mount
  useEffect(() => {
    const getLanguages = async () => {
      try {
        setIsLoadingLanguages(true);
        const fetchedLanguages = await fetchLanguages();
        setLanguages(fetchedLanguages);
      } catch (error) {
        console.error('Error fetching languages:', error);
        // Error handling without toast
      } finally {
        setIsLoadingLanguages(false);
      }
    };

    getLanguages();
  }, []);

  // Update sourceText when propTextElement changes
  useEffect(() => {
    if (propTextElement) {
      setSourceText(
        typeof propTextElement === 'string' ? propTextElement : propTextElement.join(' ')
      );
    }
  }, [propTextElement]);

  const handleTranslation = async () => {
    if (!sourceText || !toLanguage) return;
    
    try {
      setIsTranslating(true);
      const result = await translateText(sourceText, toLanguage);
      setTranslatedText(result);
    } catch (error) {
      console.error('Error translating text:', error);
      setTranslatedText('Translation failed');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl mx-auto animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <LanguageSelector
            languages={languages}
            selectedLanguage={toLanguage}
            onSelectLanguage={setToLanguage}
            isLoading={isLoadingLanguages}
          />
        </div>
        <TranslateButton
          onClick={handleTranslation}
          disabled={!toLanguage || !sourceText || isLoadingLanguages}
          isTranslating={isTranslating || propTranslating}
        />
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <SourceTextInput 
          textElement={sourceText}
          onTextChange={setSourceText}
          isDisabled={isTranslating || propTranslating}
        />
        
        <TranslationResult
          translatedText={translatedText}
          isTranslating={isTranslating || propTranslating}
        />
      </div>
    </div>
  );
};

export default Translation;
