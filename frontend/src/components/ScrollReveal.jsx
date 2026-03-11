import { motion } from "framer-motion";

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0.2,
  trigger = "scroll" // new prop
}) {

  const variants = {
    hidden: {
      opacity: 0,
      x: direction === "left" ? -60 : direction === "right" ? 60 : 0,
      y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
      scale: direction === "zoom" ? 0.9 : 1
    },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay,
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      {...(trigger === "scroll"
        ? { whileInView: "visible", viewport: { once: false, margin: "-80px" } }
        : { animate: "visible" })}
    >
      {children}
    </motion.div>
  );
}