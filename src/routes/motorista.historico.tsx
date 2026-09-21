import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/motorista/historico")({
 head: () => ({ meta: [{ title: "Historico — ViaBus" }, { name: "description", content: "Historico do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Historico — ViaBus" }, { property: "og:description", content: "Acesse historico no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="motorista-historico" />,
});
