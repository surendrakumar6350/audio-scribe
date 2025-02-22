import React, { useState, useRef, useEffect } from 'react';
import HomePage from './components/HomePage';
import FileDisplay from './components/FileDisplay';
import Information from './components/Information';
import Transcribing from './components/Transcribing';

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);

  const isAudioAvailable = file || audioStream;

  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
    setOutput(null);
    setFinished(false);
    setDownloading(false);
    setLoading(false);
  }

  const worker = useRef(null);

  useEffect(() => {
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), {
        type: 'module'
      });
    }

    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true);
          break;
        case 'LOADING':
          setLoading(true);
          break;
        case 'RESULT':
          setOutput(e.data.results);
          break;
        case 'INFERENCE_DONE':
          setFinished(true);
          break;
      }
    };

    worker.current.addEventListener('message', onMessageReceived);
    return () => worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  async function readAudioFrom(file) {
    const sampling_rate = 16000;
    const audioCTX = new AudioContext({ sampleRate: sampling_rate });
    const response = await file.arrayBuffer();
    const decoded = await audioCTX.decodeAudioData(response);
    const audio = decoded.getChannelData(0);
    return audio;
  }

  async function handleFormSubmission() {
    if (!file && !audioStream) return;

    try {
      const audio = await readAudioFrom(file ? file : audioStream);
      const model_name = `openai/whisper-tiny.en`;

      worker.current.postMessage({
        type: 'INFERENCE_REQUEST',
        audio,
        model_name
      });
    } catch (error) {
      console.error('Error processing audio:', error);
      setLoading(false);
    }
  }

  if (output) {
    return (
      <Information
        output={output}
        finished={finished}
      />
    );
  }

  if (loading || downloading) {
    return (
      <Transcribing
        downloading={downloading}
        loading={loading}
      />
    );
  }

  if (isAudioAvailable) {
    return (
      <FileDisplay
        handleAudioReset={handleAudioReset}
        file={file}
        audioStream={audioStream}
        handleFormSubmission={handleFormSubmission}
      />
    );
  }

  return (
    <HomePage
      setAudioStream={setAudioStream}
      setFile={setFile}
    />
  );
}

export default App;