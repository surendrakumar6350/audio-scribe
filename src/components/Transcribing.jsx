import React from 'react';
import { Loader2 } from 'lucide-react';
import Header from './Header';
import ActivitySidebar from './SideBar';

export default function Transcribing(props) {
  const { downloading, user, loadingLogIn, loggedIn } = props;

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800">
      <ActivitySidebar user={user} loggedIn={loggedIn} loadingLogIn={loadingLogIn} />

      <div className="flex-1 flex flex-col h-full">
        <Header user={user} loggedIn={loggedIn} loadingLogIn={loadingLogIn} />

        <main className='flex-1 p-4 flex flex-col gap-6 text-center justify-center animate-fade-in'>
          <h1 className='font-bold text-4xl sm:text-5xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300'>
            {downloading ? 'Processing' : 'Processing'}<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">...</span>
          </h1>
          <div className='grid place-items-center'>
            <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
          </div>
          <p className='text-gray-400 text-lg'>This might take a minute</p>
        </main>
      </div>
    </div>
  );
}