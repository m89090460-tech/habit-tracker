import { motion } from "framer-motion";

function Confetti() {
  const dots = Array.from({ length: 10 });
  const colors = ["#7C4DFF", "#34D399", "#FBBF24", "#FB7185", "#38BDF8"];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-visible">
      {dots.map((_, i) => {
        const angle = (i / dots.length) * Math.PI * 2;
        const dist = 40 + Math.random() * 20;
        return (
          <motion.span
            key={i}
            className="absolute left-1/2 top-1/2 w-1.5 h-1.5 rounded-full"
            style={{ background: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: Math.cos(angle) * dist,
              y: Math.sin(angle) * dist,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

export default Confetti;