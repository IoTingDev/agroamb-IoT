import { useState } from "react";
import { Cpu, Plus, Trash2, Wifi, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useFarmContext } from "@/contexts/FarmContext";
import { useDevices } from "@/hooks/useAgroData";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { es } from "date-fns/locale";

const Dispositivos = () => {
  const { activeFarmId } = useFarmContext();
  const devices = useDevices(activeFarmId);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [type, setType] = useState<string>("ambiental");

  const addDevice = async () => {
    const { error } = await supabase.from('devices').insert({
      farm_id: activeFarmId, name, device_code: code, device_type: type as any, signal_strength: 100,
    });
    if (error) toast.error(error.message);
    else { toast.success("Dispositivo agregado"); setOpen(false); setName(""); setCode(""); }
  };

  const deleteDevice = async (id: string) => {
    const { error } = await supabase.from('devices').delete().eq('id', id);
    if (error) toast.error(error.message); else toast.success("Eliminado");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <span className="text-xs font-mono text-primary tracking-widest uppercase">Módulo · Dispositivos</span>
          <h1 className="text-3xl font-display font-bold mt-1">Gestión de Dispositivos IoT</h1>
          <p className="text-sm text-muted-foreground mt-1">{devices.length} nodos registrados · {devices.filter(d=>d.is_online).length} online</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-secondary text-background"><Plus className="w-4 h-4 mr-2" />Nuevo dispositivo</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Registrar nuevo nodo IoT</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Nombre</Label><Input value={name} onChange={e=>setName(e.target.value)} placeholder="Estación Sector C" /></div>
              <div><Label>Código único</Label><Input value={code} onChange={e=>setCode(e.target.value)} placeholder="NODE-XYZ123" /></div>
              <div>
                <Label>Tipo</Label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gateway">Gateway</SelectItem>
                    <SelectItem value="ambiental">Ambiental</SelectItem>
                    <SelectItem value="suelo">Suelo</SelectItem>
                    <SelectItem value="viento">Viento</SelectItem>
                    <SelectItem value="solar">Solar</SelectItem>
                    <SelectItem value="luminosidad">Luminosidad</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter><Button onClick={addDevice} disabled={!name || !code}>Guardar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {devices.map(d => (
          <div key={d.id} className="glass-card rounded-xl p-5 group">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-primary/10 text-primary"><Cpu className="w-5 h-5" /></div>
                <div>
                  <div className="font-display font-semibold">{d.name}</div>
                  <div className="text-[10px] font-mono text-muted-foreground">{d.device_code}</div>
                </div>
              </div>
              {d.is_online ? <Wifi className="w-4 h-4 text-success" /> : <WifiOff className="w-4 h-4 text-critical" />}
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex justify-between"><span className="text-muted-foreground">Tipo</span><span className="capitalize">{d.device_type}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Señal</span><span className={d.is_online?'text-success':'text-critical'}>{d.is_online?`${d.signal_strength}%`:'OFFLINE'}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Firmware</span><span>{d.firmware_version}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Visto</span><span>{d.last_seen ? formatDistanceToNow(new Date(d.last_seen), { locale: es, addSuffix: true }) : '—'}</span></div>
            </div>
            <Button variant="ghost" size="sm" className="w-full mt-3 text-critical opacity-0 group-hover:opacity-100" onClick={()=>deleteDevice(d.id)}>
              <Trash2 className="w-3 h-3 mr-2" />Eliminar
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Dispositivos;
