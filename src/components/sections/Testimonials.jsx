import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { testimonials } from "../../utils/constants";
import { getTypeColor, getTypeIcon } from "../../utils/formHelpers";
import { useTestimonials } from "../../hooks/useTestimonials";
import Button from "../ui/Button";

const Testimonials = ({ openContactModal }) => {
  const { currentTestimonial, setCurrentTestimonial } =
    useTestimonials(testimonials);

  return (
    <section
      id="success-stories"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/30 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          className="text-4xl md:text-5xl font-bold text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          Success{" "}
          <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
            Stories
          </span>
        </motion.h2>

        {/* Featured Testimonial - Large Card */}
        <div className="mb-16">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-900/80 to-gray-800/80 p-8 md:p-12 rounded-3xl border border-gray-700 backdrop-blur-sm max-w-4xl mx-auto"
            >
              <div className="flex items-start gap-4 mb-6">
                <div className="text-4xl">
                  {getTypeIcon(testimonials[currentTestimonial].type)}
                </div>
                <div>
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${getTypeColor(
                      testimonials[currentTestimonial].type
                    )} text-white mb-2`}
                  >
                    {testimonials[currentTestimonial].type
                      .charAt(0)
                      .toUpperCase() +
                      testimonials[currentTestimonial].type.slice(1)}
                  </div>
                </div>
              </div>

              <blockquote className="text-xl md:text-2xl text-gray-100 leading-relaxed mb-6 font-light">
                "{testimonials[currentTestimonial].quote}"
              </blockquote>

              <div className="flex justify-between items-center">
                <cite className="text-lg font-semibold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
                  — {testimonials[currentTestimonial].author}
                </cite>

                {/* Navigation dots */}
                <div className="flex gap-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentTestimonial(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentTestimonial
                          ? "bg-gradient-to-r from-red-500 to-yellow-400"
                          : "bg-gray-600 hover:bg-gray-500"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Horizontal Scrolling Cards */}
        <div className="relative">
          <motion.div
            className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-80 bg-gray-900/50 p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-all duration-300 cursor-pointer"
                style={{ scrollSnapAlign: "start" }}
                onClick={() => setCurrentTestimonial(index)}
                whileHover={{ y: -5, scale: 1.02 }}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-2xl">
                    {getTypeIcon(testimonial.type)}
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getTypeColor(
                      testimonial.type
                    )} text-white`}
                  >
                    {testimonial.type.charAt(0).toUpperCase() +
                      testimonial.type.slice(1)}
                  </div>
                </div>

                <blockquote className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                  "{testimonial.quote.substring(0, 120)}..."
                </blockquote>

                <cite className="text-sm font-medium text-yellow-400">
                  — {testimonial.author}
                </cite>
              </motion.div>
            ))}
          </motion.div>

          {/* Scroll indicators */}
          <div className="flex justify-center mt-6 gap-8">
            <button className="text-gray-400 hover:text-yellow-400 transition-colors duration-200 text-sm">
              ← Scroll for more stories
            </button>
          </div>
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-xl text-gray-300 mb-8">
            Ready to write your own success story?
          </p>
          <Button onClick={() => openContactModal("consultation")} size="lg">
            Start Your Journey Today
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
