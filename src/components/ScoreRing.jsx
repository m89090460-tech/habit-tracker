import { motion } from "framer-motion";

function ScoreRing({ score, t }) {
  const R = 54;
  const CIRC = 2 * Math.PI * R;
  const offset = CIRC - (score / 100) * CIRC;
  const trackColor = t?.ringTrack ?? "#1e293b";

  return (
    <div className="relative shrink-0" style={{ width: 140, height: 140 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" className="-rotate-90">
        <circle cx="70" cy="70" r={R} fill="none" stroke={trackColor} strokeWidth="10" />

        <motion.circle
          cx="70" cy="70" r={R}
          fill="none"
          stroke="url(#grad)"
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={CIRC}
          initial={{ strokeDashoffset: CIRC }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
        />

        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C4DFF" />
            <stop offset="100%" stopColor="#5A2EE6" />
          </linearGradient>
        </defs>
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-3xl font-bold ${t?.strong ?? "text-slate-50"}`}>{score}</span>
        <span className={`text-[10px] uppercase tracking-wider ${t?.muted ?? "text-slate-500"}`}>ball</span>
      </div>
    </div>
  );
}

export default ScoreRing;