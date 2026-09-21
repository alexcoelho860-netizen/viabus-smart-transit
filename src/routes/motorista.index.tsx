import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/motorista/")({
 head: () => ({ meta: [{ title: "Painel — ViaBus" }, { name: "description", content: "Painel do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Painel — ViaBus" }, { property: "og:description", content: "Acesse painel no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="motorista-painel" />,
});
