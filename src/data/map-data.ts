export interface CoordenadaMapa {
  lat: number;
  lng: number;
}

export const CENTRO_CURITIBA: CoordenadaMapa = { lat: -25.4284, lng: -49.2733 };

/** Coordenadas aproximadas de locais públicos reais; a operação exibida continua simulada. */
export const COORDENADAS_LOCAIS: Record<string, CoordenadaMapa> = {
  "Terminal Pinheirinho": { lat: -25.5328, lng: -49.2942 },
  "Av. Winston Churchill — Capão Raso": { lat: -25.5022, lng: -49.2938 },
  "Terminal Capão Raso": { lat: -25.5075, lng: -49.2951 },
  "Av. República Argentina — Portão": { lat: -25.4776, lng: -49.2927 },
  "Terminal Portão": { lat: -25.4782, lng: -49.2929 },
  "Av. Sete de Setembro — Rebouças": { lat: -25.4434, lng: -49.2668 },
  "Praça Rui Barbosa — Centro": { lat: -25.4371, lng: -49.2743 },
  "Praça Rui Barbosa": { lat: -25.4371, lng: -49.2743 },
  "Terminal Boqueirão": { lat: -25.5057, lng: -49.2373 },
  "Av. Marechal Floriano Peixoto — Hauer": { lat: -25.4766, lng: -49.2521 },
  "Terminal Hauer": { lat: -25.4764, lng: -49.252 },
  "Praça Carlos Gomes — Centro": { lat: -25.435, lng: -49.2692 },
  "Terminal Cabral": { lat: -25.4088, lng: -49.252 },
  "Av. Paraná — Juvevê": { lat: -25.4141, lng: -49.2554 },
  "Praça do Centro Cívico": { lat: -25.4167, lng: -49.2684 },
  "Rua Presidente Faria — Centro": { lat: -25.426, lng: -49.268 },
  "Praça Tiradentes — Centro": { lat: -25.4292, lng: -49.2715 },
  "Terminal Campo Comprido": { lat: -25.4488, lng: -49.3538 },
  "Av. Manoel Ribas — Santa Felicidade": { lat: -25.4094, lng: -49.319 },
  "Terminal Campina do Siqueira": { lat: -25.438, lng: -49.3054 },
  "Av. Cândido de Abreu — Centro Cívico": { lat: -25.4188, lng: -49.2687 },
  "Terminal Carmo": { lat: -25.4988, lng: -49.2372 },
  "Terminal CIC": { lat: -25.4945, lng: -49.3348 },
  "Centro — São José dos Pinhais": { lat: -25.5347, lng: -49.2064 },
  "Centro — Pinhais": { lat: -25.4444, lng: -49.1927 },
  "Centro — Colombo": { lat: -25.2917, lng: -49.2242 },
  "Centro — Araucária": { lat: -25.592, lng: -49.4078 },
};

export const COORDENADAS_VEICULOS: CoordenadaMapa[] = [
  { lat: -25.4658, lng: -49.2874 },
  { lat: -25.4592, lng: -49.2561 },
  { lat: -25.4189, lng: -49.2571 },
  { lat: -25.4439, lng: -49.3162 },
  { lat: -25.5098, lng: -49.2298 },
  { lat: -25.4495, lng: -49.2174 },
];

export const COORDENADAS_OCORRENCIAS: CoordenadaMapa[] = [
  { lat: -25.4434, lng: -49.2668 },
  { lat: -25.505, lng: -49.2305 },
  { lat: -25.4776, lng: -49.2927 },
  { lat: -25.4088, lng: -49.252 },
  { lat: -25.4766, lng: -49.2521 },
];

export const TRANSITO_SIMULADO = [
  { id: "tr-1", posicao: { lat: -25.4434, lng: -49.2668 }, nivel: "Lento", via: "Av. Sete de Setembro — Rebouças" },
  { id: "tr-2", posicao: { lat: -25.4371, lng: -49.2743 }, nivel: "Intenso", via: "Praça Rui Barbosa — Centro" },
  { id: "tr-3", posicao: { lat: -25.5022, lng: -49.2938 }, nivel: "Lento", via: "Av. Winston Churchill — Capão Raso" },
];