import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Loader2, Mail, Lock, Building2, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const Auth = () => {
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [organization, setOrganization] = useState("");
  const [forgot, setForgot] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) toast.error(error);
    else { toast.success("Bienvenido"); navigate("/"); }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUp(email, password, fullName, organization);
    setLoading(false);
    if (error) toast.error(error);
    else { toast.success("Cuenta creada. Bienvenido a AgroSense 4.0"); navigate("/"); }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) toast.error(error.message);
    else { setForgotSent(true); toast.success("Correo de recuperación enviado"); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Decorative background */}
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
          <h1 className="font-display font-bold text-3xl">AgroSense <span className="text-gradient">4.0</span></h1>
          <p className="text-xs font-mono text-muted-foreground tracking-widest mt-1">INDUSTRIAL IoT PLATFORM</p>
        </div>

        <div className="glass-card rounded-2xl p-6">
          {forgot ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setForgot(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <h2 className="font-display font-semibold text-lg">Recuperar contraseña</h2>
              </div>
              {forgotSent ? (
                <div className="text-center space-y-4 py-4">
                  <p className="text-sm text-muted-foreground">
                    Te enviamos un enlace de recuperación a <span className="text-foreground font-medium">{email}</span>.
                    Revisa tu correo para restablecer tu contraseña.
                  </p>
                  <Button
                    onClick={() => { setForgot(false); setForgotSent(false); }}
                    variant="outline"
                    className="w-full"
                  >
                    Volver al inicio de sesión
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Ingresa tu email corporativo y te enviaremos un enlace para restablecer tu contraseña.
                  </p>
                  <div className="space-y-2">
                    <Label htmlFor="fp-email">Email corporativo</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input id="fp-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="pl-9" placeholder="usuario@empresa.com" />
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Enviar enlace de recuperación"}
                  </Button>
                </form>
              )}
            </div>
          ) : (
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-6">
              <TabsTrigger value="signin">Iniciar sesión</TabsTrigger>
              <TabsTrigger value="signup">Crear cuenta</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="si-email">Email corporativo</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="si-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="pl-9" placeholder="usuario@empresa.com" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="si-pass">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="si-pass" type="password" required value={password} onChange={e => setPassword(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Acceder al panel"}
                </Button>
                <button
                  type="button"
                  onClick={() => { setForgot(true); setForgotSent(false); }}
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors text-right"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="su-name">Nombre completo</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="su-name" required value={fullName} onChange={e => setFullName(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-org">Organización</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="su-org" required value={organization} onChange={e => setOrganization(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-email">Email corporativo</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="su-email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="su-pass">Contraseña</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="su-pass" type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="pl-9" />
                  </div>
                </div>
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-secondary text-background hover:opacity-90">
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Crear cuenta empresarial"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
        <p className="text-center text-[10px] font-mono text-muted-foreground/60 mt-6">
          AGROSENSE 4.0 · DEMO COMERCIAL · v1.0
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
