import { useState } from "react";

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
