import { motion } from 'motion/react';
import { useNavigate } from 'react-router';

export default function PromoSections() {
  const navigate = useNavigate();
  return (
    <section className="py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        <motion.div
          whileHover={{ y: -5 }}
          className="relative rounded-3xl overflow-hidden bg-[#f5ebe0] p-12 min-h-[400px] flex flex-col justify-center"
        >
          <div className="relative z-10">
            <span className="text-[10px] uppercase tracking-widest font-bold text-flaire-pink mb-4 block">
              Trend
            </span>
            <h2 className="text-5xl font-bold text-zinc-900 mb-6 leading-tight">
              Summer <br /> Essentials
            </h2>
            <a
              href="#"
              className="inline-block text-sm font-bold text-zinc-900 border-b-2 border-zinc-900 pb-1 hover:text-flaire-pink hover:border-flaire-pink transition-colors"
            >
              Explore Now
            </a>
          </div>

        </motion.div>


        <motion.div
          whileHover={{ y: -5 }}
          className="relative rounded-3xl overflow-hidden bg-[#fff0f0] flex min-h-[400px]"
        >
          <div className="w-1/2 p-12 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest font-bold text-flaire-pink mb-4 block">
              Collection
            </span>
            <h2 className="text-5xl font-bold text-zinc-900 mb-6 leading-tight">
              The Work <br /> Edit
            </h2>
            <a
              onClick={() => navigate("/collection")}
              className="inline-block text-sm font-bold text-zinc-900 border-b-2 border-zinc-900 pb-1 hover:text-flaire-pink hover:border-flaire-pink transition-colors cursor-pointer"
            >
              Shop Collection
            </a>
          </div>
          <div className="w-1/2 relative">
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=600"
              alt="Work bag"
              className="absolute inset-0 w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}