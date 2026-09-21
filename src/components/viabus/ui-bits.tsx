import { useEffect, useState, type ReactNode } from "react";
import { Bus, Inbox, Radio, WifiOff } from "lucide-react";

import { cn } from "@/lib/utils";
import { useViaBus } from "@/store/viabus-store";
import type {
  GravidadeOcorrencia,
  Lotacao,
  StatusOcorrencia,
  StatusVeiculo,
} from "@/types/viabus";

export function ClientOnly({ children }: { children: ReactNode }) {
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);
  if (!montado) return null;
  return <>{children}</>;
}

export function useHidratado() {
  const [hidratado, setHidratado] = useState(false);
  useEffect(() => setHidratado(true), []);
  return hidratado;
}

export function LogoViaBus({ className, compacto }: { className?: string; compacto?: boolean }) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
        <Bus className="size-5" />
      </span>
      {!compacto && (
        <span className="text-lg font-extrabold tracking-tight">
          Via<span className="text-primary">Bus</span>
        </span>
      )}
    </div>
  );
}

export function SeloAtualizacao({ className }: { className?: string }) {
  const { segundosDesdeAtualizacao } = useViaBus();
  const texto =
    segundosDesdeAtualizacao < 5 ? "Atualizado agora" : `Atualizado há ${segundosDesdeAtualizacao}s`;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-success/12 px-2.5 py-1 text-xs font-semibold text-success-foreground",
        className,
      )}
    >
      <span className="relative flex size-2">
        <span className="pulse-ring absolute inline-flex size-2 rounded-full bg-success" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      {texto}
    </span>
  );
}

export function SeloAoVivo() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
      <Radio className="size-3.5" /> Tempo real
    </span>
  );
}

/** Marca conteúdos que não são oficiais. */
export function SeloDemo({ texto = "Dado demonstrativo", className }: { texto?: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground",
        className,
      )}
    >
      {texto}
    </span>
  );
}

export function AvisoConexao() {
  const { online } = useViaBus();
  if (online) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl border border-warning/40 bg-warning/10 px-3 py-2 text-sm font-medium text-warning-foreground">
      <WifiOff className="size-4" /> Sem conexão — algumas informações podem estar desatualizadas.
    </div>
  );
}

const CORES_LOTACAO: Record<Lotacao, string> = {
  baixa: "bg-success/15 text-success-foreground",
  media: "bg-warning/18 text-warning-foreground",
  alta: "bg-danger/12 text-danger",
};

const ROTULO_LOTACAO: Record<Lotacao, string> = {
  baixa: "Poucos passageiros",
  media: "Movimento moderado",
  alta: "Lotado",
};

export function BadgeLotacao({ lotacao, curto }: { lotacao: Lotacao; curto?: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        CORES_LOTACAO[lotacao],
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          lotacao === "baixa" ? "bg-success" : lotacao === "media" ? "bg-warning" : "bg-danger",
        )}
      />
      {curto ? lotacao.charAt(0).toUpperCase() + lotacao.slice(1) : ROTULO_LOTACAO[lotacao]}
    </span>
  );
}

const CORES_GRAVIDADE: Record<GravidadeOcorrencia, string> = {
  baixa: "bg-success/15 text-success-foreground",
  media: "bg-warning/18 text-warning-foreground",
  alta: "bg-danger/12 text-danger",
  critica: "bg-danger text-danger-foreground",
};

export const ROTULO_GRAVIDADE: Record<GravidadeOcorrencia, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  critica: "Crítica",
};

export function BadgeGravidade({ gravidade }: { gravidade: GravidadeOcorrencia }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        CORES_GRAVIDADE[gravidade],
      )}
    >
      {ROTULO_GRAVIDADE[gravidade]}
    </span>
  );
}

export const ROTULO_STATUS: Record<StatusOcorrencia, string> = {
  registrada: "Registrada",
  recebida: "Recebida",
  em_atendimento: "Em atendimento",
  resolvida: "Resolvida",
  encerrada: "Encerrada",
};

const CORES_STATUS: Record<StatusOcorrencia, string> = {
  registrada: "bg-danger/12 text-danger",
  recebida: "bg-primary/12 text-primary",
  em_atendimento: "bg-warning/18 text-warning-foreground",
  resolvida: "bg-success/15 text-success-foreground",
  encerrada: "bg-muted text-muted-foreground",
};

export function BadgeStatus({ status }: { status: StatusOcorrencia }) {
  return (
    <span
      className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", CORES_STATUS[status])}
    >
      {ROTULO_STATUS[status]}
    </span>
  );
}

export const ROTULO_STATUS_VEICULO: Record<StatusVeiculo, string> = {
  em_rota: "Operando",
  parado: "Parado",
  manutencao: "Manutenção",
  indisponivel: "Indisponível",
};

const CORES_STATUS_VEICULO: Record<StatusVeiculo, string> = {
  em_rota: "bg-success/15 text-success-foreground",
  parado: "bg-muted text-muted-foreground",
  manutencao: "bg-warning/18 text-warning-foreground",
  indisponivel: "bg-danger/12 text-danger",
};

export function BadgeStatusVeiculo({ status }: { status: StatusVeiculo }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
        CORES_STATUS_VEICULO[status],
      )}
    >
      {ROTULO_STATUS_VEICULO[status]}
    </span>
  );
}

export function TituloPagina({
  titulo,
  subtitulo,
  acoes,
}: {
  titulo: string;
  subtitulo?: string;
  acoes?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          {titulo}
        </h1>
        {subtitulo && <p className="mt-1 text-sm text-muted-foreground">{subtitulo}</p>}
      </div>
      {acoes}
    </div>
  );
}

export function EstadoVazio({
  titulo,
  descricao,
  acao,
}: {
  titulo: string;
  descricao: string;
  acao?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
      <span className="grid size-14 place-items-center rounded-2xl bg-muted text-muted-foreground">
        <Inbox className="size-6" />
      </span>
      <div>
        <p className="font-bold">{titulo}</p>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">{descricao}</p>
      </div>
      {acao}
    </div>
  );
}

export function EsqueletoCartoes({ quantidade = 3 }: { quantidade?: number }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: quantidade }).map((_, i) => (
        <div key={i} className="h-28 animate-pulse rounded-2xl border border-border bg-muted/60" />
      ))}
    </div>
  );
}

export function EstadoErro({ onTentar }: { onTentar?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-danger/30 bg-danger/5 px-6 py-10 text-center">
      <p className="font-bold">Não conseguimos carregar os dados.</p>
      <p className="text-sm text-muted-foreground">Verifique sua conexão e tente novamente.</p>
      {onTentar && (
        <button
          onClick={onTentar}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
