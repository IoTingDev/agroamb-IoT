import { AlertTriangle, CheckCircle2, Info, Zap, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Alert } from "@/hooks/useAgroData";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const config = {
  info:     { icon: Info,           color: 'text-secondary', bg: 'bg-secondary/10', border: 'border-secondary/30' },
  warning:  { icon: AlertTriangle,  color: 'text-warning',   bg: 'bg-warning/10',   border: 'border-warning/30' },
  critical: { icon: Zap,            color: 'text-critical',  bg: 'bg-critical/10',  border: 'border-critical/40' },
  success:  { icon: CheckCircle2,   color: 'text-success',   bg: 'bg-success/10',   border: 'border-success/30' },
};

export const AlertsPanel = ({ alerts, onMarkRead }: { alerts: Alert[]; onMarkRead?: (id: string) => void }) => (
  <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
    {alerts.length === 0 && (
      <div className="text-center py-12 text-muted-foreground text-sm">
        <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-success/60" />
        Sin alertas activas. Sistema operando con normalidad.
      </div>
    )}
    <AnimatePresence>
      {alerts.map((a) => {
        const c = config[a.level];
        const Icon = c.icon;
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className={cn("flex gap-3 p-3 rounded-lg border", c.bg, c.border, a.is_read && "opacity-60")}
          >
            <Icon className={cn("w-4 h-4 mt-0.5 shrink-0", c.color)} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground truncate">{a.title}</span>
                <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                  {formatDistanceToNow(new Date(a.created_at), { addSuffix: true, locale: es })}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">{a.message}</p>
            </div>
            {onMarkRead && !a.is_read && (
              <button onClick={() => onMarkRead(a.id)} className="text-muted-foreground hover:text-primary">
                <Check className="w-4 h-4" />
              </button>
            )}
          </motion.div>
        );
      })}
    </AnimatePresence>
  </div>
);
