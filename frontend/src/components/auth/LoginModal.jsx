import React, { useState } from "react";
import { X, Mail, Shield, AlertCircle, CheckCircle } from "lucide-react";

const LoginModal = ({ isOpen, onClose, onLoginSuccess }) => {
  const [step, setStep] = useState(1); // 1: email, 2: verification
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const API_BASE = import.meta.env.PROD
    ? "https://your-production-api.com/api"
    : "http://localhost:3001/api";

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setCode("");
    setError("");
    setSuccess("");
    setLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      setSuccess("Verification code sent to your email!");
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE}/auth/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Verification failed");
      }

      // Store token and user data
      localStorage.setItem("cms-token", data.token);
      localStorage.setItem("cms-user", JSON.stringify(data.user));

      setSuccess("Login successful! Redirecting...");

      // Call success callback with user data
      setTimeout(() => {
        onLoginSuccess(data.user);
        handleClose();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    // FIXED: Proper z-index and styling
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto text-gray-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-yellow-400 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-6 w-6 text-white" />
              <h2 className="text-xl font-bold text-white">RISE CMS Login</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {step === 1 ? (
            /* Step 1: Email */
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Secure Access Required
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Enter your email to receive a verification code for secure
                  access to the content management system.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-gray-900 bg-white"
                    placeholder="your-email@example.com"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-red-500 to-yellow-400 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Sending Code...</span>
                  </div>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Verification Code */
            <form onSubmit={handleCodeSubmit} className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Enter Verification Code
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  We've sent a 6-digit verification code to{" "}
                  <strong>{email}</strong>. Please check your email and enter
                  the code below.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) =>
                    setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all text-center text-xl font-mono tracking-widest text-gray-900 bg-white"
                  placeholder="000000"
                  maxLength="6"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Code expires in 10 minutes
                </p>
              </div>

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {success && (
                <div className="flex items-center space-x-2 text-green-600 bg-green-50 p-3 rounded-lg">
                  <CheckCircle className="h-5 w-5" />
                  <span className="text-sm">{success}</span>
                </div>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading || code.length !== 6}
                  className="w-full bg-gradient-to-r from-red-500 to-yellow-400 text-white py-3 px-4 rounded-lg hover:from-red-600 hover:to-yellow-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Verifying...</span>
                    </div>
                  ) : (
                    "Verify & Login"
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-full text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-100 transition-all text-sm"
                  disabled={loading}
                >
                  ← Back to Email
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Secure access powered by two-factor authentication. Your account
              is protected with industry-standard security measures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
