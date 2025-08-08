// frontend/src/components/ui/CMSAccessButton.jsx - FIXED INDICATOR POSITIONING
import React, { useState, useEffect } from "react";
import { Settings, Eye, EyeOff, Keyboard, Shield, User } from "lucide-react";
import LoginModal from "../auth/LoginModal";
import AuthenticatedCMS from "../auth/AuthenticatedCMS";
import { useAuth } from "../../contexts/AuthContext";

const CMSAccessButton = ({ onClick }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showCMS, setShowCMS] = useState(false);
  const [showKeyboardHint, setShowKeyboardHint] = useState(false);
  const { user, isAuthenticated, login } = useAuth();

  // Keyboard shortcut to toggle CMS button visibility
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl+Shift+C or Cmd+Shift+C to toggle CMS button
      if (
        (event.ctrlKey || event.metaKey) &&
        event.shiftKey &&
        event.key === "C"
      ) {
        event.preventDefault();
        setIsVisible((prev) => !prev);

        // Show hint briefly when toggled via keyboard
        if (!isVisible) {
          setShowKeyboardHint(true);
          setTimeout(() => setShowKeyboardHint(false), 3000);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      setShowCMS(true);
    } else {
      setShowLoginModal(true);
    }
  };

  const handleLoginSuccess = (userData) => {
    login(userData);
    setShowLoginModal(false);
    setShowCMS(true);
  };

  const handleExitCMS = () => {
    setShowCMS(false);
  };

  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
    if (isVisible) {
      // Show keyboard hint when hiding
      setShowKeyboardHint(true);
      setTimeout(() => setShowKeyboardHint(false), 5000);
    }
  };

  // Show CMS as full screen overlay
  if (showCMS) {
    return <AuthenticatedCMS onExit={handleExitCMS} />;
  }

  return (
    <>
      {/* Keyboard Hint Notification */}
      {showKeyboardHint && (
        <div className="fixed top-4 right-4 z-[70] bg-black text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
          <div className="flex items-center space-x-2">
            <Keyboard className="h-4 w-4" />
            <span>
              Press <kbd className="bg-gray-700 px-1 rounded">Ctrl+Shift+C</kbd>{" "}
              to toggle CMS button
            </span>
          </div>
        </div>
      )}

      {/* CMS Access Button Container - FIXED: Added padding to accommodate indicators */}
      <div
        className={`fixed top-20 right-4 z-40 transition-all duration-300 ${
          isVisible ? "translate-x-0" : "translate-x-16"
        }`}
      >
        {/* Hide/Show Toggle - Always visible */}
        <div className="flex items-center">
          {/* Main CMS Button Container - FIXED: Added padding for indicators */}
          {isVisible && (
            <div className="relative p-2">
              {" "}
              {/* FIXED: Added padding container */}
              <button
                onClick={handleButtonClick}
                className="group relative bg-gradient-to-r from-red-500/90 to-yellow-400/90 backdrop-blur-sm text-white px-4 py-3 rounded-l-lg hover:from-red-600 hover:to-yellow-500 transition-all duration-300 shadow-lg hover:shadow-xl border border-white/20 hover:scale-105"
                title={
                  isAuthenticated ? `Open CMS (${user?.name})` : "Login to CMS"
                }
              >
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5 group-hover:rotate-90 transition-transform duration-300" />
                  <span className="font-medium text-sm hidden sm:inline">
                    {isAuthenticated ? "Content Manager" : "CMS Login"}
                  </span>
                </div>

                {/* Hover tooltip */}
                <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none z-10">
                  {isAuthenticated
                    ? `Logged in as ${user?.name} (${
                        user?.role === "super" ? "Super Admin" : "Admin"
                      })`
                    : "Secure CMS Access"}
                  <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-black"></div>
                </div>
              </button>
              {/* FIXED: Status indicator - positioned closer to the cog icon */}
              {isAuthenticated && (
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full bg-green-400 border border-white shadow-sm z-10">
                  <div className="w-full h-full bg-green-400 rounded-full animate-pulse"></div>
                </div>
              )}
              {/* FIXED: User role indicator - positioned closer to the cog icon */}
              {isAuthenticated && (
                <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-gray-900 border border-gray-600 flex items-center justify-center shadow-sm z-10">
                  {user?.role === "super" ? (
                    <Shield className="h-2 w-2 text-red-400" />
                  ) : (
                    <User className="h-2 w-2 text-blue-400" />
                  )}
                </div>
              )}
            </div>
          )}

          {/* Visibility Toggle - Always present */}
          <button
            onClick={handleToggleVisibility}
            className={`bg-gray-800/90 backdrop-blur-sm text-white p-2 hover:bg-gray-700 transition-all duration-300 shadow-lg border border-white/10 group ${
              isVisible ? "rounded-r-lg" : "rounded-lg"
            }`}
            title={
              isVisible
                ? "Hide CMS Button (Ctrl+Shift+C)"
                : "Show CMS Button (Ctrl+Shift+C)"
            }
          >
            {isVisible ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}

            {/* Keyboard shortcut hint */}
            {!isVisible && (
              <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                Press Ctrl+Shift+C or click to show
                <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-black"></div>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Login Modal */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Add custom styles for animations */}
      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }

        kbd {
          font-family: ui-monospace, SFMono-Regular, "SF Mono", Monaco, Consolas,
            "Liberation Mono", "Courier New", monospace;
          font-size: 0.75rem;
          font-weight: 600;
        }
      `}</style>
    </>
  );
};

export default CMSAccessButton;
