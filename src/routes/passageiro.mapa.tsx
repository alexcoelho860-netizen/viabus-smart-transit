import { createFileRoute } from "@tanstack/react-router";
import { MapaOperacional } from "@/components/viabus/MapaOperacional";
import { TituloPagina } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/passageiro/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa de Curitiba — ViaBus Passageiro" },
      { name: "description", content: "Explore Curitiba no mapa com posições simuladas de ônibus, paradas e trânsito." },
      { property: "og:title", content: "Mapa de Curitiba — ViaBus Passageiro" },
      { property: "og:description", content: "Mapa geográfico de Curitiba com dados operacionais simulados do ViaBus." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <div className="space-y-5">
      <TituloPagina titulo="Mapa de Curitiba" subtitulo="Toque nos marcadores para ver detalhes de cada ônibus, parada ou ocorrência simulada." />
      <MapaOperacional altura="h-[70vh]" />
    </div>
  ),
});
