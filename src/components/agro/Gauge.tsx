import { motion } from "framer-motion";

interface GaugeProps {
  value: number;
  min?: number;
  max: number;
  label: string;
  unit: string;
  color?: string;
}

export const Gauge = ({ value, min = 0, max, label, unit, color = "hsl(var(--primary))" }: GaugeProps) => {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const circumference = 2 * Math.PI * 70;
  const arc = circumference * 0.75; // 270° arc
  const offset = arc * (1 - pct);

  return (
    <div className="relative flex flex-col items-center justify-center">
      <svg width="180" height="180" viewBox="0 0 180 180" className="-rotate-[135deg]">
        <circle
          cx="90" cy="90" r="70"
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth="10"
          strokeDasharray={`${arc} ${circumference}`}
          strokeLinecap="round"
        />
        <motion.circle
          cx="90" cy="90" r="70"
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeDasharray={`${arc} ${circumference}`}
          strokeLinecap="round"
          initial={{ strokeDashoffset: arc }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ filter: `drop-shadow(0 0 8px ${color})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display font-bold tabular-nums" style={{ color }}>
          {value.toFixed(1)}
        </span>
        <span className="text-xs text-muted-foreground font-mono">{unit}</span>
        <span className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">{label}</span>
      </div>
    </div>
  );
};
