import React, { useState } from "react";
import { Mic, LogIn, LogOut, Loader } from "lucide-react";
import { LoginDialog } from "./LoginDialog";

// Header component displays the app logo and authentication controls
// Props:
// - loadingLogIn: Boolean indicating if auth state is loading
// - loggedIn: Boolean indicating if user is authenticated
const Header = ({ loadingLogIn, loggedIn }) => {
  // State to control visibility of login dialog
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Handles user logout by removing auth token and refreshing page
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="w-full py-6 px-4 glass-morphism mb-12">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo and app name */}
        <div className="flex items-center gap-2 ml-10">
          <Mic className="w-8 h-8 text-purple-400" />
          <span onClick={() => window.location.href = "/"} className="text-xl cursor-pointer font-semibold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
            AudioScribe
          </span>
        </div>

        {/* Authentication status and controls */}
        {loadingLogIn ? (
          <Loader className="w-6 h-6 text-gray-300 animate-spin" />
        ) : (
          <div className="flex items-center gap-4">
            {loggedIn ? (
              // Logout button for authenticated users
              <button
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            ) : (
              // Login button for unauthenticated users
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

      {/* Login dialog component */}
      <LoginDialog isOpen={showLoginDialog} onClose={() => setShowLoginDialog(false)} />
    </header>
  );
};

export default Header;