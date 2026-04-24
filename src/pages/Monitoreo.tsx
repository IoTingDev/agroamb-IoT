import { LiveChart } from "@/components/agro/LiveChart";
import { useFarmContext } from "@/contexts/FarmContext";
import { useReadings } from "@/hooks/useAgroData";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

const Monitoreo = () => {
  const { activeFarmId } = useFarmContext();
  const readings = useReadings(activeFarmId, 100);

  const chartData = readings.map(r => ({
    time: new Date(r.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    wind: r.wind_speed ? +Number(r.wind_speed).toFixed(1) : 0,
    radiation: r.solar_radiation ? +Number(r.solar_radiation).toFixed(0) : 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-primary tracking-widest uppercase">Módulo · Monitoreo</span>
        <h1 className="text-3xl font-display font-bold mt-1">Monitoreo Ambiental Detallado</h1>
        <p className="text-sm text-muted-foreground mt-1">Series históricas de las últimas 100 lecturas</p>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold mb-4">Temperatura, Humedad y Suelo</h3>
        <LiveChart data={readings} />
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold mb-4">Viento (m/s) y Radiación Solar (W/m²)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} />
            <YAxis yAxisId="l" stroke="hsl(var(--secondary))" fontSize={10} />
            <YAxis yAxisId="r" orientation="right" stroke="hsl(var(--accent))" fontSize={10} />
            <Tooltip contentStyle={{ background: 'hsl(var(--popover))', border: '1px solid hsl(var(--border))', borderRadius: '8px', fontSize: '12px' }} />
            <Line yAxisId="l" type="monotone" dataKey="wind" stroke="hsl(var(--secondary))" strokeWidth={2} dot={false} name="Viento m/s" />
            <Line yAxisId="r" type="monotone" dataKey="radiation" stroke="hsl(var(--accent))" strokeWidth={2} dot={false} name="Radiación W/m²" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
export default Monitoreo;
