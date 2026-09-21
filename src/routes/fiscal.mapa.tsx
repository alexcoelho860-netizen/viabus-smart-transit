import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/fiscal/mapa")({
 head: () => ({ meta: [{ title: "Mapa — ViaBus" }, { name: "description", content: "Mapa do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Mapa — ViaBus" }, { property: "og:description", content: "Acesse mapa no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="fiscal-mapa" />,
});
