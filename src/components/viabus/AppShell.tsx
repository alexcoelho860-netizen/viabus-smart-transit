import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bus,
  Check,
  ClipboardList,
  Cog,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  MessageSquare,
  Route as RouteIcon,
  Search,
  Users,
  UserSquare2,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useViaBus } from "@/store/viabus-store";
import { LogoViaBus, SeloAtualizacao } from "@/components/viabus/ui-bits";
import type { UserRole } from "@/types/viabus";

interface ItemNav {
  to: LinkProps["to"];
  rotulo: string;
  icone: LucideIcon;
  exato?: boolean;
}


const NAV: Record<UserRole, ItemNav[]> = {
  passageiro: [
    { to: "/passageiro", rotulo: "Início", icone: LayoutDashboard, exato: true },
    { to: "/passageiro/mapa", rotulo: "Mapa", icone: Map },
    { to: "/passageiro/linhas", rotulo: "Linhas", icone: RouteIcon },
    { to: "/passageiro/pontos", rotulo: "Pontos", icone: MapPin },
    { to: "/passageiro/favoritos", rotulo: "Favoritos", icone: Heart },
    { to: "/passageiro/notificacoes", rotulo: "Notificações", icone: Bell },
    { to: "/passageiro/perfil", rotulo: "Perfil", icone: UserSquare2 },
  ],
  motorista: [
    { to: "/motorista", rotulo: "Painel", icone: LayoutDashboard, exato: true },
    { to: "/motorista/ocorrencia", rotulo: "Ocorrência", icone: AlertTriangle },
    { to: "/motorista/rota", rotulo: "Rota", icone: RouteIcon },
    { to: "/motorista/comunicacao", rotulo: "Fiscal", icone: MessageSquare },
    { to: "/motorista/historico", rotulo: "Histórico", icone: History },
  ],
  fiscal: [
    { to: "/fiscal", rotulo: "Central", icone: LayoutDashboard, exato: true },
    { to: "/fiscal/mapa", rotulo: "Mapa", icone: Map },
    { to: "/fiscal/ocorrencias", rotulo: "Ocorrências", icone: AlertTriangle },
    { to: "/fiscal/comunicacao", rotulo: "Comunicação", icone: MessageSquare },
  ],
  admin: [
    { to: "/admin", rotulo: "Dashboard", icone: LayoutDashboard, exato: true },
    { to: "/admin/linhas", rotulo: "Linhas", icone: RouteIcon },
    { to: "/admin/veiculos", rotulo: "Veículos", icone: Bus },
    { to: "/admin/motoristas", rotulo: "Motoristas", icone: UserSquare2 },
    { to: "/admin/passageiros", rotulo: "Passageiros", icone: Users },
    { to: "/admin/relatorios", rotulo: "Relatórios", icone: BarChart3 },
    { to: "/admin/configuracoes", rotulo: "Configurações", icone: Cog },
  ],
};

const TITULO_PAPEL: Record<UserRole, string> = {
  passageiro: "Área do passageiro",
  motorista: "Painel do motorista",
  fiscal: "Central de operações",
  admin: "Gestão executiva",
};

export function AppShell({ role, children }: { role: UserRole; children: ReactNode }) {
  const { perfil, entrarComo, sair, notificacoes, naoLidas, marcarTodasLidas } = useViaBus();
  const navigate = useNavigate();
  const [busca, setBusca] = useState("");

  // Acesso direto pela URL na demonstração: entra automaticamente no perfil da área.
  useEffect(() => {
    if (!perfil || perfil.role !== role) entrarComo(role);
  }, [perfil, role, entrarComo]);

  const itens = NAV[role];
  const itensMobile = itens.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col bg-sidebar text-sidebar-foreground lg:flex">
        <div className="px-5 py-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Bus className="size-5" />
            </span>
            <span className="text-lg font-extrabold tracking-tight text-white">
              Via<span className="text-brand-light">Bus</span>
            </span>
          </Link>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-widest text-white/45">
            {TITULO_PAPEL[role]}
          </p>
        </div>
        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-1 pb-6">
            {itens.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.exato }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/8 hover:text-white data-[status=active]:bg-primary data-[status=active]:text-primary-foreground data-[status=active]:shadow-soft"
              >
                <item.icone className="size-[18px]" />
                {item.rotulo}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t border-white/10 p-3">
          <button
            onClick={() => {
              sair();
              navigate({ to: "/demo" });
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/8 hover:text-white"
          >
            <LogOut className="size-[18px]" /> Trocar de perfil
          </button>
        </div>
      </aside>

      {/* Conteúdo */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur-md">
          <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
            <div className="lg:hidden">
              <LogoViaBus compacto />
            </div>
            <div className="relative hidden max-w-sm flex-1 sm:block">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar linha, veículo ou parada"
                className="h-10 w-full rounded-xl border border-border bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
              />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <SeloAtualizacao className="hidden sm:inline-flex" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-xl">
                    <Bell className="size-5" />
                    {naoLidas > 0 && (
                      <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-danger text-[10px] font-bold text-danger-foreground">
                        {naoLidas}
                      </span>
                    )}
                    <span className="sr-only">Notificações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notificações
                    <button
                      onClick={marcarTodasLidas}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary"
                    >
                      <Check className="size-3.5" /> Marcar lidas
                    </button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notificacoes.slice(0, 5).map((n) => (
                    <DropdownMenuItem key={n.id} className="flex-col items-start gap-0.5 py-2.5">
                      <span className="flex w-full items-center gap-2 text-sm font-semibold">
                        {!n.lida && <span className="size-1.5 rounded-full bg-primary" />}
                        {n.titulo}
                      </span>
                      <span className="text-xs text-muted-foreground">{n.mensagem}</span>
                      <span className="text-[11px] text-muted-foreground/80">{n.tempo}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-xl border border-border bg-card px-2 py-1.5 transition-colors hover:bg-muted">
                    <span className="grid size-8 place-items-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {perfil?.avatarIniciais ?? "VB"}
                    </span>
                    <span className="hidden text-left sm:block">
                      <span className="block text-xs font-bold leading-tight">
                        {perfil?.nome ?? "Visitante"}
                      </span>
                      <span className="block text-[11px] capitalize leading-tight text-muted-foreground">
                        {role}
                      </span>
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>{perfil?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/demo">
                      <ClipboardList className="size-4" /> Trocar de perfil
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      sair();
                      navigate({ to: "/" });
                    }}
                  >
                    <LogOut className="size-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10">{children}</main>
      </div>

      {/* Navegação inferior (mobile) */}
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur-md lg:hidden">
        <div className="grid grid-cols-5">
          {itensMobile.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.exato }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <item.icone className="size-5" />
              {item.rotulo}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
