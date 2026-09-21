import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/banners")({
 head: () => ({ meta: [{ title: "Banners — ViaBus" }, { name: "description", content: "Banners do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Banners — ViaBus" }, { property: "og:description", content: "Acesse banners no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-banners" />,
});
