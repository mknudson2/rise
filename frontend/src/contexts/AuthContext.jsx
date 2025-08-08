// frontend/src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const API_BASE = import.meta.env.PROD
    ? "https://your-production-api.com/api"
    : "http://localhost:3001/api";

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("cms-token");
      const storedUser = localStorage.getItem("cms-user");

      if (!token || !storedUser) {
        setLoading(false);
        return;
      }

      // Verify token is still valid
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Token is invalid, clear storage
        localStorage.removeItem("cms-token");
        localStorage.removeItem("cms-user");
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      localStorage.removeItem("cms-token");
      localStorage.removeItem("cms-user");
    } finally {
      setLoading(false);
    }
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem("cms-token");
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("cms-token");
      localStorage.removeItem("cms-user");
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isSuperAdmin: user?.role === "super",
    isAdmin: user?.role === "admin" || user?.role === "super",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
