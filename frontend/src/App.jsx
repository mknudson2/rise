// frontend/src/App.jsx - Updated without separate CMS button
import React from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Header from "./components/layout/Header";
import Hero from "./components/sections/Hero";
import ScrollingWords from "./components/sections/ScrollingWords";
import SuccessPathways from "./components/sections/SuccessPathways";
import Testimonials from "./components/sections/Testimonials";
import RiseMethod from "./components/sections/RiseMethod";
import Team from "./components/sections/Team";
import FAQ from "./components/sections/FAQ";
import Contact from "./components/sections/Contact";
import ContactModal from "./components/ui/ContactModal";
import { useContactModal } from "./hooks/useContactModal";

const AppContent = () => {
  const { isOpen, openModal, closeModal, modalForm } = useContactModal();

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Header />

      {/* CMS button is now integrated into the Header component */}

      <Hero openContactModal={openModal} />
      <ScrollingWords />
      <SuccessPathways openContactModal={openModal} />
      <Testimonials openContactModal={openModal} />
      <RiseMethod openContactModal={openModal} />
      <Team openContactModal={openModal} />
      <FAQ />
      <Contact openContactModal={openModal} />

      <ContactModal
        isOpen={isOpen}
        onClose={closeModal}
        defaultForm={modalForm}
      />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
