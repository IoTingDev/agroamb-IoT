import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";
import { SensorReading } from "@/lib/sensorData";

export const LiveChart = ({ data }: { data: SensorReading[] }) => {
  const formatted = data.map(d => ({
    time: new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    temp: +d.ambientTemp.toFixed(1),
    humidity: +d.humidity.toFixed(1),
    soil: +d.soilTemp.toFixed(1),
  }));

  return (
    <ResponsiveContainer width="100%" height={280}>
      <AreaChart data={formatted} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gTemp" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.5} />
            <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gHum" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--secondary))" stopOpacity={0.5} />
            <stop offset="100%" stopColor="hsl(var(--secondary))" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gSoil" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity={0.5} />
            <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
        <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontFamily: 'JetBrains Mono' }} />
        <YAxis stroke="hsl(var(--muted-foreground))" fontSize={10} tick={{ fontFamily: 'JetBrains Mono' }} />
        <Tooltip
          contentStyle={{
            background: 'hsl(var(--popover))',
            border: '1px solid hsl(var(--border))',
            borderRadius: '8px',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono',
          }}
        />
        <Area type="monotone" dataKey="temp" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#gTemp)" name="T. Aire °C" />
        <Area type="monotone" dataKey="humidity" stroke="hsl(var(--secondary))" strokeWidth={2} fill="url(#gHum)" name="Humedad %" />
        <Area type="monotone" dataKey="soil" stroke="hsl(var(--accent))" strokeWidth={2} fill="url(#gSoil)" name="T. Suelo °C" />
      </AreaChart>
    </ResponsiveContainer>
  );
};
