import React, { useState, useEffect, useRef } from 'react';
import { Copy, Download, Loader2 } from 'lucide-react';
import Translation from '../components/Translation';
import Header from '../components/Header';
import ActivitySidebar from '../components/SideBar';
import generateShortTitle from '../utils/generateTitle';

// Main Information component displays transcription and translation results
// Props:
// - output: Array of transcription segments
// - finished: Boolean indicating if processing is complete
// - user: User object containing authentication details
// - loadingLogIn: Boolean for login loading state
// - loggedIn: Boolean indicating authentication status
// - setResultToSent: Function to update results
// - refreshActivities: Function to refresh sidebar activities
export default function Information(props) {
  const { output, finished, user, loadingLogIn, loggedIn, setResultToSent, refreshActivities } = props;
  // State for managing active tab (transcription/translation)
  const [tab, setTab] = useState('transcription');
  // State for storing translated text
  const [translation, setTranslation] = useState(null);
  // State for target translation language
  const [toLanguage, setToLanguage] = useState('Select language');
  // State for translation loading status
  const [translating, setTranslating] = useState(null);

  // Web Worker reference for handling translations
  const worker = useRef();

  // Initialize Web Worker and handle translation messages
  useEffect(() => {
    // Create worker if not exists
    if (!worker.current) {
      worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
        type: 'module'
      });
    }

    // Handle messages from translation worker
    const onMessageReceived = async (e) => {
      switch (e.data.status) {
        case 'initiate':
          console.log('DOWNLOADING');
          break;
        case 'progress':
          console.log('LOADING');
          break;
        case 'update':
          setTranslation(e.data.output);
          break;
        case 'complete':
          setTranslating(false);
          break;
      }
    };

    worker.current.addEventListener('message', onMessageReceived);
    // Generate and set title for the transcription
    const title = generateShortTitle(textElement[0])
    setResultToSent({ title: title, textElement: textElement })

    // Cleanup worker event listener
    return () => worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  // Get text content based on active tab
  const textElement = tab === 'transcription' || 'translation' ? output.map(val => val.text) : translation || '';

  // Copy text to clipboard
  function handleCopy() {
    navigator.clipboard.writeText(textElement);
  }

  // Download text as file
  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([textElement], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `AudioScribe_${new Date().toString()}.txt`;
    document.body.appendChild(element);
    element.click();
  }

  // Initiate translation process
  function generateTranslation() {
    if (translating || toLanguage === 'Select language') return;

    setTranslating(true);
    worker.current.postMessage({
      text: output.map(val => val.text),
      src_lang: 'eng_Latn',
      tgt_lang: toLanguage
    });
  }

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Sidebar component showing user activities */}
      <ActivitySidebar user={user} loggedIn={loggedIn} loadingLogIn={loadingLogIn} refreshActivities={refreshActivities} />

      <div className="flex-1 flex flex-col h-full overflow-y-auto">
        {/* Header component with user information */}
        <Header user={user} loggedIn={loggedIn} loadingLogIn={loadingLogIn} />

        <main className='flex-1 p-4 flex flex-col gap-6 items-center justify-center max-w-4xl w-full mx-auto animate-fade-in'>
          {/* Page title */}
          <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl text-center whitespace-nowrap'>
            Your <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400'>Transcription</span>
          </h1>

          {/* Tab switcher between transcription and translation */}
          <div className='w-full max-w-md mx-auto glass-morphism p-1 rounded-lg'>
            <div className='grid grid-cols-2 gap-1'>
              <button
                onClick={() => setTab('transcription')}
                className={`px-4 rounded-md duration-200 py-2 font-medium ${tab === 'transcription'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                Transcription
              </button>
              <button
                onClick={() => setTab('translation')}
                className={`px-4 rounded-md duration-200 py-2 font-medium ${tab === 'translation'
                  ? 'bg-purple-500/20 text-purple-400'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                Translation
              </button>
            </div>
          </div>

          {/* Content area for transcription/translation */}
          <div className='my-8 flex flex-col-reverse w-full gap-4'>
            {/* Loading indicator */}
            {(!finished || translating) && (
              <div className='grid place-items-center'>
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              </div>
            )}
            {/* Display either transcription or translation component */}
            {tab === 'transcription' ? (
              <div className="glass-morphism text-center m-auto p-6 rounded-lg text-gray-200 whitespace-pre-wrap">
                {textElement}
              </div>
            ) : (
              <Translation
                toLanguage={toLanguage}
                translating={translating}
                textElement={textElement}
                setTranslating={setTranslating}
                setTranslation={setTranslation}
                setToLanguage={setToLanguage}
                generateTranslation={generateTranslation}
              />
            )}
          </div>

          {/* Action buttons for copy and download */}
          <div className='flex items-center gap-4'>
            <button
              onClick={handleCopy}
              title="Copy"
              className='specialBtn p-3 rounded-lg hover:scale-105 transition-all duration-200'
            >
              <Copy className="w-5 h-5 text-purple-400" />
            </button>
            <button
              onClick={handleDownload}
              title="Download"
              className='specialBtn p-3 rounded-lg hover:scale-105 transition-all duration-200'
            >
              <Download className="w-5 h-5 text-purple-400" />
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}