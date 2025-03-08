import React, { useEffect, useState } from 'react';

const SpeakingAvatar = ({ isPlaying, voiceName }) => {
  const [bars, setBars] = useState([]);

  // Determine color scheme based on voice name
  const isFemale = voiceName.toLowerCase().includes('female') ||
    voiceName.toLowerCase().includes('f_') ||
    ['amy', 'emma', 'nicole', 'jessie', 'joanna', 'salli', 'ivy', 'olivia'].some(
      name => voiceName.toLowerCase().includes(name)
    );

  // Display name from voice name
  const displayName = voiceName.split(' ')[0] || voiceName;

  // Generate random bars for the visualization
  useEffect(() => {
    if (isPlaying) {
      // Create more dynamic visualization with interval
      const intervalId = setInterval(() => {
        const barCount = 32; // Number of bars in visualization
        const newBars = Array.from({ length: barCount }, () =>
          Math.random() * 0.8 + 0.2 // Random height between 0.2 and 1
        );
        setBars(newBars);
      }, 80); // Update frequency

      return () => clearInterval(intervalId);
    } else {
      // When not playing, set small idle bars
      const idleBars = Array.from({ length: 32 }, () =>
        Math.random() * 0.2 + 0.05 // Very small random heights when idle
      );
      setBars(idleBars);
    }
  }, [isPlaying]);

  return (
    <div className="flex flex-col items-center">
      {/* Audio visualization container */}
      <div className={`relative w-64 h-48 rounded-xl p-6 overflow-hidden transition-all duration-500 
        ${isPlaying ? 'shadow-lg' : 'shadow-md'} backdrop-blur-sm
        ${isFemale
          ? 'bg-gradient-to-br from-pink-500/10 to-purple-600/20 shadow-pink-500/20'
          : 'bg-gradient-to-br from-blue-500/10 to-indigo-600/20 shadow-blue-500/20'}`}
      >
        {/* Ambient glowing orb */}
        <div
          className={`absolute ${isPlaying ? 'opacity-80' : 'opacity-40'} blur-2xl rounded-full transition-all duration-1000
            ${isFemale ? 'bg-pink-400' : 'bg-blue-400'}`}
          style={{
            width: isPlaying ? '120px' : '80px',
            height: isPlaying ? '120px' : '80px',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            animation: isPlaying ? 'pulse 3s infinite' : 'none'
          }}
        />

        {/* Audio visualization bars */}
        <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between h-24">
          {bars.map((height, index) => (
            <div
              key={index}
              className={`w-1 rounded-full transition-all duration-200 ${isFemale
                ? 'bg-gradient-to-t from-pink-300 to-purple-500'
                : 'bg-gradient-to-t from-blue-300 to-indigo-500'
                }`}
              style={{
                height: `${height * 100}%`,
                opacity: Math.min(0.2 + height, 1),
                transform: `scaleY(${isPlaying ? 1 : 0.5})`,
                // Add slight animation delay based on position
                animationDelay: `${index * 0.02}s`
              }}
            />
          ))}
        </div>

        {/* Reflective surface under the visualization */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-white/10 to-transparent" />

        {/* Circular progress indicator when playing */}
        {isPlaying && (
          <div className="absolute top-4 right-4 w-3 h-3">
            <div className={`w-3 h-3 rounded-full ${isFemale ? 'bg-pink-500' : 'bg-blue-500'} opacity-80 animate-pulse`} />
            <div
              className={`absolute top-0 left-0 w-3 h-3 rounded-full ${isFemale ? 'border-pink-400' : 'border-blue-400'} border-2
                          animate-ping opacity-60`}
            />
          </div>
        )}
      </div>

      {/* Voice info with glass morphism */}
      <div className={`mt-5 bg-white/10 backdrop-blur-md px-5 py-2 rounded-full shadow-sm 
                    border border-white/20 transition-all duration-300 ${isPlaying ? 'opacity-100 scale-100' : 'opacity-90 scale-95'}`}>
        <div className="flex flex-col items-center">
          {/* Voice label chip */}
          <div className={`px-2 py-0.5 text-xs rounded-full ${isFemale ? 'bg-pink-500/20 text-pink-200' : 'bg-blue-500/20 text-blue-200'} mb-1`}>
            {isFemale ? 'Female Voice' : 'Male Voice'}
          </div>

          {/* Voice name */}
          <span className={`font-medium text-lg tracking-wide ${isFemale ? 'text-pink-300' : 'text-blue-300'}`}>
            {displayName}
          </span>
        </div>
      </div>

      {/* CSS animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.7; transform: translate(-50%, -50%) scale(1); }
          50% { opacity: 0.9; transform: translate(-50%, -50%) scale(1.1); }
        }
        
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default SpeakingAvatar;
