// Inicializa una finca demo con dispositivos y umbrales
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const auth = req.headers.get('Authorization');
    if (!auth) return new Response(JSON.stringify({ error: 'no auth' }), { status: 401, headers: corsHeaders });

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: auth } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'invalid' }), { status: 401, headers: corsHeaders });

    const admin = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

    // Already has farms? skip
    const { data: existing } = await admin.from('farms').select('id').eq('owner_id', user.id).limit(1);
    if (existing?.length) {
      return new Response(JSON.stringify({ ok: true, skipped: true }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }

    const { data: farm } = await admin.from('farms').insert({
      owner_id: user.id,
      name: "Finca La Esperanza",
      location: "Antioquia, Colombia",
      latitude: 6.2442, longitude: -75.5812, area_hectares: 24.5,
    }).select().single();

    const code = () => `NODE-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const devices = [
      { name: 'Gateway Principal', device_type: 'gateway' },
      { name: 'Estación Ambiental N°1', device_type: 'ambiental' },
      { name: 'Estación Ambiental N°2', device_type: 'ambiental' },
      { name: 'Sensor Suelo Sector A', device_type: 'suelo' },
      { name: 'Anemómetro Norte', device_type: 'viento' },
      { name: 'Estación Solar', device_type: 'solar' },
    ];
    await admin.from('devices').insert(devices.map(d => ({
      farm_id: farm!.id, device_code: code(),
      name: d.name, device_type: d.device_type,
      signal_strength: Math.floor(Math.random() * 30) + 70,
    })));

    await admin.from('thresholds').insert([
      { farm_id: farm!.id, sensor_kind: 'ambient_temp', warning_max: 30, max_value: 35, warning_min: 5, min_value: 0 },
      { farm_id: farm!.id, sensor_kind: 'humidity', warning_min: 50, min_value: 35, warning_max: 85, max_value: 95 },
      { farm_id: farm!.id, sensor_kind: 'wind_speed', warning_max: 10, max_value: 15 },
    ]);

    return new Response(JSON.stringify({ ok: true, farm_id: farm!.id }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
