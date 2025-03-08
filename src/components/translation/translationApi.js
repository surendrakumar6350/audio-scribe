import axios from 'axios';

// Function to fetch supported languages
export const fetchLanguages = async () => {
    try {
        const options = {
            method: 'GET',
            url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/support-languages',
            headers: {
                'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_GOOGLE_TRANSLATE_KEY || '',
                'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_GOOGLE_TRANSLATE_HOST || ''
            }
        };

        const response = await axios.request(options);
        return response.data;
    } catch (error) {
        console.error('Error fetching languages:', error);
        throw new Error('Failed to fetch supported languages');
    }
};

// Function to translate text
export const translateText = async (text, targetLanguage) => {
    if (!text || !targetLanguage) {
        return '';
    }

    // Truncate text to avoid API limitations
    const truncatedText = text.slice(0, 1037299);

    try {
        const options = {
            method: 'POST',
            url: 'https://google-translate113.p.rapidapi.com/api/v1/translator/text',
            headers: {
                'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_GOOGLE_TRANSLATE_KEY || '',
                'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_GOOGLE_TRANSLATE_HOST || '',
                'Content-Type': 'application/json'
            },
            data: {
                from: 'auto', // Auto-detect source language
                to: targetLanguage,
                text: truncatedText
            }
        };

        const response = await axios.request(options);
        return response.data.trans || 'Translation failed';
    } catch (error) {
        console.error('Error translating text:', error);
        throw new Error('Failed to translate text');
    }
};
