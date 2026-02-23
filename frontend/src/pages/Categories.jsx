import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router";

const categories = [
  {
    id: 1,
    name: "Men",
    description: "Sharp styles for every occasion",
    image:
      "https://res.cloudinary.com/dlvnigugl/image/upload/v1771856791/Gemini_Generated_Image_leos75leos75leos_k3fxyv.png",
    search: "men",
  },
  {
    id: 2,
    name: "Women",
    description: "Elegant fashion, redefined",
    image:
      "https://res.cloudinary.com/dlvnigugl/image/upload/v1771857018/Gemini_Generated_Image_cwz2e5cwz2e5cwz2_mz3dea.png",
    search: "women",
  },
  {
    id: 3,
    name: "Kids",
    description: "Fun & comfy fits for little ones",
    image:
      "https://res.cloudinary.com/dlvnigugl/image/upload/v1771857120/Gemini_Generated_Image_z1cbk5z1cbk5z1cb_dhb0bh.png",
    search: "kids",
  },
];

export default function Categories() {
  const navigate = useNavigate();

  return (
    <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 mb-8 sm:mb-10">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-zinc-900 mb-1 sm:mb-2">
              Categories
            </h2>
            <p className="text-sm sm:text-base text-zinc-500">
              Curated styles for the bold and beautiful.
            </p>
          </div>
          <a
            onClick={() => navigate("/collection")}
            className="flex items-center space-x-1 text-flaire-pink font-medium hover:underline cursor-pointer text-sm sm:text-base"
          >
            <span>View all</span>
            <ArrowRight size={16} />
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {categories.map((category, index) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => navigate(`/collection?search=${category.search}`)}
            >
              <div className="relative aspect-[4/5] sm:aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-100 mb-3 sm:mb-4">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">
                    {category.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-white/70">
                    {category.description}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 sm:mt-3 text-xs sm:text-sm font-semibold text-white group-hover:text-flaire-pink transition-colors">
                    Shop {category.name}{" "}
                    <ArrowRight
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
