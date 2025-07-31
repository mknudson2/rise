import React from "react";
import Header from "./components/layout/Header";
import Hero from "./components/sections/Hero";
import ScrollingWords from "./components/sections/ScrollingWords";
import SuccessPathways from "./components/sections/SuccessPathways";
import Testimonials from "./components/sections/Testimonials";
import Team from "./components/sections/Team";
import FAQ from "./components/sections/FAQ";
import Contact from "./components/sections/Contact";
import ContactModal from "./components/ui/ContactModal";
import { useContactModal } from "./hooks/useContactModal";

const App = () => {
  const { isOpen, openModal, closeModal, modalForm } = useContactModal();

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      <Header />
      <Hero openContactModal={openModal} />
      <ScrollingWords />
      <SuccessPathways openContactModal={openModal} />
      <Testimonials openContactModal={openModal} />
      <Team openContactModal={openModal} />
      <FAQ />
      <Contact openContactModal={openModal} />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isOpen}
        onClose={closeModal}
        defaultForm={modalForm}
      />
    </div>
  );
};

export default App;
