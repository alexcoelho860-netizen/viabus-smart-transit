import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useViaBus } from "@/store/viabus-store";
import { TituloPagina } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/passageiro/perfil")({
  head: () => ({ meta: [
    { title: "Meu perfil — ViaBus" },
    { name: "description", content: "Dados da conta, preferências de notificação e histórico de viagens do passageiro." },
    { property: "og:title", content: "Meu perfil — ViaBus" },
    { property: "og:description", content: "Gerencie seus dados e preferências de aviso no ViaBus." },
  ] }),
  component: Pagina,
});

function Pagina() {
  const { perfil, sair } = useViaBus();
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <TituloPagina titulo="Meu perfil" />
      <Card className="flex-row items-center gap-4 rounded-2xl border-border/70 p-5 shadow-soft">
        <span className="grid size-16 place-items-center rounded-2xl bg-primary/10 text-xl font-extrabold text-primary">{perfil?.avatarIniciais}</span>
        <div>
          <p className="text-lg font-bold">{perfil?.nome}</p>
          <p className="text-sm text-muted-foreground">{perfil?.email}</p>
          <p className="text-xs text-muted-foreground">{perfil?.telefone} · cliente desde {perfil?.desde}</p>
        </div>
      </Card>
      <div className="grid gap-4 sm:grid-cols-3">
        {[{ r: "Viagens no mês", v: "42" }, { r: "Linha mais usada", v: "203" }, { r: "Economia estimada", v: "R$ 186" }].map((i) => (
          <Card key={i.r} className="gap-0 rounded-2xl border-border/70 p-5 shadow-soft"><p className="text-2xl font-extrabold">{i.v}</p><p className="text-sm text-muted-foreground">{i.r}</p></Card>
        ))}
      </div>
      <Card className="gap-4 rounded-2xl border-border/70 p-5 shadow-soft">
        <p className="font-bold">Preferências de aviso</p>
        {["Avisar quando o ônibus estiver a 5 minutos", "Avisar sobre atrasos nas linhas favoritas", "Receber alertas de desvio e obras"].map((t, i) => (
          <div key={t} className="flex items-center justify-between gap-4">
            <span className="text-sm">{t}</span>
            <Switch defaultChecked={i !== 2} onCheckedChange={(v) => toast.success(v ? "Aviso ativado" : "Aviso desativado")} />
          </div>
        ))}
      </Card>
      <Button variant="outline" className="rounded-xl text-danger" onClick={async () => { await sair(); navigate({ to: "/demo" }); }}><LogOut className="size-4" /> Sair da conta</Button>
    </div>
  );
}
