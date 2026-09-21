import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/motorista/comunicacao")({
 head: () => ({ meta: [{ title: "Comunicacao — ViaBus" }, { name: "description", content: "Comunicacao do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Comunicacao — ViaBus" }, { property: "og:description", content: "Acesse comunicacao no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="motorista-comunicacao" />,
});
