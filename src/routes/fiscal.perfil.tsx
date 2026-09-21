import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/fiscal/perfil")({
 head: () => ({ meta: [{ title: "Perfil — ViaBus" }, { name: "description", content: "Perfil do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Perfil — ViaBus" }, { property: "og:description", content: "Acesse perfil no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="fiscal-perfil" />,
});
