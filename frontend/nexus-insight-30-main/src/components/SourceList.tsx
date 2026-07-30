import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, ExternalLink, Link2 } from "lucide-react";
import { useState } from "react";
import type { Source } from "@/lib/report-types";

export function SourceList({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState<number | null>(null);
  if (!sources.length) return null;

  return (
    <div className="overflow-hidden rounded-3xl glass">
      {sources.map((s, i) => {
        const isOpen = open === i;
        return (
          <div key={`${s.url}-${i}`} className={i > 0 ? "border-t border-white/6" : ""}>
            <motion.button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              whileHover={{ backgroundColor: "oklch(1 0 0 / 0.03)" }}
              className="flex w-full items-center gap-4 px-6 py-5 text-left"
            >
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-muted-foreground">
                <Link2 className="size-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[14px] font-medium tracking-tight">
                  {s.title}
                </span>
                <span className="mt-0.5 block font-mono text-[10.5px] uppercase tracking-[0.14em] text-muted-foreground/70">
                  {s.domain}
                </span>
              </span>
              <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.3 }}>
                <ChevronDown className="size-4 text-muted-foreground" />
              </motion.span>
            </motion.button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-6 pl-18">
                    <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted-foreground">
                      {s.snippet}
                    </p>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="mt-4 inline-flex items-center gap-1.5 text-[12.5px] text-cyan transition-opacity hover:opacity-70"
                    >
                      Open source <ExternalLink className="size-3" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
