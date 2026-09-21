import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/relatorios")({
 head: () => ({ meta: [{ title: "Relatorios — ViaBus" }, { name: "description", content: "Relatorios do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Relatorios — ViaBus" }, { property: "og:description", content: "Acesse relatorios no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-relatorios" />,
});
