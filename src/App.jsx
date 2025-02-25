import React, { useState, useRef, useEffect } from 'react';
import HomePage from './components/HomePage';
import FileDisplay from './components/FileDisplay';
import Information from './components/Information';
import Transcribing from './components/Transcribing';
import axios from 'axios';
import { BACKEND_URL } from "../constants/constants"

function App() {
  const [file, setFile] = useState(null);
  const [audioStream, setAudioStream] = useState(null);
  const [output, setOutput] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [loadingLogIn, setLoadingLogIn] = useState(true);
  const [user, setUser] = useState();

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


  const fetchUser = async () => {
    const userId = localStorage.getItem("token");

    if (!userId) {
      setLoggedIn(false);
      setLoadingLogIn(false);
      return;
    }

    try {
      const response = await axios.post(`${BACKEND_URL}/v1/getAccount`, { _id: userId });
      if (response.data.success) {
        setUser(response.data.user);
        setLoggedIn(true);
        setLoadingLogIn(false);
      } else {
        setLoggedIn(false);
        setLoadingLogIn(false);
      }
    } catch (err) {
      setLoggedIn(false);
      setLoadingLogIn(false);
    }
  };

  useEffect(() => {
    fetchUser();

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
        loggedIn={loggedIn}
        user={user}
        loadingLogIn={loadingLogIn}
      />
    );
  }

  if (loading || downloading) {
    return (
      <Transcribing
        downloading={downloading}
        loading={loading}
        loggedIn={loggedIn}
        user={user}
        loadingLogIn={loadingLogIn}
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
        loggedIn={loggedIn}
        user={user}
        loadingLogIn={loadingLogIn}
      />
    );
  }

  return (
    <HomePage
      setAudioStream={setAudioStream}
      setFile={setFile}
      loggedIn={loggedIn}
      user={user}
      loadingLogIn={loadingLogIn}
    />
  );
}

export default App;