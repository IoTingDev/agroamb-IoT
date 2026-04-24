import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useFarmContext } from "@/contexts/FarmContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

type Threshold = { id?: string; sensor_kind: string; min_value: number | null; max_value: number | null; warning_min: number | null; warning_max: number | null; enabled: boolean };

const SENSORS = [
  { key: 'ambient_temp', label: 'Temperatura ambiente', unit: '°C' },
  { key: 'humidity', label: 'Humedad', unit: '%' },
  { key: 'soil_temp', label: 'Temperatura suelo', unit: '°C' },
  { key: 'wind_speed', label: 'Velocidad del viento', unit: 'm/s' },
  { key: 'solar_radiation', label: 'Radiación solar', unit: 'W/m²' },
];

const Configuracion = () => {
  const { activeFarmId } = useFarmContext();
  const { user, role } = useAuth();
  const [thresholds, setThresholds] = useState<Record<string, Threshold>>({});
  const [profile, setProfile] = useState({ full_name: '', organization: '' });

  useEffect(() => {
    if (!activeFarmId) return;
    supabase.from('thresholds').select('*').eq('farm_id', activeFarmId).then(({ data }) => {
      const map: Record<string, Threshold> = {};
      (data ?? []).forEach((t: any) => { map[t.sensor_kind] = t; });
      setThresholds(map);
    });
  }, [activeFarmId]);

  useEffect(() => {
    if (!user) return;
    supabase.from('profiles').select('full_name, organization').eq('id', user.id).maybeSingle()
      .then(({ data }) => data && setProfile({ full_name: data.full_name ?? '', organization: data.organization ?? '' }));
  }, [user]);

  const update = (kind: string, patch: Partial<Threshold>) => {
    setThresholds(prev => ({ ...prev, [kind]: { ...(prev[kind] ?? { sensor_kind: kind, min_value: null, max_value: null, warning_min: null, warning_max: null, enabled: true }), ...patch } }));
  };

  const saveThresholds = async () => {
    for (const t of Object.values(thresholds)) {
      const payload = { ...t, farm_id: activeFarmId };
      if (t.id) await supabase.from('thresholds').update(payload).eq('id', t.id);
      else await supabase.from('thresholds').insert(payload as any);
    }
    toast.success("Umbrales guardados");
  };

  const saveProfile = async () => {
    await supabase.from('profiles').update(profile).eq('id', user!.id);
    toast.success("Perfil actualizado");
  };

  return (
    <div className="space-y-6">
      <div>
        <span className="text-xs font-mono text-primary tracking-widest uppercase">Módulo · Configuración</span>
        <h1 className="text-3xl font-display font-bold mt-1">Configuración del Sistema</h1>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold mb-4">Perfil de usuario · <span className="text-xs font-mono text-primary uppercase">{role}</span></h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div><Label>Nombre completo</Label><Input value={profile.full_name} onChange={e => setProfile({ ...profile, full_name: e.target.value })} /></div>
          <div><Label>Organización</Label><Input value={profile.organization} onChange={e => setProfile({ ...profile, organization: e.target.value })} /></div>
        </div>
        <Button onClick={saveProfile} className="mt-4" size="sm"><Save className="w-3 h-3 mr-2" />Guardar perfil</Button>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-display font-semibold mb-1">Umbrales de alerta</h3>
        <p className="text-xs text-muted-foreground mb-4">Define los rangos para activar alertas automáticas en cada sensor</p>
        <div className="space-y-4">
          {SENSORS.map(s => {
            const t = thresholds[s.key] ?? { sensor_kind: s.key, min_value: null, max_value: null, warning_min: null, warning_max: null, enabled: true };
            return (
              <div key={s.key} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="font-medium">{s.label}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{s.unit}</div>
                  </div>
                  <Switch checked={t.enabled} onCheckedChange={v => update(s.key, { enabled: v })} />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div><Label className="text-[10px] text-critical">Mín crítico</Label><Input type="number" value={t.min_value ?? ''} onChange={e => update(s.key, { min_value: e.target.value === '' ? null : +e.target.value })} /></div>
                  <div><Label className="text-[10px] text-warning">Mín advertencia</Label><Input type="number" value={t.warning_min ?? ''} onChange={e => update(s.key, { warning_min: e.target.value === '' ? null : +e.target.value })} /></div>
                  <div><Label className="text-[10px] text-warning">Máx advertencia</Label><Input type="number" value={t.warning_max ?? ''} onChange={e => update(s.key, { warning_max: e.target.value === '' ? null : +e.target.value })} /></div>
                  <div><Label className="text-[10px] text-critical">Máx crítico</Label><Input type="number" value={t.max_value ?? ''} onChange={e => update(s.key, { max_value: e.target.value === '' ? null : +e.target.value })} /></div>
                </div>
              </div>
            );
          })}
        </div>
        <Button onClick={saveThresholds} className="mt-4 bg-gradient-to-r from-primary to-secondary text-background"><Save className="w-4 h-4 mr-2" />Guardar umbrales</Button>
      </div>
    </div>
  );
};
export default Configuracion;
