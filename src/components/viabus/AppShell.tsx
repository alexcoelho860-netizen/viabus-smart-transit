import { useEffect, useMemo, useState, type ReactNode } from "react";
import { Link, useNavigate, type LinkProps } from "@tanstack/react-router";
import {
  AlertTriangle,
  BarChart3,
  Bell,
  Bus,
  Check,
  ClipboardList,
  Cog,
  FileClock,
  Heart,
  History,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Map,
  MapPin,
  Megaphone,
  MessageSquare,
  Moon,
  PlayCircle,
  Route as RouteIcon,
  Search,
  Shield,
  Sun,
  Users,
  UserSquare2,
  WifiOff,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { BuscaGlobal } from "@/components/viabus/BuscaGlobal";
import type { UserRole } from "@/types/viabus";

interface ItemNav {
  to: NonNullable<LinkProps["to"]>;
  rotulo: string;
  icone: LucideIcon;
  exato?: boolean;
}

const NAV: Record<UserRole, ItemNav[]> = {
  passageiro: [
    { to: "/passageiro", rotulo: "Início", icone: LayoutDashboard, exato: true },
    { to: "/passageiro/mapa", rotulo: "Mapa", icone: Map },
    { to: "/passageiro/linhas", rotulo: "Rotas", icone: RouteIcon },
    { to: "/passageiro/pontos", rotulo: "Pontos", icone: MapPin },
    { to: "/passageiro/favoritos", rotulo: "Favoritos", icone: Heart },
    { to: "/passageiro/historico", rotulo: "Histórico", icone: History },
    { to: "/passageiro/problema", rotulo: "Informar problema", icone: AlertTriangle },
    { to: "/passageiro/notificacoes", rotulo: "Notificações", icone: Bell },
    { to: "/passageiro/perfil", rotulo: "Perfil", icone: UserSquare2 },
  ],
  motorista: [
    { to: "/motorista", rotulo: "Painel", icone: LayoutDashboard, exato: true },
    { to: "/motorista/operacao", rotulo: "Operação", icone: PlayCircle },
    { to: "/motorista/ocorrencia", rotulo: "Ocorrência", icone: AlertTriangle },
    { to: "/motorista/rota", rotulo: "Rota", icone: RouteIcon },
    { to: "/motorista/comunicacao", rotulo: "Fiscal", icone: MessageSquare },
    { to: "/motorista/historico", rotulo: "Histórico", icone: History },
    { to: "/motorista/perfil", rotulo: "Perfil", icone: UserSquare2 },
  ],
  fiscal: [
    { to: "/fiscal", rotulo: "Central", icone: LayoutDashboard, exato: true },
    { to: "/fiscal/mapa", rotulo: "Mapa", icone: Map },
    { to: "/fiscal/ocorrencias", rotulo: "Ocorrências", icone: AlertTriangle },
    { to: "/fiscal/comunicacao", rotulo: "Comunicação", icone: MessageSquare },
    { to: "/fiscal/veiculos", rotulo: "Veículos", icone: Bus },
    { to: "/fiscal/motoristas", rotulo: "Motoristas", icone: UserSquare2 },
    { to: "/fiscal/historico", rotulo: "Histórico", icone: History },
    { to: "/fiscal/perfil", rotulo: "Perfil", icone: Shield },
  ],
  admin: [
    { to: "/admin", rotulo: "Dashboard", icone: LayoutDashboard, exato: true },
    { to: "/admin/usuarios", rotulo: "Usuários", icone: Users },
    { to: "/admin/motoristas", rotulo: "Motoristas", icone: UserSquare2 },
    { to: "/admin/fiscais", rotulo: "Fiscais", icone: Shield },
    { to: "/admin/veiculos", rotulo: "Veículos", icone: Bus },
    { to: "/admin/rotas", rotulo: "Rotas", icone: RouteIcon },
    { to: "/admin/ocorrencias", rotulo: "Ocorrências", icone: AlertTriangle },
    { to: "/admin/banners", rotulo: "Banners", icone: ImageIcon },
    { to: "/admin/notificacoes", rotulo: "Notificações", icone: Megaphone },
    { to: "/admin/relatorios", rotulo: "Relatórios", icone: BarChart3 },
    { to: "/admin/auditoria", rotulo: "Auditoria", icone: FileClock },
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
  const {
    perfil,
    entrarComo,
    sair,
    notificacoes,
    naoLidas,
    marcarTodasLidas,
    tema,
    definirTema,
    online,
  } = useViaBus();
  const navigate = useNavigate();
  const [buscaAberta, setBuscaAberta] = useState(false);
  const [confirmarSaida, setConfirmarSaida] = useState(false);

  // Acesso direto sem sessão inicia a demonstração; perfis ativos não trocam de área pela URL.
  useEffect(() => {
    if (!perfil) entrarComo(role);
  }, [perfil, role, entrarComo]);

  const itens = NAV[role];
  const itensMobile = useMemo(() => itens.slice(0, 5), [itens]);

  if (perfil && perfil.role !== role) {
    return (
      <main className="grid min-h-screen place-items-center bg-muted px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lift">
          <Shield className="mx-auto size-12 text-warning" />
          <h1 className="mt-4 text-2xl font-extrabold">Acesso não permitido</h1>
          <p className="mt-2 text-sm text-muted-foreground">Você não possui permissão para acessar esta página.</p>
          <div className="mt-6 flex justify-center gap-2">
            <Button asChild><Link to="/demo">Trocar de perfil</Link></Button>
            <Button asChild variant="outline"><Link to="/">Voltar ao início</Link></Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-3 focus:top-3 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground"
      >
        Ir para o conteúdo
      </a>

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
          <nav className="space-y-1 pb-6" aria-label="Navegação principal">
            {itens.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                {...(item.exato ? { activeOptions: { exact: true } } : {})}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-all hover:bg-white/8 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-light data-[status=active]:bg-primary data-[status=active]:text-primary-foreground data-[status=active]:shadow-soft"
              >
                <item.icone className="size-[18px]" />
                {item.rotulo}
              </Link>
            ))}
          </nav>
        </ScrollArea>
        <div className="border-t border-white/10 p-3">
          <Link
            to="/demo"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/8 hover:text-white"
          >
            <ClipboardList className="size-[18px]" /> Trocar de perfil
          </Link>
          <button
            onClick={() => setConfirmarSaida(true)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/8 hover:text-white"
          >
            <LogOut className="size-[18px]" /> Sair da conta
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
            <button
              onClick={() => setBuscaAberta(true)}
              className="relative hidden h-10 max-w-sm flex-1 items-center gap-2 rounded-xl border border-border bg-background pl-9 pr-3 text-left text-sm text-muted-foreground transition-colors hover:border-primary/30 sm:flex"
            >
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
              Buscar rota, veículo, motorista ou protocolo
            </button>
            <div className="ml-auto flex items-center gap-2">
              {!online && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-1 text-xs font-semibold text-warning-foreground">
                  <WifiOff className="size-3.5" /> Sem conexão
                </span>
              )}
              <SeloAtualizacao className="hidden sm:inline-flex" />

              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl"
                aria-label="Alternar tema"
                onClick={() => definirTema(tema === "escuro" ? "claro" : "escuro")}
              >
                {tema === "escuro" ? <Sun className="size-5" /> : <Moon className="size-5" />}
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative rounded-xl">
                    <Bell className="size-5" />
                    {naoLidas > 0 && (
                      <span className="absolute right-1.5 top-1.5 grid size-4 place-items-center rounded-full bg-danger text-[10px] font-bold text-danger-foreground">
                        {naoLidas}
                      </span>
                    )}
                    <span className="sr-only">
                      {naoLidas > 0 ? `${naoLidas} novas notificações` : "Notificações"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    Notificações
                    <button
                      onClick={marcarTodasLidas}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary"
                    >
                      <Check className="size-3.5" /> Marcar todas como lidas
                    </button>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notificacoes.slice(0, 5).map((n) => (
                    <DropdownMenuItem
                      key={n.id}
                      className="flex-col items-start gap-0.5 py-2.5"
                      onSelect={() => marcarTodasLidas()}
                    >
                      <span className="flex w-full items-center gap-2 text-sm font-semibold">
                        {!n.lida && <span className="size-1.5 rounded-full bg-primary" />}
                        {n.titulo}
                      </span>
                      <span className="text-xs text-muted-foreground">{n.mensagem}</span>
                      <span className="text-[11px] text-muted-foreground/80">{n.tempo}</span>
                    </DropdownMenuItem>
                  ))}
                  {notificacoes.length === 0 && (
                    <p className="px-2 py-4 text-center text-sm text-muted-foreground">
                      Nenhuma notificação por enquanto.
                    </p>
                  )}
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
                  <DropdownMenuItem asChild>
                    <Link to="/ajuda">
                      <MessageSquare className="size-4" /> Ajuda
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setConfirmarSaida(true)}>
                    <LogOut className="size-4" /> Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        <main id="conteudo" className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:pb-10">
          {children}
        </main>
      </div>

      {/* Navegação inferior (mobile) */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur-md lg:hidden"
        aria-label="Navegação rápida"
      >
        <div className="grid grid-cols-5">
          {itensMobile.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              {...(item.exato ? { activeOptions: { exact: true } } : {})}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <item.icone className="size-5" />
              {item.rotulo}
            </Link>
          ))}
        </div>
      </nav>

      <BuscaGlobal aberta={buscaAberta} aoFechar={() => setBuscaAberta(false)} />

      <AlertDialog open={confirmarSaida} onOpenChange={setConfirmarSaida}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sair da conta?</AlertDialogTitle>
            <AlertDialogDescription>
              Você voltará para a página inicial e precisará entrar novamente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                sair();
                navigate({ to: "/" });
              }}
            >
              Sair
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
