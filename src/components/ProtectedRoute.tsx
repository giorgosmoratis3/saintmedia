import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const liquidGlassCard = "relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-[60px] saturate-[200%] border border-white/30 shadow-[0_8px_40px_rgba(0,0,0,0.15),0_0_0_1px_rgba(255,255,255,0.1)_inset,0_2px_0_rgba(255,255,255,0.2)_inset]";

const ProtectedRoute = ({ children, requiredRole = "admin" }: ProtectedRouteProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          if (isMounted) {
            navigate("/admin-auth");
          }
          return;
        }

        // Check role in database
        const { data: roleData, error } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", session.user.id)
          .eq("role", requiredRole)
          .maybeSingle();

        if (error || !roleData) {
          if (isMounted) {
            await supabase.auth.signOut();
            navigate("/admin-auth");
          }
          return;
        }

        if (isMounted) {
          setIsAuthorized(true);
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          navigate("/admin-auth");
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          if (isMounted) {
            setIsAuthorized(false);
            navigate("/admin-auth");
          }
        }
      }
    );

    checkAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, requiredRole]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#1a1a1a]">
        <div className={cn("p-8 rounded-2xl", liquidGlassCard)}>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            <div className="text-white text-xl">Έλεγχος πρόσβασης...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
