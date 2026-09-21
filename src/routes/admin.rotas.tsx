import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/rotas")({
 head: () => ({ meta: [{ title: "Rotas — ViaBus" }, { name: "description", content: "Rotas do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Rotas — ViaBus" }, { property: "og:description", content: "Acesse rotas no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-rotas" />,
});
