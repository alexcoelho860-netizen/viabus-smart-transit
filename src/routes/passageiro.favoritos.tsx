import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LINHAS } from "@/data/mock";
import { useViaBus } from "@/store/viabus-store";
import { TituloPagina } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/passageiro/favoritos")({
  head: () => ({ meta: [
    { title: "Linhas favoritas — ViaBus" },
    { name: "description", content: "Suas linhas salvas com intervalo, atraso médio e acesso rápido ao itinerário." },
    { property: "og:title", content: "Linhas favoritas — ViaBus" },
    { property: "og:description", content: "Acompanhe rapidamente as linhas que você mais usa." },
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
          {salvas.map((l) => (
            <Card key={l.id} className="flex-row items-center justify-between gap-3 rounded-2xl border-border/70 p-5 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl text-sm font-extrabold text-white" style={{ backgroundColor: l.cor }}>{l.codigo}</span>
                <div><p className="font-bold">{l.nome}</p><p className="text-xs text-muted-foreground">a cada {l.intervaloMin} min · atraso {l.atrasoMedioMin} min</p></div>
              </div>
              <button onClick={() => { alternarFavorito(l.codigo); toast("Linha removida dos favoritos"); }} aria-label="Remover"><Heart className="size-5 fill-danger text-danger" /></button>
            </Card>
          ))}
        </div>
      )}
      {outras.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold">Sugestões para salvar</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {outras.map((l) => (
              <Card key={l.id} className="flex-row items-center justify-between gap-3 rounded-2xl border-border/70 p-4 shadow-soft">
                <div className="flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-xl text-xs font-extrabold text-white" style={{ backgroundColor: l.cor }}>{l.codigo}</span>
                  <p className="text-sm font-semibold">{l.nome}</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => { alternarFavorito(l.codigo); toast.success("Linha salva nos favoritos"); }}>Salvar</Button>
              </Card>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
