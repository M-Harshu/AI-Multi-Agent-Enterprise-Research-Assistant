import { motion } from "motion/react";

/** Word-by-word blur-to-focus reveal. */
export function TextReveal({
  text,
  className = "",
  delay = 0,
  stagger = 0.06,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const words = text.split(" ");
  return (
    <span>
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: 18, filter: "blur(12px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{
            duration: 0.9,
            delay: delay + i * stagger,
            ease: [0.16, 1, 0.3, 1],
          }}
        >
          <span className={`inline-block ${className}`}>
            {w}
            {i < words.length - 1 ? "\u00A0" : ""}
          </span>
        </motion.span>
      ))}
    </span>

  );
}
