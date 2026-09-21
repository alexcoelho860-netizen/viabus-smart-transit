import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/motorista/rota")({
 head: () => ({ meta: [{ title: "Rota — ViaBus" }, { name: "description", content: "Rota do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Rota — ViaBus" }, { property: "og:description", content: "Acesse rota no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="motorista-rota" />,
});
