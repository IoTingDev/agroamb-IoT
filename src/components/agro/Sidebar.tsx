import { NavLink } from "react-router-dom";
import { Activity, Bell, Cpu, FileBarChart, LayoutDashboard, Leaf, LogOut, Settings, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/" },
  { icon: Activity, label: "Monitoreo", to: "/monitoreo" },
  { icon: Sun, label: "Energía Solar", to: "/energia" },
  { icon: Bell, label: "Alertas", to: "/alertas" },
  { icon: FileBarChart, label: "Reportes", to: "/reportes" },
  { icon: Cpu, label: "Dispositivos IoT", to: "/dispositivos" },
  { icon: Settings, label: "Configuración", to: "/configuracion" },
];

export const Sidebar = () => {
  const { signOut, role } = useAuth();
  return (
    <aside className="hidden lg:flex flex-col w-60 h-screen sticky top-0 glass-card rounded-none border-r border-l-0 border-t-0 border-b-0 p-4 gap-1">
      <div className="flex items-center gap-2.5 px-2 py-3 mb-4">
        <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary">
          <Leaf className="w-5 h-5 text-background" />
        </div>
        <div>
          <h1 className="font-display font-bold text-lg leading-none">AgroSense</h1>
          <span className="text-[10px] font-mono text-primary tracking-widest">v 4.0 · IoT</span>
        </div>
      </div>

      <nav className="flex flex-col gap-1">
        {items.map((it) => (
          <NavLink key={it.to} to={it.to} end
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative",
              isActive
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent"
            )}
          >
            {({ isActive }) => (
              <>
                <it.icon className="w-4 h-4" />
                <span className="font-medium">{it.label}</span>
                {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto space-y-2">
        <div className="glass-card rounded-lg p-3 border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-xs font-mono text-success uppercase">{role ?? 'cliente'}</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">Sistema sincronizado</p>
        </div>
        <Button variant="ghost" size="sm" onClick={signOut} className="w-full justify-start text-muted-foreground hover:text-critical">
          <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
        </Button>
      </div>
    </aside>
  );
};
