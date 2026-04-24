import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFarmContext } from "@/contexts/FarmContext";
import { useReadings } from "@/hooks/useAgroData";
import { toast } from "sonner";

const Reportes = () => {
  const { activeFarmId, farms } = useFarmContext();
  const readings = useReadings(activeFarmId, 200);
  const farm = farms.find(f => f.id === activeFarmId);

  const downloadCSV = () => {
    const header = "timestamp,ambient_temp,humidity,soil_temp,wind_speed,wind_direction,solar_radiation,solar_power\n";
    const rows = readings.map(r => [
      new Date(r.recorded_at).toISOString(), r.ambient_temp, r.humidity, r.soil_temp,
      r.wind_speed, r.wind_direction, r.solar_radiation, r.solar_power,
    ].join(',')).join('\n');
    const blob = new Blob([header + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `agrosense_${farm?.name?.replace(/\s/g, '_')}_${Date.now()}.csv`;
    a.click(); URL.revokeObjectURL(url);
    toast.success("Reporte CSV descargado");
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify({ farm, generated_at: new Date(), readings }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `agrosense_${Date.now()}.json`; a.click();
    URL.revokeObjectURL(url);
    toast.success("Reporte JSON descargado");
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-primary tracking-widest uppercase">Módulo · Reportes</span>
        <h1 className="text-3xl font-display font-bold mt-1">Reportes Descargables</h1>
        <p className="text-sm text-muted-foreground mt-1">Exporta tus datos para análisis externos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-6">
          <FileSpreadsheet className="w-10 h-10 text-primary mb-3" />
          <h3 className="font-display font-semibold text-lg mb-1">Reporte CSV</h3>
          <p className="text-sm text-muted-foreground mb-4">Compatible con Excel, Google Sheets y herramientas BI.</p>
          <p className="text-xs font-mono text-muted-foreground mb-4">{readings.length} lecturas disponibles</p>
          <Button onClick={downloadCSV} className="w-full"><Download className="w-4 h-4 mr-2" />Descargar CSV</Button>
        </div>
        <div className="glass-card rounded-xl p-6">
          <FileText className="w-10 h-10 text-secondary mb-3" />
          <h3 className="font-display font-semibold text-lg mb-1">Reporte JSON</h3>
          <p className="text-sm text-muted-foreground mb-4">Para integración con APIs y sistemas externos.</p>
          <p className="text-xs font-mono text-muted-foreground mb-4">Incluye metadatos de la finca</p>
          <Button onClick={downloadJSON} variant="outline" className="w-full"><Download className="w-4 h-4 mr-2" />Descargar JSON</Button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold mb-3">Vista previa de datos</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="text-left p-2">Timestamp</th>
                <th className="text-right p-2">T.Aire °C</th>
                <th className="text-right p-2">Humedad %</th>
                <th className="text-right p-2">T.Suelo °C</th>
                <th className="text-right p-2">Viento m/s</th>
                <th className="text-right p-2">Solar W</th>
              </tr>
            </thead>
            <tbody>
              {readings.slice(-10).reverse().map(r => (
                <tr key={r.id} className="border-b border-border/30">
                  <td className="p-2 text-muted-foreground">{new Date(r.recorded_at).toLocaleString()}</td>
                  <td className="p-2 text-right">{Number(r.ambient_temp ?? 0).toFixed(1)}</td>
                  <td className="p-2 text-right">{Number(r.humidity ?? 0).toFixed(0)}</td>
                  <td className="p-2 text-right">{Number(r.soil_temp ?? 0).toFixed(1)}</td>
                  <td className="p-2 text-right">{Number(r.wind_speed ?? 0).toFixed(1)}</td>
                  <td className="p-2 text-right">{Number(r.solar_power ?? 0).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Reportes;
