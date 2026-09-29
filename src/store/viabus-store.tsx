import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  AUDITORIA_INICIAL,
  AVISOS_INICIAIS,
  BANNERS_INICIAIS,
  BANNERS_INICIAIS as _BANNERS,
  CONTAS_INICIAIS,
  FISCAIS,
  LINHAS,
  MENSAGENS_INICIAIS,
  MOTORISTAS,
  NOTIFICACOES_INICIAIS,
  OCORRENCIAS_INICIAIS,
  PASSAGEIROS_CADASTRADOS,
  PERFIS,
  VEICULOS,
  dataAtual,
  gerarProtocolo,
  horaAtual,
} from "@/data/mock";
import type {
  AvisoPublicado,
  Banner,
  CategoriaNotificacao,
  Conta,
  Fiscal,
  GravidadeOcorrencia,
  Linha,
  Mensagem,
  Motorista,
  Notificacao,
  Ocorrencia,
  Passageiro,
  RegistroAuditoria,
  StatusOcorrencia,
  TipoOcorrencia,
  UserProfile,
  UserRole,
  Veiculo,
} from "@/types/viabus";
import { supabase } from "@/integrations/supabase/client";

void _BANNERS;

export interface NovaOcorrencia {
  tipo: TipoOcorrencia;
  gravidade: GravidadeOcorrencia;
  descricao: string;
  local: string;
  anexos?: string[];
}

export interface DadosCadastro {
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  role: Exclude<UserRole, "admin">;
}

export type Tema = "claro" | "escuro" | "sistema";

interface Resultado {
  ok: boolean;
  erro?: string;
  confirmacao?: boolean;
}

interface ViaBusContexto {
  // Sessão
  perfil: UserProfile | null;
  contas: Conta[];
  entrar: (email: string, senha: string) => Promise<Resultado>;
  cadastrar: (dados: DadosCadastro) => Promise<Resultado>;
  recuperarSenha: (email: string) => Promise<Resultado>;
  entrarComo: (role: UserRole) => void;
  sair: () => Promise<void>;
  atualizarPerfil: (dados: Partial<UserProfile>) => void;
  temPermissao: (role: UserRole) => boolean;

  // Operação
  veiculos: Veiculo[];
  atualizarVeiculo: (id: string, dados: Partial<Veiculo>) => void;
  linhas: Linha[];
  atualizarLinha: (id: string, dados: Partial<Linha>) => void;
  motoristas: Motorista[];
  alternarSituacaoMotorista: (id: string) => void;
  fiscais: Fiscal[];
  alternarSituacaoFiscal: (id: string) => void;
  passageiros: Passageiro[];
  alternarSituacaoPassageiro: (id: string) => void;

  operacaoAtiva: boolean;
  iniciarOperacao: () => void;
  finalizarOperacao: () => void;

  // Ocorrências
  ocorrencias: Ocorrencia[];
  registrarOcorrencia: (dados: NovaOcorrencia) => Ocorrencia;
  avancarOcorrencia: (id: string, status: StatusOcorrencia) => void;

  // Notificações
  notificacoes: Notificacao[];
  todasNotificacoes: Notificacao[];
  naoLidas: number;
  marcarTodasLidas: () => void;
  marcarLida: (id: string) => void;
  notificar: (dados: {
    titulo: string;
    mensagem: string;
    destino: UserRole | "todos";
    categoria?: CategoriaNotificacao;
    tom?: Notificacao["tom"];
  }) => void;

  // Comunicação
  mensagens: Mensagem[];
  enviarMensagem: (papel: Mensagem["papel"], texto: string, motoristaId?: string) => void;
  marcarConversaLida: (motoristaId: string) => void;

  // Conteúdo
  favoritos: string[];
  alternarFavorito: (codigo: string) => void;
  avisos: AvisoPublicado[];
  salvarAviso: (aviso: AvisoPublicado) => void;
  removerAviso: (id: string) => void;
  banners: Banner[];
  salvarBanner: (banner: Banner) => void;
  removerBanner: (id: string) => void;

