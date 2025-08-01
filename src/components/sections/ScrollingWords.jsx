import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { scrollingWords } from "../../utils/constants";

const ScrollingWords = () => {
  const [spotlightWord, setSpotlightWord] = useState(null);
  const [isHighlighted, setIsHighlighted] = useState({}); // Track highlight state per word
  const containerRef = useRef(null);

  // Create multiple rows for more visual interest
  const createWordRows = () => {
    const wordsPerRow = Math.ceil(scrollingWords.length / 3);
    return [
      scrollingWords.slice(0, wordsPerRow),
      scrollingWords.slice(wordsPerRow, wordsPerRow * 2),
      scrollingWords.slice(wordsPerRow * 2),
    ];
  };

  const wordRows = createWordRows();

  // Create a flat array of all words for spotlight selection
  const allWordsFlat = wordRows.flatMap((row, rowIndex) =>
    row.map((word, wordIndex) => ({
      word,
      rowIndex,
      wordIndex,
      uniqueId: `${rowIndex}-${wordIndex}-${word}`,
    }))
  );

  // Enhanced visibility check - more precise detection
  const getVisibleWords = () => {
    if (!containerRef.current) return [];

    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const wordElements = container.querySelectorAll("[data-word-id]");
    const visible = [];

    wordElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const wordId = element.getAttribute("data-word-id");

      // More precise visibility check - word must be substantially visible
      const isVisible =
        rect.right > containerRect.left + 100 &&
        rect.left < containerRect.right - 100 &&
        rect.bottom > containerRect.top &&
        rect.top < containerRect.bottom;

      if (isVisible) {
        visible.push(wordId);
      }
    });

    return visible;
  };

  // Simplified timing - no intermediate states to prevent animation restarts
  const highlightWord = (wordId) => {
    // Start with highlighted state (will fade in from 0 to 1)
    setIsHighlighted((prev) => ({ ...prev, [wordId]: "highlighted" }));

    // After hold period, start fade-out
    setTimeout(() => {
      setIsHighlighted((prev) => ({ ...prev, [wordId]: "fading-out" }));
    }, 4200); // 1200ms fade-in + 3000ms hold

    // Clean up after fade-out completes
    setTimeout(() => {
      setIsHighlighted((prev) => {
        const newState = { ...prev };
        delete newState[wordId];
        return newState;
      });
    }, 5400); // 1200ms fade-in + 3000ms hold + 1200ms fade-out
  };

  // Spotlight effect - ONLY highlight visible words on screen
  useEffect(() => {
    const interval = setInterval(() => {
      const visibleWords = getVisibleWords();

      // Only proceed if there are actually visible words
      if (visibleWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * visibleWords.length);
        const selectedWord = visibleWords[randomIndex];
        setSpotlightWord(selectedWord);
        highlightWord(selectedWord);
      }
    }, 6000); // Extended cycle to 6 seconds to accommodate longer transitions

    return () => clearInterval(interval);
  }, [allWordsFlat]);

  // Initialize with a visible word only
  useEffect(() => {
    const timer = setTimeout(() => {
      const visibleWords = getVisibleWords();
      if (visibleWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * visibleWords.length);
        const selectedWord = visibleWords[randomIndex];
        setSpotlightWord(selectedWord);
        highlightWord(selectedWord);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const WordElement = ({ word, rowIndex, wordIndex }) => {
    const uniqueId = `${rowIndex}-${wordIndex}-${word}`;
    const highlightState = isHighlighted[uniqueId];

    return (
      <span
        data-word-id={uniqueId}
        className="inline-block mx-6 sm:mx-8 md:mx-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl select-none relative"
      >
        {/* Base gray text - more subtle with reduced opacity */}
        <span className="font-light text-gray-500 hover:text-gray-400 block whitespace-nowrap opacity-40">
          {word}
        </span>

        {/* Gradient overlay with proper fade in AND fade out */}
        <motion.span
          className="absolute inset-0 top-0 left-0 font-light bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity:
              highlightState === "highlighted"
                ? 1
                : highlightState === "fading-out"
                ? 0
                : 0,
          }}
          transition={{
            duration: 1.2,
            ease: [0.4, 0.0, 0.2, 1], // Custom cubic-bezier for smooth fade
          }}
        >
          {word}
        </motion.span>
      </span>
    );
  };

  return (
    <section
      ref={containerRef}
      className="relative py-12 sm:py-16 bg-gray-900/20 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-yellow-950/10 to-red-950/10 opacity-50" />

        {/* Floating particles */}
        {Array.from({ length: 8 }, (_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-red-500 to-yellow-400 rounded-full opacity-30"
            style={{
              left: `${10 + i * 10}%`,
              top: `${20 + (i % 3) * 30}%`,
            }}
            animate={{
              y: [-10, 10, -10],
              opacity: [0.2, 0.6, 0.2],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 4 + (i % 3),
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}
      </div>

      {/* Glass morphism container */}
      <div className="relative backdrop-blur-sm bg-gray-900/10 border-y border-gray-800/50">
        {/* Top Row - Left to Right */}
        <div className="relative overflow-hidden py-4">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 80,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Duplicate for seamless loop */}
            {[...wordRows[0], ...wordRows[0], ...wordRows[0]].map(
              (word, index) => (
                <WordElement
                  key={`row1-${index}`}
                  word={word}
                  rowIndex={0}
                  wordIndex={index % wordRows[0].length}
                />
              )
            )}
          </motion.div>
        </div>

        {/* Middle Row - Right to Left (Opposite Direction) */}
        <div className="relative overflow-hidden py-4">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["-100%", "0%"] }}
            transition={{
              duration: 70,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...wordRows[1], ...wordRows[1], ...wordRows[1]].map(
              (word, index) => (
                <WordElement
                  key={`row2-${index}`}
                  word={word}
                  rowIndex={1}
                  wordIndex={index % wordRows[1].length}
                />
              )
            )}
          </motion.div>
        </div>

        {/* Bottom Row - Left to Right (Slower) */}
        <div className="relative overflow-hidden py-4">
          <motion.div
            className="flex whitespace-nowrap"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              duration: 90,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {[...wordRows[2], ...wordRows[2], ...wordRows[2]].map(
              (word, index) => (
                <WordElement
                  key={`row3-${index}`}
                  word={word}
                  rowIndex={2}
                  wordIndex={index % wordRows[2].length}
                />
              )
            )}
          </motion.div>
        </div>
      </div>

      {/* Fade edges for smooth visual transition */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none z-10" />

      {/* Bottom gradient transition */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />
    </section>
  );
};

export default ScrollingWords;
