import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/usuarios")({
 head: () => ({ meta: [{ title: "Usuarios — ViaBus" }, { name: "description", content: "Usuarios do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Usuarios — ViaBus" }, { property: "og:description", content: "Acesse usuarios no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-usuarios" />,
});
