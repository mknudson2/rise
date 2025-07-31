import React from "react";
import { motion } from "framer-motion";

const SuccessPathways = ({ openContactModal }) => {
  return (
    <section id="programs" className="py-20 px-4 sm:px-6 lg:px-8">
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
            Pathways
          </span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-12">
          {/* For Survivors */}
          <motion.div
            className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">
              …as a stroke / SCI survivor
            </h3>

            {/* Replaced placeholder with actual image */}
            <div className="w-full h-64 rounded-lg mb-6 overflow-hidden">
              <img
                src="/assets/images/survivor.jpg"
                alt="Stroke and SCI survivors participating in RISE recovery training"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>

            <p className="text-gray-300 leading-relaxed">
              Greatness is not a function of your situation. Greatness is
              largely a matter of choice and discipline. If you've had a Stroke
              or SCI and you're ready to achieve greatness, we're a click away
              from being your greatest resource.
            </p>
          </motion.div>

          {/* For Trainers */}
          <motion.div
            className="bg-gray-900/50 p-8 rounded-2xl border border-gray-800"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4 text-white">
              …as a trainer
            </h3>

            {/* Replaced placeholder with actual image */}
            <div className="w-full h-64 rounded-lg mb-6 overflow-hidden">
              <img
                src="/assets/images/trainer.webp"
                alt="Healthcare professionals learning RISE training methodologies"
                className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
              />
            </div>

            <p className="text-gray-300 leading-relaxed">
              No exercise is better for the heart than reaching out and lifting
              others up. If you're a student or healthcare professional and
              interested in unlocking your skills while transforming people's
              lives, we're currently accepting applicants.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default SuccessPathways;
