import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LINHAS } from "@/data/mock";
import { useViaBus } from "@/store/viabus-store";
import { TituloPagina } from "@/components/viabus/ui-bits";
import { RouteCard } from "@/components/viabus/RouteCard";

export const Route = createFileRoute("/passageiro/favoritos")({
  head: () => ({ meta: [
    { title: "Linhas favoritas — ViaBus" },
    { name: "description", content: "Suas linhas salvas com intervalo, atraso médio e acesso rápido ao itinerário." },
    { property: "og:title", content: "Linhas favoritas — ViaBus" },
    { property: "og:description", content: "Acompanhe rapidamente as linhas que você mais usa." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Pagina,
});

function Pagina() {
  const { favoritos, alternarFavorito } = useViaBus();
  const salvas = LINHAS.filter((l) => favoritos.includes(l.codigo));
  const outras = LINHAS.filter((l) => !favoritos.includes(l.codigo));
  return (
    <div className="space-y-6">
      <TituloPagina titulo="Favoritos" subtitulo="Suas linhas salvas para acesso rápido." />
      {salvas.length === 0 ? (
        <Card className="items-center gap-2 rounded-2xl p-10 text-center shadow-soft">
          <Heart className="size-8 text-muted-foreground" />
          <p className="font-semibold">Você ainda não salvou nenhuma linha</p>
          <p className="text-sm text-muted-foreground">Toque no coração em qualquer linha para salvá-la aqui.</p>
          <Button asChild className="mt-2 rounded-xl"><Link to="/passageiro/linhas">Explorar linhas</Link></Button>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {salvas.map((l) => <RouteCard key={l.id} linha={l} favorita aoFavoritar={() => alternarFavorito(l.codigo)} />)}
        </div>
      )}
      {outras.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">Sugestões para salvar</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {outras.map((l) => (
              <RouteCard key={l.id} linha={l} favorita={false} aoFavoritar={() => alternarFavorito(l.codigo)} compacta />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
