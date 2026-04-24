import { Bell, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { useFarmContext } from "@/contexts/FarmContext";

export const TopBar = ({ status, farmName }: { status: 'optimal' | 'warning' | 'critical'; farmName?: string }) => {
  const { user, signOut, role } = useAuth();
  const { farms, setActiveFarmId, activeFarmId } = useFarmContext();
  const statusMap = {
    optimal: { label: "ÓPTIMO", color: "success" },
    warning: { label: "ADVERTENCIA", color: "warning" },
    critical: { label: "CRÍTICO", color: "critical" },
  };
  const s = statusMap[status];
  const initials = (user?.email ?? "U").slice(0, 2).toUpperCase();
  const active = farms.find(f => f.id === activeFarmId);

  return (
    <header className="sticky top-0 z-20 glass-card rounded-none border-x-0 border-t-0 px-4 lg:px-8 py-3 flex items-center gap-4">
      <div className="flex flex-col">
        <span className="text-[10px] font-mono uppercase text-muted-foreground tracking-widest">Centro de Control</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="font-display font-semibold text-base lg:text-lg flex items-center gap-1.5 hover:text-primary">
              {farmName || active?.name || 'Sin finca'}
              <ChevronDown className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Cambiar de finca</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {farms.map(f => (
              <DropdownMenuItem key={f.id} onClick={() => setActiveFarmId(f.id)}>
                {f.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden md:flex items-center gap-2 ml-4 px-3 py-1.5 rounded-full border"
           style={{ background: `hsl(var(--${s.color}) / 0.05)`, borderColor: `hsl(var(--${s.color}) / 0.3)` }}>
        <span className="relative flex w-2 h-2">
          <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping" style={{ background: `hsl(var(--${s.color}))` }} />
          <span className="relative inline-flex w-2 h-2 rounded-full" style={{ background: `hsl(var(--${s.color}))` }} />
        </span>
        <span className="text-xs font-mono font-semibold" style={{ color: `hsl(var(--${s.color}))` }}>{s.label}</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="icon" className="hidden sm:flex"><Search className="w-4 h-4" /></Button>
        <Button variant="ghost" size="icon" className="relative"><Bell className="w-4 h-4" /></Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 pl-3 ml-1 border-l border-border hover:opacity-80">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-background font-bold text-xs">{initials}</div>
              <div className="hidden md:flex flex-col items-start">
                <span className="text-xs font-medium leading-tight">{user?.email}</span>
                <span className="text-[10px] text-muted-foreground font-mono uppercase">{role}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-muted-foreground hidden md:block" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>Cerrar sesión</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
