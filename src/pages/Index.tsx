import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Cloud, Droplets, Gauge as GaugeIcon, Sprout, Sun, Thermometer, Wind, Zap } from "lucide-react";
import { Sidebar } from "@/components/agro/Sidebar";
import { TopBar } from "@/components/agro/TopBar";
import { KpiCard } from "@/components/agro/KpiCard";
import { Gauge } from "@/components/agro/Gauge";
import { WindCompass } from "@/components/agro/WindCompass";
import { LiveChart } from "@/components/agro/LiveChart";
import { AlertsPanel, Alert } from "@/components/agro/AlertsPanel";
import { getStatus, nextReading, seedHistory, SensorReading } from "@/lib/sensorData";

const initialAlerts: Alert[] = [
  { id: '1', level: 'warning',  title: 'Humedad baja en Sector B', message: 'Detectado 47% — umbral mínimo 50%.', time: 'hace 2m', device: 'NODE-02 · DHT22' },
  { id: '2', level: 'success',  title: 'Generación solar óptima', message: 'Producción 12% sobre la media diaria.', time: 'hace 8m', device: 'SOLAR-01 · MPPT' },
  { id: '3', level: 'info',     title: 'Sincronización OTA completada', message: 'Firmware 2.4.1 desplegado en 8 nodos.', time: 'hace 23m', device: 'GATEWAY · ESP32' },
  { id: '4', level: 'critical', title: 'Viento elevado · Sector Norte', message: 'Ráfaga de 16.2 m/s detectada.', time: 'hace 41m', device: 'NODE-05 · Anemómetro' },
];

const Index = () => {
  const [history, setHistory] = useState<SensorReading[]>(() => seedHistory(20));
  const current = history[history.length - 1];

  useEffect(() => {
    const id = setInterval(() => {
      setHistory(prev => [...prev.slice(-29), nextReading()]);
    }, 2500);
    return () => clearInterval(id);
  }, []);

  const status = getStatus(current);

  return (
    <div className="min-h-screen flex">
      <Sidebar />
      <main className="flex-1 flex flex-col min-w-0">
        <TopBar status={status} />

        <div className="p-4 lg:p-8 space-y-6">
          {/* Hero header */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap items-end justify-between gap-4"
          >
            <div>
              <span className="text-xs font-mono text-primary tracking-widest uppercase">Industria 4.0 · Agro Tech</span>
              <h1 className="text-3xl lg:text-4xl font-display font-bold mt-1">
                Monitoreo <span className="text-gradient">Ambiental Inteligente</span>
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Datos en vivo · Última lectura {new Date(current.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <div className="flex gap-2">
              {['24h', '7d', '30d', 'Custom'].map((r, i) => (
                <button key={r} className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition ${i === 0 ? 'bg-primary/10 border-primary/30 text-primary' : 'border-border text-muted-foreground hover:text-foreground'}`}>
                  {r}
                </button>
              ))}
            </div>
          </motion.div>

          {/* KPI grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            <KpiCard label="T. Ambiente" value={current.ambientTemp.toFixed(1)} unit="°C" icon={Thermometer} accent="primary" status={current.ambientTemp > 30 ? 'warning' : 'optimal'} trend={2.3} delay={0} />
            <KpiCard label="Humedad" value={current.humidity.toFixed(0)} unit="%" icon={Droplets} accent="secondary" status={current.humidity < 50 ? 'warning' : 'optimal'} trend={-1.2} delay={0.05} />
            <KpiCard label="T. Suelo" value={current.soilTemp.toFixed(1)} unit="°C" icon={Sprout} accent="primary" trend={0.8} delay={0.1} />
            <KpiCard label="Radiación" value={current.solarRadiation.toFixed(0)} unit="W/m²" icon={Sun} accent="accent" trend={5.4} delay={0.15} />
            <KpiCard label="Energía Solar" value={(current.solarPower / 1000).toFixed(2)} unit="kW" icon={Zap} accent="accent" trend={3.1} delay={0.2} />
            <KpiCard label="Presión" value="1013" unit="hPa" icon={GaugeIcon} accent="secondary" trend={0.2} delay={0.25} />
          </div>

          {/* Main grid: chart + gauges */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="xl:col-span-2 glass-card rounded-xl p-5 scan-line"
            >
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
              <LiveChart data={history} />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="glass-card rounded-xl p-5"
            >
              <h3 className="font-display font-semibold text-base mb-1">Indicadores críticos</h3>
              <p className="text-xs text-muted-foreground mb-4">Lecturas instantáneas</p>
              <div className="grid grid-cols-2 gap-2">
                <Gauge value={current.ambientTemp} max={40} label="Temp" unit="°C" color="hsl(var(--primary))" />
                <Gauge value={current.humidity} max={100} label="Humedad" unit="%" color="hsl(var(--secondary))" />
                <Gauge value={current.solarPower / 1000} max={8} label="Solar" unit="kW" color="hsl(var(--accent))" />
                <div className="flex items-center justify-center">
                  <WindCompass direction={current.windDirection} speed={current.windSpeed} />
                </div>
              </div>
            </motion.section>
          </div>

          {/* Alerts + system status */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              className="xl:col-span-2 glass-card rounded-xl p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-display font-semibold text-base">Alertas inteligentes</h3>
                  <p className="text-xs text-muted-foreground">Eventos del sistema · últimas 24 horas</p>
                </div>
                <button className="text-xs font-mono text-primary hover:text-primary-glow">Ver todas →</button>
              </div>
              <AlertsPanel alerts={initialAlerts} />
            </motion.section>

            <motion.section
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
              className="glass-card rounded-xl p-5"
            >
              <h3 className="font-display font-semibold text-base mb-4">Estado de la red IoT</h3>
              <div className="space-y-3">
                {[
                  { name: 'Gateway Principal', id: 'GW-001', online: true, signal: 98 },
                  { name: 'Nodo Ambiental N°1', id: 'NODE-01', online: true, signal: 87 },
                  { name: 'Nodo Ambiental N°2', id: 'NODE-02', online: true, signal: 72 },
                  { name: 'Estación Solar', id: 'SOLAR-01', online: true, signal: 91 },
                  { name: 'Anemómetro Norte', id: 'NODE-05', online: true, signal: 65 },
                  { name: 'Sensor Suelo S-3', id: 'SOIL-03', online: false, signal: 0 },
                ].map(d => (
                  <div key={d.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/30 border border-border/50">
                    <div className={`w-2 h-2 rounded-full ${d.online ? 'bg-success animate-pulse' : 'bg-critical'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{d.name}</div>
                      <div className="text-[10px] font-mono text-muted-foreground">{d.id}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-mono" style={{ color: d.online ? `hsl(var(--success))` : `hsl(var(--critical))` }}>
                        {d.online ? `${d.signal}%` : 'OFFLINE'}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{d.online ? 'señal' : '—'}</div>
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
      </main>
    </div>
  );
};

export default Index;
