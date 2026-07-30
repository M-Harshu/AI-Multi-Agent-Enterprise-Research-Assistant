import { motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { useState } from "react";
import { MagneticButton } from "./MagneticButton";
import { TextReveal } from "./TextReveal";

const CHIPS = ["NVIDIA", "Tesla", "Apple", "Microsoft", "Google", "Amazon", "OpenAI"];

export function SearchHero({ onAnalyze }: { onAnalyze: (company: string) => void }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const submit = () => {
    if (value.trim()) onAnalyze(value.trim());
  };

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(14px)", scale: 0.98 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 py-28 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="mb-10 inline-flex items-center gap-2.5 rounded-full glass-soft px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground"
      >
        <motion.span
          className="h-1.5 w-1.5 rounded-full bg-cyan"
          animate={{ opacity: [1, 0.25, 1], scale: [1, 0.8, 1] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
        Six autonomous agents online
      </motion.div>

      <h1 className="max-w-4xl text-balance text-[clamp(2.7rem,7.2vw,5.4rem)] font-light leading-[0.98] tracking-[-0.035em]">
        <TextReveal text="Enterprise intelligence," className="text-gradient" />
        <br />
        <TextReveal
          text="deliberated by agents."
          className="font-display italic text-foreground/85"
          delay={0.35}
        />
      </h1>

      <motion.p
        initial={{ opacity: 0, filter: "blur(8px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 0.9 }}
        className="mt-7 max-w-xl text-pretty text-[15px] leading-relaxed text-muted-foreground"
      >
        Research, verification, an adversarial bull–bear debate, and a final adjudicated
        verdict — composed in one pass on any company you name.
      </motion.p>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 26, filter: "blur(14px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1.1, delay: 1.05, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-14 w-full max-w-2xl"
      >
        <AnimatePresence>
          {focused && (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.94 }}
              transition={{ duration: 0.5 }}
              className="pointer-events-none absolute -inset-10 rounded-[3rem] blur-3xl"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, oklch(0.82 0.14 202 / 0.22), oklch(0.68 0.19 305 / 0.14) 45%, transparent 70%)",
              }}
            />
          )}
        </AnimatePresence>

        <motion.div
          animate={{ scale: focused ? 1.015 : 1 }}
          transition={{ type: "spring", stiffness: 240, damping: 22 }}
          className="relative flex items-center gap-3 rounded-2xl glass p-2 pl-5"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-2xl"
            animate={{ opacity: focused ? 1 : 0 }}
            transition={{ duration: 0.4 }}
            style={{
              background: "var(--gradient-accent)",
              WebkitMask:
                "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
              WebkitMaskComposite: "xor",
              maskComposite: "exclude",
              padding: 1,
            }}
          />
          <Sparkles className="size-[18px] shrink-0 text-cyan/80" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            placeholder="Ask anything about a company..."
            aria-label="Company to analyze"
            className="h-12 flex-1 bg-transparent text-[15px] tracking-tight text-foreground outline-none placeholder:text-muted-foreground/70"
          />
          <MagneticButton
            onClick={submit}
            disabled={!value.trim()}
            className="group relative h-12 shrink-0 overflow-hidden rounded-xl px-6 text-sm font-medium text-primary-foreground disabled:opacity-40"
          >
            <span className="absolute inset-0 accent-gradient" />
            <motion.span
              className="absolute inset-0 opacity-70"
              style={{
                background:
                  "linear-gradient(100deg, transparent 20%, oklch(1 0 0 / 0.5) 50%, transparent 80%)",
              }}
              animate={{ x: ["-120%", "220%"] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
            />
            <span className="relative flex items-center gap-1.5">
              Analyze
              <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </span>
          </MagneticButton>
        </motion.div>
      </motion.div>

      {/* Chips */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        {CHIPS.map((chip, i) => (
          <motion.button
            key={chip}
            type="button"
            initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ delay: 1.3 + i * 0.07, duration: 0.7 }}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setValue(chip);
              onAnalyze(chip);
            }}
            className="relative overflow-hidden rounded-full glass-soft px-4 py-2 text-[13px] text-muted-foreground transition-colors duration-300 hover:text-foreground"
          >
            <span className="relative z-10">{chip}</span>
            <motion.span
              className="absolute inset-0 opacity-0 transition-opacity duration-300 hover:opacity-100"
              style={{ background: "var(--gradient-accent)", filter: "blur(14px)" }}
              whileHover={{ opacity: 0.35 }}
            />
          </motion.button>
        ))}
      </div>
    </motion.section>
  );
}
