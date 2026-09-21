import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/configuracoes")({
 head: () => ({ meta: [{ title: "Configuracoes — ViaBus" }, { name: "description", content: "Configuracoes do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Configuracoes — ViaBus" }, { property: "og:description", content: "Acesse configuracoes no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-configuracoes" />,
});
