import { motion } from "framer-motion";

const CandleLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4 bg-background">
      
      <motion.span
        className="material-symbols-outlined text-primary text-6xl"
        animate={{ y: [0, -6, 0], opacity: [0.7, 1, 0.7] }}
        transition={{ repeat: Infinity, duration: 1.4 }}
      >
        local_fire_department
      </motion.span>

      <p className="text-lg tracking-widest text-gray-700">
        Loading fragrances...<span className="text-2xl">🕯</span>
      </p>

    </div>
  );
};

export default CandleLoader;