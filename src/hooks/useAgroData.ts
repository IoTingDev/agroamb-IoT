import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

export type Farm = { id: string; name: string; location: string | null; latitude: number | null; longitude: number | null; area_hectares: number | null };
export type Device = { id: string; farm_id: string; name: string; device_code: string; device_type: string; is_online: boolean; signal_strength: number | null; firmware_version: string | null; last_seen: string | null };
export type Reading = { id: number; farm_id: string; device_id: string; ambient_temp: number | null; humidity: number | null; soil_temp: number | null; wind_speed: number | null; wind_direction: number | null; solar_radiation: number | null; solar_power: number | null; luminosity: number | null; recorded_at: string };
export type Alert = { id: string; farm_id: string; device_id: string | null; level: 'info'|'warning'|'critical'|'success'; title: string; message: string; is_read: boolean; created_at: string };

export const useFarms = () => {
  const { user } = useAuth();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let cancelled = false;
    const load = async () => {
      const { data } = await supabase.from('farms').select('*').order('created_at');
      if (!cancelled) {
        setFarms((data as Farm[]) ?? []);
        setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [user]);

  return { farms, loading, refetch: async () => {
    const { data } = await supabase.from('farms').select('*').order('created_at');
    setFarms((data as Farm[]) ?? []);
  }};
};

export const useDevices = (farmId: string | null) => {
  const [devices, setDevices] = useState<Device[]>([]);
  useEffect(() => {
    if (!farmId) return;
    supabase.from('devices').select('*').eq('farm_id', farmId).order('created_at')
      .then(({ data }) => setDevices((data as Device[]) ?? []));

    const ch = supabase.channel(`devices-${farmId}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'devices', filter: `farm_id=eq.${farmId}` },
          () => supabase.from('devices').select('*').eq('farm_id', farmId).order('created_at')
                  .then(({ data }) => setDevices((data as Device[]) ?? [])))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [farmId]);
  return devices;
};

export const useReadings = (farmId: string | null, limit = 50) => {
  const [readings, setReadings] = useState<Reading[]>([]);
  useEffect(() => {
    if (!farmId) return;
    supabase.from('sensor_readings').select('*').eq('farm_id', farmId).order('recorded_at', { ascending: false }).limit(limit)
      .then(({ data }) => setReadings(((data as Reading[]) ?? []).reverse()));

    const ch = supabase.channel(`readings-${farmId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'sensor_readings', filter: `farm_id=eq.${farmId}` },
          (payload) => setReadings(prev => [...prev.slice(-(limit - 1)), payload.new as Reading]))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [farmId, limit]);
  return readings;
};

export const useAlerts = (farmId: string | null) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  useEffect(() => {
    if (!farmId) return;
    supabase.from('alerts').select('*').eq('farm_id', farmId).order('created_at', { ascending: false }).limit(20)
      .then(({ data }) => setAlerts((data as Alert[]) ?? []));

    const ch = supabase.channel(`alerts-${farmId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'alerts', filter: `farm_id=eq.${farmId}` },
          (payload) => setAlerts(prev => [payload.new as Alert, ...prev].slice(0, 20)))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [farmId]);
  return { alerts, markRead: async (id: string) => {
    await supabase.from('alerts').update({ is_read: true }).eq('id', id);
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, is_read: true } : a));
  }};
};
