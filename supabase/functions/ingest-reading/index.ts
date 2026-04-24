// Edge function: ingesta pública de lecturas IoT
// POST /ingest-reading  body: { device_code, ambient_temp, humidity, ... }
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const body = await req.json();
    const { device_code, ...metrics } = body;
    if (!device_code) {
      return new Response(JSON.stringify({ error: "device_code requerido" }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const { data: device, error: devErr } = await supabase
      .from('devices').select('id, farm_id').eq('device_code', device_code).maybeSingle();

    if (devErr || !device) {
      return new Response(JSON.stringify({ error: "device no encontrado" }), { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { error } = await supabase.from('sensor_readings').insert({
      device_id: device.id,
      farm_id: device.farm_id,
      ...metrics,
    });

    if (error) throw error;

    await supabase.from('devices').update({ last_seen: new Date().toISOString(), is_online: true }).eq('id', device.id);

    // Threshold check
    const { data: thresholds } = await supabase.from('thresholds').select('*').eq('farm_id', device.farm_id).eq('enabled', true);
    for (const t of thresholds ?? []) {
      const v = metrics[t.sensor_kind as keyof typeof metrics];
      if (typeof v !== 'number') continue;
      let level: string | null = null;
      let msg = "";
      if ((t.min_value !== null && v < t.min_value) || (t.max_value !== null && v > t.max_value)) {
        level = 'critical'; msg = `${t.sensor_kind}=${v} fuera de rango crítico`;
      } else if ((t.warning_min !== null && v < t.warning_min) || (t.warning_max !== null && v > t.warning_max)) {
        level = 'warning'; msg = `${t.sensor_kind}=${v} en zona de advertencia`;
      }
      if (level) {
        await supabase.from('alerts').insert({
          farm_id: device.farm_id, device_id: device.id, level,
          title: `Umbral superado: ${t.sensor_kind}`, message: msg,
        });
      }
    }

    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
