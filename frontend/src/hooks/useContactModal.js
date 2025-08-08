import { useState } from "react";

const API_BASE =
  process.env.NODE_ENV === "production"
    ? "https://your-production-api.com/api"
    : "/api"; // This will proxy to localhost:5000 in development

export const useContactModal = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [defaultModalForm, setDefaultModalForm] = useState("consultation");

  const openContactModal = (formType = "consultation") => {
    setDefaultModalForm(formType);
    setIsContactModalOpen(true);
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
  };

  return {
    isOpen: isContactModalOpen,
    modalForm: defaultModalForm,
    openModal: openContactModal,
    closeModal: closeContactModal,
  };
};
