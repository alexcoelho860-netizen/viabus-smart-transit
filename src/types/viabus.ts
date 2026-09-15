// Modelos de dados do ViaBus.
// Estruturados para espelhar futuras tabelas no banco (Lovable Cloud / Supabase):
// users, profiles, drivers, inspectors, passengers, vehicles, routes, bus_stops,
// occurrences, messages, notifications, banners, traffic_alerts, favorites, trips, audit_logs.

export type UserRole = "passageiro" | "motorista" | "fiscal" | "admin";

/** Papéis equivalentes no futuro backend (RBAC). */
export const ROLE_BACKEND: Record<UserRole, string> = {
  passageiro: "passenger",
  motorista: "driver",
  fiscal: "inspector",
  admin: "admin",
};

export type StatusRegistro = "ativo" | "inativo";

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatarIniciais: string;
  telefone?: string;
  matricula?: string;
  cargo?: string;
  regiao?: string;
  desde: string;
  ultimoAcesso?: string;
  status: StatusRegistro;
}

/** Conta de demonstração (substituída por Supabase Auth no futuro). */
export interface Conta {
  email: string;
  senha: string;
  perfil: UserProfile;
}

export type Lotacao = "baixa" | "media" | "alta";

/** Rota demonstrativa ViaBus (tabela futura: routes). */
export interface Linha {
  id: string;
  codigo: string;
  nome: string;
  origem: string;
  destino: string;
  regiao: string;
  cor: string;
  intervaloMin: number;
  tarifa: number;
  atrasoMedioMin: number;
  viagensDia: number;
  ativa: boolean;
  paradas: string[];
}

export type StatusVeiculo = "em_rota" | "parado" | "manutencao" | "indisponivel";

export interface Veiculo {
  id: string;
  codigo: string;
  placa: string;
  modelo: string;
  ano: number;
  linhaCodigo: string;
  motoristaId: string;
  status: StatusVeiculo;
  lotacao: Lotacao;
  velocidadeKmh: number;
  atrasoMin: number;
  acessivel: boolean;
  /** Posição simulada no mapa, em % do container (0-100). Futuro: latitude/longitude. */
  x: number;
  y: number;
}

export interface Parada {
  id: string;
  nome: string;
  endereco: string;
  bairro: string;
  linhas: string[];
  abrigo: boolean;
  x: number;
  y: number;
}

export type StatusMotorista = "em_operacao" | "intervalo" | "offline";

export interface Motorista {
  id: string;
  nome: string;
  matricula: string;
  telefone: string;
  email: string;
  linhaCodigo: string;
  veiculoCodigo: string;
  status: StatusMotorista;
  avaliacao: number;
  viagensMes: number;
  desde: string;
  situacao: StatusRegistro;
}

export interface Fiscal {
  id: string;
  nome: string;
  matricula: string;
  telefone: string;
  email: string;
  regiao: string;
  status: "online" | "offline";
  desde: string;
  situacao: StatusRegistro;
}

export interface Passageiro {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  viagens: number;
  desde: string;
  situacao: StatusRegistro;
}

export type TipoOcorrencia =
  | "mecanico"
  | "acidente"
  | "congestionamento"
  | "via"
  | "passageiro"
  | "atraso"
  | "desvio"
  | "outro";

export type GravidadeOcorrencia = "baixa" | "media" | "alta" | "critica";

export type StatusOcorrencia =
  | "registrada"
  | "recebida"
  | "em_atendimento"
  | "resolvida"
  | "encerrada";

export interface Ocorrencia {
  id: string;
  protocolo: string;
  tipo: TipoOcorrencia;
  gravidade: GravidadeOcorrencia;
  descricao: string;
  linhaCodigo: string;
  veiculoCodigo: string;
  motoristaId: string;
  motorista: string;
  local: string;
  /** true quando a posição não vem de GPS real. */
  localSimulado: boolean;
  status: StatusOcorrencia;
  fiscalResponsavel?: string;
  /** Marcos de tempo em minutos desde o registro (protótipo, sem backend). */
  registradaEm: string;
  recebidaEm?: string;
  atendidaEm?: string;
  encerradaEm?: string;
  minutosResposta?: number;
  minutosTotal?: number;
  anexos: string[];
  criadaEm: string;
  x: number;
  y: number;
}

export type TipoAlerta = "transito" | "desvio" | "climatico" | "servico";

export interface Alerta {
  id: string;
  titulo: string;
  descricao: string;
  tipo: TipoAlerta;
  regiao: string;
  rotasAfetadas: string[];
  criadoEm: string;
}

export type CategoriaNotificacao =
  | "informacao"
  | "transito"
  | "atraso"
  | "ocorrencia"
  | "sistema";

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tempo: string;
  lida: boolean;
  tom: "info" | "sucesso" | "alerta" | "erro";
  categoria: CategoriaNotificacao;
  /** Destinatário: papel específico ou todos. */
  destino: UserRole | "todos";
}

export interface Mensagem {
  id: string;
  autor: string;
  papel: "motorista" | "fiscal";
  texto: string;
  hora: string;
  /** Conversa entre um motorista e a central; id do motorista. */
  motoristaId: string;
  lida: boolean;
}

export type PrioridadeAviso = "informacao" | "atencao" | "urgente";

export interface AvisoPublicado {
  id: string;
  titulo: string;
  mensagem: string;
  publico: UserRole | "todos";
  prioridade: PrioridadeAviso;
  ativo: boolean;
  criadoEm: string;
}

export interface Banner {
  id: string;
  titulo: string;
  descricao: string;
  imagem?: string;
  botao?: string;
  publico: UserRole | "todos";
  dataInicial: string;
  dataFinal: string;
  ativo: boolean;
}

export interface RegistroAuditoria {
  id: string;
  usuario: string;
  acao: string;
  data: string;
  hora: string;
}

export interface Viagem {
  id: string;
  linhaCodigo: string;
  origem: string;
  destino: string;
  data: string;
  hora: string;
  duracaoMin: number;
}

export interface PontoSerie {
  rotulo: string;
  valor: number;
  valorSecundario?: number;
}

export interface ServicoSistema {
  nome: string;
  situacao: "operacional" | "demonstracao" | "nao_conectado";
}
