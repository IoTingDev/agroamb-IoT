import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Leaf } from "lucide-react";

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center animate-pulse-glow">
            <Leaf className="w-6 h-6 text-background" />
          </div>
          <span className="text-xs font-mono text-muted-foreground">INICIALIZANDO SISTEMA...</span>
        </div>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  return <>{children}</>;
};
