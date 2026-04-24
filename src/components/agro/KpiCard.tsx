import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: number | string;
  unit: string;
  icon: LucideIcon;
  trend?: number;
  status?: 'optimal' | 'warning' | 'critical';
  accent?: 'primary' | 'secondary' | 'accent';
  delay?: number;
}

const statusColor = {
  optimal: 'text-success',
  warning: 'text-warning',
  critical: 'text-critical',
};

const accentBar = {
  primary: 'from-primary to-primary/0',
  secondary: 'from-secondary to-secondary/0',
  accent: 'from-accent to-accent/0',
};

export const KpiCard = ({ label, value, unit, icon: Icon, trend, status = 'optimal', accent = 'primary', delay = 0 }: KpiCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card rounded-xl p-5 relative overflow-hidden group hover:border-primary/40 transition-all"
    >
      <div className={cn("absolute top-0 left-0 right-0 h-px bg-gradient-to-r", accentBar[accent])} />
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "p-2 rounded-lg",
            accent === 'primary' && 'bg-primary/10 text-primary',
            accent === 'secondary' && 'bg-secondary/10 text-secondary',
            accent === 'accent' && 'bg-accent/10 text-accent',
          )}>
            <Icon className="w-4 h-4" />
          </div>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{label}</span>
        </div>
        <div className={cn("w-2 h-2 rounded-full animate-pulse", `bg-${status === 'optimal' ? 'success' : status === 'warning' ? 'warning' : 'critical'}`)}
             style={{ backgroundColor: `hsl(var(--${status === 'optimal' ? 'success' : status === 'warning' ? 'warning' : 'critical'}))` }} />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-display font-bold text-foreground tabular-nums">{value}</span>
        <span className="text-sm text-muted-foreground font-mono">{unit}</span>
      </div>
      {trend !== undefined && (
        <div className={cn("text-xs mt-2 font-mono", trend >= 0 ? 'text-success' : 'text-critical')}>
          {trend >= 0 ? '▲' : '▼'} {Math.abs(trend).toFixed(1)}% últimas 24h
        </div>
      )}
    </motion.div>
  );
};
