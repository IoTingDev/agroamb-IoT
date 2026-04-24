import { Sun, Zap, TrendingUp, Battery } from "lucide-react";
import { KpiCard } from "@/components/agro/KpiCard";
import { Gauge } from "@/components/agro/Gauge";
import { useFarmContext } from "@/contexts/FarmContext";
import { useReadings } from "@/hooks/useAgroData";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const Energia = () => {
  const { activeFarmId } = useFarmContext();
  const readings = useReadings(activeFarmId, 60);
  const current = readings[readings.length - 1];

  const data = readings.map(r => ({
    time: new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    power: r.solar_power ? +(Number(r.solar_power) / 1000).toFixed(2) : 0,
    radiation: r.solar_radiation ? +Number(r.solar_radiation).toFixed(0) : 0,
  }));

  const totalKwh = data.reduce((s, d) => s + d.power, 0) * 0.05; // mock integral
  const avgPower = data.length ? data.reduce((s, d) => s + d.power, 0) / data.length : 0;
  const efficiency = current?.solar_radiation ? Math.min(100, (Number(current.solar_power) / Number(current.solar_radiation)) * 12) : 0;

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-accent tracking-widest uppercase">Módulo · Energía Solar</span>
        <h1 className="text-3xl font-display font-bold mt-1">Generación y Eficiencia Solar</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KpiCard label="Potencia actual" value={current ? (Number(current.solar_power) / 1000).toFixed(2) : '0'} unit="kW" icon={Zap} accent="accent" />
        <KpiCard label="Radiación" value={current ? Number(current.solar_radiation).toFixed(0) : '0'} unit="W/m²" icon={Sun} accent="accent" />
        <KpiCard label="Energía hoy" value={totalKwh.toFixed(2)} unit="kWh" icon={Battery} accent="primary" trend={12} />
        <KpiCard label="Eficiencia" value={efficiency.toFixed(0)} unit="%" icon={TrendingUp} accent="secondary" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="xl:col-span-2 glass-card rounded-xl p-5">
          <h3 className="font-display font-semibold mb-4">Producción solar (kW)</h3>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={data}>
              <defs>
                <linearGradient id="solar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.6} />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
              <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} />
              <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="power" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#solar)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="glass-card rounded-xl p-5 flex flex-col items-center justify-center gap-4">
          <h3 className="font-display font-semibold">Potencia instantánea</h3>
          <Gauge value={current ? Number(current.solar_power) / 1000 : 0} max={8} label="Solar" unit="kW" color="hsl(var(--accent))" />
          <div className="text-center">
            <div className="text-xs text-muted-foreground">Promedio sesión</div>
            <div className="text-2xl font-display font-bold text-accent">{avgPower.toFixed(2)} kW</div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Energia;
