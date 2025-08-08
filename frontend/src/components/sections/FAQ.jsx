import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Search, X } from "lucide-react";
import { faqs } from "../../utils/constants";
import { useContent } from "../../hooks/useContent";

const FAQ = () => {
  const { content, loading } = useContent();
  const [openFAQ, setOpenFAQ] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = content?.faq || [];

  // Filter FAQs based on search term
  const filteredFaqs = faqs.filter((faq) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      faq.question.toLowerCase().includes(searchLower) ||
      faq.answer.toLowerCase().includes(searchLower)
    );
  });

  const clearSearch = () => {
    setSearchTerm("");
    setOpenFAQ(null); // Close any open FAQ when clearing search
  };

  const highlightText = (text, highlight) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-400/30 text-yellow-200 rounded px-1"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
            FAQ
          </span>
        </motion.h2>

        {/* Search Bar */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search FAQs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-gray-900/50 border border-gray-800 rounded-lg 
                          text-white placeholder-gray-400 focus:outline-none focus:ring-2 
                          focus:ring-yellow-400 focus:border-transparent transition-all duration-300"
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 
                            hover:text-white transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Results Count */}
            {searchTerm && (
              <div className="mt-3 text-sm text-gray-400 text-center">
                {filteredFaqs.length === 0 ? (
                  <span className="text-gray-500">
                    No FAQs found matching "{searchTerm}"
                  </span>
                ) : (
                  <span>
                    Found {filteredFaqs.length} FAQ
                    {filteredFaqs.length !== 1 ? "s" : ""}
                    {filteredFaqs.length < faqs.length && ` of ${faqs.length}`}
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-4">
          <AnimatePresence>
            {filteredFaqs.length === 0 && searchTerm ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-12"
              >
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg mb-2">
                    No FAQs found for "{searchTerm}"
                  </p>
                  <p className="text-sm">
                    Try a different search term or browse all questions below.
                  </p>
                </div>
                <button
                  onClick={clearSearch}
                  className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200 underline"
                >
                  Show all FAQs
                </button>
              </motion.div>
            ) : (
              filteredFaqs.map((faq, index) => (
                <motion.div
                  key={`${faq.question}-${index}`}
                  className="bg-gray-900/50 border border-gray-800 rounded-lg"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  layout
                >
                  <button
                    className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-800/30 
                              transition-all duration-300"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <span className="text-white font-semibold">
                      {searchTerm
                        ? highlightText(faq.question, searchTerm)
                        : faq.question}
                    </span>
                    <ChevronDown
                      className={`text-yellow-400 transition-transform duration-200 ${
                        openFAQ === index ? "rotate-180" : ""
                      }`}
                      size={20}
                    />
                  </button>
                  <AnimatePresence>
                    {openFAQ === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="px-6 pb-6"
                      >
                        <p className="text-gray-300">
                          {searchTerm
                            ? highlightText(faq.answer, searchTerm)
                            : faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
