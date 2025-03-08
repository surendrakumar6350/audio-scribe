import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Play, Pause, Volume2, VolumeX, Loader2 } from 'lucide-react';
import SpeakingAvatar from './SpeakingAvatar';
import { message } from 'react-message-popup';

// TextToSpeech component for voice conversion
const TextToSpeech = ({ textContent }) => {
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState('');
    const [audioUrl, setAudioUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [error, setError] = useState('');
    const [volume, setVolume] = useState(1);
    const [muted, setMuted] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const audioRef = useRef(null);

    // Fetch available voices when component mounts
    useEffect(() => {
        fetchVoices();
    }, []);

    // Controls for audio playback
    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(err => {
                    console.error("Error playing audio:", err);
                    setError("Failed to play audio. Please try again.");
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, audioUrl]);

    // Handle volume changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = muted ? 0 : volume;
        }
    }, [volume, muted]);

    // Handle audio end event
    useEffect(() => {
        const handleAudioEnd = () => {
            setIsPlaying(false);
            // Reset audio to beginning when it finishes
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
            }
        };

        if (audioRef.current) {
            audioRef.current.addEventListener('ended', handleAudioEnd);
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.removeEventListener('ended', handleAudioEnd);
            }
        };
    }, [audioRef.current]);

    // Fetch all available voices
    const fetchVoices = async () => {
        setIsRefreshing(true);
        setIsLoading(true);
        try {
            const options = {
                method: 'GET',
                url: 'https://express-voic-text-to-speech.p.rapidapi.com/getAllVoice',
                headers: {
                    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_VOIC_KEY,
                    'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_VOIC_HOST
                }
            };

            const response = await axios.request(options);
            if (response.data && response.data.voices && response.data.voices.StreamElements) {
                const maleVoices = response.data.voices.StreamElements.MALE || [];
                const femaleVoices = response.data.voices.StreamElements.FEMALE || [];
                setVoices([...maleVoices, ...femaleVoices]);
                if (maleVoices.length > 0) {
                    setSelectedVoice(maleVoices[0]);
                } else if (femaleVoices.length > 0) {
                    setSelectedVoice(femaleVoices[0]);
                }
            }
        } catch (error) {
            console.error("Error fetching voices:", error);
            message.error('Failed to load available voices. Please try again.', 4000);
            setError("Failed to load available voices. Please try again.");
        } finally {
            setIsLoading(false);
            setIsRefreshing(false);
        }
    };

    // Generate speech from text
    const generateSpeech = async () => {
        if (!selectedVoice || !textContent) {
            setError("Please select a voice and ensure text is available");
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const options = {
                method: 'GET',
                url: 'https://express-voic-text-to-speech.p.rapidapi.com/getAudioLink',
                params: {
                    service: 'StreamElements',
                    voice: selectedVoice.split(" ")[0],
                    text: textContent.slice(0, 1000)
                },
                headers: {
                    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_VOIC_KEY,
                    'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_VOIC_HOST
                }
            };

            const response = await axios.request(options);
            if (response.data && response.data.audio_url) {
                setAudioUrl(response.data.audio_url);
                setIsPlaying(true);
            } else {
                message.error("Couldn't generate audio. Please select another voice", 4000);
            }
        } catch (error) {
            console.error("Error generating speech:", error);
            setError("Failed to convert text to speech. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Toggle play/pause
    const togglePlayback = () => {
        if (audioUrl) {
            setIsPlaying(!isPlaying);
        } else if (selectedVoice && textContent) {
            generateSpeech();
        }
    };

    // Handle refresh voices without full component re-render
    const handleRefreshVoices = (e) => {
        e.preventDefault();
        if (!isRefreshing) {
            fetchVoices();
        }
    };

    // Toggle mute
    const toggleMute = () => {
        setMuted(!muted);
    };

    // Handle volume change
    const handleVolumeChange = (e) => {
        const value = parseFloat(e.target.value);
        setVolume(value);
        if (value > 0 && muted) {
            setMuted(false);
        }
    };

    // Handle voice selection and fetch new voices
    const handleVoiceChange = (e) => {
        setSelectedVoice(e.target.value);
        generateSpeech();
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="bg-slate-800/70 backdrop-blur-lg border border-slate-700/50 rounded-xl p-6 shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                        Text to Speech
                    </h3>
                </div>

                {/* Voice selector */}
                <div className="mb-6">
                    <label className="flex items-center gap-2 text-slate-300 text-sm font-medium mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" y1="19" x2="12" y2="23" /><line x1="8" y1="23" x2="16" y2="23" /></svg>
                        Select Voice
                    </label>
                    <div className="relative">
                        <select
                            value={selectedVoice}
                            onChange={handleVoiceChange}
                            className="w-full p-3 bg-slate-900/70 border border-slate-700 rounded-lg text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all"
                            disabled={isLoading || isRefreshing}
                        >
                            <option value="">Select a voice</option>
                            {voices.map((voice, index) => (
                                <option key={index} value={voice}>
                                    {voice}
                                </option>
                            ))}
                        </select>
                        {(isLoading || isRefreshing) && !audioUrl && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                <Loader2 size={18} className="text-purple-400 animate-spin" />
                            </div>
                        )}
                    </div>
                </div>

                {/* Character visualization */}
                {selectedVoice && (
                    <div className="flex justify-center mb-8">
                        <SpeakingAvatar isPlaying={isPlaying} voiceName={selectedVoice} />
                    </div>
                )}

                {/* Text preview */}
                {textContent && (
                    <div className="mb-6 bg-slate-900/50 border border-slate-800 rounded-lg p-3 max-h-24 overflow-y-auto">
                        <p className="text-sm text-slate-300 line-clamp-3">{textContent}</p>
                    </div>
                )}

                {/* Controls */}
                <div className="flex items-center justify-between">
                    <div className="flex justify-center">
                        <button
                            onClick={togglePlayback}
                            disabled={isLoading || !selectedVoice || isRefreshing}
                            className={`
                                relative group flex items-center justify-center w-14 h-14 rounded-full 
                                ${isPlaying ? 'bg-pink-600 hover:bg-pink-700' : 'bg-purple-600 hover:bg-purple-700'}
                                transition-all duration-300 disabled:opacity-50 disabled:hover:bg-slate-700
                                disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 
                                focus:ring-purple-500 focus:ring-offset-slate-900
                            `}
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                            ) : isPlaying ? (
                                <Pause className="w-6 h-6 text-white" />
                            ) : (
                                <Play className="w-6 h-6 text-white ml-1" />
                            )}
                            <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                                {isPlaying ? "Pause" : "Play"}
                            </span>
                        </button>
                    </div>

                    {audioUrl && (
                        <div className="flex items-center gap-4">
                            <button
                                onClick={toggleMute}
                                className="text-slate-300 hover:text-purple-400 transition-colors"
                            >
                                {muted ? (
                                    <VolumeX size={20} />
                                ) : (
                                    <Volume2 size={20} />
                                )}
                            </button>
                            <div className="h-24 flex flex-col items-center justify-center">
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.05"
                                    value={volume}
                                    onChange={handleVolumeChange}
                                    className="h-20 w-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500 vertical-slider"
                                    style={{
                                        WebkitAppearance: 'slider-vertical',
                                        writingMode: 'bt-lr'
                                    }}
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Error message */}
                {error && (
                    <div className="mt-5 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                        <p className="text-red-400 text-sm">{error}</p>
                    </div>
                )}

                {/* Hidden audio element */}
                {audioUrl && (
                    <audio ref={audioRef} src={audioUrl} className="hidden" />
                )}
            </div>
        </div>
    );
};

export default TextToSpeech;
