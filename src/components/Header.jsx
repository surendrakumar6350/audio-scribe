import React, { useState } from "react";
import { Mic, LogIn, LogOut, Loader } from "lucide-react";
import { LoginDialog } from "./LoginDialog";

const Header = ({ loadingLogIn, loggedIn }) => {
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="w-full py-6 px-4 glass-morphism mb-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2 ml-10">
          <Mic className="w-8 h-8 text-purple-400" />
          <span className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            Audio
          </span>
          <span className="text-xl font-semibold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            Scribe
          </span>
        </div>

        {/* Show loading spinner when details are loading */}
        {loadingLogIn ? (
          <Loader className="w-6 h-6 text-gray-300 animate-spin" />
        ) : (
          <div className="flex items-center gap-4">
            {loggedIn ? (
              // Show Logout button when logged in
              <button
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              // Show Login button when not logged in
              <button
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                onClick={() => setShowLoginDialog(true)}
              >
                <LogIn className="w-5 h-5" />
                <span>Login</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Show login dialog when login button is clicked */}
      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    </header>
  );
};

export default Header;
