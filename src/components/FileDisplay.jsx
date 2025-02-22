import React, { useRef, useEffect } from 'react';
import { PenLine, RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';


const FileDisplay = ({
  handleAudioReset,
  file,
  audioStream,
  handleFormSubmission
}) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!file && !audioStream) return;

    if (audioRef.current) {
      if (file) {
        audioRef.current.src = URL.createObjectURL(file);
      } else if (audioStream) {
        audioRef.current.src = URL.createObjectURL(audioStream);
      }
    }
  }, [audioStream, file]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-block">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 mb-4">
                Audio File
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">File</span>
            </h1>
          </div>

          <div className="glass-morphism p-6 rounded-2xl space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold text-white">Name</h3>
              <p className="truncate text-gray-400">
                {file ? file.name : 'Custom audio'}
              </p>
            </div>

            <div className="w-full">
              <audio
                ref={audioRef}
                controls
                className="w-full glass-morphism rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
              >
                Your browser does not support the audio element.
              </audio>
            </div>

            <div className="flex items-center justify-between gap-4 pt-4">
              <button
                onClick={handleAudioReset}
                className="text-gray-400 hover:text-white transition-colors duration-200 flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>

              <button
                onClick={handleFormSubmission}
                className=" px-6 py-3 rounded-lg flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium"
              >
                <span>Transcribe</span>
                <PenLine className="w-4 h-4" />
              </button>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default FileDisplay;