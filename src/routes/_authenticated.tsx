import { supabase } from "@/lib/supabase";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    if (context.auth.isLoading) {
      // You can return early or the router will wait
      return;
    }

    if (!context.auth.isAuthenticated || !context.auth.user) {
      throw redirect({ to: "/auth/login" });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", context.auth.user.id)
      .single();

    const hasUsername = !!profile?.username;
    const isCompletingProfile = location.pathname === "/complete-profile";

    if (!hasUsername && !isCompletingProfile) {
      throw redirect({ to: "/complete-profile" });
    }

    if (hasUsername && isCompletingProfile) {
      throw redirect({ to: "/dashboard" });
    }
  },

  component: () => AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return (
    <div className="auth-container flex min-h-screen items-center justify-center bg-slate-50">
      {/* This Card wraps all sub-routes (Login, SignUp, Verify) */}
      <div className="w-full max-w-md p-6 bg-white shadow-xl rounded-2xl border border-slate-200">
        {/* Sub-routes render here */}
        <Outlet />
      </div>
    </div>
  );
}
