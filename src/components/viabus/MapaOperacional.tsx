import { useMemo, useState } from "react";
import { AlertTriangle, Bus, MapPin, TrafficCone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PARADAS, ROTULO_TIPO } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useViaBus } from "@/store/viabus-store";
import { BadgeGravidade, BadgeLotacao, SeloAtualizacao } from "@/components/viabus/ui-bits";

type Camada = "onibus" | "paradas" | "transito" | "ocorrencias";

const CAMADAS: { valor: Camada; rotulo: string; cor: string }[] = [
  { valor: "onibus", rotulo: "Ônibus", cor: "bg-primary" },
  { valor: "paradas", rotulo: "Paradas", cor: "bg-brand-ink" },
  { valor: "transito", rotulo: "Trânsito", cor: "bg-warning" },
  { valor: "ocorrencias", rotulo: "Ocorrências", cor: "bg-danger" },
];

const PONTOS_TRANSITO = [
  { id: "tr-1", x: 62, y: 48, nivel: "Lento", via: "Av. Brasil" },
  { id: "tr-2", x: 28, y: 34, nivel: "Parado", via: "Centro histórico" },
  { id: "tr-3", x: 50, y: 82, nivel: "Lento", via: "Av. dos Estudantes" },
];

interface Selecionado {
  titulo: string;
  linhas: string[];
}

