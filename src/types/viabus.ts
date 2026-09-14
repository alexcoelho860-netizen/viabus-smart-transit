// Modelos de dados do ViaBus.
// Estruturados para espelhar futuras tabelas no banco (Lovable Cloud / Supabase).

export type UserRole = "passageiro" | "motorista" | "fiscal" | "admin";

export interface UserProfile {
  id: string;
  nome: string;
  email: string;
  role: UserRole;
  avatarIniciais: string;
  telefone?: string;
  matricula?: string;
  desde: string;
}

export type Lotacao = "baixa" | "media" | "alta";

export interface Linha {
  id: string;
  codigo: string;
  nome: string;
  origem: string;
  destino: string;
  cor: string;
  intervaloMin: number;
  tarifa: number;
  atrasoMedioMin: number;
  viagensDia: number;
  ativa: boolean;
  paradas: string[];
}

export type StatusVeiculo = "em_rota" | "garagem" | "manutencao";

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
  /** Posição no mapa operacional, em % do container (0-100). */
  x: number;
  y: number;
}

export interface Parada {
  id: string;
  nome: string;
  endereco: string;
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
  linhaCodigo: string;
  veiculoCodigo: string;
  status: StatusMotorista;
  avaliacao: number;
  viagensMes: number;
  desde: string;
}

export type TipoOcorrencia =
  | "mecanico"
  | "acidente"
  | "congestionamento"
  | "via"
  | "passageiro"
  | "outro";

export type GravidadeOcorrencia = "baixa" | "media" | "alta" | "critica";

export type StatusOcorrencia = "aberta" | "em_atendimento" | "encerrada";

export interface Ocorrencia {
  id: string;
  protocolo: string;
  tipo: TipoOcorrencia;
  gravidade: GravidadeOcorrencia;
  descricao: string;
  linhaCodigo: string;
  veiculoCodigo: string;
  motorista: string;
  local: string;
  status: StatusOcorrencia;
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
  criadoEm: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tempo: string;
  lida: boolean;
  tom: "info" | "sucesso" | "alerta" | "erro";
}

export interface Mensagem {
  id: string;
  autor: string;
  papel: "motorista" | "fiscal";
  texto: string;
  hora: string;
}

export interface PontoSerie {
  rotulo: string;
  valor: number;
  valorSecundario?: number;
}
