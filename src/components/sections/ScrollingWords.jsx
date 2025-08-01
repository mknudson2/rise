import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { scrollingWords } from "../../utils/constants";

const FADE_IN = 1200;
const HOLD = 1500;
const FADE_OUT = 1200;
const TOTAL = FADE_IN + HOLD + FADE_OUT;

const ScrollingWords = () => {
  const [spotlightOverlay, setSpotlightOverlay] = useState(null);
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

  // Enhanced visibility check - returns array of visible word objects
  const getVisibleWords = () => {
    if (!containerRef.current) return [];
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const wordElements = container.querySelectorAll("[data-word-id]");
    const visible = [];

    wordElements.forEach((element) => {
      const rect = element.getBoundingClientRect();
      const wordId = element.getAttribute("data-word-id");
      const isVisible =
        rect.right > containerRect.left + 100 &&
        rect.left < containerRect.right - 100;

      if (isVisible) {
        // Parse rowIndex and wordIndex from wordId
        const [rowIndex, wordIndex, ...wordParts] = wordId.split("-");
        visible.push({
          wordId,
          rowIndex: Number(rowIndex),
          wordIndex: Number(wordIndex),
          word: wordParts.join("-"),
          rect,
        });
      }
    });

    return visible;
  };

  // Enhanced overlay highlight logic with proper alignment
  const showSpotlightOverlay = (wordObj) => {
    // Get position relative to container
    const containerRect = containerRef.current.getBoundingClientRect();
    const { rect, wordId, word } = wordObj;
    
    // Get the DOM node for the highlighted word
    const el = containerRef.current.querySelector(`[data-word-id="${wordId}"]`);
    let fontSize = "inherit";
    let fontFamily = "inherit";
    let fontWeight = "inherit";
    let paddingLeft = "0px";
    let paddingRight = "0px";
    
    if (el) {
      const computed = window.getComputedStyle(el);
      fontSize = computed.fontSize;
      fontFamily = computed.fontFamily;
      fontWeight = computed.fontWeight;
      paddingLeft = computed.paddingLeft;
      paddingRight = computed.paddingRight;
    }

    // Position overlay so the word part aligns exactly with the grey word
    setSpotlightOverlay({
      word,
      wordId,
      left: rect.left - containerRect.left, // Keep word in same position
      top: rect.top - containerRect.top,
      width: rect.width,
      height: rect.height,
      fontSize,
      fontFamily,
      fontWeight,
      paddingLeft,
      paddingRight,
      phase: "fading-in",
    });

    setTimeout(() => {
      setSpotlightOverlay((prev) =>
        prev && prev.wordId === wordId
          ? { ...prev, phase: "highlighted" }
          : prev
      );
    }, FADE_IN);

    setTimeout(() => {
      setSpotlightOverlay((prev) =>
        prev && prev.wordId === wordId ? { ...prev, phase: "fading-out" } : prev
      );
    }, FADE_IN + HOLD);

    setTimeout(() => {
      setSpotlightOverlay((prev) =>
        prev && prev.wordId === wordId ? null : prev
      );
    }, TOTAL);
  };

  // Keep overlay position in sync with scrolling word
  useEffect(() => {
    if (!spotlightOverlay) return;

    let animationFrameId;

    const updateOverlayPosition = () => {
      const el = containerRef.current.querySelector(
        `[data-word-id="${spotlightOverlay.wordId}"]`
      );
      const containerRect = containerRef.current.getBoundingClientRect();
      if (el) {
        const rect = el.getBoundingClientRect();
        const computed = window.getComputedStyle(el);
        
        setSpotlightOverlay((prev) =>
          prev
            ? {
                ...prev,
                left: rect.left - containerRect.left,
                top: rect.top - containerRect.top,
                width: rect.width,
                height: rect.height,
                fontSize: computed.fontSize,
                fontFamily: computed.fontFamily,
                fontWeight: computed.fontWeight,
                paddingLeft: computed.paddingLeft,
                paddingRight: computed.paddingRight,
              }
            : prev
        );
      }
      animationFrameId = requestAnimationFrame(updateOverlayPosition);
    };

    animationFrameId = requestAnimationFrame(updateOverlayPosition);

    return () => {
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [spotlightOverlay?.wordId]);

  // Spotlight effect - only highlight truly visible word instances
  useEffect(() => {
    let isMounted = true;

    const highlightCycle = () => {
      if (!isMounted) return;
      const visibleWords = getVisibleWords();
      if (visibleWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * visibleWords.length);
        const selected = visibleWords[randomIndex];
        showSpotlightOverlay(selected);
      }
      setTimeout(highlightCycle, TOTAL);
    };

    highlightCycle();

    return () => {
      isMounted = false;
    };
  }, []);

  // Initialize with a visible word only
  useEffect(() => {
    const timer = setTimeout(() => {
      const visibleWords = getVisibleWords();
      if (visibleWords.length > 0) {
        const randomIndex = Math.floor(Math.random() * visibleWords.length);
        const selected = visibleWords[randomIndex];
        showSpotlightOverlay(selected);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  const WordElement = React.memo(({ word, rowIndex, wordIndex }) => {
    const uniqueId = `${rowIndex}-${wordIndex}-${word}`;
    
    // Calculate if this word should be dimmed (nearby the highlighted word)
    const shouldDim = spotlightOverlay && spotlightOverlay.wordId !== uniqueId;
    
    return (
      <span
        data-word-id={uniqueId}
        className="inline-block mx-6 sm:mx-8 md:mx-12 text-xl sm:text-2xl md:text-3xl lg:text-4xl select-none relative"
      >
        <span 
          className={`font-light text-gray-500 hover:text-gray-400 block whitespace-nowrap transition-opacity duration-1000 ease-out`}
          style={{
            opacity: shouldDim ? 0.15 : 0.4
          }}
        >
          {word}
        </span>
      </span>
    );
  });

  return (
    <section
      ref={containerRef}
      className="relative py-12 sm:py-16 bg-gray-900/20 overflow-hidden"
    >
      {/* Enhanced Overlay highlight with premium separation effects */}
      <AnimatePresence>
        {spotlightOverlay && (
          <>
            {/* Subtle backdrop for premium separation */}
            <motion.div
              key={`backdrop-${spotlightOverlay.wordId}`}
              className="pointer-events-none absolute z-10"
              style={{
                left: spotlightOverlay.left - (parseFloat(spotlightOverlay.fontSize) * 3.5),
                top: spotlightOverlay.top - (parseFloat(spotlightOverlay.fontSize) * 0.2),
                width: parseFloat(spotlightOverlay.fontSize) * 8,
                height: parseFloat(spotlightOverlay.fontSize) * 1.4,
                background: "rgba(0, 0, 0, 0.15)",
                backdropFilter: "blur(12px)",
                borderRadius: "12px",
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity:
                  spotlightOverlay.phase === "fading-in"
                    ? 1
                    : spotlightOverlay.phase === "highlighted"
                    ? 1
                    : spotlightOverlay.phase === "fading-out"
                    ? 0
                    : 0,
                scale: 1,
              }}
              transition={{
                duration:
                  spotlightOverlay.phase === "fading-in" ||
                  spotlightOverlay.phase === "fading-out"
                    ? 1.2
                    : 0,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            />

            {/* "RISE is" positioned with perfect spacing and subtle glow */}
            <motion.span
              key={`rise-${spotlightOverlay.wordId}`}
              className="pointer-events-none font-light bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap absolute z-20"
              style={{
                left: spotlightOverlay.left - (parseFloat(spotlightOverlay.fontSize) * 3.2),
                top: spotlightOverlay.top,
                height: spotlightOverlay.height,
                fontSize: spotlightOverlay.fontSize,
                fontFamily: spotlightOverlay.fontFamily,
                fontWeight: spotlightOverlay.fontWeight,
                display: "flex",
                alignItems: "center",
                textShadow: "0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2)",
                filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))",
              }}
              initial={{ opacity: 0, x: 20 }}
              animate={{
                opacity:
                  spotlightOverlay.phase === "fading-in"
                    ? 1
                    : spotlightOverlay.phase === "highlighted"
                    ? 1
                    : spotlightOverlay.phase === "fading-out"
                    ? 0
                    : 0,
                x: 0,
              }}
              transition={{
                duration:
                  spotlightOverlay.phase === "fading-in" ||
                  spotlightOverlay.phase === "fading-out"
                    ? 1.2
                    : 0,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            >
              RISE is
            </motion.span>

            {/* The highlighted word - perfectly aligned with subtle glow */}
            <motion.span
              key={`word-${spotlightOverlay.wordId}`}
              className="pointer-events-none font-light bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent whitespace-nowrap absolute z-20"
              style={{
                left: spotlightOverlay.left,
                top: spotlightOverlay.top,
                width: spotlightOverlay.width,
                height: spotlightOverlay.height,
                fontSize: spotlightOverlay.fontSize,
                fontFamily: spotlightOverlay.fontFamily,
                fontWeight: spotlightOverlay.fontWeight,
                paddingLeft: spotlightOverlay.paddingLeft,
                paddingRight: spotlightOverlay.paddingRight,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textShadow: "0 0 20px rgba(239, 68, 68, 0.4), 0 0 40px rgba(239, 68, 68, 0.2)",
                filter: "drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))",
              }}
              initial={{ opacity: 0 }}
              animate={{
                opacity:
                  spotlightOverlay.phase === "fading-in"
                    ? 1
                    : spotlightOverlay.phase === "highlighted"
                    ? 1
                    : spotlightOverlay.phase === "fading-out"
                    ? 0
                    : 0,
              }}
              transition={{
                duration:
                  spotlightOverlay.phase === "fading-in" ||
                  spotlightOverlay.phase === "fading-out"
                    ? 1.2
                    : 0,
                ease: [0.4, 0.0, 0.2, 1],
              }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {spotlightOverlay.word}
            </motion.span>
          </>
        )}
      </AnimatePresence>

      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/10 via-yellow-950/10 to-red-950/10 opacity-50" />
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

      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900/50 to-transparent pointer-events-none" />
    </section>
  );
};

export default ScrollingWords;