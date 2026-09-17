import { useMemo, useState } from "react";
import { AlertTriangle, Bus, MapPin, TrafficCone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MOTORISTAS, PARADAS, ROTULO_TIPO } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useViaBus } from "@/store/viabus-store";
import {
  BadgeGravidade,
  BadgeLotacao,
  SeloAtualizacao,
  SeloDemo,
} from "@/components/viabus/ui-bits";

type Camada = "onibus" | "paradas" | "transito" | "ocorrencias";
type Situacao = "todos" | "normal" | "atencao" | "atrasado" | "ocorrencia";

const CAMADAS: { valor: Camada; rotulo: string; cor: string }[] = [
  { valor: "onibus", rotulo: "Ônibus", cor: "bg-primary" },
  { valor: "paradas", rotulo: "Pontos", cor: "bg-brand-ink" },
  { valor: "transito", rotulo: "Trânsito", cor: "bg-warning" },
  { valor: "ocorrencias", rotulo: "Ocorrências", cor: "bg-danger" },
];

const SITUACOES: { valor: Situacao; rotulo: string }[] = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "normal", rotulo: "Normal" },
  { valor: "atencao", rotulo: "Atenção" },
  { valor: "atrasado", rotulo: "Atrasado" },
  { valor: "ocorrencia", rotulo: "Com ocorrência" },
];

/** Pontos de trânsito simulados sobre vias reais de Curitiba. */
const PONTOS_TRANSITO = [
  { id: "tr-1", x: 62, y: 48, nivel: "Lento", via: "Av. Sete de Setembro — Rebouças" },
  { id: "tr-2", x: 28, y: 34, nivel: "Parado", via: "Centro — Praça Rui Barbosa" },
  { id: "tr-3", x: 50, y: 82, nivel: "Lento", via: "Av. Winston Churchill — Capão Raso" },
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
  const { veiculos, ocorrencias, segundosDesdeAtualizacao } = useViaBus();
  const [ativas, setAtivas] = useState<Camada[]>(["onibus", "paradas", "transito", "ocorrencias"]);
  const [situacao, setSituacao] = useState<Situacao>("todos");
  const [selecionado, setSelecionado] = useState<Selecionado | null>(null);

  const ocorrenciasVisiveis = useMemo(
    () => ocorrencias.filter((o) => o.status !== "encerrada"),
    [ocorrencias],
  );

  const veiculosVisiveis = useMemo(() => {
    const comOcorrencia = new Set(ocorrenciasVisiveis.map((o) => o.veiculoCodigo));
    return veiculos
      .filter((v) => v.status === "em_rota")
      .filter((v) => {
        if (situacao === "todos") return true;
        if (situacao === "ocorrencia") return comOcorrencia.has(v.codigo);
        if (situacao === "atrasado") return v.atrasoMin >= 10;
        if (situacao === "atencao") return v.atrasoMin >= 5 && v.atrasoMin < 10;
        return v.atrasoMin < 5;
      });
  }, [ocorrenciasVisiveis, situacao, veiculos]);

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
                aria-pressed={ativo}
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

      <div className="flex flex-wrap items-center gap-2 border-b border-border/70 bg-card px-4 py-2.5">
        <span className="text-xs font-semibold text-muted-foreground">Situação:</span>
        {SITUACOES.map((s) => (
          <button
            key={s.valor}
            onClick={() => setSituacao(s.valor)}
            aria-pressed={situacao === s.valor}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              situacao === s.valor
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border text-muted-foreground hover:bg-muted",
            )}
          >
            {s.rotulo}
          </button>
        ))}
        <SeloDemo texto="Localização simulada" className="ml-auto" />
      </div>

      <div
        className={cn("relative w-full overflow-hidden bg-muted", altura)}
        style={{
          backgroundImage:
            "linear-gradient(0deg, rgba(148,163,184,.25) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,.25) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
        onClick={() => setSelecionado(null)}
      >
        {/* Vias principais (representação esquemática) */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-0 top-[38%] h-3 w-full -rotate-3 rounded-full bg-card/90" />
          <div className="absolute left-[30%] top-0 h-full w-3 rotate-6 rounded-full bg-card/90" />
          <div className="absolute left-0 top-[70%] h-2.5 w-full rotate-2 rounded-full bg-card/80" />
          <div className="absolute left-[72%] top-0 h-full w-2.5 -rotate-3 rounded-full bg-card/80" />
          <div className="absolute left-[6%] top-[8%] size-28 rounded-2xl bg-card/55" />
          <div className="absolute bottom-[12%] right-[10%] size-32 rounded-2xl bg-card/55" />
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
                  linhas: [t.via, "Monitoramento simulado para demonstração"],
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
                  linhas: [
                    `${p.endereco} · ${p.bairro}`,
                    `Rotas demonstrativas: ${p.linhas.join(", ")}`,
                    p.abrigo ? "Ponto com abrigo" : "Ponto sem abrigo",
                  ],
                });
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
              aria-label={`Ponto ${p.nome}`}
            >
              <span className="grid size-6 place-items-center rounded-full bg-brand-ink text-white shadow-soft ring-2 ring-card">
                <MapPin className="size-3.5" />
              </span>
            </button>
          ))}

        {ativas.includes("onibus") &&
          veiculosVisiveis.map((v) => {
            const motorista = MOTORISTAS.find((m) => m.id === v.motoristaId);
            return (
              <button
                key={v.id}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelecionado({
                    titulo: `Veículo ${v.codigo} — ${v.linhaCodigo}`,
                    linhas: [
                      `Motorista: ${motorista?.nome ?? "—"}`,
                      `Rota demonstrativa ${v.linhaCodigo} · ${v.velocidadeKmh} km/h`,
                      `Atraso de ${v.atrasoMin} min · lotação ${v.lotacao}`,
                      `Última atualização: há ${segundosDesdeAtualizacao}s (simulada)`,
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
                      "relative grid size-8 place-items-center rounded-full text-white shadow-lift ring-2 ring-card",
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
                <span className="mt-1 block rounded-md bg-card/95 px-1.5 text-[10px] font-bold text-foreground shadow-soft">
                  {v.codigo}
                </span>
              </button>
            );
          })}

        {ativas.includes("ocorrencias") &&
          ocorrenciasVisiveis.map((o) => (
            <button
              key={o.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelecionado({
                  titulo: `${ROTULO_TIPO[o.tipo]} · ${o.protocolo}`,
                  linhas: [o.local, o.descricao, `Veículo ${o.veiculoCodigo} · ${o.motorista}`],
                });
              }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${o.x}%`, top: `${o.y}%` }}
              aria-label={`Ocorrência ${o.protocolo}`}
            >
              <span className="grid size-8 place-items-center rounded-lg bg-danger text-danger-foreground shadow-lift ring-2 ring-card">
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
          <span className="ml-auto">Localização simulada para demonstração.</span>
        </div>
      )}
    </Card>
  );
}
