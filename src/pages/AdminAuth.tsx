import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { z } from "zod";
import { useLanguage } from "@/contexts/language-context";

const AdminAuth = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const loginSchema = z.object({
    email: z.string().email(t.adminAuth.invalidEmail),
    password: z.string().min(6, t.adminAuth.passwordTooShort),
  });

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setTimeout(() => {
            checkAdminRole(session.user.id);
          }, 0);
        }
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        checkAdminRole(session.user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkAdminRole = async (userId: string) => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "admin")
      .maybeSingle();

    if (data) {
      navigate("/admin");
    }
  };

  const validateForm = () => {
    try {
      loginSchema.parse({ email, password });
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: { email?: string; password?: string } = {};
        error.errors.forEach((err) => {
          if (err.path[0] === "email") fieldErrors.email = err.message;
          if (err.path[0] === "password") fieldErrors.password = err.message;
        });
        setErrors(fieldErrors);
      }
      return false;
    }
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast({
          title: t.adminAuth.signupSuccess,
          description: t.adminAuth.signupDescription,
        });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;

        if (data.user) {
          const { data: roleData } = await supabase
            .from("user_roles")
            .select("role")
            .eq("user_id", data.user.id)
            .eq("role", "admin")
            .maybeSingle();

          if (roleData) {
            navigate("/admin");
          } else {
            await supabase.auth.signOut();
            toast({
              title: t.adminAuth.noAccess,
              description: t.adminAuth.noAccessDescription,
              variant: "destructive",
            });
          }
        }
      }
    } catch (error: any) {
      let message = t.adminAuth.genericError;
      if (error.message.includes("Invalid login credentials")) {
        message = t.adminAuth.invalidCredentials;
      } else if (error.message.includes("User already registered")) {
        message = t.adminAuth.alreadyRegistered;
      } else if (error.message.includes("Email not confirmed")) {
        message = t.adminAuth.emailNotConfirmed;
      }
      toast({ title: t.adminAuth.error, description: message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#1a1a1a]">
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center">
            <Lock className="w-10 h-10 text-white/70" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-[60px] saturate-[200%] border border-white/30 rounded-3xl p-8 shadow-[0_8px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_2px_0_rgba(255,255,255,0.2)_inset]">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white mb-2">{t.adminAuth.title}</h1>
            <p className="text-white/60 text-sm">
              {isSignUp ? t.adminAuth.signupSubtitle : t.adminAuth.subtitle}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-white mb-2">{t.adminAuth.email}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full h-12 px-4 bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">{t.adminAuth.password}</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 pr-12 bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-white/20 backdrop-blur-xl border border-white/20 rounded-xl text-white font-medium hover:bg-white/30 transition-all disabled:opacity-50"
            >
              {isLoading ? t.adminAuth.loading : isSignUp ? t.adminAuth.signup : t.adminAuth.login}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-white/50 hover:text-white transition-colors"
            >
              {isSignUp ? t.adminAuth.hasAccount : t.adminAuth.noAccount}
            </button>
          </div>
        </div>

        <a
          href="/"
          className="flex items-center justify-center gap-2 text-white/40 hover:text-white mt-6 transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.adminAuth.backHome}
        </a>
      </div>
    </div>
  );
};

export default AdminAuth;
