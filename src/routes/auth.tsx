import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/auth")({
  component: AuthLayout,
});

function AuthLayout() {
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
