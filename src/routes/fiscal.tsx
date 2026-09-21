import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/viabus/AppShell";
export const Route = createFileRoute("/fiscal")({ component: () => <AppShell role="fiscal"><Outlet /></AppShell> });
