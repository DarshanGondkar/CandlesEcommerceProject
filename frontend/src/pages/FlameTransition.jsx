import { motion } from "framer-motion";

export default function FlameTransition() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-background"
    >
      <div className="relative flex flex-col items-center">
        {/* Candle Stick */}
        <div className="w-2 h-16 bg-primary rounded-sm"></div>

        {/* Flame */}
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.9, 1.1, 0.95, 1] }}
          transition={{
            repeat: Infinity,
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="absolute -top-6 w-6 h-8 bg-gradient-to-t from-orange-500 via-yellow-400 to-yellow-200 rounded-full blur-sm"
        ></motion.div>
      </div>
    </motion.div>
  );
}