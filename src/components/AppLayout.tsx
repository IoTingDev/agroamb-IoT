import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/agro/Sidebar";
import { TopBar } from "@/components/agro/TopBar";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useFarms } from "@/hooks/useAgroData";
import { Loader2 } from "lucide-react";
import { FarmContext } from "@/contexts/FarmContext";

export const AppLayout = () => {
  const { user } = useAuth();
  const { farms, loading, refetch } = useFarms();
  const [seeding, setSeeding] = useState(false);
  const [activeFarmId, setActiveFarmId] = useState<string | null>(null);
  const [systemStatus, setSystemStatus] = useState<'optimal'|'warning'|'critical'>('optimal');

  // Auto-seed demo on first login
  useEffect(() => {
    if (!user || loading) return;
    if (farms.length === 0 && !seeding) {
      setSeeding(true);
      supabase.functions.invoke('seed-demo').then(() => refetch().finally(() => setSeeding(false)));
    } else if (farms.length > 0 && !activeFarmId) {
      setActiveFarmId(farms[0].id);
    }
  }, [user, loading, farms, seeding, activeFarmId, refetch]);

  // Telemetry simulation: invoke every 6s while logged in
  useEffect(() => {
    if (!activeFarmId) return;
    const tick = () => supabase.functions.invoke('simulate-telemetry').catch(() => {});
    tick();
    const id = setInterval(tick, 6000);
    return () => clearInterval(id);
  }, [activeFarmId]);

  if (loading || seeding || !activeFarmId) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <span className="text-xs font-mono text-muted-foreground">
          {seeding ? "INICIALIZANDO FINCA DEMO..." : "CARGANDO DATOS..."}
        </span>
      </div>
    );
  }

  return (
    <FarmContext.Provider value={{ activeFarmId, setActiveFarmId, farms, systemStatus, setSystemStatus }}>
      <div className="min-h-screen flex">
        <Sidebar />
        <main className="flex-1 flex flex-col min-w-0">
          <TopBar status={systemStatus} farmName={farms.find(f => f.id === activeFarmId)?.name ?? ''} />
          <div className="p-4 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </FarmContext.Provider>
  );
};
