import React from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Button from "../ui/Button";

const Hero = ({ openContactModal }) => {
  return (
    <section className="min-h-screen flex flex-col justify-center px-4 sm:px-6 lg:px-8 pt-16">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-8"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
              RISE
            </span>
          </motion.h1>

          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl font-light text-white mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover High-Intensity Training with{" "}
            <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent font-bold">
              RISE
            </span>
          </motion.h2>

          <motion.p
            className="text-lg md:text-xl text-gray-300 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            Stroke and SCI recovery is entering a new era. RISE has pioneered
            cutting-edge, evidence-based, neuro-fitness techniques that are
            producing statistically significant gains that are simply
            remarkable. The mind-blowing fact is that these results occur after
            a 3-5 day high-intensity boot camp that in some cases, "traditional"
            techniques aren't achieving after up to 10 months.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <Button onClick={() => openContactModal("consultation")} size="lg">
              Start Your Journey
            </Button>
            <Button
              onClick={() => openContactModal("general")}
              variant="secondary"
              size="lg"
            >
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <ChevronDown className="text-white opacity-60" size={32} />
      </motion.div>
    </section>
  );
};

export default Hero;
