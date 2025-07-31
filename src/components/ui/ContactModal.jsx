// Updated ContactModal.jsx - Correct Netlify Implementation
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, X } from "lucide-react";
import { formConfigs, initialFormData } from "../../utils/formHelpers";
import Button from "./Button";

const ContactModal = ({ isOpen, onClose, defaultForm = "consultation" }) => {
  const [activeForm, setActiveForm] = useState(defaultForm);
  const [formData, setFormData] = useState(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [submitMessage, setSubmitMessage] = useState("");

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveForm(defaultForm);
      setSubmitStatus(null);
      setSubmitMessage("");
      setFormData(initialFormData);
    }
  }, [isOpen, defaultForm]);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Encode form data for Netlify
      const formBody = new FormData(e.target);

      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formBody).toString(),
      });

      if (response.ok) {
        setSubmitStatus("success");
        setSubmitMessage(
          "Thank you! We've received your request and will contact you within 24 hours."
        );

        // Auto close modal after success
        setTimeout(() => {
          onClose();
        }, 4000);
      } else {
        throw new Error("Form submission failed");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
      setSubmitMessage(
        "Sorry, there was a problem submitting your form. Please try again or contact us directly at info@risechangeslives.com"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentForm = formConfigs[activeForm];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative bg-gray-900 rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-800">
            <div>
              <h2 className="text-2xl font-bold text-white">Contact RISE</h2>
              <p className="text-gray-400">
                Let's start your transformation journey
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800 rounded-lg"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Form Selector & Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                {/* Contact Information */}
                <div className="bg-gray-800/50 p-4 rounded-xl">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Get in Touch
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Phone size={16} className="text-yellow-400" />
                      <span className="text-gray-300">
                        Contact for phone number
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail size={16} className="text-yellow-400" />
                      <span className="text-gray-300">
                        info@risechangeslives.com
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin size={16} className="text-yellow-400" />
                      <span className="text-gray-300">
                        Multiple locations available
                      </span>
                    </div>
                  </div>
                </div>

                {/* Form Type Selector */}
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Choose Your Path
                  </h3>
                  {Object.entries(formConfigs).map(([key, form]) => (
                    <button
                      key={key}
                      onClick={() => setActiveForm(key)}
                      className={`w-full p-3 rounded-lg text-left transition-all duration-200 text-sm ${
                        activeForm === key
                          ? "bg-gradient-to-r from-red-500 to-yellow-400 text-white"
                          : "bg-gray-800/50 text-gray-300 hover:bg-gray-700/50"
                      }`}
                    >
                      <div className="font-semibold">{form.title}</div>
                      <div className="text-xs opacity-80">{form.subtitle}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="lg:col-span-2">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeForm}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold text-white mb-2">
                      {currentForm.title}
                    </h3>
                    <p className="text-gray-400 mb-6 text-sm">
                      {currentForm.subtitle}
                    </p>

                    {submitStatus ? (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <div className="text-5xl mb-4">
                          {submitStatus === "success" ? "✅" : "❌"}
                        </div>
                        <h4 className="text-xl font-bold text-white mb-3">
                          {submitStatus === "success"
                            ? "Thank You!"
                            : "Submission Error"}
                        </h4>
                        <p
                          className={`text-sm ${
                            submitStatus === "success"
                              ? "text-gray-300"
                              : "text-red-300"
                          }`}
                        >
                          {submitMessage}
                        </p>
                        {submitStatus === "error" && (
                          <button
                            onClick={() => {
                              setSubmitStatus(null);
                              setSubmitMessage("");
                            }}
                            className="mt-4 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                          >
                            Try Again
                          </button>
                        )}
                      </motion.div>
                    ) : (
                      <form
                        onSubmit={handleSubmit}
                        className="space-y-4"
                        name={`rise-${activeForm}`}
                        method="POST"
                        data-netlify="true"
                        data-netlify-honeypot="bot-field"
                      >
                        {/* Hidden fields for Netlify */}
                        <input
                          type="hidden"
                          name="form-name"
                          value={`rise-${activeForm}`}
                        />

                        {/* Honeypot field for spam protection */}
                        <div style={{ display: "none" }}>
                          <label>
                            Don't fill this out: <input name="bot-field" />
                          </label>
                        </div>

                        {currentForm.fields.map((field, index) => (
                          <motion.div
                            key={field.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                          >
                            <label className="block text-sm font-medium text-gray-300 mb-1">
                              {field.label}{" "}
                              {field.required && (
                                <span className="text-red-400">*</span>
                              )}
                            </label>

                            {field.type === "select" ? (
                              <select
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleInputChange}
                                required={field.required}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                              >
                                <option value="">Select an option</option>
                                {field.options.map((option) => (
                                  <option key={option} value={option}>
                                    {option}
                                  </option>
                                ))}
                              </select>
                            ) : field.type === "textarea" ? (
                              <textarea
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleInputChange}
                                required={field.required}
                                rows={3}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200 resize-none"
                                placeholder={`Tell us about ${field.label.toLowerCase()}...`}
                              />
                            ) : (
                              <input
                                type={field.type}
                                name={field.name}
                                value={formData[field.name] || ""}
                                onChange={handleInputChange}
                                required={field.required}
                                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all duration-200"
                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                              />
                            )}
                          </motion.div>
                        ))}

                        <div className="mt-6">
                          <Button
                            type="submit"
                            loading={isSubmitting}
                            disabled={isSubmitting}
                            className="w-full"
                          >
                            {isSubmitting
                              ? "Submitting..."
                              : `Submit ${currentForm.title}`}
                          </Button>
                        </div>
                      </form>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ContactModal;
