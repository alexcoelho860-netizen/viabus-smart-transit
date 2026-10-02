import { createFileRoute, Link } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogoViaBus, SeloDemo } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [
    { title: "Política de Privacidade — ViaBus" },
    { name: "description", content: "Saiba como o ViaBus trata dados de contas de passageiros e informações simuladas da operação." },
    { property: "og:title", content: "Política de Privacidade — ViaBus" },
    { property: "og:description", content: "Dados de contas reais de passageiros e dados simulados da operação ViaBus." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: Page,
});

function Page() {
  return <main className="mx-auto max-w-3xl space-y-5 px-4 py-12">
    <div className="flex justify-between"><LogoViaBus /><SeloDemo /></div>
    <h1 className="text-3xl font-extrabold">Política de Privacidade</h1>
    <p className="text-muted-foreground">As contas de passageiros são reais; os dados da operação continuam simulados.</p>
    <Card className="rounded-lg p-5"><h2 className="font-bold">Conta de passageiro</h2><p className="mt-2 text-sm text-muted-foreground">Nome, e-mail e telefone informados no cadastro são armazenados no Lovable Cloud para identificação, acesso à conta e recuperação de senha. A senha é gerenciada pelo serviço de autenticação.</p></Card>
    <Card className="rounded-lg p-5"><h2 className="font-bold">Demonstração e mapas</h2><p className="mt-2 text-sm text-muted-foreground">Rotas, veículos, ocorrências e perfis de acesso rápido são dados simulados. O mapa usa Google Maps quando autorizado ou OpenStreetMap; ao usar sua localização, o navegador pede permissão antes de mostrá-la no mapa.</p></Card>
    <Card className="rounded-lg p-5"><h2 className="font-bold">Seus dados</h2><p className="mt-2 text-sm text-muted-foreground">Para solicitar acesso, correção ou exclusão dos dados da sua conta, entre em contato pela página de suporte.</p></Card>
    <Button asChild><Link to="/suporte">Falar com suporte</Link></Button>
  </main>;
}