import { motion } from "framer-motion";

export default function AnimatedCard({ children, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: "easeOut"
      }}
      viewport={{ once: true, margin: "-80px" }}
      whileHover={{
        y: -6,
        scale: 1.02
      }}
      whileTap={{
        scale: 0.97
      }}
      className="group"
    >
      {children}
    </motion.div>
  );
}
