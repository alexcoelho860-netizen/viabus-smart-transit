import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/motorista/operacao")({
 head: () => ({ meta: [{ title: "Operacao — ViaBus" }, { name: "description", content: "Operacao do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Operacao — ViaBus" }, { property: "og:description", content: "Acesse operacao no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="motorista-operacao" />,
});
