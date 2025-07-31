import React from "react";
import { motion } from "framer-motion";
import { teamMembers } from "../../utils/constants";
import Button from "../ui/Button";

const Team = ({ openContactModal }) => {
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
              key={index}
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-gray-900/50 rounded-3xl border border-gray-800 overflow-hidden hover:border-gray-600 transition-all duration-500 transform group-hover:scale-105 group-hover:shadow-2xl">
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  <div className="aspect-square bg-gray-800 flex items-center justify-center relative">
                    {/* Placeholder for image */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center">
                      <span className="text-6xl text-gray-600">👤</span>
                    </div>

                    {/* Gradient overlay */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-t ${member.gradientFrom} ${member.gradientTo} opacity-20 group-hover:opacity-30 transition-opacity duration-300`}
                    />
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-white mb-1">
                      {member.name}
                    </h3>
                    <p
                      className={`text-lg font-semibold bg-gradient-to-r ${member.gradientFrom} ${member.gradientTo} bg-clip-text text-transparent mb-1`}
                    >
                      {member.title}
                    </p>
                    <p className="text-sm text-gray-400 italic">
                      {member.subtitle}
                    </p>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-4">
                    {member.bio}
                  </p>

                  {/* Specialties Tags */}
                  <div className="flex flex-wrap gap-2">
                    {member.specialties.map((specialty, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full border border-gray-700"
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
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
