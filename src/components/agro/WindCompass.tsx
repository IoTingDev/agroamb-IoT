import { motion } from "framer-motion";
import { Navigation } from "lucide-react";

export const WindCompass = ({ direction, speed }: { direction: number; speed: number }) => {
  const dirLabel = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round(direction / 45) % 8];
  return (
    <div className="relative w-[180px] h-[180px] flex items-center justify-center">
      <div className="absolute inset-0 rounded-full border border-border/60" />
      <div className="absolute inset-3 rounded-full border border-border/40" />
      {['N','E','S','W'].map((d, i) => (
        <span key={d}
          className="absolute text-[10px] font-mono text-muted-foreground"
          style={{
            top: i === 0 ? 4 : i === 2 ? 'auto' : '50%',
            bottom: i === 2 ? 4 : 'auto',
            left: i === 3 ? 4 : i === 1 ? 'auto' : '50%',
            right: i === 1 ? 4 : 'auto',
            transform: (i === 0 || i === 2) ? 'translateX(-50%)' : 'translateY(-50%)',
          }}>{d}</span>
      ))}
      <motion.div
        animate={{ rotate: direction }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="absolute"
      >
        <Navigation className="w-10 h-10 text-secondary" style={{ filter: 'drop-shadow(0 0 8px hsl(var(--secondary)))' }} fill="currentColor" />
      </motion.div>
      <div className="absolute bottom-5 flex flex-col items-center">
        <span className="text-xl font-display font-bold text-secondary">{speed.toFixed(1)}</span>
        <span className="text-[10px] text-muted-foreground font-mono">m/s · {dirLabel}</span>
      </div>
    </div>
  );
};
