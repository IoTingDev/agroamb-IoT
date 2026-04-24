import { Bell, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export const TopBar = ({ status }: { status: 'optimal' | 'warning' | 'critical' }) => {
  const statusMap = {
    optimal: { label: "ÓPTIMO", color: "success" },
    warning: { label: "ADVERTENCIA", color: "warning" },
    critical: { label: "CRÍTICO", color: "critical" },
  };
  const s = statusMap[status];

  return (
    <header className="sticky top-0 z-20 glass-card rounded-none border-x-0 border-t-0 px-4 lg:px-8 py-3 flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Centro de Control</span>
        <h2 className="font-display font-semibold text-base lg:text-lg">Finca La Esperanza · Nodo 01</h2>
      </div>

      <div className={`hidden md:flex items-center gap-2 ml-4 px-3 py-1.5 rounded-full border bg-${s.color}/5 border-${s.color}/30`}
           style={{ background: `hsl(var(--${s.color}) / 0.05)`, borderColor: `hsl(var(--${s.color}) / 0.3)` }}>
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping" style={{ background: `hsl(var(--${s.color}))` }} />
          <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: `hsl(var(--${s.color}))` }} />
        </span>
        <span className="text-xs font-mono font-semibold" style={{ color: `hsl(var(--${s.color}))` }}>{s.label}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden sm:flex"><Search className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-accent rounded-full" />
        </Button>
        <div className="flex items-center gap-2 pl-3 ml-1 border-l border-border">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold text-xs">JM</div>
          <div className="hidden md:flex flex-col">
            <span className="text-xs font-medium leading-tight">Juan Méndez</span>
            <span className="text-[10px] text-muted-foreground font-mono">Administrador</span>
          </div>
          <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
        </div>
      </div>
    </header>
  );
};
