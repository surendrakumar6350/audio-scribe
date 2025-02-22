import React from 'react';
import { Mic } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6 px-4 glass-morphism mb-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Mic className="w-8 h-8 text-purple-400" />
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
            Audio<span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Scribe</span>
          </span>
        </div>
        <nav className="hidden sm:flex items-center gap-6">
          <a href="#features" className="text-gray-300 hover:text-white transition-colors">Features</a>
          <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
          <a href="#contact" className="specialBtn px-4 py-2 rounded-lg">Contact</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;