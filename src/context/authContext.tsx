// 1. Define types and the simple Auth state
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export interface AuthContext {
  isAuthenticated: boolean;
  user: Session["user"] | null | undefined;
  sessionId: string | null | undefined;
  isLoading: boolean;
}

export const useAuthContext = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // 2. Listen for changes (login/logout/refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  return {
    isAuthenticated: !!session,
    user: session?.user,
    sessionId: session?.access_token,
    isLoading,
  };
};
