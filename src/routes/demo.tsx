import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, BarChart3, Bus, ShieldCheck, Users } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogoViaBus } from "@/components/viabus/ui-bits";
import { useViaBus } from "@/store/viabus-store";
import type { UserRole } from "@/types/viabus";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Entrar na demonstração — ViaBus" },
      {
        name: "description",
        content:
          "Acesse o ViaBus em um clique como passageiro, motorista, fiscal ou administrador. Sem senha, sem cadastro.",
      },
      { property: "og:title", content: "Entrar na demonstração — ViaBus" },
      {
        property: "og:description",
        content: "Escolha um dos quatro perfis e explore a plataforma de transporte coletivo ViaBus.",
      },
    ],
  }),
  component: Demo,
});

const OPCOES: {
  role: UserRole;
  titulo: string;
  pessoa: string;
  descricao: string;
  icone: typeof Users;
  destino: "/passageiro" | "/motorista" | "/fiscal" | "/admin";
  cor: string;
}[] = [
  {
    role: "passageiro",
    titulo: "Passageiro",
    pessoa: "Ana Beatriz Moura",
    descricao: "Próximo ônibus, mapa, linhas favoritas e alertas da região.",
    icone: Users,
    destino: "/passageiro",
    cor: "bg-primary/10 text-primary",
  },
  {
    role: "motorista",
    titulo: "Motorista",
    pessoa: "João da Silva · Veículo 4821",
    descricao: "Painel do volante com registro rápido de ocorrência e chat com o fiscal.",
    icone: Bus,
    destino: "/motorista",
    cor: "bg-success/15 text-success-foreground",
  },
  {
    role: "fiscal",
    titulo: "Fiscal",
    pessoa: "Carla Nogueira · FS-2207",
    descricao: "Central de operações com mapa ao vivo e fila de ocorrências.",
    icone: ShieldCheck,
    destino: "/fiscal",
    cor: "bg-warning/18 text-warning-foreground",
  },
  {
    role: "admin",
    titulo: "Administrador",
    pessoa: "Rafael Andrade · AD-0031",
    descricao: "Dashboard executivo, análises e gestão de linhas, frota e equipes.",
    icone: BarChart3,
    destino: "/admin",
    cor: "bg-danger/12 text-danger",
  },
];

function Demo() {
  const { entrarComo } = useViaBus();
  const navigate = useNavigate();

  function entrar(opcao: (typeof OPCOES)[number]) {
    entrarComo(opcao.role);
    toast.success(`Bem-vindo(a), ${opcao.pessoa.split("·")[0]?.trim() ?? opcao.pessoa}!`, {
      description: `Você entrou como ${opcao.titulo.toLowerCase()}.`,
    });
    navigate({ to: opcao.destino });
  }

  return (
    <div className="min-h-screen bg-brand-ink px-4 py-10 text-white sm:py-16">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
        >
          <ArrowLeft className="size-4" /> Voltar para o site
        </Link>

        <div className="mt-8 text-center">
          <div className="flex justify-center">
            <LogoViaBus className="[&_span:last-child]:text-white" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Escolha um perfil para explorar
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-white/65">
            Esta é uma demonstração com dados fictícios. O acesso é imediato, em um clique, sem senha
            ou cadastro.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {OPCOES.map((o) => (
            <Card
              key={o.role}
              className="group cursor-pointer gap-0 rounded-2xl border-white/10 bg-white/[0.06] p-6 text-white backdrop-blur transition-all hover:-translate-y-1 hover:border-white/25 hover:bg-white/10"
              onClick={() => entrar(o)}
            >
              <span className={`grid size-11 place-items-center rounded-xl ${o.cor}`}>
                <o.icone className="size-5" />
              </span>
              <h2 className="mt-4 text-xl font-bold">{o.titulo}</h2>
              <p className="text-sm text-white/55">{o.pessoa}</p>
              <p className="mt-2 text-sm text-white/70">{o.descricao}</p>
              <Button
                className="mt-5 h-11 w-full rounded-xl text-base"
                onClick={(e) => {
                  e.stopPropagation();
                  entrar(o);
                }}
              >
                Entrar como {o.titulo}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Card>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-white/40">
          Protótipo ViaBus · dados simulados de operação urbana
        </p>
      </div>
    </div>
  );
}
