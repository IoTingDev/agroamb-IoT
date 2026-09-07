import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { AppLayout } from "@/components/AppLayout";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import Monitoreo from "./pages/Monitoreo";
import Energia from "./pages/Energia";
import Alertas from "./pages/Alertas";
import Reportes from "./pages/Reportes";
import Dispositivos from "./pages/Dispositivos";
import Configuracion from "./pages/Configuracion";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/auth" element={<Navigate to="/" replace />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route element={<AppLayout />}>

              <Route path="/" element={<Dashboard />} />
              <Route path="/monitoreo" element={<Monitoreo />} />
              <Route path="/energia" element={<Energia />} />
              <Route path="/alertas" element={<Alertas />} />
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/dispositivos" element={<Dispositivos />} />
              <Route path="/configuracion" element={<Configuracion />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
