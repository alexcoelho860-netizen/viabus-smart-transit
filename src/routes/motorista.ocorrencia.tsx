import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/motorista/ocorrencia")({
 head: () => ({ meta: [{ title: "Ocorrencia — ViaBus" }, { name: "description", content: "Ocorrencia do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Ocorrencia — ViaBus" }, { property: "og:description", content: "Acesse ocorrencia no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="motorista-ocorrencia" />,
});
