import { createContext, useContext } from "react";
import { Farm } from "@/hooks/useAgroData";

type FarmCtx = {
  activeFarmId: string;
  setActiveFarmId: (id: string) => void;
  farms: Farm[];
  systemStatus: 'optimal'|'warning'|'critical';
  setSystemStatus: (s: 'optimal'|'warning'|'critical') => void;
};

export const FarmContext = createContext<FarmCtx | null>(null);

export const useFarmContext = () => {
  const c = useContext(FarmContext);
  if (!c) throw new Error("useFarmContext outside provider");
  return c;
};
