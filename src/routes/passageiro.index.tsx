import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Bell, Bus, Clock, Heart, MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ALERTAS, LINHAS, PARADAS } from "@/data/mock";
import { useViaBus } from "@/store/viabus-store";
import { BadgeLotacao, SeloAtualizacao } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/passageiro/")({
  head: () => ({
    meta: [
      { title: "Minhas viagens — ViaBus Passageiro" },
      { name: "description", content: "Veja o próximo ônibus, a lotação, seus favoritos e os alertas da sua região no ViaBus." },
      { property: "og:title", content: "Minhas viagens — ViaBus Passageiro" },
      { property: "og:description", content: "Próximo ônibus da linha 203, tempo de chegada, lotação e alertas da região." },
    ],
  }),
  component: Pagina,
});

function Pagina() {
  const { perfil, veiculos, favoritos, alternarFavorito, naoLidas } = useViaBus();
  const [destino, setDestino] = useState("");
  const [indice, setIndice] = useState(0);

  const proximo = veiculos.find((v) => v.codigo === "4821")!;
  const linha203 = LINHAS[0];
  const proximos = useMemo(() => veiculos.filter((v) => v.status === "em_rota").slice(0, 4), [veiculos]);
  const aviso = ALERTAS[indice % ALERTAS.length] ?? ALERTAS[0];

  if (!aviso || !linha203) return <div className="p-8 text-center text-muted-foreground">Dados demonstrativos indisponíveis.</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Bom dia,</p>
          <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
            {perfil?.nome.split(" ")[0] ?? "Passageiro"} 👋
          </h1>
        </div>
        <Link to="/passageiro/notificacoes" className="relative inline-flex size-11 items-center justify-center rounded-xl border border-border bg-card shadow-soft">
          <Bell className="size-5" />
          {naoLidas > 0 && (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-danger text-[11px] font-bold text-danger-foreground">{naoLidas}</span>
          )}
        </Link>
      </div>

      <Card className="gap-0 rounded-2xl border-border/70 p-5 shadow-soft">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{aviso.tipo === "transito" ? "Trânsito" : aviso.tipo === "desvio" ? "Desvio" : aviso.tipo === "climatico" ? "Clima" : "Serviço"} · {aviso.regiao}</p>
            <p className="mt-1 font-bold">{aviso.titulo}</p>
            <p className="mt-1 text-sm text-muted-foreground">{aviso.descricao}</p>
          </div>
          <Button variant="outline" size="icon" className="shrink-0 rounded-xl" onClick={() => setIndice((i) => i + 1)} aria-label="Próximo aviso">
            <ArrowRight className="size-4" />
          </Button>
        </div>
        <div className="mt-4 flex gap-1.5">
          {ALERTAS.map((a, i) => (
            <span key={a.id} className={`h-1.5 flex-1 rounded-full ${i === indice % ALERTAS.length ? "bg-primary" : "bg-border"}`} />
          ))}
        </div>
      </Card>

      <Card className="gap-0 rounded-2xl border-border/70 p-5 shadow-soft">
        <label className="text-sm font-semibold">Para onde você vai?</label>
        <div className="mt-3 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={destino} onChange={(e) => setDestino(e.target.value)} placeholder="Ex.: Hospital Municipal" className="h-11 rounded-xl pl-9" />
          </div>
          <Button className="h-11 rounded-xl px-5" onClick={() => toast.success(destino ? `Buscando rotas até ${destino}` : "Digite um destino para buscar", { description: destino ? "Melhor opção: linha 203, 4 min de espera." : undefined })}>Buscar</Button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {PARADAS.slice(0, 4).map((p) => (
            <button key={p.id} onClick={() => setDestino(p.nome)} className="rounded-full border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary">{p.nome}</button>
          ))}
        </div>
      </Card>

      <Card className="gap-0 overflow-hidden rounded-2xl border-border/70 p-0 shadow-soft">
        <div className="bg-brand-ink p-5 text-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white/70">Seu próximo ônibus</span>
            <SeloAtualizacao />
          </div>
          <div className="mt-4 flex items-center gap-3">
            <span className="grid size-14 place-items-center rounded-2xl bg-primary text-xl font-extrabold">{linha203.codigo}</span>
            <div>
              <p className="font-bold">{linha203.origem} → {linha203.destino}</p>
              <p className="text-sm text-white/60">Veículo {proximo.codigo} · {proximo.velocidadeKmh} km/h</p>
            </div>
          </div>
          <div className="mt-5 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-2xl bg-white/10 py-3"><p className="text-xl font-extrabold">4 min</p><p className="text-[11px] text-white/60">chega em</p></div>
            <div className="rounded-2xl bg-white/10 py-3"><p className="text-xl font-extrabold">1,2 km</p><p className="text-[11px] text-white/60">distância</p></div>
            <div className="rounded-2xl bg-white/10 py-3"><p className="text-xl font-extrabold">{proximo.atrasoMin} min</p><p className="text-[11px] text-white/60">atraso</p></div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 p-4">
          <BadgeLotacao lotacao={proximo.lotacao} />
          <div className="flex gap-2">
            <Button asChild variant="outline" className="rounded-xl"><Link to="/passageiro/mapa">Ver no mapa</Link></Button>
            <Button asChild className="rounded-xl"><Link to="/passageiro/linhas">Detalhes da linha</Link></Button>
          </div>
        </div>
      </Card>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold">Linhas favoritas</h2>
          <Link to="/passageiro/favoritos" className="text-sm font-semibold text-primary">Ver todas</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {LINHAS.filter((l) => favoritos.includes(l.codigo)).map((l) => (
            <Card key={l.id} className="gap-0 rounded-2xl border-border/70 p-4 shadow-soft">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-xl text-sm font-extrabold text-white" style={{ backgroundColor: l.cor }}>{l.codigo}</span>
                  <div><p className="font-bold">{l.nome}</p><p className="text-xs text-muted-foreground">a cada {l.intervaloMin} min</p></div>
                </div>
                <button onClick={() => { alternarFavorito(l.codigo); toast("Linha removida dos favoritos"); }} aria-label="Remover dos favoritos">
                  <Heart className="size-5 fill-danger text-danger" />
                </button>
              </div>
              <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground"><Clock className="size-4" /> atraso médio de {l.atrasoMedioMin} min</p>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Ônibus próximos de você</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {proximos.map((v) => (
            <Card key={v.id} className="flex-row items-center justify-between gap-3 rounded-2xl border-border/70 p-4 shadow-soft">
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary"><Bus className="size-5" /></span>
                <div>
                  <p className="text-sm font-bold">Linha {v.linhaCodigo} · {v.codigo}</p>
                  <p className="text-xs text-muted-foreground">{v.velocidadeKmh} km/h · atraso {v.atrasoMin} min</p>
                </div>
              </div>
              <BadgeLotacao lotacao={v.lotacao} curto />
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-bold">Alertas da sua região</h2>
        <div className="space-y-3">
          {ALERTAS.map((a) => (
            <Card key={a.id} className="flex-row items-start gap-3 rounded-2xl border-border/70 p-4 shadow-soft">
              <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-warning/18 text-warning-foreground"><MapPin className="size-4" /></span>
              <div><p className="font-semibold">{a.titulo}</p><p className="text-sm text-muted-foreground">{a.descricao}</p><p className="mt-1 text-xs text-muted-foreground/80">{a.criadoEm} · {a.regiao}</p></div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
