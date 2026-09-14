import { createFileRoute } from "@tanstack/react-router";
import { MapaOperacional } from "@/components/viabus/MapaOperacional";
import { TituloPagina } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/passageiro/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa ao vivo — ViaBus Passageiro" },
      { name: "description", content: "Acompanhe no mapa os ônibus em circulação, as paradas próximas e os pontos de trânsito lento." },
      { property: "og:title", content: "Mapa ao vivo — ViaBus Passageiro" },
      { property: "og:description", content: "Ônibus, paradas e trânsito em tempo real no mapa do ViaBus." },
    ],
  }),
  component: () => (
    <div className="space-y-5">
      <TituloPagina titulo="Mapa ao vivo" subtitulo="Toque nos marcadores para ver detalhes de cada ônibus, parada ou ocorrência." />
      <MapaOperacional altura="h-[70vh]" />
    </div>
  ),
});
