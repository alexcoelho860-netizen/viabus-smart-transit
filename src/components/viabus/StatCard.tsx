import type { LucideIcon } from "lucide-react";
import { TrendingDown, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Tom = "brand" | "success" | "warning" | "danger";

const TONS: Record<Tom, string> = {
  brand: "bg-primary/10 text-primary",
  success: "bg-success/15 text-success-foreground",
  warning: "bg-warning/18 text-warning-foreground",
  danger: "bg-danger/12 text-danger",
};

export function StatCard({
  titulo,
  valor,
  descricao,
  icone: Icone,
  tom = "brand",
  variacao,
}: {
  titulo: string;
  valor: string | number;
  descricao?: string;
  icone: LucideIcon;
  tom?: Tom;
  variacao?: number;
}) {
  const positivo = (variacao ?? 0) >= 0;
  return (
    <Card className="gap-0 rounded-2xl border-border/70 p-5 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{titulo}</p>
        <span className={cn("grid size-10 place-items-center rounded-xl", TONS[tom])}>
          <Icone className="size-5" />
        </span>
      </div>
      <p className="mt-3 text-3xl font-extrabold tracking-tight text-foreground">{valor}</p>
      <div className="mt-1.5 flex items-center gap-2">
        {variacao !== undefined && (
          <span
            className={cn(
              "inline-flex items-center gap-1 text-xs font-semibold",
              positivo ? "text-success-foreground" : "text-danger",
            )}
          >
            {positivo ? <TrendingUp className="size-3.5" /> : <TrendingDown className="size-3.5" />}
            {positivo ? "+" : ""}
            {variacao}%
          </span>
        )}
        {descricao && <span className="text-xs text-muted-foreground">{descricao}</span>}
      </div>
    </Card>
  );
}
