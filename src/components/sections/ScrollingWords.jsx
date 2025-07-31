import React from 'react';
import { motion } from 'framer-motion';
import { scrollingWords } from '../../utils/constants';

const ScrollingWords = () => {
  return (
    <div className="relative overflow-hidden py-8 border-t border-b border-gray-800">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-100%"] }}
        transition={{
          duration: 60,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        {/* Duplicate the words for seamless loop */}
        {[...scrollingWords, ...scrollingWords].map((word, index) => (
          <span 
            key={index} 
            className="mx-8 text-2xl md:text-3xl font-light text-gray-300"
          >
            {word}
          </span>
        ))}
      </motion.div>
    </div>
  );
};

export default ScrollingWords;