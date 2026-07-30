import { motion, AnimatePresence } from "motion/react";
import {
  Telescope,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Scale,
  PenLine,
  Check,
  type LucideIcon,
} from "lucide-react";
import { AGENTS, type AgentId } from "@/lib/report-types";

const ICONS: Record<string, LucideIcon> = {
  Telescope,
  ShieldCheck,
  TrendingUp,
  TrendingDown,
  Scale,
  PenLine,
};

export type AgentState = "idle" | "running" | "done";

export function AgentPipeline({
  company,
  states,
  progress,
}: {
  company: string;
  states: Record<AgentId, AgentState>;
  progress: number;
}) {
  const activeIndex = AGENTS.findIndex((a) => states[a.id] === "running");

  return (
    <motion.section
      initial={{ opacity: 0, filter: "blur(18px)", scale: 1.02 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(18px)", scale: 0.98 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col justify-center px-6 py-24"
    >
      <div className="mb-14 text-center">
        <motion.p
          className="text-[11px] font-medium uppercase tracking-[0.28em] text-cyan/80"
          animate={{ opacity: [0.55, 1, 0.55] }}
          transition={{ duration: 2.6, repeat: Infinity }}
        >
          Agent swarm executing
        </motion.p>
        <h2 className="mt-4 text-[clamp(2rem,4.6vw,3.4rem)] font-light tracking-[-0.03em]">
          Deliberating on{" "}
          <span className="font-display italic text-gradient">{company}</span>
        </h2>
        <div className="mx-auto mt-8 h-px w-full max-w-md overflow-hidden bg-white/8">
          <motion.div
            className="h-full accent-gradient"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "easeOut", duration: 0.8 }}
          />
        </div>
      </div>

      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* flowing energy connectors */}
        <svg
          className="pointer-events-none absolute inset-0 hidden h-full w-full lg:block"
          aria-hidden
        >
          <defs>
            <linearGradient id="flow" x1="0" x2="1">
              <stop offset="0%" stopColor="oklch(0.82 0.14 202)" stopOpacity="0" />
              <stop offset="50%" stopColor="oklch(0.82 0.14 202)" stopOpacity="0.75" />
              <stop offset="100%" stopColor="oklch(0.68 0.19 305)" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>

        {AGENTS.map((agent, i) => {
          const state = states[agent.id];
          const Icon = ICONS[agent.icon];
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 26, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <motion.div
                animate={
                  state === "running"
                    ? { y: [0, -6, 0] }
                    : state === "done"
                      ? { y: 0 }
                      : { y: 0 }
                }
                transition={{ duration: 4, repeat: state === "running" ? Infinity : 0 }}
                className={`relative h-full overflow-hidden rounded-3xl p-6 transition-colors duration-700 ${
                  state === "idle" ? "glass-soft opacity-45" : "glass"
                }`}
              >
                {/* running glow */}
                <AnimatePresence>
                  {state === "running" && (
                    <>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute -inset-24 blur-3xl"
                        style={{
                          background:
                            "radial-gradient(circle at 50% 50%, oklch(0.82 0.14 202 / 0.28), transparent 60%)",
                        }}
                      />
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute -inset-px rounded-3xl"
                        style={{
                          background: "var(--gradient-accent)",
                          WebkitMask:
                            "linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0)",
                          WebkitMaskComposite: "xor",
                          maskComposite: "exclude",
                          padding: 1,
                        }}
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                      />
                    </>
                  )}
                </AnimatePresence>

                <div className="relative flex items-start justify-between">
                  <div
                    className={`flex size-11 items-center justify-center rounded-2xl transition-colors duration-500 ${
                      state === "done"
                        ? "bg-cyan/15 text-cyan"
                        : state === "running"
                          ? "bg-white/10 text-foreground"
                          : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {state === "done" ? (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 320, damping: 16 }}
                      >
                        <Check className="size-5" />
                      </motion.span>
                    ) : (
                      <Icon className="size-5" />
                    )}
                  </div>

                  <StatusPill state={state} />
                </div>

                <h3 className="relative mt-5 text-[15px] font-medium tracking-tight">
                  {agent.name}
                </h3>
                <p className="relative mt-1 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground/70">
                  {agent.role}
                </p>
                <p className="relative mt-3 text-[13px] leading-relaxed text-muted-foreground">
                  {agent.detail}
                </p>

                <div className="relative mt-5 h-px w-full overflow-hidden bg-white/8">
                  <motion.div
                    className="h-full"
                    style={{
                      background:
                        state === "done"
                          ? "var(--gradient-accent)"
                          : "linear-gradient(90deg, transparent, oklch(0.82 0.14 202 / 0.9), transparent)",
                    }}
                    animate={
                      state === "done"
                        ? { width: "100%", x: 0 }
                        : state === "running"
                          ? { width: "45%", x: ["-60%", "240%"] }
                          : { width: "0%" }
                    }
                    transition={
                      state === "running"
                        ? { duration: 1.6, repeat: Infinity, ease: "easeInOut" }
                        : { duration: 0.6 }
                    }
                  />
                </div>
              </motion.div>

              {/* node pulse */}
              {i < AGENTS.length - 1 && (
                <motion.span
                  className="absolute -right-2 top-1/2 hidden size-1.5 -translate-y-1/2 rounded-full bg-cyan lg:block"
                  animate={{
                    opacity: i <= activeIndex ? [0.3, 1, 0.3] : 0.12,
                    scale: i <= activeIndex ? [1, 1.6, 1] : 1,
                  }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}

function StatusPill({ state }: { state: AgentState }) {
  const label = state === "done" ? "Complete" : state === "running" ? "Thinking" : "Queued";
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9.5px] uppercase tracking-[0.16em] ${
        state === "done"
          ? "bg-cyan/10 text-cyan"
          : state === "running"
            ? "bg-white/10 text-foreground"
            : "bg-white/5 text-muted-foreground/70"
      }`}
    >
      {state === "running" && (
        <motion.span
          className="h-1 w-1 rounded-full bg-current"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
      )}
      {label}
    </span>
  );
}
