import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { useViaBus } from "@/store/viabus-store";
import { TituloPagina } from "@/components/viabus/ui-bits";
import { RouteCard } from "@/components/viabus/RouteCard";

export const Route = createFileRoute("/passageiro/linhas")({
  head: () => ({
    meta: [
      { title: "Linhas de ônibus — ViaBus" },
      { name: "description", content: "Compare trajetos demonstrativos, itinerários, intervalos e tarifas em Curitiba e região." },
      { property: "og:title", content: "Linhas de ônibus — ViaBus" },
      { property: "og:description", content: "Itinerários completos, intervalos e atrasos médios das linhas urbanas." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Pagina,
});

function Pagina() {
  const { favoritos, alternarFavorito, linhas } = useViaBus();
  const [busca, setBusca] = useState("");
  const lista = linhas.filter((l) => `${l.codigo} ${l.nome} ${l.origem} ${l.destino}`.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-5">
      <TituloPagina titulo="Rotas" subtitulo="Compare trajetos, intervalos e previsões em Curitiba e região." />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por número ou bairro" className="h-11 rounded-xl pl-9" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((l) => <RouteCard key={l.id} linha={l} favorita={favoritos.includes(l.codigo)} aoFavoritar={() => alternarFavorito(l.codigo)} />)}
        {lista.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma linha encontrada para "{busca}".</p>}
      </div>
    </div>
  );
}
