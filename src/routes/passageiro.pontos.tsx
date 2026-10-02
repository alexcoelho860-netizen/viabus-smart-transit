import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { MapPin, Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PARADAS } from "@/data/mock";
import { useViaBus } from "@/store/viabus-store";
import { nomeRotaPorCodigo } from "@/lib/viabus-display";
import { TituloPagina } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/passageiro/pontos")({
  head: () => ({ meta: [
    { title: "Pontos e paradas — ViaBus" },
    { name: "description", content: "Encontre paradas próximas, endereços, linhas atendidas e próximas chegadas." },
    { property: "og:title", content: "Pontos e paradas — ViaBus" },
    { property: "og:description", content: "Paradas do transporte coletivo com linhas atendidas e chegadas previstas." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Pagina,
});

function Pagina() {
  const { linhas } = useViaBus();
  const [busca, setBusca] = useState("");
  const lista = PARADAS.filter((p) => `${p.nome} ${p.endereco}`.toLowerCase().includes(busca.toLowerCase()));
  return (
    <div className="space-y-5">
      <TituloPagina titulo="Pontos de parada" subtitulo="Paradas com abrigo, linhas atendidas e próximas chegadas." />
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Buscar parada" className="h-11 rounded-xl pl-9" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {lista.map((p, i) => (
          <Card key={p.id} className="gap-0 rounded-2xl border-border/70 p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"><MapPin className="size-5" /></span>
              <div><p className="font-bold">{p.nome}</p><p className="text-xs text-muted-foreground">{p.endereco}</p></div>
            </div>
            <div className="mt-4 space-y-2">
              {p.linhas.map((l, j) => (
                <div key={l} className="flex items-center justify-between rounded-xl bg-muted px-3 py-2 text-sm">
                  <span className="font-semibold">{nomeRotaPorCodigo(l, linhas)}</span>
                  <span className="text-muted-foreground">previsão simulada: {3 + i + j * 5} min</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{p.abrigo ? "Com abrigo e banco" : "Sem abrigo"}</p>
          </Card>
        ))}
        {lista.length === 0 && <p className="text-sm text-muted-foreground">Nenhuma parada encontrada.</p>}
      </div>
    </div>
  );
}
