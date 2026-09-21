import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/fiscais")({
 head: () => ({ meta: [{ title: "Fiscais — ViaBus" }, { name: "description", content: "Fiscais do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Fiscais — ViaBus" }, { property: "og:description", content: "Acesse fiscais no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-fiscais" />,
});
