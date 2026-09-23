import type { Linha } from "@/types/viabus";

export function nomeRota(linha: Linha) {
  return linha.nome.replace(/^Rota demonstrativa\s*[—-]\s*/i, "");
}

export function nomeRotaPorCodigo(codigo: string, linhas: Linha[]) {
  const linha = linhas.find((item) => item.codigo === codigo);
  return linha ? nomeRota(linha) : "Rota urbana";
}

export function rotasPorCodigos(codigos: string[], linhas: Linha[]) {
  return codigos.map((codigo) => nomeRotaPorCodigo(codigo, linhas));
}