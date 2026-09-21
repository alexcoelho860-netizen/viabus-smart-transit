import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LogoViaBus, SeloDemo } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/suporte")({
  head: () => ({ meta: [
    { title: "Suporte — ViaBus" },
    { name: "description", content: "Envie uma solicitação demonstrativa ao suporte ViaBus." },
    { property: "og:title", content: "Suporte — ViaBus" },
    { property: "og:description", content: "Envie uma solicitação demonstrativa ao suporte ViaBus." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ]}),
  component: Page,
});

function Page() {
  const [enviado, setEnviado] = useState(false);
  return <main className="mx-auto max-w-3xl space-y-5 px-4 py-12">
    <div className="flex justify-between"><LogoViaBus/><SeloDemo/></div>
    <h1 className="text-3xl font-extrabold">Suporte</h1>
    <p className="text-muted-foreground">Envie uma solicitação demonstrativa para a equipe ViaBus.</p>
    <Card className="rounded-2xl p-5 shadow-soft">
      {enviado ? <div className="py-8 text-center"><h2 className="text-xl font-bold">Solicitação enviada</h2><p className="mt-2 text-sm text-muted-foreground">Recebemos sua mensagem nesta demonstração.</p><Button className="mt-5" onClick={() => setEnviado(false)}>Enviar outra</Button></div> :
      <form className="grid gap-4" onSubmit={(event) => { event.preventDefault(); setEnviado(true); toast.success("Solicitação enviada com sucesso."); }}>
        <div><Label htmlFor="nome">Nome</Label><Input id="nome" required className="mt-2" /></div>
        <div><Label htmlFor="email">E-mail</Label><Input id="email" type="email" required className="mt-2" /></div>
        <div><Label htmlFor="assunto">Assunto</Label><Input id="assunto" required className="mt-2" /></div>
        <div><Label htmlFor="mensagem">Mensagem</Label><Textarea id="mensagem" required className="mt-2 min-h-32" /></div>
        <Button type="submit">Enviar solicitação</Button>
      </form>}
    </Card>
    <p className="text-xs text-muted-foreground">Em situações reais de emergência, utilize os canais oficiais locais.</p>
    <Button asChild variant="outline"><Link to="/">Voltar ao início</Link></Button>
  </main>;
}