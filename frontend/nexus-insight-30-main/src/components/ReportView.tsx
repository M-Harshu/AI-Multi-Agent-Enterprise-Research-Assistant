import { motion, useScroll, useSpring } from "motion/react";
import {
  ArrowLeft,
  CircleCheck,
  CircleDashed,
  CircleHelp,
  Gavel,
  Quote,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { Report, Verdict } from "@/lib/report-types";
import { TiltCard } from "./TiltCard";
import { TextReveal } from "./TextReveal";
import { SourceList } from "./SourceList";
import { MagneticButton } from "./MagneticButton";

const ease = [0.16, 1, 0.3, 1] as const;

function Section({
  children,
  label,
  index = 0,
}: {
  children: React.ReactNode;
  label: string;
  index?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 46, filter: "blur(12px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-90px" }}
      transition={{ duration: 0.9, ease }}
      className="mt-24 first:mt-0"
    >
      <div className="mb-7 flex items-center gap-4">
        <span className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-cyan/75">
          {String(index + 1).padStart(2, "0")} — {label}
        </span>
        <span className="hairline flex-1" />
      </div>
      {children}
    </motion.section>
  );
}

const VERDICT_ICON: Record<Verdict, typeof CircleCheck> = {
  verified: CircleCheck,
  partial: CircleDashed,
  unverified: CircleHelp,
};

