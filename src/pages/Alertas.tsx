import { useFarmContext } from "@/contexts/FarmContext";
import { useAlerts } from "@/hooks/useAgroData";
import { AlertsPanel } from "@/components/agro/AlertsPanel";

const Alertas = () => {
  const { activeFarmId } = useFarmContext();
  const { alerts, markRead } = useAlerts(activeFarmId);

  const counts = {
    critical: alerts.filter(a => a.level === 'critical' && !a.is_read).length,
    warning: alerts.filter(a => a.level === 'warning' && !a.is_read).length,
    info: alerts.filter(a => a.level === 'info' && !a.is_read).length,
    success: alerts.filter(a => a.level === 'success').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-warning tracking-widest uppercase">Módulo · Alertas</span>
        <h1 className="text-3xl font-display font-bold mt-1">Centro de Alertas</h1>
        <p className="text-sm text-muted-foreground mt-1">Eventos críticos y notificaciones del sistema</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Críticas', value: counts.critical, color: 'critical' },
          { label: 'Advertencias', value: counts.warning, color: 'warning' },
          { label: 'Info', value: counts.info, color: 'secondary' },
          { label: 'OK', value: counts.success, color: 'success' },
        ].map(c => (
          <div key={c.label} className="glass-card rounded-xl p-5">
            <div className="text-xs font-mono uppercase text-muted-foreground tracking-widest">{c.label}</div>
            <div className="text-4xl font-display font-bold mt-2" style={{ color: `hsl(var(--${c.color}))` }}>{c.value}</div>
          </div>
        ))}
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold mb-4">Historial completo</h3>
        <AlertsPanel alerts={alerts} onMarkRead={markRead} />
      </div>
    </div>
  );
};
export default Alertas;
