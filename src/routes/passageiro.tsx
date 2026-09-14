import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/viabus/AppShell";

export const Route = createFileRoute("/passageiro")({ component: () => (
  <AppShell role="passageiro"><Outlet /></AppShell>
) });
