import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin } from "lucide-react";
import Button from "../ui/Button";

const Contact = ({ openContactModal }) => {
  return (
    <section
      id="contact"
      className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30"
    >
      <div className="max-w-4xl mx-auto text-center">
        {/* Mobile-optimized heading */}
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 sm:mb-8 px-2"
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

        {/* Mobile-optimized subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-gray-300 mb-8 sm:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          Take the first step toward recovery or professional development. Our
          team is here to help you achieve what you thought was impossible.
        </motion.p>

        {/* Mobile-optimized button layout */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-stretch sm:items-center mb-8 sm:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Button
            onClick={() => openContactModal("consultation")}
            size="lg"
            className="w-full sm:w-auto min-h-[48px]"
          >
            Book Free Consultation
          </Button>
          <Button
            onClick={() => openContactModal("professional")}
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto min-h-[48px]"
          >
            Professional Training
          </Button>
        </motion.div>

        {/* Mobile-optimized contact info - stacked on mobile */}
        <motion.div
          className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-4 sm:gap-8 text-gray-300 mb-8 sm:mb-12 px-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Phone size={18} className="text-yellow-400 flex-shrink-0" />
            <span className="text-sm sm:text-base">
              Contact for phone number
            </span>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <Mail size={18} className="text-yellow-400 flex-shrink-0" />
            <span className="text-sm sm:text-base break-all">
              info@risechangeslives.com
            </span>
          </div>
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <MapPin size={18} className="text-yellow-400 flex-shrink-0" />
            <span className="text-sm sm:text-base">Multiple locations</span>
          </div>
        </motion.div>

        {/* Mobile-optimized emergency notice */}
        <motion.div
          className="p-4 sm:p-6 bg-red-900/20 border border-red-800 rounded-xl text-center mx-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-red-300 text-sm sm:text-base font-medium leading-relaxed">
            <strong className="block sm:inline mb-1 sm:mb-0">
              Medical Emergency:
            </strong>
            <span className="block sm:inline">
              {" "}
              If you are experiencing a medical emergency, please call 911 or go
              to your nearest emergency room immediately.
            </span>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
