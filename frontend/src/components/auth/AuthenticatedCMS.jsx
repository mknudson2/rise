import React, { useState } from "react";
import { LogOut, User, Shield, Users } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import RiseCMS from "../cms/RiseCMS";
import UserManagement from "./UserManagement";

const AuthenticatedCMS = ({ onExit }) => {
  const { user, logout, isSuperAdmin } = useAuth();
  const [activeView, setActiveView] = useState("cms");

  const handleLogout = async () => {
    if (confirm("Are you sure you want to log out?")) {
      await logout();
      onExit();
    }
  };

  const handleExit = () => {
    setActiveView("cms");
    onExit();
  };

  return (
    // FIXED: Full screen overlay with proper styling
    <div className="fixed inset-0 z-50 bg-gray-100 text-gray-900 overflow-auto">
      {/* Top Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side */}
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                RISE CMS
              </h1>

              {/* Navigation Tabs */}
              <div className="hidden md:flex space-x-1">
                <button
                  onClick={() => setActiveView("cms")}
                  className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    activeView === "cms"
                      ? "bg-red-100 text-red-700"
                      : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Content Manager
                </button>

                {isSuperAdmin && (
                  <button
                    onClick={() => setActiveView("users")}
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors flex items-center space-x-1 ${
                      activeView === "users"
                        ? "bg-red-100 text-red-700"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Users className="h-4 w-4" />
                    <span>User Management</span>
                  </button>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* User Info */}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  {user.role === "super" ? (
                    <Shield className="h-4 w-4 text-red-500" />
                  ) : (
                    <User className="h-4 w-4 text-blue-500" />
                  )}
                  <span className="hidden sm:inline font-medium text-gray-900">
                    {user.name}
                  </span>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "super"
                      ? "bg-red-100 text-red-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role === "super" ? "Super Admin" : "Admin"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleExit}
                  className="text-gray-600 hover:text-gray-800 px-3 py-2 text-sm font-medium transition-colors"
                >
                  Exit CMS
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-red-600 hover:text-red-800 px-3 py-2 text-sm font-medium transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isSuperAdmin && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveView("cms")}
              className={`flex-1 py-3 text-sm font-medium text-center ${
                activeView === "cms"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500"
              }`}
            >
              Content
            </button>
            <button
              onClick={() => setActiveView("users")}
              className={`flex-1 py-3 text-sm font-medium text-center ${
                activeView === "users"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "text-gray-500"
              }`}
            >
              Users
            </button>
          </div>
        </div>
      )}

      {/* Content Area - FIXED: Proper text colors */}
      <div className="bg-gray-100 min-h-screen text-gray-900">
        {activeView === "cms" ? (
          <div style={{ color: "#1f2937" }}>
            <RiseCMS onExit={handleExit} hideHeader={true} />
          </div>
        ) : (
          <div className="p-6" style={{ color: "#1f2937" }}>
            <UserManagement />
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthenticatedCMS;
