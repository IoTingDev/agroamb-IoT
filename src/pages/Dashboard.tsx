import { motion } from "framer-motion";
import { useEffect } from "react";
import { Droplets, Gauge as GaugeIcon, Sprout, Sun, Thermometer, Zap } from "lucide-react";
import { KpiCard } from "@/components/agro/KpiCard";
import { Gauge } from "@/components/agro/Gauge";
import { WindCompass } from "@/components/agro/WindCompass";
import { LiveChart } from "@/components/agro/LiveChart";
import { AlertsPanel } from "@/components/agro/AlertsPanel";
import { useFarmContext } from "@/contexts/FarmContext";
import { useReadings, useAlerts, useDevices } from "@/hooks/useAgroData";

const num = (v: number | string | null | undefined) => v == null ? 0 : Number(v);

const Dashboard = () => {
  const { activeFarmId, setSystemStatus } = useFarmContext();
  const readings = useReadings(activeFarmId, 30);
  const { alerts, markRead } = useAlerts(activeFarmId);
  const devices = useDevices(activeFarmId);
  const current = readings[readings.length - 1];

  useEffect(() => {
    if (!current) return;
    const t = num(current.ambient_temp), h = num(current.humidity), w = num(current.wind_speed);
    if (t > 33 || h < 40 || w > 15) setSystemStatus('critical');
    else if (t > 30 || h < 50 || w > 10) setSystemStatus('warning');
    else setSystemStatus('optimal');
  }, [current, setSystemStatus]);

  if (!current) {
    return <div className="text-center py-20 text-muted-foreground font-mono text-sm">⏳ Esperando primera lectura de telemetría...</div>;
  }

  const t = num(current.ambient_temp);
  const h = num(current.humidity);

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Industria 4.0 · Agro Tech</span>
          <h1 className="text-3xl lg:text-4xl font-display font-bold mt-1">
            Monitoreo <span className="text-gradient">Ambiental Inteligente</span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Datos en vivo · Última lectura {new Date(current.recorded_at).toLocaleTimeString()}
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="T. Ambiente" value={t.toFixed(1)} unit="°C" icon={Thermometer} accent="primary" status={t > 30 ? 'warning' : 'optimal'} trend={2.3} delay={0} />
        <KpiCard label="Humedad" value={h.toFixed(0)} unit="%" icon={Droplets} accent="secondary" status={h < 50 ? 'warning' : 'optimal'} trend={-1.2} delay={0.05} />
        <KpiCard label="T. Suelo" value={num(current.soil_temp).toFixed(1)} unit="°C" icon={Sprout} accent="primary" trend={0.8} delay={0.1} />
        <KpiCard label="Radiación" value={num(current.solar_radiation).toFixed(0)} unit="W/m²" icon={Sun} accent="accent" trend={5.4} delay={0.15} />
        <KpiCard label="Energía Solar" value={(num(current.solar_power) / 1000).toFixed(2)} unit="kW" icon={Zap} accent="accent" trend={3.1} delay={0.2} />
        <KpiCard label="Viento" value={num(current.wind_speed).toFixed(1)} unit="m/s" icon={GaugeIcon} accent="secondary" trend={0.2} delay={0.25} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="xl:col-span-2 glass-card rounded-xl p-5 scan-line">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-base">Telemetría en tiempo real</h3>
              <p className="text-xs text-muted-foreground">Temperatura · Humedad · Suelo</p>
            </div>
            <div className="flex gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary" />T.Aire</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-secondary" />Humedad</span>
              <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-accent" />T.Suelo</span>
            </div>
          </div>
          <LiveChart data={readings} />
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-base mb-1">Indicadores críticos</h3>
          <p className="text-xs text-muted-foreground mb-4">Lecturas instantáneas</p>
          <div className="grid grid-cols-2 gap-2">
            <Gauge value={t} max={40} label="Temp" unit="°C" color="hsl(var(--primary))" />
            <Gauge value={h} max={100} label="Humedad" unit="%" color="hsl(var(--secondary))" />
            <Gauge value={num(current.solar_power) / 1000} max={8} label="Solar" unit="kW" color="hsl(var(--accent))" />
            <div className="flex items-center justify-center">
              <WindCompass direction={num(current.wind_direction)} speed={num(current.wind_speed)} />
            </div>
          </div>
        </motion.section>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="xl:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-semibold text-base">Alertas inteligentes</h3>
              <p className="text-xs text-muted-foreground">Eventos del sistema · tiempo real</p>
            </div>
          </div>
          <AlertsPanel alerts={alerts.slice(0, 8)} onMarkRead={markRead} />
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold text-base mb-4">Estado de la red IoT</h3>
          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {devices.map(d => (
              <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/50">
                <div className={`w-2 h-2 rounded-full ${d.is_online ? 'bg-success animate-pulse' : 'bg-critical'}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{d.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{d.device_code}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono" style={{ color: d.is_online ? `hsl(var(--success))` : `hsl(var(--critical))` }}>
                    {d.is_online ? `${d.signal_strength}%` : 'OFFLINE'}
                  </div>
                  <div className="text-[10px] text-muted-foreground">{d.is_online ? 'señal' : '—'}</div>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      </div>

      <footer className="text-center text-[10px] font-mono text-muted-foreground/60 py-4">
        AGROSENSE 4.0 · INDUSTRIAL IoT PLATFORM · POWERED BY EDGE COMPUTING
      </footer>
    </div>
  );
};

export default Dashboard;
