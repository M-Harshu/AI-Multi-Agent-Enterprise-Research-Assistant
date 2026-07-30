import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { useEffect } from "react";

/**
 * Cinematic backdrop: aurora blobs, gradient mesh, drifting particles,
 * and a mouse-follow light. Purely decorative.
 */
export function AuroraBackground({ intensity = 1 }: { intensity?: number }) {
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.35);
  const sx = useSpring(mx, { stiffness: 60, damping: 22, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 22, mass: 0.6 });
  const lightX = useTransform(sx, (v) => `${v * 100}%`);
  const lightY = useTransform(sy, (v) => `${v * 100}%`);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mx.set(e.clientX / window.innerWidth);
      my.set(e.clientY / window.innerHeight);
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [mx, my]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden grain">
      <div className="absolute inset-0 bg-background" />

      {/* gradient mesh */}
      <motion.div
        className="absolute -left-[18%] top-[-22%] h-[70vw] w-[70vw] rounded-full blur-[120px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.62 0.2 265 / 0.5), transparent 62%)",
          opacity: 0.75 * intensity,
        }}
        animate={{ x: [0, 90, -40, 0], y: [0, 60, 30, 0], scale: [1, 1.12, 0.95, 1] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[-20%] top-[6%] h-[60vw] w-[60vw] rounded-full blur-[130px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.82 0.14 202 / 0.4), transparent 64%)",
          opacity: 0.7 * intensity,
        }}
        animate={{ x: [0, -80, 20, 0], y: [0, 70, -30, 0], scale: [1, 0.92, 1.1, 1] }}
        transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-30%] left-[22%] h-[62vw] w-[62vw] rounded-full blur-[140px]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.68 0.19 305 / 0.42), transparent 66%)",
          opacity: 0.65 * intensity,
        }}
        animate={{ x: [0, 60, -60, 0], y: [0, -50, 20, 0], scale: [1, 1.08, 0.96, 1] }}
        transition={{ duration: 38, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* mouse-follow light */}
      <motion.div
        className="absolute h-[46vw] w-[46vw] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[90px]"
        style={{
          left: lightX,
          top: lightY,
          background:
            "radial-gradient(circle, oklch(0.9 0.09 210 / 0.16), transparent 60%)",
        }}
      />

      {/* fine grid */}
      <div
        className="absolute inset-0 opacity-[0.055]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(1 0 0 / 1) 1px, transparent 1px), linear-gradient(90deg, oklch(1 0 0 / 1) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 80% 65% at 50% 40%, black 20%, transparent 78%)",
        }}
      />

      <Particles />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 30%, transparent 40%, oklch(0.11 0.015 265 / 0.85) 100%)",
        }}
      />
    </div>
  );
}

const PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  left: (i * 37.7) % 100,
  top: (i * 61.3) % 100,
  size: 1 + ((i * 13) % 3),
  duration: 16 + ((i * 7) % 18),
  delay: (i * 1.7) % 12,
}));

function Particles() {
  return (
    <div className="absolute inset-0">
      {PARTICLES.map((p) => (
        <motion.span
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            filter: "blur(0.3px)",
          }}
          animate={{ y: [0, -140, 0], opacity: [0, 0.5, 0] }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
