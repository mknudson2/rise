import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navItems } from "../../utils/constants";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showLinks, setShowLinks] = useState(false);

  // Track scroll position for adaptive transparency
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);

      // Consider "scrolled" after moving past hero section (roughly 80vh)
      const heroHeight = window.innerHeight * 0.8;
      setIsScrolled(currentScrollY > heroHeight);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Show links after navbar entrance animation (only set once)
  useEffect(() => {
    if (!showLinks) {
      const timer = setTimeout(() => setShowLinks(true), 600); // navbar animates in 0.6s
      return () => clearTimeout(timer);
    }
  }, [showLinks]);

  // Get background styles based on scroll state
  const getBackgroundStyles = () => {
    if (isScrolled) {
      return {
        background: "rgba(17, 24, 39, 0.95)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(107, 114, 128, 0.3)",
        boxShadow: "0 4px 24px rgba(0, 0, 0, 0.1)",
      };
    } else {
      return {
        background: `rgba(17, 24, 39, ${
          0.1 + (scrollY / (window.innerHeight * 0.8)) * 0.4
        })`,
        backdropFilter: "blur(12px)",
        borderBottom: `1px solid rgba(107, 114, 128, ${
          0.1 + (scrollY / (window.innerHeight * 0.8)) * 0.2
        })`,
        boxShadow: "none",
      };
    }
  };

  return (
    <motion.nav
      className="fixed top-0 w-full z-50 transition-all duration-500 ease-out"
      style={getBackgroundStyles()}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.4, 0.0, 0.2, 1] }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo + RISE Text */}
          <motion.a
            href="#"
            className="flex items-center space-x-3 cursor-pointer"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.img
              src="/assets/logo/logo-dark.png"
              alt="RISE logo - Phoenix rising"
              className="h-8 w-8 object-contain"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            />
            <motion.span
              className="text-2xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              RISE
            </motion.span>
          </motion.a>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8">
            {showLinks &&
              navItems.map((item, index) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase().replace(" ", "-")}`}
                  className={`relative font-medium transition-all duration-300 ${
                    isScrolled
                      ? "text-white hover:text-yellow-400"
                      : "text-white/90 hover:text-yellow-400"
                  }`}
                  initial={{ opacity: 1 }}
                  // animate={{ opacity: 1 }}
                  // transition={{
                  //   duration: 1.2,
                  //   delay: 0.12 * index,
                  //   ease: [0.4, 0.0, 0.2, 1],
                  // }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                  {/* Hover underline effect */}
                  <motion.div
                    className="absolute -bottom-1 left-0 h-0.5 bg-gradient-to-r from-red-500 to-yellow-400"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.a>
              ))}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className={`md:hidden transition-colors duration-300 p-2 rounded-lg ${
              isScrolled
                ? "text-white hover:bg-gray-800"
                : "text-white/90 hover:bg-white/10"
            }`}
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Enhanced Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
              className="md:hidden overflow-hidden"
              style={{
                background: isScrolled
                  ? "rgba(17, 24, 39, 0.98)"
                  : "rgba(17, 24, 39, 0.95)",
                backdropFilter: "blur(20px)",
                borderTop: "1px solid rgba(107, 114, 128, 0.2)",
                marginTop: "1px",
              }}
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {showLinks &&
                  navItems.map((item, index) => (
                    <motion.a
                      key={item}
                      href={`#${item.toLowerCase().replace(" ", "-")}`}
                      className="block px-4 py-3 text-white/90 hover:text-yellow-400 hover:bg-white/5 rounded-lg transition-all duration-200 font-medium"
                      onClick={() => setIsOpen(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{
                        duration: 1.2,
                        delay: 0.12 * index,
                        ease: [0.4, 0.0, 0.2, 1],
                      }}
                      whileHover={{ x: 8 }}
                    >
                      {item}
                    </motion.a>
                  ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
};

export default Header;
