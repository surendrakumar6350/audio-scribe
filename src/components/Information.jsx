import React, { useState, useEffect, useRef } from 'react';
import { Copy, Download, Loader2 } from 'lucide-react';
import Translation from './Translation';
import Header from './Header';
import Footer from './Footer';

export default function Information(props) {
  const { output, finished } = props;
  const [tab, setTab] = useState('transcription');
  const [translation, setTranslation] = useState(null);
  const [toLanguage, setToLanguage] = useState('Select language');
  const [translating, setTranslating] = useState(null);

  const worker = useRef();

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('../utils/translate.worker.js', import.meta.url), {
        type: 'module'
      });
    }

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
    return () => worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  const textElement = tab === 'transcription' ? output.map(val => val.text) : translation || '';

  function handleCopy() {
    navigator.clipboard.writeText(textElement);
  }

  function handleDownload() {
    const element = document.createElement("a");
    const file = new Blob([textElement], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `FreeScribe_${new Date().toString()}.txt`;
    document.body.appendChild(element);
    element.click();
  }

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />
      <main className='flex-1 p-4 flex flex-col gap-6 items-center justify-center pb-20 max-w-4xl w-full mx-auto animate-fade-in'>
        <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl text-center whitespace-nowrap'>
          Your <span className='bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400'>Transcription</span>
        </h1>

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

        <div className='my-8 flex flex-col-reverse w-full gap-4'>
          {(!finished || translating) && (
            <div className='grid place-items-center'>
              <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
            </div>
          )}
          {tab === 'transcription' ? (
            <div className="glass-morphism text-center m-auto p-6 rounded-lg text-gray-200 text-left whitespace-pre-wrap">
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
      <Footer />
    </div>
  );
}
