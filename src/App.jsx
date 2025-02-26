import React, { useState, useRef, useEffect } from 'react';
import HomePage from './components/HomePage';
import FileDisplay from './components/FileDisplay';
import Information from './components/Information';
import Transcribing from './components/Transcribing';
import axios from 'axios';
import { BACKEND_URL } from "../constants/constants"

/**
 * Main App component that manages the whisper transcription application flow
 * Handles audio file processing, transcription, and user authentication
 */
function App() {
  // State for managing audio files and streams
  const [file, setFile] = useState(null);  // For uploaded audio files
  const [audioStream, setAudioStream] = useState(null);  // For recorded audio streams
  const [output, setOutput] = useState(null);  // Stores transcription output
  
  // Application status states
  const [downloading, setDownloading] = useState(false);  // Downloading model status
  const [loading, setLoading] = useState(false);  // Processing audio status
  const [finished, setFinished] = useState(false);  // Transcription completed status
  
  // Authentication states
  const [loggedIn, setLoggedIn] = useState(false);  // User login status
  const [loadingLogIn, setLoadingLogIn] = useState(true);  // Login process status
  const [user, setUser] = useState();  // Current user information
  
  // Result management states
  const [resultaudioBase64, setResultAudioBase64] = useState(null);  // Base64 encoded audio for saving
  const [resultToSent, setResultToSent] = useState();  // Formatted results to be sent to server
  const [refreshActivities, setRefreshActivites] = useState(true);  // Toggle to refresh activity list

  // Determines if any audio source is available for processing
  const isAudioAvailable = file || audioStream;

  /**
   * Resets all audio and processing states to initial values
   */
  function handleAudioReset() {
    setFile(null);
    setAudioStream(null);
    setOutput(null);
    setFinished(false);
    setDownloading(false);
    setLoading(false);
  }

  // Web worker reference for running Whisper model in background thread
  const worker = useRef(null);

  /**
   * Effect to upload transcription results to server when available
   */
  useEffect(() => {
    if (resultToSent) {
      (async () => {
        // Get user token from local storage
        const userId = localStorage.getItem("token");
        if (!user || !userId) {
          return console.log("please login...");
        }
        if (!resultaudioBase64) return;
        
        // Upload audio and transcription to server
        await axios.post(`${BACKEND_URL}/v1/upload-audio`, {
          userId, 
          name: user.name, 
          audioBase64: resultaudioBase64,
          transcription: resultToSent.textElement, 
          title: resultToSent.title
        });
        
        // Trigger activity list refresh
        setRefreshActivites((pre) => !pre)
      })()
    }
  }, [resultToSent])

  /**
   * Fetches user information from server using stored token
   */
  const fetchUser = async () => {
    const userId = localStorage.getItem("token");

    if (!userId) {
      setLoggedIn(false);
      setLoadingLogIn(false);
      return;
    }

    try {
      // Verify user token with server
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

  /**
   * Initializes web worker and sets up authentication
   */
  useEffect(() => {
    // Fetch user data on component mount
    fetchUser();

    // Initialize web worker if not already created
    if (!worker.current) {
      worker.current = new Worker(new URL('./utils/whisper.worker.js', import.meta.url), {
        type: 'module'
      });
    }

    /**
     * Handles messages from the web worker
     * Updates application state based on worker progress
     */
    const onMessageReceived = async (e) => {
      switch (e.data.type) {
        case 'DOWNLOADING':
          setDownloading(true);  // Model is being downloaded
          break;
        case 'LOADING':
          setLoading(true);  // Model/audio is being processed
          break;
        case 'RESULT':
          setOutput(e.data.results);  // Save transcription results
          break;
        case 'INFERENCE_DONE':
          setFinished(true);  // Processing completed
          break;
      }
    };

    // Add event listener for worker messages
    worker.current.addEventListener('message', onMessageReceived);
    
    // Clean up event listener on component unmount
    return () => worker.current.removeEventListener('message', onMessageReceived);
  }, []);

  /**
   * Converts audio file to the format needed for Whisper model
   * @param {File} file - Audio file to process
   * @returns {Float32Array} - Processed audio data
   */
  async function readAudioFrom(file) {
    const sampling_rate = 16000;  // Required sample rate for Whisper
    const audioCTX = new AudioContext({ sampleRate: sampling_rate });
    const response = await file.arrayBuffer();
    const decoded = await audioCTX.decodeAudioData(response);
    const audio = decoded.getChannelData(0);  // Get first audio channel
    return audio;
  }

  /**
   * Handles form submission to process audio through Whisper model
   */
  async function handleFormSubmission() {
    if (!file && !audioStream) return;

    try {
      // Process either uploaded file or recorded audio stream
      const audio = await readAudioFrom(file ? file : audioStream);
      const model_name = `openai/whisper-tiny.en`;  // Using English tiny model

      // Send audio to worker for processing
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

  // Conditional rendering based on application state
  
  // Show results if transcription is complete
  if (output) {
    return (
      <Information
        output={output}
        finished={finished}
        loggedIn={loggedIn}
        user={user}
        loadingLogIn={loadingLogIn}
        setResultToSent={setResultToSent}
        refreshActivities={refreshActivities}
      />
    );
  }

  // Show processing screen while downloading model or processing audio
  if (loading || downloading) {
    return (
      <Transcribing
        downloading={downloading}
        loading={loading}
        loggedIn={loggedIn}
        user={user}
        loadingLogIn={loadingLogIn}
        refreshActivities={refreshActivities}
      />
    );
  }

  // Show file display when audio is available but not yet processed
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
        refreshActivities={refreshActivities}
      />
    );
  }

  // Default view for uploading or recording audio
  return (
    <HomePage
      setAudioStream={setAudioStream}
      setFile={setFile}
      loggedIn={loggedIn}
      user={user}
      loadingLogIn={loadingLogIn}
      setResultAudioBase64={setResultAudioBase64}
      refreshActivities={refreshActivities}
    />
  );
}

export default App;
