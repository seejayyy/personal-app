import VerifyOtpPage from "../../views/VerifyOtpPage";
import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/auth/verify")({
  beforeLoad: ({ context, location }) => {
    if (context.auth.sessionId) {
      throw redirect({ to: "/dashboard" });
    }

    const state = location.state as { email?: string };

    if (!state?.email) {
      console.warn("No email found in navigation state, redirecting...");
      throw redirect({ to: "/auth/login" });
    }

    // Pass it into the route context so the component can use it easily
    return {
      email: state.email,
    };
  },

  component: () => <VerifyOtpPage />,
});
