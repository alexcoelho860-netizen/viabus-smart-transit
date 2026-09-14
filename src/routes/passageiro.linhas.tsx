import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Heart, Search } from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LINHAS } from "@/data/mock";
import { useViaBus } from "@/store/viabus-store";
import { TituloPagina } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/passageiro/linhas")({
  head: () => ({
    meta: [
      { title: "Linhas de ônibus — ViaBus" },
      { name: "description", content: "Consulte itinerário, intervalo, tarifa e atraso médio das linhas 203, 205, 301 e 405." },
      { property: "og:title", content: "Linhas de ônibus — ViaBus" },
      { property: "og:description", content: "Itinerários completos, intervalos e atrasos médios das linhas urbanas." },
    ],
  }),
  component: Pagina,
});

function Pagina() {
  const { favoritos, alternarFavorito } = useViaBus();
  const [busca, setBusca] = useState("");
  const lista = LINHAS.filter((l) => `${l.codigo} ${l.nome} ${l.origem} ${l.destino}`.toLowerCase().includes(busca.toLowerCase()));

  return (
    <div className="space-y-5">
      <TituloPagina titulo="Linhas" subtitulo="Todas as linhas em operação no município." />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar por número ou bairro" className="h-11 rounded-xl pl-9" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((l) => (
          <Card key={l.id} className="gap-0 rounded-2xl border-border/70 p-5 shadow-soft">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-12 place-items-center rounded-xl text-sm font-extrabold text-white" style={{ backgroundColor: l.cor }}>{l.codigo}</span>
                <div><p className="font-bold">{l.nome}</p><p className="text-xs text-muted-foreground">{l.origem} → {l.destino}</p></div>
              </div>
              <button onClick={() => { alternarFavorito(l.codigo); toast.success(favoritos.includes(l.codigo) ? "Removida dos favoritos" : "Adicionada aos favoritos"); }} aria-label="Favoritar linha">
                <Heart className={`size-5 ${favoritos.includes(l.codigo) ? "fill-danger text-danger" : "text-muted-foreground"}`} />
              </button>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
              <div className="rounded-xl bg-muted py-2"><p className="text-sm font-bold">{l.intervaloMin} min</p><p className="text-muted-foreground">intervalo</p></div>
              <div className="rounded-xl bg-muted py-2"><p className="text-sm font-bold">R$ {l.tarifa.toFixed(2)}</p><p className="text-muted-foreground">tarifa</p></div>
              <div className="rounded-xl bg-muted py-2"><p className="text-sm font-bold">{l.atrasoMedioMin} min</p><p className="text-muted-foreground">atraso médio</p></div>
            </div>
            <Dialog>
              <DialogTrigger asChild><Button variant="outline" className="mt-4 rounded-xl">Ver itinerário</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Linha {l.codigo} · {l.nome}</DialogTitle>
                  <DialogDescription>{l.viagensDia} viagens por dia · intervalo de {l.intervaloMin} minutos</DialogDescription>
                </DialogHeader>
                <ol className="space-y-3">
                  {l.paradas.map((p, i) => (
                    <li key={p} className="flex items-center gap-3 text-sm">
                      <span className="grid size-6 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{i + 1}</span>
                      {p}
                      <span className="ml-auto inline-flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3.5" />{i * 6 + 4} min</span>
                    </li>
                  ))}
                </ol>
              </DialogContent>
            </Dialog>
          </Card>
        ))}
        {lista.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma linha encontrada para "{busca}".</p>}
      </div>
    </div>
  );
}
