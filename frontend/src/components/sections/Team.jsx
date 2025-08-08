import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Button from "../ui/Button";
import TeamImage from "../ui/TeamImage";
import { useContent } from "../../hooks/useContent"; // Add this import

const Team = ({ openContactModal }) => {
  const { content, loading } = useContent(); // Add this hook
  const [expandedCard, setExpandedCard] = useState(null);

  const toggleCard = (index) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  if (loading) {
    return (
      <section id="team" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-gray-300">Loading team information...</div>
        </div>
      </section>
    );
  }

  // Use dynamic team data from API
  const teamMembers = content?.team || [];

  return (
    <section id="team" className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Meet the{" "}
            <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
              Team
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            The dedicated professionals behind RISE's revolutionary approach to
            stroke and SCI recovery
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id || index}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              layout
            >
              <motion.div
                className={`bg-gray-900/50 rounded-3xl border border-gray-800 overflow-hidden cursor-pointer transition-all duration-500 hover:border-gray-600 hover:shadow-2xl h-full flex flex-col ${
                  expandedCard === index
                    ? "border-yellow-400/50 shadow-xl shadow-yellow-400/10"
                    : "group-hover:scale-105"
                }`}
                onClick={() => toggleCard(index)}
                layout
                transition={{
                  layout: { duration: 0.6, ease: [0.4, 0.0, 0.2, 1] },
                }}
              >
                {/* Image Section */}
                <TeamImage
                  src={member.image}
                  fallback={member.imageFallback}
                  alt={member.alt || `${member.name} - ${member.title}`}
                  gradientFrom={member.gradientFrom || "from-red-500"}
                  gradientTo={member.gradientTo || "to-yellow-400"}
                />

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-6 h-24 flex items-start">
                    <div className="flex items-start justify-between w-full">
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-white mb-1">
                          {member.name}
                        </h3>
                        <p
                          className={`text-lg font-semibold bg-gradient-to-r ${
                            member.gradientFrom || "from-red-500"
                          } ${
                            member.gradientTo || "to-yellow-400"
                          } bg-clip-text text-transparent mb-1`}
                        >
                          {member.title}
                        </p>
                        <p className="text-sm text-gray-400 italic">
                          {member.subtitle}
                        </p>
                      </div>

                      {/* Expand/Collapse Indicator */}
                      <motion.div
                        className="ml-4 flex-shrink-0"
                        animate={{ rotate: expandedCard === index ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <ChevronDown
                          className={`w-6 h-6 transition-colors duration-300 ${
                            expandedCard === index
                              ? "text-yellow-400"
                              : "text-gray-500"
                          }`}
                        />
                      </motion.div>
                    </div>
                  </div>

                  {/* Bio Section with Smooth Expansion */}
                  <motion.div
                    layout
                    initial={false}
                    className="flex-1 flex flex-col"
                  >
                    <AnimatePresence mode="wait">
                      {expandedCard === index ? (
                        // Expanded Bio
                        <motion.div
                          key="expanded"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{
                            duration: 0.5,
                            ease: [0.4, 0.0, 0.2, 1],
                            opacity: { duration: 0.3, delay: 0.1 },
                          }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-300 text-sm leading-relaxed mb-6">
                            {member.bio}
                          </p>

                          {/* Enhanced Specialties for Expanded View */}
                          <div className="mb-4">
                            <h4 className="text-white font-semibold mb-3 text-sm uppercase tracking-wide">
                              Specialties
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {(member.specialties || []).map(
                                (specialty, idx) => (
                                  <motion.span
                                    key={idx}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`px-3 py-2 bg-gradient-to-r ${
                                      member.gradientFrom || "from-red-500"
                                    } ${
                                      member.gradientTo || "to-yellow-400"
                                    } bg-opacity-10 text-white text-xs rounded-full border border-gray-600 hover:border-gray-500 transition-all duration-200`}
                                  >
                                    {specialty}
                                  </motion.span>
                                )
                              )}
                            </div>
                          </div>

                          {/* Click to Collapse Hint - Fixed Height */}
                          <div className="h-8 flex items-center justify-center border-t border-gray-800 pt-2 mt-4">
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.4 }}
                              className="text-center"
                            >
                              <p className="text-gray-500 text-xs">
                                Click anywhere to collapse
                              </p>
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : (
                        // Collapsed Bio Preview
                        <motion.div
                          key="collapsed"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          {/* Bio Preview - Fixed Height */}
                          <div className="h-16 mb-4">
                            <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                              {member.bio}
                            </p>
                          </div>

                          {/* Specialties Tags - Fixed Height */}
                          <div className="h-12 mb-4 flex items-start">
                            <div className="flex flex-wrap gap-2">
                              {(member.specialties || [])
                                .slice(0, 2)
                                .map((specialty, idx) => (
                                  <span
                                    key={idx}
                                    className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700"
                                  >
                                    {specialty}
                                  </span>
                                ))}
                              {(member.specialties || []).length > 2 && (
                                <span className="px-3 py-1 bg-gray-800 text-gray-400 text-xs rounded-full border border-gray-700">
                                  +{member.specialties.length - 2} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Read More Hint - Fixed Height */}
                          <div className="h-8 flex items-center justify-center border-t border-gray-800 pt-2">
                            <motion.div
                              className="text-center"
                              whileHover={{ scale: 1.02 }}
                            >
                              <p className="text-yellow-400 text-xs font-medium flex items-center justify-center gap-1">
                                Click to read more
                                <ChevronDown className="w-3 h-3" />
                              </p>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16 p-8 bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-2xl border border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-white mb-4">
            Ready to work with our expert team?
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Our experienced professionals are here to guide you through every
            step of your recovery journey or professional development.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={() => openContactModal("consultation")}>
              Schedule Consultation
            </Button>
            <Button
              onClick={() => openContactModal("professional")}
              variant="secondary"
            >
              Learn About Training
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Team;