  // Auditoria e ambiente
  auditoria: RegistroAuditoria[];
  registrarAuditoria: (acao: string) => void;
  tema: Tema;
  definirTema: (tema: Tema) => void;
  online: boolean;
  definirOnline: (valor: boolean) => void;
  segundosDesdeAtualizacao: number;
}

const Ctx = createContext<ViaBusContexto | null>(null);

const MOTORISTA_PADRAO = "mot-01";

function passo(valor: number, delta: number, min: number, max: number) {
  const novo = valor + delta;
  if (novo > max) return min;
  if (novo < min) return max;
  return novo;
}

function iniciais(nome: string) {
  const partes = nome.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? "V") + (partes[1]?.[0] ?? "B")).toUpperCase();
}

export function ViaBusProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [contaReal, setContaReal] = useState(false);
  const [contas, setContas] = useState<Conta[]>(CONTAS_INICIAIS);
  const [veiculos, setVeiculos] = useState<Veiculo[]>(VEICULOS);
  const [linhas, setLinhas] = useState<Linha[]>(LINHAS);
  const [motoristas, setMotoristas] = useState<Motorista[]>(MOTORISTAS);
  const [fiscais, setFiscais] = useState<Fiscal[]>(FISCAIS);
  const [passageiros, setPassageiros] = useState<Passageiro[]>(PASSAGEIROS_CADASTRADOS);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(OCORRENCIAS_INICIAIS);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(NOTIFICACOES_INICIAIS);
  const [mensagens, setMensagens] = useState<Mensagem[]>(MENSAGENS_INICIAIS);
  const [favoritos, setFavoritos] = useState<string[]>(["RD-01", "RD-03"]);
  const [avisos, setAvisos] = useState<AvisoPublicado[]>(AVISOS_INICIAIS);
  const [banners, setBanners] = useState<Banner[]>(BANNERS_INICIAIS);
  const [auditoria, setAuditoria] = useState<RegistroAuditoria[]>(AUDITORIA_INICIAL);
  const [operacaoAtiva, setOperacaoAtiva] = useState(true);
  const [tema, setTema] = useState<Tema>("claro");
  const [online, setOnline] = useState(true);
  const [sequencia, setSequencia] = useState(482);
  const [segundosDesdeAtualizacao, setSegundos] = useState(0);

  // Contas demonstrativas só dão acesso a dados simulados; sessões reais são validadas pelo serviço de autenticação.
  useEffect(() => {
    let ativo = true;
    const carregarConta = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!ativo || !user) return;
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      if (!ativo || !roles?.some((r) => r.role === "user")) return;
      const { data: dados } = await supabase.from("profiles").select("name,phone,created_at").eq("user_id", user.id).maybeSingle();
      if (!ativo) return;
      const nome = dados?.name || String(user.user_metadata?.name ?? "Passageiro");
      setContaReal(true);
      setPerfil({ id: user.id, nome, email: user.email ?? "", role: "passageiro", avatarIniciais: iniciais(nome), telefone: dados?.phone ?? "", desde: dados?.created_at ? new Date(dados.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : "Hoje", status: "ativo" });
      // A ficha é criada após confirmação de e-mail, quando a sessão passa a existir.
      if (!dados) await supabase.from("profiles").upsert({ user_id: user.id, name: nome, phone: String(user.user_metadata?.phone ?? "") });
    };
    try {
      const salvo = sessionStorage.getItem("viabus-demo-perfil");
      if (salvo) {
        const usuario = JSON.parse(salvo) as UserProfile;
        if (usuario.role in PERFIS && usuario.id === PERFIS[usuario.role]?.id) setPerfil(PERFIS[usuario.role]);
      }
    } catch { sessionStorage.removeItem("viabus-demo-perfil"); }
    void carregarConta();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN" || event === "USER_UPDATED") setTimeout(() => void carregarConta(), 0);
      if (event === "SIGNED_OUT" && ativo) { setContaReal(false); setPerfil(null); }
    });
    return () => { ativo = false; subscription.unsubscribe(); };
  }, []);
  useEffect(() => {
    if (perfil && !contaReal && PERFIS[perfil.role]?.id === perfil.id) sessionStorage.setItem("viabus-demo-perfil", JSON.stringify(perfil));
  }, [perfil, contaReal]);

  // Simulação de tempo real: movimenta a frota e renova o selo "Atualizado agora".
  useEffect(() => {
    const relogio = setInterval(() => setSegundos((s) => s + 1), 1000);
    const frota = setInterval(() => {
      setSegundos(0);
      setVeiculos((atual) =>
        atual.map((v) => {
          if (v.status !== "em_rota") return v;
          return {
            ...v,
            x: Math.round(passo(v.x, (Math.random() - 0.35) * 4, 6, 92) * 10) / 10,
            y: Math.round(passo(v.y, (Math.random() - 0.5) * 3, 8, 90) * 10) / 10,
            velocidadeKmh: Math.max(
              0,
              Math.min(52, Math.round(v.velocidadeKmh + (Math.random() - 0.5) * 8)),
            ),
          };
        }),
      );
    }, 5000);
    return () => {
      clearInterval(relogio);
      clearInterval(frota);
    };
  }, []);

  // Tema (claro / escuro / sistema)
  useEffect(() => {
    if (typeof document === "undefined") return;
    const raiz = document.documentElement;
    const escuroSistema =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const escuro = tema === "escuro" || (tema === "sistema" && escuroSistema);
    raiz.classList.toggle("dark", Boolean(escuro));
  }, [tema]);

  // Status de conexão real do navegador.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ligar = () => setOnline(true);
    const desligar = () => setOnline(false);
    window.addEventListener("online", ligar);
    window.addEventListener("offline", desligar);
    setOnline(window.navigator.onLine);
    return () => {
      window.removeEventListener("online", ligar);
      window.removeEventListener("offline", desligar);
    };
  }, []);

  const entrarComo = useCallback((role: UserRole) => { void supabase.auth.signOut(); setContaReal(false); sessionStorage.setItem("viabus-demo-perfil", JSON.stringify(PERFIS[role])); setPerfil(PERFIS[role]); }, []);
  const sair = useCallback(async () => { sessionStorage.removeItem("viabus-demo-perfil"); if (contaReal) await supabase.auth.signOut(); setContaReal(false); setPerfil(null); }, [contaReal]);

  const entrar = useCallback(
    async (email: string, senha: string): Promise<Resultado> => {
      const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password: senha });
      if (error || !data.user) return { ok: false, erro: "E-mail ou senha inválidos, ou confirmação pendente." };
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", data.user.id);
      if (!roles?.some((r) => r.role === "user")) { await supabase.auth.signOut(); return { ok: false, erro: "Esta conta não tem acesso de passageiro." }; }
      sessionStorage.removeItem("viabus-demo-perfil");
      const { data: dados } = await supabase.from("profiles").select("name,phone,created_at").eq("user_id", data.user.id).maybeSingle();
      const nome = dados?.name || String(data.user.user_metadata?.name ?? "Passageiro");
      setContaReal(true);
      setPerfil({ id: data.user.id, nome, email: data.user.email ?? email, role: "passageiro", avatarIniciais: iniciais(nome), telefone: dados?.phone ?? "", desde: dados?.created_at ? new Date(dados.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" }) : "Hoje", status: "ativo" });
      if (!dados) await supabase.from("profiles").upsert({ user_id: data.user.id, name: nome, phone: String(data.user.user_metadata?.phone ?? "") });
      return { ok: true };
    },
    [],
  );

  const cadastrar = useCallback(
    async (dados: DadosCadastro): Promise<Resultado> => {
      if (dados.role !== "passageiro") return { ok: false, erro: "O cadastro público está disponível apenas para passageiros." };
      const { data, error } = await supabase.auth.signUp({ email: dados.email.trim(), password: dados.senha, options: { data: { name: dados.nome.trim(), phone: dados.telefone }, emailRedirectTo: `${window.location.origin}/login` } });
      if (error || !data.user) return { ok: false, erro: error?.message ?? "Não foi possível criar sua conta." };
      if (!data.session) return { ok: true, confirmacao: true };
      sessionStorage.removeItem("viabus-demo-perfil");
      setContaReal(true);
      setPerfil({ id: data.user.id, nome: dados.nome.trim(), email: data.user.email ?? dados.email, role: "passageiro", avatarIniciais: iniciais(dados.nome), telefone: dados.telefone, desde: "Hoje", status: "ativo" });
      await supabase.from("profiles").upsert({ user_id: data.user.id, name: dados.nome.trim(), phone: dados.telefone });
      return { ok: true, confirmacao: false };
    },
    [],
  );

  const recuperarSenha = useCallback(
    async (email: string): Promise<Resultado> => {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/recuperar-senha` });
      return error ? { ok: false, erro: error.message } : { ok: true };
    },
    [],
  );

  const atualizarPerfil = useCallback((dados: Partial<UserProfile>) => {
    setPerfil((atual) => (atual ? { ...atual, ...dados } : atual));
  }, []);

  const temPermissao = useCallback(
    (role: UserRole) => perfil?.role === role,
    [perfil],
  );

  const notificar = useCallback<ViaBusContexto["notificar"]>((dados) => {
    setNotificacoes((atual) => [
      {
        id: `not-${Date.now()}-${Math.round(Math.random() * 999)}`,
        titulo: dados.titulo,
        mensagem: dados.mensagem,
        tempo: "agora",
        lida: false,
        tom: dados.tom ?? "info",
        categoria: dados.categoria ?? "informacao",
        destino: dados.destino,
      },
      ...atual,
    ]);
  }, []);

  const registrarAuditoria = useCallback(
    (acao: string) => {
      setAuditoria((atual) => [
        {
          id: `aud-${Date.now()}`,
          usuario: perfil?.nome ?? "Sistema ViaBus",
          acao,
          data: dataAtual(),
          hora: horaAtual(),
        },
        ...atual,
      ]);
    },
    [perfil],
  );

  const registrarOcorrencia = useCallback(
    (dados: NovaOcorrencia) => {
      const proxima = sequencia + 1;
      setSequencia(proxima);
      const motorista = MOTORISTAS.find((m) => m.id === MOTORISTA_PADRAO)!;
      const nova: Ocorrencia = {
        id: `oco-${proxima}`,
        protocolo: gerarProtocolo(proxima),
        tipo: dados.tipo,
        gravidade: dados.gravidade,
        descricao: dados.descricao,
        linhaCodigo: motorista.linhaCodigo,
        veiculoCodigo: motorista.veiculoCodigo,
        motoristaId: motorista.id,
        motorista: motorista.nome,
        local: dados.local,
        localSimulado: true,
        status: "registrada",
        registradaEm: horaAtual(),
        anexos: dados.anexos ?? [],
        criadaEm: "agora",
        x: 46,
        y: 42,
      };
      setOcorrencias((atual) => [nova, ...atual]);
      notificar({
        titulo: "Nova ocorrência registrada",
        mensagem: `Protocolo ${nova.protocolo} — ${motorista.nome}, veículo ${motorista.veiculoCodigo}.`,
        destino: "fiscal",
        categoria: "ocorrencia",
        tom: "erro",
      });
      notificar({
        titulo: `Ocorrência ${nova.protocolo} enviada`,
        mensagem: "Registro enviado para a central de operações.",
        destino: "motorista",
        categoria: "ocorrencia",
        tom: "sucesso",
      });
      return nova;
    },
    [notificar, sequencia],
  );

  const avancarOcorrencia = useCallback(
    (id: string, status: StatusOcorrencia) => {
      const hora = horaAtual();
      let alvo: Ocorrencia | undefined;
      setOcorrencias((atual) =>
        atual.map((o) => {
          if (o.id !== id) return o;
          const atualizada: Ocorrencia = { ...o, status };
          if (status === "recebida") {
            atualizada.recebidaEm = hora;
            atualizada.minutosResposta = atualizada.minutosResposta ?? 1;
          }
          if (status === "em_atendimento") {
            atualizada.recebidaEm = o.recebidaEm ?? hora;
            atualizada.atendidaEm = hora;
            atualizada.fiscalResponsavel = perfil?.nome ?? o.fiscalResponsavel ?? "Central ViaBus";
          }
          if (status === "resolvida") {
            atualizada.atendidaEm = o.atendidaEm ?? hora;
          }
          if (status === "encerrada") {
            atualizada.encerradaEm = hora;
            atualizada.minutosTotal = atualizada.minutosTotal ?? 32;
          }
          alvo = atualizada;
          return atualizada;
        }),
      );
      if (!alvo) return;
      const mensagens: Partial<Record<StatusOcorrencia, string>> = {
        recebida: "Sua ocorrência foi recebida pela central.",
        em_atendimento: "Sua ocorrência está sendo atendida.",
        resolvida: "A central marcou sua ocorrência como resolvida.",
        encerrada: "Ocorrência encerrada.",
      };
      const texto = mensagens[status];
      if (texto) {
        notificar({
          titulo: `Ocorrência ${alvo.protocolo}`,
          mensagem: texto,
          destino: "motorista",
          categoria: "ocorrencia",
          tom: status === "encerrada" ? "sucesso" : "info",
        });
      }
      if (status === "em_atendimento" || status === "encerrada") {
        notificar({
          titulo: "Aviso de operação",
          mensagem: `Ocorrência ${alvo.protocolo} (${alvo.local}) pode afetar sua rota favorita.`,
          destino: "passageiro",
          categoria: "ocorrencia",
          tom: "alerta",
        });
      }
    },
    [notificar, perfil],
  );

  const marcarTodasLidas = useCallback(
    () => setNotificacoes((atual) => atual.map((n) => ({ ...n, lida: true }))),
    [],
  );
  const marcarLida = useCallback(
    (id: string) =>
      setNotificacoes((atual) => atual.map((n) => (n.id === id ? { ...n, lida: true } : n))),
    [],
  );

  const enviarMensagem = useCallback(
    (papel: Mensagem["papel"], texto: string, motoristaId = MOTORISTA_PADRAO) => {
      const motorista = MOTORISTAS.find((m) => m.id === motoristaId);
      const fiscalNome = "Carlos Henrique";
      const autor = papel === "fiscal" ? fiscalNome : (motorista?.nome ?? "Motorista");
      setMensagens((atual) => [
        ...atual,
        {
          id: `msg-${Date.now()}`,
          autor,
          papel,
          texto,
          hora: horaAtual(),
          motoristaId,
          lida: true,
        },
      ]);
      const respostaDe: Mensagem["papel"] = papel === "fiscal" ? "motorista" : "fiscal";
      const resposta =
        respostaDe === "fiscal"
          ? "Recebido aqui na central. Já estou acompanhando pelo painel."
          : "Copiado, central. Seguindo a viagem normalmente.";
      setTimeout(() => {
        setMensagens((atual) => [
          ...atual,
          {
            id: `msg-${Date.now()}-r`,
            autor: respostaDe === "fiscal" ? fiscalNome : (motorista?.nome ?? "Motorista"),
            papel: respostaDe,
            texto: resposta,
            hora: horaAtual(),
            motoristaId,
            lida: false,
          },
        ]);
      }, 1600);
    },
    [],
  );

  const marcarConversaLida = useCallback((motoristaId: string) => {
    setMensagens((atual) =>
      atual.map((m) => (m.motoristaId === motoristaId ? { ...m, lida: true } : m)),
    );
  }, []);

  const alternarFavorito = useCallback((codigo: string) => {
    setFavoritos((atual) =>
      atual.includes(codigo) ? atual.filter((c) => c !== codigo) : [...atual, codigo],
    );
  }, []);

  const atualizarVeiculo = useCallback((id: string, dados: Partial<Veiculo>) => {
    setVeiculos((atual) => atual.map((v) => (v.id === id ? { ...v, ...dados } : v)));
  }, []);

  const atualizarLinha = useCallback((id: string, dados: Partial<Linha>) => {
    setLinhas((atual) => atual.map((l) => (l.id === id ? { ...l, ...dados } : l)));
  }, []);

  const alternarSituacaoMotorista = useCallback((id: string) => {
    setMotoristas((atual) =>
      atual.map((m) =>
        m.id === id ? { ...m, situacao: m.situacao === "ativo" ? "inativo" : "ativo" } : m,
      ),
    );
  }, []);

  const alternarSituacaoFiscal = useCallback((id: string) => {
    setFiscais((atual) =>
      atual.map((f) =>
        f.id === id ? { ...f, situacao: f.situacao === "ativo" ? "inativo" : "ativo" } : f,
      ),
    );
  }, []);

  const alternarSituacaoPassageiro = useCallback((id: string) => {
    setPassageiros((atual) =>
      atual.map((p) =>
        p.id === id ? { ...p, situacao: p.situacao === "ativo" ? "inativo" : "ativo" } : p,
      ),
    );
  }, []);

  const iniciarOperacao = useCallback(() => setOperacaoAtiva(true), []);
  const finalizarOperacao = useCallback(() => setOperacaoAtiva(false), []);

  const salvarAviso = useCallback((aviso: AvisoPublicado) => {
    setAvisos((atual) => {
      const existe = atual.some((a) => a.id === aviso.id);
      return existe ? atual.map((a) => (a.id === aviso.id ? aviso : a)) : [aviso, ...atual];
    });
  }, []);
  const removerAviso = useCallback(
    (id: string) => setAvisos((atual) => atual.filter((a) => a.id !== id)),
    [],
  );

  const salvarBanner = useCallback((banner: Banner) => {
    setBanners((atual) => {
      const existe = atual.some((b) => b.id === banner.id);
      return existe ? atual.map((b) => (b.id === banner.id ? banner : b)) : [banner, ...atual];
    });
  }, []);
  const removerBanner = useCallback(
    (id: string) => setBanners((atual) => atual.filter((b) => b.id !== id)),
    [],
  );

  const notificacoesDoPapel = useMemo(() => {
    const papel = perfil?.role;
    if (!papel) return notificacoes.filter((n) => n.destino === "todos");
    return notificacoes.filter((n) => n.destino === "todos" || n.destino === papel);
  }, [notificacoes, perfil]);

  const valor = useMemo<ViaBusContexto>(
    () => ({
      perfil,
      contas,
      entrar,
      cadastrar,
      recuperarSenha,
      entrarComo,
      sair,
      atualizarPerfil,
      temPermissao,
      veiculos,
      atualizarVeiculo,
      linhas,
      atualizarLinha,
      motoristas,
      alternarSituacaoMotorista,
      fiscais,
      alternarSituacaoFiscal,
      passageiros,
      alternarSituacaoPassageiro,
      operacaoAtiva,
      iniciarOperacao,
      finalizarOperacao,
      ocorrencias,
      registrarOcorrencia,
      avancarOcorrencia,
      notificacoes: notificacoesDoPapel,
      todasNotificacoes: notificacoes,
      naoLidas: notificacoesDoPapel.filter((n) => !n.lida).length,
      marcarTodasLidas,
      marcarLida,
      notificar,
      mensagens,
      enviarMensagem,
      marcarConversaLida,
      favoritos,
      alternarFavorito,
      avisos,
      salvarAviso,
      removerAviso,
      banners,
      salvarBanner,
      removerBanner,
      auditoria,
      registrarAuditoria,
      tema,
      definirTema: setTema,
      online,
      definirOnline: setOnline,
      segundosDesdeAtualizacao,
    }),
    [
      perfil,
      contas,
      entrar,
      cadastrar,
      recuperarSenha,
      entrarComo,
      sair,
      atualizarPerfil,
      temPermissao,
      veiculos,
      atualizarVeiculo,
      linhas,
      atualizarLinha,
      motoristas,
      alternarSituacaoMotorista,
      fiscais,
      alternarSituacaoFiscal,
      passageiros,
      alternarSituacaoPassageiro,
      operacaoAtiva,
      iniciarOperacao,
      finalizarOperacao,
      ocorrencias,
      registrarOcorrencia,
      avancarOcorrencia,
      notificacoesDoPapel,
      notificacoes,
      marcarTodasLidas,
      marcarLida,
      notificar,
      mensagens,
      enviarMensagem,
      marcarConversaLida,
      favoritos,
      alternarFavorito,
      avisos,
      salvarAviso,
      removerAviso,
      banners,
      salvarBanner,
      removerBanner,
      auditoria,
      registrarAuditoria,
      tema,
      online,
      segundosDesdeAtualizacao,
    ],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}

export function useViaBus() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useViaBus precisa estar dentro de ViaBusProvider");
  return ctx;
}
