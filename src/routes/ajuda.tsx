import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
export const Route=createFileRoute("/ajuda")({head:()=>({meta:[{title:"Ajuda — ViaBus"},{name:"description",content:"Ajuda e dúvidas frequentes do protótipo ViaBus."},{property:"og:title",content:"Ajuda — ViaBus"},{property:"og:description",content:"Encontre respostas sobre o ViaBus."},{property:"og:type",content:"website"},{name:"twitter:card",content:"summary"}]}),component:Ajuda});
const perguntas = [
  ["Como acompanhar um ônibus?", "No perfil Passageiro, abra Mapa ou Linhas. As posições e previsões exibidas são simuladas."],
  ["Como registrar uma ocorrência?", "Motoristas usam Registrar ocorrência; passageiros podem relatar um problema sem acessar ocorrências internas."],
  ["Como falar com o fiscal?", "No perfil Motorista, abra Falar com fiscal para acessar o chat operacional demonstrativo."],
  ["Como alterar minha senha?", "Use Esqueci minha senha na tela de acesso. O envio é apenas demonstrativo nesta versão."],
  ["Como receber notificações?", "Abra Notificações no seu perfil. Os alertas são simulados e direcionados conforme cada função."],
];
function Ajuda(){return <main className="mx-auto max-w-3xl space-y-5 px-4 py-12"><h1 className="text-3xl font-extrabold">Central de ajuda</h1>{perguntas.map(([pergunta,resposta])=><Card key={pergunta} className="rounded-2xl p-5"><h2 className="font-bold">{pergunta}</h2><p className="mt-2 text-sm text-muted-foreground">{resposta}</p></Card>)}<Button asChild><Link to="/demo">Voltar à demonstração</Link></Button></main>}
