import { createFileRoute } from "@tanstack/react-router";
import { RolePage } from "@/components/viabus/RolePages";
export const Route = createFileRoute("/admin/veiculos")({
 head: () => ({ meta: [{ title: "Veiculos — ViaBus" }, { name: "description", content: "Veiculos do ViaBus com dados demonstrativos de Curitiba e Região Metropolitana." }, { property: "og:title", content: "Veiculos — ViaBus" }, { property: "og:description", content: "Acesse veiculos no protótipo ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
 component: () => <RolePage mode="admin-veiculos" />,
});
