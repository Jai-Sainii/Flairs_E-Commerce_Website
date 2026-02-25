import React from "react";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-8">
      <div className="max-w-7xl mx-auto">
        <div className="relative rounded-3xl overflow-hidden hero-gradient min-h-[400px] md:min-h-[500px] flex flex-col md:flex-row md:items-center">
          <div className="relative z-10 w-full md:w-1/2 p-6 sm:p-8 md:p-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-zinc-900 mb-3 md:mb-4 tracking-tighter">
                Flaire
              </h1>
              <p className="text-xl sm:text-2xl md:text-3xl font-serif italic text-zinc-800 mb-6 md:mb-8">
                Ditch the Fashion.
              </p>
              <button
                onClick={() => navigate("/collection")}
                className="group flex items-center space-x-2 bg-zinc-900 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-medium hover:bg-zinc-800 transition-all text-sm sm:text-base"
              >
                <span>Shop Collection</span>
                <ArrowRight
                  size={18}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </motion.div>
          </div>

          <div className="relative md:absolute md:right-0 md:top-0 md:bottom-0 w-full md:w-1/2 md:h-full flex items-end md:items-stretch justify-center md:justify-end">
            <motion.img
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800"
              alt="Model in purple top"
              className="h-[200px] sm:h-[350px] md:h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-flaire-pink/40 blur-[100px] rounded-full"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
