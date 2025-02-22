import React, { useState, useEffect, useRef } from 'react';
import { Mic, Upload } from 'lucide-react';
import Header from './Header';
import Footer from './Footer';

const HomePage = ({ setAudioStream, setFile }) => {
  const [recordingStatus, setRecordingStatus] = useState('inactive');
  const [duration, setDuration] = useState(0);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const mimeType = 'audio/webm';

  async function startRecording() {
    let tempStream;

    try {
      const streamData = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      tempStream = streamData;
    } catch (err) {
      console.log(err.message);
      return;
    }

    setRecordingStatus('recording');

    const media = new MediaRecorder(tempStream, { type: mimeType });
    mediaRecorder.current = media;
    audioChunks.current = [];

    mediaRecorder.current.ondataavailable = (event) => {
      if (typeof event.data === 'undefined') return;
      if (event.data.size === 0) return;
      audioChunks.current.push(event.data);
    };

    mediaRecorder.current.start();
  }

  async function stopRecording() {
    setRecordingStatus('inactive');

    mediaRecorder.current.stop();
    mediaRecorder.current.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: mimeType });
      setAudioStream(audioBlob);
      setDuration(0);
    };
  }

  useEffect(() => {
    if (recordingStatus === 'inactive') return;

    const interval = setInterval(() => {
      setDuration(curr => curr + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [recordingStatus]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-900 to-slate-800">
      <Header />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl mx-auto flex flex-col items-center space-y-8 animate-fade-in">
          <div className="text-center space-y-4">
            <div className="inline-block">
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 mb-4">
                Voice to Text
              </span>
            </div>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
              Audio<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Scribe</span>
            </h1>
            <div className="flex items-center justify-center gap-3 text-gray-300 font-medium mt-4">
              <span>Record</span>
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Transcribe</span>
              <svg className="w-4 h-4 text-purple-400" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 8H13M13 8L8 3M13 8L8 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span>Translate</span>
            </div>
          </div>

          <div className="w-full max-w-md space-y-6">
            <button
              onClick={recordingStatus === 'recording' ? stopRecording : startRecording}
              className="specialBtn w-full py-4 px-6 rounded-2xl flex items-center justify-center gap-3 text-lg font-medium transition-all duration-300 group"
            >
              <span className={`${recordingStatus === 'recording' ? 'text-red-400' : 'text-purple-400'}`}>
                {recordingStatus === 'inactive' ? 'Start Recording' : `Recording in progress (${duration}s)`}
              </span>
              <Mic
                className={`w-5 h-5 transition-all duration-300 ${recordingStatus === 'recording'
                  ? 'text-red-400 pulse-recording'
                  : 'text-purple-400'
                  }`}
              />
            </button>

            <div className="flex items-center justify-center gap-2 text-gray-400">
              <span>or</span>
              <label className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 cursor-pointer group">
                <span className="group-hover:underline">upload a file</span>
                <Upload className="w-4 h-4" />
                <input
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) setFile(file);
                  }}
                  className="hidden"
                  type="file"
                  accept=".mp3,.wav"
                />
              </label>
            </div>
          </div>

          <p className="text-sm text-gray-500 italic mt-8">
            Free now, free forever
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;