export function MapaOperacional({
  altura = "h-[460px]",
  compacto = false,
}: {
  altura?: string;
  compacto?: boolean;
}) {
  const { veiculos, ocorrencias } = useViaBus();
  const [ativas, setAtivas] = useState<Camada[]>(["onibus", "paradas", "transito", "ocorrencias"]);
  const [selecionado, setSelecionado] = useState<Selecionado | null>(null);

  const ocorrenciasVisiveis = useMemo(
    () => ocorrencias.filter((o) => o.status !== "encerrada"),
    [ocorrencias],
  );

  function alternar(camada: Camada) {
    setAtivas((atual) =>
      atual.includes(camada) ? atual.filter((c) => c !== camada) : [...atual, camada],
    );
  }

  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border-border/70 p-0 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 bg-card px-4 py-3">
        <div className="flex flex-wrap gap-2">
          {CAMADAS.map((c) => {
            const ativo = ativas.includes(c.valor);
            return (
              <button
                key={c.valor}
                onClick={() => alternar(c.valor)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                  ativo
                    ? "border-primary/30 bg-primary/10 text-primary"
                    : "border-border bg-card text-muted-foreground hover:bg-muted",
                )}
              >
                <span className={cn("size-2 rounded-full", c.cor, !ativo && "opacity-40")} />
                {c.rotulo}
              </button>
            );
          })}
        </div>
        <SeloAtualizacao />
      </div>

      <div
        className={cn(
          "relative w-full overflow-hidden bg-[#eef2f7]",
          altura,
        )}
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(148,163,184,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.25) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        onClick={() => setSelecionado(null)}
      >
        {/* Vias principais */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-[38%] h-3 w-full -rotate-3 rounded-full bg-white/90" />
          <div className="absolute left-[30%] top-0 h-full w-3 rotate-6 rounded-full bg-white/90" />
          <div className="absolute left-0 top-[70%] h-2.5 w-full rotate-2 rounded-full bg-white/80" />
          <div className="absolute left-[72%] top-0 h-full w-2.5 -rotate-3 rounded-full bg-white/80" />
          <div className="absolute left-[6%] top-[8%] size-28 rounded-2xl bg-white/55" />
          <div className="absolute right-[10%] bottom-[12%] size-32 rounded-2xl bg-white/55" />
          <div className="absolute left-[42%] top-[14%] size-24 rounded-2xl bg-success/15" />
        </div>

        {ativas.includes("transito") &&
          PONTOS_TRANSITO.map((t) => (
            <button
              key={t.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelecionado({
                  titulo: `Trânsito ${t.nivel.toLowerCase()}`,
                  linhas: [t.via, "Monitoramento em tempo real"],
                });
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${t.x}%`, top: `${t.y}%` }}
              aria-label={`Trânsito em ${t.via}`}
            >
              <span className="grid size-7 place-items-center rounded-full bg-warning text-warning-foreground shadow-soft">
                <TrafficCone className="size-4" />
              </span>
            </button>
          ))}

        {ativas.includes("paradas") &&
          PARADAS.map((p) => (
            <button
              key={p.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelecionado({
                  titulo: p.nome,
                  linhas: [p.endereco, `Linhas: ${p.linhas.join(", ")}`],
                });
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label={`Parada ${p.nome}`}
            >
              <span className="grid size-6 place-items-center rounded-full bg-brand-ink text-white shadow-soft ring-2 ring-white">
                <MapPin className="size-3.5" />
              </span>
            </button>
          ))}

        {ativas.includes("onibus") &&
          veiculos
            .filter((v) => v.status === "em_rota")
            .map((v) => (
              <button
                key={v.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelecionado({
                    titulo: `Veículo ${v.codigo} — Linha ${v.linhaCodigo}`,
                    linhas: [
                      `${v.velocidadeKmh} km/h · atraso de ${v.atrasoMin} min`,
                      `Lotação: ${v.lotacao}`,
                      v.acessivel ? "Acessível para cadeirantes" : "Sem elevador",
                    ],
                  });
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-[4500ms] ease-linear"
                style={{ left: `${v.x}%`, top: `${v.y}%` }}
                aria-label={`Ônibus ${v.codigo}`}
              >
                <span className="relative flex">
                  <span
                    className={cn(
                      "pulse-ring absolute inset-0 rounded-full",
                      v.lotacao === "alta"
                        ? "bg-danger"
                        : v.lotacao === "media"
                          ? "bg-warning"
                          : "bg-success",
                    )}
                  />
                  <span
                    className={cn(
                      "relative grid size-8 place-items-center rounded-full text-white shadow-lift ring-2 ring-white",
                      v.lotacao === "alta"
                        ? "bg-danger"
                        : v.lotacao === "media"
                          ? "bg-warning"
                          : "bg-primary",
                    )}
                  >
                    <Bus className="size-4" />
                  </span>
                </span>
                <span className="mt-1 block rounded-md bg-white/95 px-1.5 text-[10px] font-bold text-brand-ink shadow-soft">
                  {v.codigo}
                </span>
              </button>
            ))}

        {ativas.includes("ocorrencias") &&
          ocorrenciasVisiveis.map((o) => (
            <button
              key={o.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelecionado({
                  titulo: `${ROTULO_TIPO[o.tipo]} · ${o.protocolo}`,
                  linhas: [o.local, o.descricao],
                });
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${o.x}%`, top: `${o.y}%` }}
              aria-label={`Ocorrência ${o.protocolo}`}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-danger text-danger-foreground shadow-lift ring-2 ring-white">
                <AlertTriangle className="size-4" />
              </span>
            </button>
          ))}

        {selecionado && (
          <Card className="absolute bottom-4 left-4 right-4 gap-1 rounded-xl border-border/70 p-4 shadow-lift sm:right-auto sm:max-w-sm">
            <p className="text-sm font-bold text-foreground">{selecionado.titulo}</p>
            {selecionado.linhas.map((l) => (
              <p key={l} className="text-xs text-muted-foreground">
                {l}
              </p>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="mt-2 h-7 w-fit px-2 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                setSelecionado(null);
              }}
            >
              Fechar
            </Button>
          </Card>
        )}
      </div>

      {!compacto && (
        <div className="flex flex-wrap items-center gap-4 border-t border-border/70 bg-card px-4 py-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Legenda:</span>
          <BadgeLotacao lotacao="baixa" />
          <BadgeLotacao lotacao="media" />
          <BadgeLotacao lotacao="alta" />
          <span className="inline-flex items-center gap-1.5">
            <AlertTriangle className="size-3.5 text-danger" /> Ocorrência ativa
          </span>
          <BadgeGravidade gravidade="critica" />
        </div>
      )}
    </Card>
  );
}
