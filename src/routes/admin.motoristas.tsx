import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/motoristas")({
 head: () => ({ meta: [{ title: "Motoristas — ViaBus" }, { name: "description", content: "Motoristas do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Motoristas — ViaBus" }, { property: "og:description", content: "Acesse motoristas no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-motoristas" />,
});
