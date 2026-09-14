import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Bus,
  CheckCircle2,
  Clock,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogoViaBus } from "@/components/viabus/ui-bits";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ViaBus — Transporte coletivo urbano em tempo real" },
      {
        name: "description",
        content:
          "ViaBus conecta passageiros, motoristas, fiscais e gestores do transporte coletivo em uma única plataforma com dados em tempo real.",
      },
      { property: "og:title", content: "ViaBus — Transporte coletivo urbano em tempo real" },
      {
        property: "og:description",
        content:
          "Acompanhe ônibus ao vivo, registre ocorrências da frota e gerencie a operação com indicadores executivos.",
      },
    ],
  }),
  component: Landing,
});

const PERFIS = [
  {
    titulo: "Passageiro",
    descricao: "Veja o próximo ônibus, a lotação, alertas da sua região e suas linhas favoritas.",
    icone: Users,
    to: "/passageiro" as const,
    cor: "bg-primary/10 text-primary",
  },
  {
    titulo: "Motorista",
    descricao: "Interface limpa para o volante, com registro de ocorrência em poucos toques.",
    icone: Bus,
    to: "/motorista" as const,
    cor: "bg-success/15 text-success-foreground",
  },
  {
    titulo: "Fiscal",
    descricao: "Central de operações com mapa ao vivo, ocorrências e chat com a frota.",
    icone: ShieldCheck,
    to: "/fiscal" as const,
    cor: "bg-warning/18 text-warning-foreground",
  },
  {
    titulo: "Administrador",
    descricao: "Indicadores executivos, análises de atrasos e gestão completa do sistema.",
    icone: BarChart3,
    to: "/admin" as const,
    cor: "bg-danger/12 text-danger",
  },
];

