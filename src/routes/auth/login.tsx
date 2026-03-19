import { createFileRoute, redirect } from "@tanstack/react-router";
import LoginPage from "../../views/LoginPage";

export const Route = createFileRoute("/auth/login")({
  beforeLoad: ({ context }) => {
    if (context.auth.sessionId) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: () => <LoginPage />,
});