export function ReportView({ report, onReset }: { report: Report; onReset: () => void }) {
  const { scrollYProgress } = useScroll();
  const bar = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(20px)", scale: 1.01 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      exit={{ opacity: 0, filter: "blur(16px)" }}
      transition={{ duration: 0.9, ease }}
      className="relative"
    >
      <motion.div
        style={{ scaleX: bar }}
        className="fixed inset-x-0 top-0 z-50 h-px origin-left accent-gradient"
      />

      <div className="mx-auto w-full max-w-4xl px-6 pb-40 pt-28">
        {/* Masthead */}
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-mono text-[10.5px] uppercase tracking-[0.28em] text-muted-foreground"
            >
              {report.sector} · {report.ticker}
            </motion.p>
            <h1 className="mt-4 text-[clamp(2.6rem,6.5vw,4.6rem)] font-light leading-[1.02] tracking-[-0.04em]">
              <TextReveal text={report.company} className="text-gradient" />
            </h1>
          </div>
          <MagneticButton
            onClick={onReset}
            strength={0.2}
            className="flex items-center gap-2 rounded-full glass-soft px-4 py-2.5 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> New analysis
          </MagneticButton>
        </div>

        <div className="mt-10 grid gap-3 sm:grid-cols-3">
          {report.highlights?.map((h, i) => (
            <motion.div
              key={h + i}
              initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.7, ease }}
              whileHover={{ y: -3 }}
              className="rounded-2xl glass-soft p-5"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cyan/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">{h}</p>
            </motion.div>
          ))}
        </div>

        {/* 01 Executive Summary */}
        <Section label="Executive Summary" index={0}>
          <div className="relative rounded-3xl glass p-9">
            <Quote className="absolute right-8 top-8 size-7 text-white/8" />
            <p className="max-w-2xl text-pretty text-[19px] font-light leading-[1.65] tracking-[-0.012em] text-foreground/90">
              {report.executiveSummary}
            </p>
          </div>
        </Section>

        {/* 02 Verified Research */}
        <Section label="Verified Research" index={1}>
          <div className="space-y-3">
            {report.research?.map((r, i) => {
              const Icon = VERDICT_ICON[r.verdict] ?? CircleHelp;
              const tone =
                r.verdict === "verified"
                  ? "text-bull"
                  : r.verdict === "partial"
                    ? "text-cyan"
                    : "text-bear";
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -18 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease }}
                  whileHover={{ x: 4 }}
                  className="flex gap-4 rounded-2xl glass-soft p-5"
                >
                  <Icon className={`mt-0.5 size-[18px] shrink-0 ${tone}`} />
                  <div>
                    <p className="text-[14.5px] leading-relaxed tracking-tight text-foreground/90">
                      {r.claim}
                    </p>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {r.note}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </Section>

        {/* 03/04 Debate */}
        <Section label="The Debate" index={2}>
          <div className="grid gap-4 md:grid-cols-2">
            <ArgumentColumn
              title="Bull Perspective"
              icon={<TrendingUp className="size-4" />}
              accent="var(--bull)"
              items={report.bull ?? []}
            />
            <ArgumentColumn
              title="Bear Perspective"
              icon={<TrendingDown className="size-4" />}
              accent="var(--bear)"
              items={report.bear ?? []}
            />
          </div>
        </Section>

        {/* 05 Judge */}
        <Section label="Judge Verdict" index={3}>
          <TiltCard className="p-9" max={4}>
            <div className="flex items-start gap-5">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/6">
                <Gavel className="size-5 text-cyan" />
              </div>
              <div className="flex-1">
                <h3 className="text-[26px] font-light tracking-[-0.03em]">
                  {report.judge?.verdict}
                </h3>
                <p className="mt-3 max-w-2xl text-[14.5px] leading-relaxed text-muted-foreground">
                  {report.judge?.rationale}
                </p>

                <div className="mt-8">
                  <div className="mb-2 flex justify-between font-mono text-[10.5px] uppercase tracking-[0.16em]">
                    <span className="text-bull">Bull {report.judge?.bullScore}</span>
                    <span className="text-bear">Bear {report.judge?.bearScore}</span>
                  </div>
                  <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      className="h-full"
                      style={{ background: "var(--bull)" }}
                      initial={{ width: 0 }}
                      whileInView={{ width: `${report.judge?.bullScore ?? 50}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease }}
                    />
                    <motion.div
                      className="h-full flex-1"
                      style={{ background: "var(--bear)" }}
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 0.85 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, delay: 0.2 }}
                    />
                  </div>
                  <p className="mt-4 font-mono text-[10.5px] uppercase tracking-[0.16em] text-muted-foreground">
                    Confidence {report.judge?.confidence}%
                  </p>
                </div>
              </div>
            </div>
          </TiltCard>
        </Section>

        {/* 06 Recommendation */}
        <Section label="Business Recommendation" index={4}>
          <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-3xl glass p-8">
              <p className="font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
                Stance
              </p>
              <p className="mt-3 text-[28px] font-light leading-tight tracking-[-0.03em] text-gradient">
                {report.recommendation?.stance}
              </p>
              <p className="mt-6 font-mono text-[10.5px] uppercase tracking-[0.2em] text-muted-foreground">
                Horizon · {report.recommendation?.horizon}
              </p>
            </div>
            <div className="space-y-3">
              {report.recommendation?.actions?.map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease }}
                  whileHover={{ y: -3 }}
                  className="flex items-center gap-4 rounded-2xl glass-soft px-6 py-5"
                >
                  <span className="font-mono text-[11px] text-cyan/80">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-[14px] leading-relaxed text-foreground/90">{a}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>

        {/* 07 Conclusion */}
        <Section label="Conclusion" index={5}>
          <p className="max-w-3xl text-pretty font-display text-[clamp(1.4rem,3vw,2rem)] font-light italic leading-[1.45] tracking-[-0.02em] text-foreground/85">
            {report.conclusion}
          </p>
        </Section>

        {/* 08 Sources */}
        {report.sources?.length > 0 && (
          <Section label="Sources" index={6}>
            <SourceList sources={report.sources} />
          </Section>
        )}
      </div>
    </motion.div>
  );
}

function ArgumentColumn({
  title,
  icon,
  accent,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  accent: string;
  items: { title: string; detail: string; weight: number }[];
}) {
  return (
    <div className="rounded-3xl glass p-7">
      <div className="flex items-center gap-2.5" style={{ color: accent }}>
        {icon}
        <span className="font-mono text-[10.5px] uppercase tracking-[0.2em]">{title}</span>
      </div>
      <div className="mt-6 space-y-5">
        {items.map((it, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.09, duration: 0.7, ease }}
          >
            <p className="text-[14.5px] font-medium tracking-tight">{it.title}</p>
            <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted-foreground">
              {it.detail}
            </p>
            <div className="mt-3 h-px w-full overflow-hidden bg-white/8">
              <motion.div
                className="h-full"
                style={{ background: accent, opacity: 0.8 }}
                initial={{ width: 0 }}
                whileInView={{ width: `${it.weight ?? 50}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.15 + i * 0.09, ease }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
