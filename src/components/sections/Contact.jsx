import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import Button from "../ui/Button";

const Contact = ({ openContactModal }) => {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30">
      <div className="max-w-4xl mx-auto text-center">
        <motion.h2
          className="text-4xl md:text-5xl font-bold mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Ready to Transform Your Life with{" "}
          <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
            RISE
          </span>
          ?
        </motion.h2>

        <motion.p
          className="text-xl text-gray-300 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Take the first step toward recovery or professional development. Our
          team is here to help you achieve what you thought was impossible.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button onClick={() => openContactModal("consultation")} size="lg">
            Book Free Consultation
          </Button>
          <Button
            onClick={() => openContactModal("professional")}
            variant="secondary"
            size="lg"
          >
            Professional Training
          </Button>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row justify-center items-center gap-8 text-gray-300 mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <Phone size={20} className="text-yellow-400" />
            <span>Contact for phone number</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={20} className="text-yellow-400" />
            <span>info@risechangeslives.com</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-yellow-400" />
            <span>Multiple locations</span>
          </div>
        </motion.div>

        {/* Emergency Notice */}
        <motion.div
          className="p-4 bg-red-900/20 border border-red-800 rounded-xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-red-300 text-sm">
            <strong>Medical Emergency:</strong> If you are experiencing a
            medical emergency, please call 911 or go to your nearest emergency
            room immediately.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
