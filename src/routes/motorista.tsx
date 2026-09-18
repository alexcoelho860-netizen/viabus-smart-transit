import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/viabus/AppShell";

export const Route = createFileRoute("/motorista")({
  component: () => (
    <AppShell role="motorista">
      <Outlet />
    </AppShell>
  ),
});
