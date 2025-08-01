import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Button from "../ui/Button";
import styles from "./Hero.module.css";

const Hero = ({ openContactModal }) => {
  const [currentWord, setCurrentWord] = useState(0);
  const words = ["Recovery", "Innovation", "Science", "Excellence"];

  // Typewriter effect for rotating words
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 2500); // Slightly longer duration for smoother experience
    return () => clearInterval(interval);
  }, []);

  // Generate particles for animation
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${10 + i * 7}%`,
    delay: i * 0.5,
    duration: 8 + (i % 4),
  }));

  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-950 via-red-950/20 to-yellow-950/20">
        {/* CHANGED: Increased opacity from opacity-30 to opacity-60 for brighter flames */}
        <div
          className={`absolute inset-0 opacity-60 ${styles.animatedBackground}`}
        />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className={`${styles.particle} absolute`}
            style={{
              left: particle.left,
              animation: `${styles.particleRise} ${particle.duration}s linear infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-7xl mx-auto w-full">
          {/* Main RISE Title */}
          <motion.h1
            className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold mb-6 sm:mb-8"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <span
              className={`bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent ${styles.textGlow}`}
            >
              RISE
            </span>
          </motion.h1>

          {/* FIXED: Animated Subtitle with Working Cycling Text */}
          <motion.div
            className="h-12 sm:h-16 flex items-center justify-center mb-8 sm:mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
          >
            {/* CHANGED: Restructured layout to use flexbox instead of inline-block with absolute positioning */}
            <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-light text-gray-200 flex items-center justify-center flex-wrap gap-2">
              <span className="text-gray-200">Empowering</span>
              <span className="text-yellow-400">•</span>
              {/* CHANGED: From inline-block with absolute positioning to relative flexbox */}
              <div className="relative min-w-[180px] sm:min-w-[200px] flex justify-center">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={currentWord}
                    initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
                    transition={{
                      duration: 0.8,
                      ease: [0.25, 0.46, 0.45, 0.94], // Custom cubic-bezier for smoother motion
                    }}
                    className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent font-semibold block"
                  >
                    {words[currentWord]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Floating Stats Cards */}
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12 max-w-4xl mx-auto px-4"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5 }}
          >
            <motion.div
              className={`${styles.glassCard} rounded-xl p-4 sm:p-6 text-center cursor-pointer`}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
                3-5 Days
              </div>
              <div className="text-gray-300 text-sm">Revolutionary Results</div>
            </motion.div>

            <motion.div
              className={`${styles.glassCard} rounded-xl p-4 sm:p-6 text-center cursor-pointer`}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <div className="text-gray-300 text-sm">Lives Transformed</div>
            </motion.div>

            <motion.div
              className={`${styles.glassCard} rounded-xl p-4 sm:p-6 text-center cursor-pointer`}
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
                10x Faster
              </div>
              <div className="text-gray-300 text-sm">
                Than Traditional Methods
              </div>
            </motion.div>
          </motion.div>

          {/* Hero Description */}
          <motion.p
            className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto mb-8 sm:mb-12 leading-relaxed px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 2.0 }}
          >
            Experience the future of stroke and SCI recovery. Our
            evidence-based, high-intensity training achieves in days what
            traditional methods take months to accomplish.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center px-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 2.3 }}
          >
            <Button
              onClick={() => openContactModal("consultation")}
              size="lg"
              className={`w-full sm:w-auto min-h-[48px] ${styles.primaryButton} shadow-2xl hover:shadow-red-500/20`}
            >
              Start Your Journey
            </Button>
            <Button
              onClick={() => openContactModal("general")}
              variant="secondary"
              size="lg"
              className={`w-full sm:w-auto min-h-[48px] ${styles.secondaryButton} hover:border-yellow-400 hover:text-yellow-400`}
            >
              Discover RISE Method
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{
          opacity: { duration: 0.8, delay: 3.0 },
          y: { duration: 2, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <ChevronDown
          className="text-white/60 hover:text-yellow-400 transition-colors duration-300"
          size={32}
        />
      </motion.div>

      {/* Seamless Gradient Transition to Next Section */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-32 ${styles.gradientTransition} pointer-events-none z-20`}
      />
    </section>
  );
};

export default Hero;
