import { AlertTriangle, CheckCircle2, Info, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export type Alert = {
  id: string;
  level: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  time: string;
  device: string;
};

const config = {
  info:     { icon: Info,           color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30' },
  warning:  { icon: AlertTriangle,  color: 'text-warning',   bg: 'bg-warning/10',   border: 'border-warning/30' },
  critical: { icon: Zap,            color: 'text-critical',  bg: 'bg-critical/10',  border: 'border-critical/40' },
  success:  { icon: CheckCircle2,   color: 'text-success',   bg: 'bg-success/10',   border: 'border-success/30' },
};

export const AlertsPanel = ({ alerts }: { alerts: Alert[] }) => (
  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
    <AnimatePresence>
      {alerts.map((a) => {
        const c = config[a.level];
        const Icon = c.icon;
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className={cn("flex gap-3 p-3 rounded-lg border", c.bg, c.border)}
          >
            <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", c.color)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground truncate">{a.title}</span>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">{a.time}</span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
              <span className="text-[10px] font-mono text-muted-foreground/70">{a.device}</span>
            </div>
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);
