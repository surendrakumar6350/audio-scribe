import React, { useState } from 'react';
import { ChevronDown, Settings, Menu, X } from 'lucide-react';

const ActivitySidebar = ({ activities }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Default activities if none provided
  const defaultActivities = [
    {
      id: 1,
      category: 'Today',
      items: [
        { id: 'a1', title: 'IAM Role Deployment Fix' },
        { id: 'a2', title: 'Admin Panel Button Issue' }
      ]
    },
    {
      id: 2,
      category: 'Yesterday',
      items: [
        { id: 'b1', title: 'Get URL Search Params' },
        { id: 'b2', title: 'PWA Install Button Popup' },
        { id: 'b3', title: 'Vaul library explanation' },
        { id: 'b4', title: 'AWS credentials issue' },
        { id: 'b5', title: 'PWA Manifest Optimization' },
        { id: 'b6', title: 'PWA Install Button React' }
      ]
    }
  ];

  const activityData = activities || defaultActivities;

  // Mobile toggle button component
  const MobileToggle = () => (
    <button 
      className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-full bg-slate-800 text-white" 
      onClick={() => setIsOpen(!isOpen)}
    >
      {isOpen ? <X size={20} /> : <Menu size={20} />}
    </button>
  );

  return (
    <>
      <MobileToggle />
      
      {/* Overlay for mobile - only visible when sidebar is open */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar - hidden by default on mobile, shown when isOpen=true */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 min-h-screen bg-slate-950 text-white border-r border-slate-800 flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0
      `}>
        <div className="p-4 flex items-center gap-2 border-b border-slate-800">
          <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center">
            <span className="text-sm">AS</span>
          </div>
          <span className="font-medium">AudioScribe</span>
        </div>
        
        <div className="flex items-center gap-2 p-3 mx-2 my-2 rounded-lg hover:bg-slate-800 cursor-pointer">
          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-xs">AS</span>
          </div>
          <span>AudioScribe</span>
        </div>
        
        <div className="flex items-center gap-2 p-3 mx-2 rounded-lg hover:bg-slate-800 cursor-pointer">
          <div className="w-6 h-6 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-xs">GP</span>
          </div>
          <span>Explore GPTs</span>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {activityData.map((group) => (
            <div key={group.id} className="mt-6">
              <div className="px-4 py-2 text-xs font-medium text-slate-400">
                {group.category}
              </div>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <div 
                    key={item.id} 
                    className="px-4 py-2 text-sm hover:bg-slate-800 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    {item.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-auto border-t border-slate-800 p-4">
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
      </div>
    </>
  );
};

export default ActivitySidebar;