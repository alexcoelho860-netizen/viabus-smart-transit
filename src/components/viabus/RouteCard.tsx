import { Clock3, Heart, MapPinned, Navigation, Route as RouteIcon, Ticket } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MapaOperacional } from "@/components/viabus/MapaOperacional";
import { nomeRota } from "@/lib/viabus-display";
import { cn } from "@/lib/utils";
import type { Linha } from "@/types/viabus";

export function RouteCard({ linha, favorita, aoFavoritar, compacta = false }: { linha: Linha; favorita: boolean; aoFavoritar: () => void; compacta?: boolean }) {
  function favoritar() {
    aoFavoritar();
    toast.success(favorita ? "Rota removida dos favoritos" : "Rota salva nos favoritos");
  }

  return <Card className="gap-0 rounded-lg border-border/70 p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-lift">
    <div className="flex items-start gap-3">
      <span className="grid size-11 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><RouteIcon className="size-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="font-bold leading-snug">{nomeRota(linha)}</p>
        <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground"><Navigation className="size-3.5" />{linha.regiao}</p>
      </div>
      <Button variant="ghost" size="icon" className="shrink-0 rounded-full" onClick={favoritar} aria-label={favorita ? "Remover rota dos favoritos" : "Salvar rota nos favoritos"}>
        <Heart className={cn("size-5 transition-transform active:scale-125", favorita ? "fill-danger text-danger" : "text-muted-foreground")} />
      </Button>
    </div>
    <div className="mt-4 grid grid-cols-3 divide-x divide-border rounded-lg bg-muted/70 py-3 text-center">
      <div className="px-2"><Clock3 className="mx-auto size-4 text-primary"/><p className="mt-1 text-sm font-bold">{linha.intervaloMin} min</p><p className="text-[11px] text-muted-foreground">Intervalo</p></div>
      <div className="px-2"><Ticket className="mx-auto size-4 text-primary"/><p className="mt-1 text-sm font-bold">R$ {linha.tarifa.toFixed(2).replace(".", ",")}</p><p className="text-[11px] text-muted-foreground">Tarifa estimada</p></div>
      <div className="px-2"><Navigation className="mx-auto size-4 text-primary"/><p className="mt-1 text-sm font-bold">{linha.atrasoMedioMin} min</p><p className="text-[11px] text-muted-foreground">Atraso médio</p></div>
    </div>
    {!compacta && <Dialog>
      <DialogTrigger asChild><Button variant="outline" className="mt-4 w-full"><MapPinned />Ver itinerário</Button></DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader><DialogTitle>{nomeRota(linha)}</DialogTitle><DialogDescription>{linha.origem} até {linha.destino} · aproximadamente {Math.max(24, linha.paradas.length * 6)} min</DialogDescription></DialogHeader>
        <div className="grid gap-5 md:grid-cols-[1.1fr_.9fr]">
          <MapaOperacional altura="h-[320px]" compacto />
          <div><div className="grid grid-cols-2 gap-2"><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Operação</p><p className="font-bold">{linha.ativa ? "Em circulação" : "Temporariamente suspensa"}</p></div><div className="rounded-lg bg-muted p-3"><p className="text-xs text-muted-foreground">Viagens previstas</p><p className="font-bold">{linha.viagensDia} ao dia</p></div></div>
          <ol className="mt-4">{linha.paradas.map((parada, indice) => <li key={parada} className="flex gap-3"><div className="flex flex-col items-center"><span className="grid size-7 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{indice + 1}</span>{indice < linha.paradas.length - 1 && <span className="h-9 w-px bg-primary/30" />}</div><div><p className="text-sm font-medium">{parada}</p><p className="text-xs text-muted-foreground">Previsão: {indice * 6 + 2} min</p></div></li>)}</ol></div>
        </div>
        <p className="text-xs text-muted-foreground">Itinerário e tarifa simulados sobre localidades reais; não representam uma linha oficial.</p>
      </DialogContent>
    </Dialog>}
  </Card>;
}