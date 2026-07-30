import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { AuroraBackground } from "@/components/AuroraBackground";
import { SearchHero } from "@/components/SearchHero";
import { AgentPipeline, type AgentState } from "@/components/AgentPipeline";
import { ReportView } from "@/components/ReportView";
import { analyzeCompany } from "@/lib/report.functions";
import { AGENTS, type AgentId, type Report } from "@/lib/report-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oracle — Multi-Agent Research Assistant" },
      {
        name: "description",
        content:
          "Six autonomous AI agents research, verify, debate and adjudicate any company into a single executive intelligence brief.",
      },
      { property: "og:title", content: "Oracle — Multi-Agent Research Assistant" },
      {
        property: "og:description",
        content:
          "Enterprise intelligence powered by autonomous AI agents: research, fact-check, bull vs bear debate, and a final verdict.",
      },
    ],
  }),
  component: Index,
});

type Phase = "idle" | "running" | "report";

const initialStates = () =>
  Object.fromEntries(AGENTS.map((a) => [a.id, "idle"])) as Record<AgentId, AgentState>;

function Index() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [company, setCompany] = useState("");
  const [report, setReport] = useState<Report | null>(null);
  const [states, setStates] = useState<Record<AgentId, AgentState>>(initialStates);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finished = useRef(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const run = useCallback(async (name: string) => {
  timers.current.forEach(clearTimeout);
  timers.current = [];
  finished.current = false;

  setCompany(name);
  setStates(initialStates());
  setPhase("running");

  window.scrollTo({ top: 0 });

  const STEP = 1500;
  const start = Date.now();

  // Animate agents while backend works
  AGENTS.forEach((agent, i) => {
    timers.current.push(
      setTimeout(() => {
        setStates((prev) => {
          const next = { ...prev };

          if (i > 0) {
            next[AGENTS[i - 1].id] = "done";
          }

          next[agent.id] = "running";

          return next;
        });
      }, i * STEP),
    );
  });

  let result: Report | null = null;

  try {
    result = await analyzeCompany({
      data: {
        company: name,
      },
    });

    console.log("✅ RESULT RECEIVED:");
    console.log(result);
  } catch (err) {
    console.error("❌ ANALYZE ERROR:");
    console.error(err);
  }

  finished.current = true;

  const floor = (AGENTS.length - 1) * STEP + 1100;
  const wait = Math.max(0, floor - (Date.now() - start));

  timers.current.push(
    setTimeout(() => {
      setStates(
        Object.fromEntries(
          AGENTS.map((a) => [a.id, "done"])
        ) as Record<AgentId, AgentState>,
      );

      timers.current.push(
        setTimeout(() => {
          if (result) {
            console.log("✅ SETTING REPORT:");
            console.log(result);

            setReport(result);
            setPhase("report");

            window.scrollTo({
              top: 0,
            });
          } else {
            console.error("❌ Result is NULL");

            setPhase("idle");
          }
        }, 950),
      );
    }, wait),
  );
}, []);


  const doneCount = AGENTS.filter((a) => states[a.id] === "done").length;
  const runningBonus = AGENTS.some((a) => states[a.id] === "running") ? 0.5 : 0;
  const progress = ((doneCount + runningBonus) / AGENTS.length) * 100;

  return (
    <main className="relative min-h-screen">
      <AuroraBackground intensity={phase === "report" ? 0.55 : 1} />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="pointer-events-none fixed inset-x-0 top-0 z-40 flex justify-center pt-7"
      >
        <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.34em] text-muted-foreground/80">
          <span className="size-1.5 rounded-full accent-gradient" />
          Oracle
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {phase === "idle" && <SearchHero key="hero" onAnalyze={run} />}
        {phase === "running" && (
          <AgentPipeline
            key="pipeline"
            company={company}
            states={states}
            progress={progress}
          />
        )}
        {phase === "report" && report && (
          <ReportView
            key="report"
            report={report}
            onReset={() => {
              setReport(null);
              setPhase("idle");
              window.scrollTo({ top: 0 });
            }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
