import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/ocorrencias")({
 head: () => ({ meta: [{ title: "Ocorrencias — ViaBus" }, { name: "description", content: "Ocorrencias do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Ocorrencias — ViaBus" }, { property: "og:description", content: "Acesse ocorrencias no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-ocorrencias" />,
});
