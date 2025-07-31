import React from "react";
import { motion } from "framer-motion";
import { Zap, Users, Award, Target, Heart, Brain } from "lucide-react";

const RiseMethod = ({ openContactModal }) => {
  const methods = [
    {
      icon: Zap,
      title: "High-intensity Bootcamp",
      content:
        "The biggest obstacles you face are the ones you've placed on yourself. Let us help you tear them down so we can build you up to reclaim your life",
      gradient: "from-red-500 to-orange-400",
      delay: 0.2,
    },
    {
      icon: Heart,
      title: "Personalized Training and Support",
      content:
        "We review, assess, and interview all RISE clients (and family members) to ensure we make the most out of every bootcamp. You and your goals are our biggest priority.",
      gradient: "from-orange-400 to-yellow-400",
      delay: 0.4,
    },
    {
      icon: Brain,
      title: "Evidence-based with Grit Embraced",
      content:
        "Our methods were meticulously constructed to empower you in every possible way. We set you up for success before the bootcamp begins and provide support long after the bootcamp ends.",
      gradient: "from-yellow-400 to-red-500",
      delay: 0.6,
    },
  ];

  return (
    <section
      id="rise-method"
      className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-900/20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            The{" "}
            <span className="bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent">
              RISE Method
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Three pillars that make our approach to recovery uniquely effective
            and transformational
          </p>
        </motion.div>

        {/* Methods Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {methods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <motion.div
                key={index}
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: method.delay }}
                viewport={{ once: true }}
              >
                {/* Background Card */}
                <div
                  className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 h-full
                              hover:border-gray-700 hover:shadow-2xl transition-all duration-500 
                              hover:-translate-y-2 relative overflow-hidden"
                >
                  {/* Gradient Background on Hover */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${method.gradient} opacity-0 
                                  group-hover:opacity-5 transition-all duration-500`}
                  ></div>

                  {/* Content */}
                  <div className="relative z-10">
                    {/* Icon */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${method.gradient} 
                                    p-4 mb-6 group-hover:scale-110 transition-transform duration-300`}
                    >
                      <IconComponent className="w-full h-full text-white" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl font-bold text-white mb-4 group-hover:text-transparent 
                                 group-hover:bg-gradient-to-r group-hover:from-red-500 group-hover:to-yellow-400 
                                 group-hover:bg-clip-text transition-all duration-300"
                    >
                      {method.title}
                    </h3>

                    {/* Content */}
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {method.content}
                    </p>
                  </div>

                  {/* Decorative Element */}
                  <div
                    className={`absolute -bottom-2 -right-2 w-24 h-24 bg-gradient-to-br ${method.gradient} 
                                  rounded-full opacity-5 group-hover:opacity-10 group-hover:scale-125 
                                  transition-all duration-500`}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Stats/Features Row */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
              3-5 Days
            </div>
            <p className="text-gray-300">Intensive Bootcamp Duration</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
              100%
            </div>
            <p className="text-gray-300">Evidence-Based Protocols</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold bg-gradient-to-r from-red-500 to-yellow-400 bg-clip-text text-transparent mb-2">
              Lifetime
            </div>
            <p className="text-gray-300">Ongoing Support</p>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          viewport={{ once: true }}
        >
          <div className="bg-gradient-to-r from-red-500/10 to-yellow-400/10 border border-red-500/20 rounded-2xl p-8 sm:p-12">
            <h3 className="text-3xl font-bold mb-4">
              Ready to Experience the RISE Difference?
            </h3>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Our proven methodology has transformed hundreds of lives. Discover
              what makes RISE the most effective approach to stroke and SCI
              recovery.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openContactModal("consultation")}
                className="bg-gradient-to-r from-red-500 to-yellow-400 text-white px-8 py-4 rounded-full font-semibold 
                          hover:from-red-600 hover:to-yellow-500 transition-all duration-300 transform hover:scale-105 
                          shadow-lg hover:shadow-xl"
              >
                Schedule Free Consultation
              </button>
              <button
                onClick={() => openContactModal("general")}
                className="border border-gray-600 text-gray-300 px-8 py-4 rounded-full font-semibold 
                          hover:border-gray-500 hover:text-white transition-all duration-300 transform hover:scale-105"
              >
                Learn More About Our Method
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default RiseMethod;
