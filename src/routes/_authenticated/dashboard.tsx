import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/dashboard")({
  beforeLoad: ({ context }) => {
    if (!context.auth.sessionId) {
      throw redirect({ to: "/auth/login" });
    }
  },
  component: () => (
    <div className="p-10">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>Only logged-in users see this.</p>
    </div>
  ),
});
