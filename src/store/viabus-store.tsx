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
  MENSAGENS_INICIAIS,
  NOTIFICACOES_INICIAIS,
  OCORRENCIAS_INICIAIS,
  PERFIS,
  VEICULOS,
  gerarProtocolo,
} from "@/data/mock";
import type {
  GravidadeOcorrencia,
  Mensagem,
  Notificacao,
  Ocorrencia,
  TipoOcorrencia,
  UserProfile,
  UserRole,
  Veiculo,
} from "@/types/viabus";

interface NovaOcorrencia {
  tipo: TipoOcorrencia;
  gravidade: GravidadeOcorrencia;
  descricao: string;
  local: string;
}

interface ViaBusContexto {
  perfil: UserProfile | null;
  entrarComo: (role: UserRole) => void;
  sair: () => void;

  veiculos: Veiculo[];
  ocorrencias: Ocorrencia[];
  registrarOcorrencia: (dados: NovaOcorrencia) => Ocorrencia;
  atualizarStatusOcorrencia: (id: string, status: Ocorrencia["status"]) => void;

  notificacoes: Notificacao[];
  naoLidas: number;
  marcarTodasLidas: () => void;
  marcarLida: (id: string) => void;

  mensagens: Mensagem[];
  enviarMensagem: (papel: Mensagem["papel"], texto: string) => void;

  favoritos: string[];
  alternarFavorito: (codigo: string) => void;

  segundosDesdeAtualizacao: number;
}

const Ctx = createContext<ViaBusContexto | null>(null);

function horaAgora() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function passo(valor: number, delta: number, min: number, max: number) {
  const novo = valor + delta;
  if (novo > max) return min;
  if (novo < min) return max;
  return novo;
}

export function ViaBusProvider({ children }: { children: ReactNode }) {
  const [perfil, setPerfil] = useState<UserProfile | null>(null);
  const [veiculos, setVeiculos] = useState<Veiculo[]>(VEICULOS);
  const [ocorrencias, setOcorrencias] = useState<Ocorrencia[]>(OCORRENCIAS_INICIAIS);
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>(NOTIFICACOES_INICIAIS);
  const [mensagens, setMensagens] = useState<Mensagem[]>(MENSAGENS_INICIAIS);
  const [favoritos, setFavoritos] = useState<string[]>(["203", "301"]);
  const [sequencia, setSequencia] = useState(482);
  const [segundosDesdeAtualizacao, setSegundos] = useState(0);

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
            velocidadeKmh: Math.max(0, Math.min(52, Math.round(v.velocidadeKmh + (Math.random() - 0.5) * 8))),
          };
        }),
      );
    }, 5000);
    return () => {
      clearInterval(relogio);
      clearInterval(frota);
    };
  }, []);

  const entrarComo = useCallback((role: UserRole) => setPerfil(PERFIS[role]), []);
  const sair = useCallback(() => setPerfil(null), []);

  const registrarOcorrencia = useCallback(
    (dados: NovaOcorrencia) => {
      const proxima = sequencia + 1;
      setSequencia(proxima);
      const nova: Ocorrencia = {
        id: `oco-${proxima}`,
        protocolo: gerarProtocolo(proxima),
        tipo: dados.tipo,
        gravidade: dados.gravidade,
        descricao: dados.descricao,
        linhaCodigo: "203",
        veiculoCodigo: "4821",
        motorista: "João da Silva",
        local: dados.local || "Av. Brasil, altura do nº 1200",
        status: "aberta",
        criadaEm: "agora",
        x: 34,
        y: 46,
      };
      setOcorrencias((atual) => [nova, ...atual]);
      setNotificacoes((atual) => [
        {
          id: `not-${proxima}`,
          titulo: `Ocorrência ${nova.protocolo}`,
          mensagem: `Registro enviado para a central de operações.`,
          tempo: "agora",
          lida: false,
          tom: "alerta",
        },
        ...atual,
      ]);
      return nova;
    },
    [sequencia],
  );

  const atualizarStatusOcorrencia = useCallback((id: string, status: Ocorrencia["status"]) => {
    setOcorrencias((atual) => atual.map((o) => (o.id === id ? { ...o, status } : o)));
  }, []);

  const marcarTodasLidas = useCallback(
    () => setNotificacoes((atual) => atual.map((n) => ({ ...n, lida: true }))),
    [],
  );
  const marcarLida = useCallback(
    (id: string) => setNotificacoes((atual) => atual.map((n) => (n.id === id ? { ...n, lida: true } : n))),
    [],
  );

  const enviarMensagem = useCallback((papel: Mensagem["papel"], texto: string) => {
    const autor = papel === "fiscal" ? "Carla Nogueira" : "João da Silva";
    setMensagens((atual) => [
      ...atual,
      { id: `msg-${Date.now()}`, autor, papel, texto, hora: horaAgora() },
    ]);
    const respostaDe: Mensagem["papel"] = papel === "fiscal" ? "motorista" : "fiscal";
    const resposta =
      respostaDe === "fiscal"
        ? "Recebido aqui na central. Já estou acompanhando pelo painel."
        : "Copiado, fiscal. Seguindo a viagem normalmente.";
    setTimeout(() => {
      setMensagens((atual) => [
        ...atual,
        {
          id: `msg-${Date.now()}-r`,
          autor: respostaDe === "fiscal" ? "Carla Nogueira" : "João da Silva",
          papel: respostaDe,
          texto: resposta,
          hora: horaAgora(),
        },
      ]);
    }, 1600);
  }, []);

  const alternarFavorito = useCallback((codigo: string) => {
    setFavoritos((atual) =>
      atual.includes(codigo) ? atual.filter((c) => c !== codigo) : [...atual, codigo],
    );
  }, []);

  const valor = useMemo<ViaBusContexto>(
    () => ({
      perfil,
      entrarComo,
      sair,
      veiculos,
      ocorrencias,
      registrarOcorrencia,
      atualizarStatusOcorrencia,
      notificacoes,
      naoLidas: notificacoes.filter((n) => !n.lida).length,
      marcarTodasLidas,
      marcarLida,
      mensagens,
      enviarMensagem,
      favoritos,
      alternarFavorito,
      segundosDesdeAtualizacao,
    }),
    [
      perfil,
      entrarComo,
      sair,
      veiculos,
      ocorrencias,
      registrarOcorrencia,
      atualizarStatusOcorrencia,
      notificacoes,
      marcarTodasLidas,
      marcarLida,
      mensagens,
      enviarMensagem,
      favoritos,
      alternarFavorito,
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
