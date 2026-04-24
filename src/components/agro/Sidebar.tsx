import { Activity, Bell, Cpu, FileBarChart, LayoutDashboard, Leaf, Settings, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Activity, label: "Monitoreo" },
  { icon: Sun, label: "Energía Solar" },
  { icon: Bell, label: "Alertas", badge: 3 },
  { icon: FileBarChart, label: "Reportes" },
  { icon: Cpu, label: "Dispositivos IoT" },
  { icon: Settings, label: "Configuración" },
];

export const Sidebar = () => (
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
        <button
          key={it.label}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all relative group",
            it.active
              ? "bg-primary/10 text-primary border border-primary/20"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          )}
        >
          <it.icon className="w-4 h-4" />
          <span className="font-medium">{it.label}</span>
          {it.badge && (
            <span className="ml-auto text-[10px] bg-accent text-accent-foreground font-mono px-1.5 py-0.5 rounded-full">
              {it.badge}
            </span>
          )}
          {it.active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-primary rounded-r" />}
        </button>
      ))}
    </nav>

    <div className="mt-auto glass-card rounded-lg p-3 border-primary/20">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
        <span className="text-xs font-mono text-success">SISTEMA ÓPTIMO</span>
      </div>
      <p className="text-[11px] text-muted-foreground leading-relaxed">
        12 sensores activos · Latencia 42ms
      </p>
    </div>
  </aside>
);
