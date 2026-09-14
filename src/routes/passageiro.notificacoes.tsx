import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useViaBus } from "@/store/viabus-store";
import { TituloPagina } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/passageiro/notificacoes")({
  head: () => ({ meta: [
    { title: "Notificações — ViaBus" },
    { name: "description", content: "Avisos de atraso, chegada de ônibus, desvios e novidades das suas linhas." },
    { property: "og:title", content: "Notificações — ViaBus" },
    { property: "og:description", content: "Todos os avisos da sua operação de transporte em um só lugar." },
  ] }),
  component: Pagina,
});

const TONS: Record<string, string> = { info: "bg-primary/10 text-primary", sucesso: "bg-success/15 text-success-foreground", alerta: "bg-warning/18 text-warning-foreground", erro: "bg-danger/12 text-danger" };

function Pagina() {
  const { notificacoes, marcarLida, marcarTodasLidas } = useViaBus();
  return (
    <div className="space-y-5">
      <TituloPagina titulo="Notificações" subtitulo="Avisos das suas linhas e da sua região." acoes={
        <Button variant="outline" className="rounded-xl" onClick={() => { marcarTodasLidas(); toast.success("Todas as notificações foram marcadas como lidas"); }}>
          <CheckCheck className="size-4" /> Marcar todas como lidas
        </Button>
      } />
      <div className="space-y-3">
        {notificacoes.map((n) => (
          <Card key={n.id} onClick={() => marcarLida(n.id)} className={`flex-row items-start gap-3 rounded-2xl border-border/70 p-4 shadow-soft transition-colors ${n.lida ? "" : "bg-primary/[0.04]"}`}>
            <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${TONS[n.tom]}`}><Bell className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                {!n.lida && <span className="size-2 rounded-full bg-primary" />}
                <p className="font-semibold">{n.titulo}</p>
                <span className="ml-auto text-xs text-muted-foreground">{n.tempo}</span>
              </div>
              <p className="mt-0.5 text-sm text-muted-foreground">{n.mensagem}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
