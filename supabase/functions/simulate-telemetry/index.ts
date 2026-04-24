// Simulador de telemetría: genera lecturas para todos los devices del usuario
// POST /simulate-telemetry  (auth requerido) genera 1 lectura por device de las farms del usuario
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function rand(min: number, max: number) { return +(Math.random() * (max - min) + min).toFixed(2); }

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const auth = req.headers.get('Authorization');
    if (!auth) return new Response(JSON.stringify({ error: 'no auth' }), { status: 401, headers: corsHeaders });

    const userClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: auth } } }
    );
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return new Response(JSON.stringify({ error: 'invalid auth' }), { status: 401, headers: corsHeaders });

    const { data: farms } = await supabase.from('farms').select('id').eq('owner_id', user.id);
    if (!farms?.length) return new Response(JSON.stringify({ inserted: 0 }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    const farmIds = farms.map(f => f.id);
    const { data: devices } = await supabase.from('devices').select('id, farm_id, device_type').in('farm_id', farmIds);

    const rows = (devices ?? []).map(d => ({
      device_id: d.id,
      farm_id: d.farm_id,
      ambient_temp: rand(20, 32),
      humidity: rand(45, 80),
      soil_temp: rand(16, 24),
      wind_speed: rand(0.5, 12),
      wind_direction: rand(0, 359),
      solar_radiation: rand(200, 1000),
      solar_power: rand(1500, 7000),
      luminosity: rand(5000, 90000),
    }));

    if (rows.length) await supabase.from('sensor_readings').insert(rows);

    return new Response(JSON.stringify({ inserted: rows.length }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
