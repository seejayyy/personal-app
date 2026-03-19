import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";
import type { AuthContext } from "../context/authContext";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Toaster } from "sonner";

interface RouterContext {
  auth: AuthContext;
}

// 2. Create the Root Route
export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="min-h-screen bg-gray-100">
      {/* This is where your pages will render */}
      <Outlet />
      <Toaster richColors position="top-center" />
      <TanStackRouterDevtools />
    </div>
  ),
});
