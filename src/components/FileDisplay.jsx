import React, { useRef, useEffect } from 'react';
import { PenLine, RotateCcw } from 'lucide-react';
import Header from '../components/Header';
import ActivitySidebar from './SideBar';

// FileDisplay component handles audio file preview and transcription controls
// Props:
// - handleAudioReset: Function to reset audio state
// - file: Uploaded audio file
// - audioStream: Recorded audio stream
// - handleFormSubmission: Function to handle transcription request
// - user: User authentication object
// - loggedIn: Boolean indicating if user is authenticated
// - loadingLogIn: Boolean indicating if auth state is loading
// - refreshActivities: Function to refresh activity list
const FileDisplay = ({
  handleAudioReset,
  file,
  audioStream,
  handleFormSubmission,
  user,
  loggedIn,
  loadingLogIn,
  refreshActivities
}) => {
  // Reference to audio element for controlling playback
  const audioRef = useRef(null);

  // Update audio source when file or stream changes
  useEffect(() => {
    if (!file && !audioStream) return;

    if (audioRef.current) {
      // Create object URL from file or stream
      if (file) {
        audioRef.current.src = URL.createObjectURL(file);
      } else if (audioStream) {
        audioRef.current.src = URL.createObjectURL(audioStream);
      }
    }
  }, [audioStream, file]);

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      {/* Activity sidebar component */}
      <ActivitySidebar user={user} loggedIn={loggedIn} loadingLogIn={loadingLogIn} refreshActivities={refreshActivities} />

      <div className="flex-1 flex flex-col h-full">
        {/* Header component */}
        <Header user={user} loggedIn={loggedIn} loadingLogIn={loadingLogIn} />

        <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8">
            {/* Page title and subtitle */}
            <div className="text-center space-y-3 sm:space-y-4">
              <div className="inline-block">
                <span className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-purple-500/10 text-purple-400">
                  Audio File
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Your <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">File</span>
              </h1>
            </div>

            {/* Audio player and controls container */}
            <div className="glass-morphism p-4 sm:p-6 rounded-2xl space-y-4 sm:space-y-6 backdrop-blur-lg bg-white/5">
              {/* File name display */}
              <div className="space-y-2">
                <h3 className="font-semibold text-white text-sm sm:text-base">Name</h3>
                <p className="truncate text-gray-400 text-sm sm:text-base">
                  {file ? file.name : 'Custom audio'}
                </p>
              </div>

              {/* Audio player */}
              <div className="w-full">
                <audio
                  ref={audioRef}
                  controls
                  className="w-full glass-morphism rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                {/* Reset button */}
                <button
                  onClick={handleAudioReset}
                  className="w-full sm:w-auto text-gray-400 hover:text-white transition-colors duration-200 flex items-center justify-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-800/50"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Reset</span>
                </button>

                {/* Transcribe button */}
                <button
                  onClick={handleFormSubmission}
                  className="w-full sm:w-auto px-6 py-3 rounded-lg flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-medium transition-all duration-200 hover:shadow-lg"
                >
                  <span>Transcribe</span>
                  <PenLine className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default FileDisplay;