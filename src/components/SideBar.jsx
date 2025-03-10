import React, { useState } from 'react';
import { Settings, Menu, X, Loader } from 'lucide-react';
import { BACKEND_URL } from '../../constants/constants'
import { useEffect } from 'react';
import axios from 'axios';

// ActivitySidebar component displays user activities and navigation options
// Props:
// - loadingLogIn: boolean indicating if user authentication is in progress
// - loggedIn: boolean indicating if user is authenticated
// - user: object containing user information including profile picture
// - refreshActivities: trigger to refresh the activities list
const ActivitySidebar = ({ loadingLogIn, loggedIn, user, refreshActivities }) => {
  // State for mobile sidebar visibility
  const [isOpen, setIsOpen] = useState(false);
  // State for storing audio data from backend
  const [audioData, setAudioData] = useState([]);
  // State for tracking data loading state
  const [isLoading, setIsLoading] = useState(false);

  // Fetch user's audio data when component mounts or when dependencies change
  useEffect(() => {
    const fetchUserAudio = async () => {
      const userId = localStorage.getItem("token");
      if (!user || !userId) {
        return console.log("please login...");
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`${BACKEND_URL}/v1/audio/${userId}`);
        setAudioData(response.data);
      } catch (error) {
        console.error("Error fetching audio data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (loggedIn) {
      fetchUserAudio();
    }
  }, [user, loggedIn, refreshActivities]);

  // Formats raw audio data into categorized sections (Today, Yesterday, Older)
  const formatAudioData = (data) => {
    if (!data || data.length === 0) {
      return defaultActivities;
    }
  
    const today = new Date();
    today.setHours(0, 0, 0, 0);
  
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
  
    let todayItems = [];
    let yesterdayItems = [];
    let olderItems = [];
  
    // Categorize each audio item based on upload date
    data.forEach(audio => {
      const uploadDate = new Date(audio.uploadedAt);
      uploadDate.setHours(0, 0, 0, 0);
  
      // Generate title from audio data or transcription
      const title = audio.title !== "[BLANK_AUDIO]" 
        ? audio.title 
        : audio.transcription[0] !== "[BLANK_AUDIO]" 
          ? audio.transcription[0].substring(0, 30) + (audio.transcription[0].length > 30 ? "..." : "") 
          : "Untitled Audio";
  
      const item = {
        id: audio._id,
        title: title,
        audioData: audio
      };
  
      // Sort items into appropriate time categories
      if (uploadDate.getTime() === today.getTime()) {
        todayItems.push(item);
      } else if (uploadDate.getTime() === yesterday.getTime()) {
        yesterdayItems.push(item);
      } else {
        olderItems.push(item);
      }
    });
  
    // Limit to latest 20 records while maintaining chronological order
    let allItems = [...todayItems, ...yesterdayItems, ...olderItems].slice(0, 20);
  
    // Regroup items into their respective categories
    let groupedData = [];
    
    if (allItems.some(item => todayItems.includes(item))) {
      groupedData.push({
        id: 1,
        category: 'Today',
        items: allItems.filter(item => todayItems.includes(item)).reverse()
      });
    }
  
    if (allItems.some(item => yesterdayItems.includes(item))) {
      groupedData.push({
        id: 2,
        category: 'Yesterday',
        items: allItems.filter(item => yesterdayItems.includes(item)).reverse()
      });
    }
  
    if (allItems.some(item => olderItems.includes(item))) {
      groupedData.push({
        id: 3,
        category: 'Older',
        items: allItems.filter(item => olderItems.includes(item)).reverse()
      });
    }
  
    return groupedData.length > 0 ? groupedData : defaultActivities;
  };
  
  // Default empty activities array when no data is available
  const defaultActivities = [];

  // Process the audio data for display
  const activityData = formatAudioData(audioData);

  // Mobile toggle button component for showing/hiding sidebar
  const MobileToggle = () => (
    <button
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-slate-800 text-white hover:bg-slate-700 transition-colors"
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );

  return (
    <>
      {/* Mobile menu toggle button */}
      <MobileToggle />

      {/* Mobile overlay - darkens the background when sidebar is open */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Main sidebar component */}
      <aside className={`
        fixed lg:sticky top-0 left-0 z-40
        w-64 h-screen bg-slate-950 text-white border-r border-slate-800
        flex flex-col overflow-hidden
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        {/* Sidebar header with app logo/name */}
        <div className="shrink-0 p-4 flex items-center gap-2 border-b border-slate-800">
          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
            {loadingLogIn ? (
              <Loader className="w-6 h-6 text-gray-300 animate-spin" />
            ) : loggedIn ? (
              <img className="w-8 h-8 rounded-full" src={user.picture} alt="User" />
            ) : (
              <img className="w-8 h-8 rounded-full" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFgG_wbqwD7HVD9FLCyRsz-Rz5DQRgwE8_NQ&s" alt="User" />
            )}
          </div>
          <span className="font-medium">AudioScribe</span>
        </div>

        {/* User profile section */}
        <div className="shrink-0 flex items-center gap-2 p-3 mx-2 my-2 rounded-lg hover:bg-slate-800 cursor-pointer">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            {loadingLogIn ? (
              <Loader className="w-6 h-6 text-gray-300 animate-spin" />
            ) : loggedIn ? (
              <img className="w-full h-full object-cover" src={user.picture} alt="User" />
            ) : (
              <img className="w-full h-full object-cover" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTFgG_wbqwD7HVD9FLCyRsz-Rz5DQRgwE8_NQ&s" alt="User" />
            )}
          </div>
          <span>AudioScribe</span>
        </div>

        {/* GPT exploration section */}
        <div className="shrink-0 flex items-center gap-2 p-3 mx-2 rounded-lg hover:bg-slate-800 cursor-pointer">
          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-xs">GP</span>
          </div>
          <span>Explore GPTs</span>
        </div>

        {/* Scrollable activities list */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="w-6 h-6 text-slate-400 animate-spin" />
            </div>
          ) : (
            activityData.map((group) => (
              <div key={group.id} className="mt-6">
                <div className="px-4 py-2 text-xs font-medium text-slate-400">
                  {group.category}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="px-4 py-2 text-sm hover:bg-slate-800 cursor-pointer transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      {item.title}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with upgrade plan option and settings */}
        <div className="shrink-0 mt-auto border-t border-slate-800 p-4">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span>Upgrade plan</span>
            </div>
            <Settings className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-xs text-slate-500 mt-1">
            More access to the best models
          </div>
        </div>
      </aside>
    </>
  );
};

export default ActivitySidebar;