const RECURSOS = [
  { icone: MapPin, titulo: "Mapa operacional ao vivo", texto: "Frota, paradas, trânsito e ocorrências em um só painel, com filtros por camada." },
  { icone: AlertTriangle, titulo: "Ocorrências com protocolo", texto: "Registro em segundos pelo motorista e protocolo automático para a central." },
  { icone: MessageSquare, titulo: "Chat operacional", texto: "Motorista e fiscal conversam com respostas rápidas prontas para o dia a dia." },
  { icone: Bell, titulo: "Alertas inteligentes", texto: "Avisos de atraso, desvio e clima chegam ao passageiro antes do embarque." },
  { icone: Clock, titulo: "Previsão de chegada", texto: "Tempo estimado por ponto considerando trânsito e atraso acumulado da viagem." },
  { icone: BarChart3, titulo: "Gestão orientada a dados", texto: "Ocorrências por dia e categoria, linhas críticas e tempo médio de atendimento." },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <LogoViaBus />
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex">
            <a href="#perfis" className="transition-colors hover:text-foreground">
              Perfis
            </a>
            <a href="#recursos" className="transition-colors hover:text-foreground">
              Recursos
            </a>
            <a href="#numeros" className="transition-colors hover:text-foreground">
              Números
            </a>
          </nav>
          <Button asChild className="rounded-xl">
            <Link to="/demo">
              Entrar na demonstração <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative overflow-hidden bg-brand-ink text-white">
        <div className="absolute -right-24 -top-24 size-96 rounded-full bg-primary/30 blur-3xl" />
        <div className="absolute -bottom-32 left-10 size-80 rounded-full bg-brand-light/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-semibold">
              <span className="size-2 rounded-full bg-success" /> Operação monitorada em tempo real
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
              A cidade inteira acompanhando o mesmo ônibus.
            </h1>
            <p className="mt-5 max-w-xl text-base text-white/70 sm:text-lg">
              O ViaBus reúne passageiros, motoristas, fiscais e gestores em uma plataforma única de
              transporte coletivo urbano: previsão de chegada, registro de ocorrências, comunicação
              operacional e indicadores de desempenho.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="h-12 rounded-xl px-6 text-base">
                <Link to="/demo">
                  Testar os 4 perfis <ArrowRight className="size-5" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-white/25 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <Link to="/passageiro">Ver como passageiro</Link>
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-white/60">
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" /> Sem cadastro
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" /> Dados de demonstração
              </span>
              <span className="inline-flex items-center gap-2">
                <CheckCircle2 className="size-4 text-success" /> Acesso em 1 clique
              </span>
            </div>
          </div>

          <div className="relative">
            <Card className="gap-0 rounded-3xl border-white/10 bg-white/10 p-5 backdrop-blur">
              <div className="flex items-center justify-between text-sm text-white/70">
                <span className="font-semibold text-white">Seu próximo ônibus</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-success/20 px-2.5 py-1 text-xs font-semibold text-success">
                  <span className="size-1.5 rounded-full bg-success" /> ao vivo
                </span>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <span className="grid size-14 place-items-center rounded-2xl bg-primary text-xl font-extrabold">
                  203
                </span>
                <div>
                  <p className="font-bold">Terminal Central → Jardim das Flores</p>
                  <p className="text-sm text-white/60">Veículo 4821 · movimento moderado</p>
                </div>
              </div>
              <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                {[
                  { rotulo: "Chega em", valor: "4 min" },
                  { rotulo: "Distância", valor: "1,2 km" },
                  { rotulo: "Atraso", valor: "7 min" },
                ].map((i) => (
                  <div key={i.rotulo} className="rounded-2xl bg-white/10 px-2 py-3">
                    <p className="text-xl font-extrabold">{i.valor}</p>
                    <p className="text-[11px] text-white/60">{i.rotulo}</p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {["Praça da Matriz · 4 min", "Hospital Municipal · 9 min", "Shopping Norte · 15 min"].map(
                  (p) => (
                    <div
                      key={p}
                      className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm text-white/75"
                    >
                      <MapPin className="size-4 text-brand-light" /> {p}
                    </div>
                  ),
                )}
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="perfis" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight">Quatro perfis, uma operação</h2>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Cada pessoa vê exatamente o que precisa para decidir rápido — do ponto de ônibus à sala de
          controle.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PERFIS.map((p) => (
            <Card
              key={p.titulo}
              className="group gap-0 rounded-2xl border-border/70 p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift"
            >
              <span className={`grid size-11 place-items-center rounded-xl ${p.cor}`}>
                <p.icone className="size-5" />
              </span>
              <h3 className="mt-4 text-lg font-bold">{p.titulo}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{p.descricao}</p>
              <Link
                to={p.to}
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary"
              >
                Abrir painel
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section id="recursos" className="bg-card py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 className="text-3xl font-extrabold tracking-tight">Tudo que a operação precisa</h2>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {RECURSOS.map((r) => (
              <div key={r.titulo} className="rounded-2xl border border-border/70 p-5">
                <r.icone className="size-5 text-primary" />
                <h3 className="mt-3 font-bold">{r.titulo}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{r.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="numeros" className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="grid gap-5 rounded-3xl bg-brand-ink p-8 text-white sm:grid-cols-4">
          {[
            { valor: "4", rotulo: "linhas monitoradas" },
            { valor: "6", rotulo: "veículos na frota demo" },
            { valor: "590", rotulo: "viagens por dia" },
            { valor: "12 min", rotulo: "tempo médio de atendimento" },
          ].map((n) => (
            <div key={n.rotulo}>
              <p className="text-3xl font-extrabold">{n.valor}</p>
              <p className="text-sm text-white/60">{n.rotulo}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border/70 bg-card py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <LogoViaBus />
          <p className="text-sm text-muted-foreground">
            ViaBus · Plataforma de demonstração de mobilidade urbana
          </p>
          <Button asChild variant="outline" className="rounded-xl">
            <Link to="/demo">Acessar demonstração</Link>
          </Button>
        </div>
      </footer>
    </div>
  );
}
