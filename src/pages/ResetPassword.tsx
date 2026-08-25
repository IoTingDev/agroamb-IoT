import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Loader2, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";


const ResetPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, sess) => {
      if (event === "PASSWORD_RECOVERY" || sess) {
        setReady(true);
        setChecking(false);
      }
    });

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const query = new URLSearchParams(window.location.search);
    const isRecoveryLink =
      hash.get("type") === "recovery" ||
      query.get("type") === "recovery" ||
      !!query.get("code") ||
      !!hash.get("access_token");

    const timer = setTimeout(async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setReady(!!session || isRecoveryLink);
      setChecking(false);
    }, 800);

    return () => { subscription.unsubscribe(); clearTimeout(timer); };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden");
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setDone(true);
      toast.success("Contraseña actualizada correctamente");
      await supabase.auth.signOut();
      setTimeout(() => navigate("/auth", { replace: true }), 800);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-20 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-secondary/10 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center glow-primary mb-4">
            <Leaf className="w-7 h-7 text-background" />
          </div>
          <h1 className="font-display font-bold text-2xl">Restablecer contraseña</h1>
          <p className="text-xs font-mono text-muted-foreground tracking-widest mt-1">AGROSENSE 4.0</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          {checking ? (
            <div className="flex flex-col items-center gap-3 py-8">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">Validando enlace de recuperación…</p>
            </div>
          ) : done ? (
            <div className="text-center space-y-4 py-6">
              <CheckCircle2 className="w-8 h-8 text-primary mx-auto" />
              <p className="text-sm text-muted-foreground">
                Tu contraseña fue actualizada. Inicia sesión con la nueva contraseña.
              </p>
            </div>
          ) : !ready ? (
            <div className="text-center space-y-4 py-4">
              <p className="text-sm text-muted-foreground">
                El enlace de recuperación no es válido o ha expirado.
              </p>
              <Button
                onClick={() => navigate("/auth")}
                variant="outline"
                className="w-full"
              >
                <ArrowLeft className="w-4 h-4 mr-2" /> Volver al inicio de sesión
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rp-pass">Nueva contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="rp-pass"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="pl-9"
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="rp-confirm">Confirmar contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="rp-confirm"
                    type="password"
                    required
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    className="pl-9"
                    placeholder="Repite la nueva contraseña"
                  />
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Actualizar contraseña"}
              </Button>
            </form>
          )}
        </div>
        <p className="text-center text-[10px] font-mono text-muted-foreground/60 mt-6">
          AGROSENSE 4.0 · SEGURIDAD DE CUENTA
        </p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
