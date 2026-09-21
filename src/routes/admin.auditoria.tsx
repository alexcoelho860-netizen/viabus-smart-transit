import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/auditoria")({
 head: () => ({ meta: [{ title: "Auditoria — ViaBus" }, { name: "description", content: "Auditoria do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Auditoria — ViaBus" }, { property: "og:description", content: "Acesse auditoria no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-auditoria" />,
});
