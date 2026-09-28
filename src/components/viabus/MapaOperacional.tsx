/// <reference types="google.maps" />
import { useEffect, useMemo, useRef, useState } from "react";
import type * as Leaflet from "leaflet";
import {
  AlertTriangle,
  Ban,
  BusFront,
  Crosshair,
  LocateFixed,
  MapPin,
  Minus,
  Plus,
  TrafficCone,
  Wrench,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MOTORISTAS, PARADAS, ROTULO_TIPO } from "@/data/mock";
import {
  CENTRO_CURITIBA,
  COORDENADAS_LOCAIS,
  COORDENADAS_OCORRENCIAS,
  COORDENADAS_VEICULOS,
  TRANSITO_SIMULADO,
  type CoordenadaMapa,
} from "@/data/map-data";
import { nomeRotaPorCodigo, rotasPorCodigos } from "@/lib/viabus-display";
import { cn } from "@/lib/utils";
import type { Linha } from "@/types/viabus";
import { useViaBus } from "@/store/viabus-store";
import { BadgeGravidade, BadgeLotacao, SeloAtualizacao } from "@/components/viabus/ui-bits";

type Camada = "onibus" | "paradas" | "transito" | "ocorrencias";
type Situacao = "todos" | "normal" | "atencao" | "atrasado" | "ocorrencia";

interface DetalheMapa {
  tipo: "onibus" | "parada" | "transito" | "ocorrencia";
  titulo: string;
  linhas: string[];
  posicao: CoordenadaMapa;
  lotacao?: "baixa" | "media" | "alta";
  gravidade?: "baixa" | "media" | "alta" | "critica";
}

const CAMADAS: Array<{ valor: Camada; rotulo: string }> = [
  { valor: "onibus", rotulo: "Ônibus" },
  { valor: "paradas", rotulo: "Pontos" },
  { valor: "transito", rotulo: "Trânsito" },
  { valor: "ocorrencias", rotulo: "Ocorrências" },
];

const SITUACOES: Array<{ valor: Situacao; rotulo: string }> = [
  { valor: "todos", rotulo: "Todos" },
  { valor: "normal", rotulo: "Normal" },
  { valor: "atencao", rotulo: "Atenção" },
  { valor: "atrasado", rotulo: "Atrasado" },
  { valor: "ocorrencia", rotulo: "Com ocorrência" },
];

let carregamentoMapa: Promise<void> | null = null;

function carregarGoogleMaps() {
  if (typeof window === "undefined") return Promise.reject(new Error("Mapa indisponível no servidor"));
  if (typeof google !== "undefined" && google.maps) return Promise.resolve();
  if (carregamentoMapa) return carregamentoMapa;

  const chave = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"] as string | undefined;
  const canal = import.meta.env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] as string | undefined;
  if (!chave) return Promise.reject(new Error("Chave de renderização não disponível"));

  carregamentoMapa = new Promise<void>((resolve, reject) => {
    const callback = `initViaBusMap_${Date.now()}`;
    const janela = window as unknown as Window & Record<string, unknown>;
    janela["gm_authFailure"] = () => window.dispatchEvent(new Event("viabus-map-unavailable"));
    janela[callback] = () => {
      delete janela[callback];
      resolve();
    };
    const script = document.createElement("script");
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(chave)}&loading=async&callback=${callback}&channel=${encodeURIComponent(canal ?? "viabus")}`;
    script.onerror = () => reject(new Error("Não foi possível carregar o mapa"));
    document.head.appendChild(script);
  });
  return carregamentoMapa;
}

function corToken(nome: string, fallback: string) {
  if (typeof document === "undefined") return fallback;
  return getComputedStyle(document.documentElement).getPropertyValue(nome).trim() || fallback;
}

function iconeOcorrencia(tipo: string) {
  if (tipo === "mecanico") return Wrench;
  if (tipo === "congestionamento") return TrafficCone;
  if (tipo === "via") return Ban;
  return AlertTriangle;
}

export function MapaOperacional({ altura = "h-[460px]", compacto = false, rotaDestacada }: { altura?: string; compacto?: boolean; rotaDestacada?: Linha }) {
  const { veiculos, linhas, ocorrencias, segundosDesdeAtualizacao } = useViaBus();
  const elementoMapa = useRef<HTMLDivElement>(null);
  const mapa = useRef<google.maps.Map | null>(null);
  const elementos = useRef<Array<google.maps.Marker | google.maps.Polyline>>([]);
  const marcadorUsuario = useRef<google.maps.Marker | null>(null);
  const mapaAlternativo = useRef<Leaflet.Map | null>(null);
  const leaflet = useRef<typeof Leaflet | null>(null);
  const camadaAlternativa = useRef<Leaflet.LayerGroup | null>(null);
  const marcadorUsuarioAlternativo = useRef<Leaflet.CircleMarker | null>(null);
  const [provedor, setProvedor] = useState<"google" | "alternativo" | null>(null);
  const [ativas, setAtivas] = useState<Camada[]>(["onibus", "paradas", "transito", "ocorrencias"]);
  const [situacao, setSituacao] = useState<Situacao>("todos");
  const [detalhe, setDetalhe] = useState<DetalheMapa | null>(null);
  const [mapaPronto, setMapaPronto] = useState(false);
  const [erroMapa, setErroMapa] = useState("");
  const [localizando, setLocalizando] = useState(false);
  const [erroLocalizacao, setErroLocalizacao] = useState("");

  const ocorrenciasVisiveis = useMemo(() => ocorrencias.filter((o) => o.status !== "encerrada"), [ocorrencias]);
  const veiculosVisiveis = useMemo(() => {
    const comOcorrencia = new Set(ocorrenciasVisiveis.map((o) => o.veiculoCodigo));
    return veiculos.filter((v) => v.status === "em_rota").filter((v) => {
      if (situacao === "todos") return true;
      if (situacao === "ocorrencia") return comOcorrencia.has(v.codigo);
      if (situacao === "atrasado") return v.atrasoMin >= 10;
      if (situacao === "atencao") return v.atrasoMin >= 5 && v.atrasoMin < 10;
      return v.atrasoMin < 5;
    });
  }, [ocorrenciasVisiveis, situacao, veiculos]);

  useEffect(() => {
    let ativo = true;
    let iniciandoAlternativo = false;
    async function iniciarAlternativo() {
      if (!ativo || iniciandoAlternativo || mapaAlternativo.current || !elementoMapa.current) return;
      iniciandoAlternativo = true;
      try {
        const L = await import("leaflet");
        if (!ativo || !elementoMapa.current) return;
        elementoMapa.current.replaceChildren();
        mapa.current = null;
        leaflet.current = L;
        const alternativo = L.map(elementoMapa.current, { zoomControl: false, attributionControl: true }).setView([CENTRO_CURITIBA.lat, CENTRO_CURITIBA.lng], 12);
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "© OpenStreetMap contributors" }).addTo(alternativo);
        mapaAlternativo.current = alternativo;
        camadaAlternativa.current = L.layerGroup().addTo(alternativo);
        alternativo.on("click", () => setDetalhe(null));
        setProvedor("alternativo");
        setMapaPronto(true);
        window.setTimeout(() => { if (ativo) alternativo.invalidateSize(); }, 100);
      } catch {
        if (ativo) setErroMapa("O mapa não pôde ser carregado agora.");
      }
    }
    window.addEventListener("viabus-map-unavailable", iniciarAlternativo);
    carregarGoogleMaps()
      .then(() => {
        if (!ativo || !elementoMapa.current) return;
        mapa.current = new google.maps.Map(elementoMapa.current, {
          center: CENTRO_CURITIBA,
          zoom: 12,
          clickableIcons: false,
          disableDefaultUI: true,
          gestureHandling: "greedy",
          styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }],
        });
        mapa.current.addListener("click", () => setDetalhe(null));
        setProvedor("google");
        setMapaPronto(true);
      })
      .catch(iniciarAlternativo);
    return () => {
      ativo = false;
      window.removeEventListener("viabus-map-unavailable", iniciarAlternativo);
      mapaAlternativo.current?.remove();
      mapaAlternativo.current = null;
    };
  }, []);

  useEffect(() => {
    if (!mapaPronto || !provedor) return;
    if (provedor === "alternativo" && leaflet.current && mapaAlternativo.current && camadaAlternativa.current) {
      const L = leaflet.current;
      const camadas = camadaAlternativa.current;
      camadas.clearLayers();
      const adicionarAlternativo = (posicao: CoordenadaMapa, cor: string, titulo: string, aoClicar: () => void, simbolo: string) => {
        const marcador = L.marker([posicao.lat, posicao.lng], {
          title: titulo,
          icon: L.divIcon({ className: "viabus-marker", html: `<span style="background:${cor}">${simbolo}</span>`, iconSize: [28, 28], iconAnchor: [14, 14] }),
        });
        marcador.on("click", (e) => { L.DomEvent.stopPropagation(e); aoClicar(); });
        marcador.addTo(camadas);
      };
      const corSucesso = corToken("--success", "#22c55e");
      const corAlerta = corToken("--warning", "#f59e0b");
      const corPerigo = corToken("--danger", "#ef4444");
      if (ativas.includes("onibus")) veiculosVisiveis.forEach((v) => {
        const posicao = COORDENADAS_VEICULOS[veiculos.findIndex((item) => item.id === v.id)] ?? CENTRO_CURITIBA;
        const motorista = MOTORISTAS.find((m) => m.id === v.motoristaId);
        adicionarAlternativo(posicao, ocorrenciasVisiveis.some((o) => o.veiculoCodigo === v.codigo) ? corPerigo : v.atrasoMin >= 5 ? corAlerta : corSucesso, `Ônibus ${v.codigo}`, () => {
          mapaAlternativo.current?.panTo([posicao.lat, posicao.lng]);
          setDetalhe({ tipo: "onibus", titulo: `Ônibus ${v.codigo}`, linhas: [nomeRotaPorCodigo(v.linhaCodigo, linhas), `Motorista: ${motorista?.nome ?? "Não informado"}`, `${v.velocidadeKmh} km/h · previsão em ${Math.max(2, v.atrasoMin + 2)} min`, `Atualizado há ${segundosDesdeAtualizacao}s`], posicao, lotacao: v.lotacao });
        }, "🚌");
      });
      if (ativas.includes("paradas")) PARADAS.forEach((p) => {
        const posicao = COORDENADAS_LOCAIS[p.nome];
        if (posicao) adicionarAlternativo(posicao, corToken("--brand-ink", "#0f172a"), p.nome, () => setDetalhe({ tipo: "parada", titulo: p.nome, linhas: [p.endereco, ...rotasPorCodigos(p.linhas, linhas), p.abrigo ? "Ponto com abrigo" : "Ponto sem abrigo"], posicao }), "•");
      });
      if (ativas.includes("transito")) TRANSITO_SIMULADO.forEach((t) => adicionarAlternativo(t.posicao, corAlerta, `Trânsito em ${t.via}`, () => setDetalhe({ tipo: "transito", titulo: `Trânsito ${t.nivel.toLowerCase()}`, linhas: [t.via, "Condição simulada para avaliação do produto"], posicao: t.posicao }), "!") );
      if (ativas.includes("ocorrencias")) ocorrenciasVisiveis.forEach((o) => {
        const posicao = COORDENADAS_OCORRENCIAS[ocorrencias.findIndex((item) => item.id === o.id)] ?? COORDENADAS_VEICULOS[veiculos.findIndex((v) => v.codigo === o.veiculoCodigo)] ?? CENTRO_CURITIBA;
        adicionarAlternativo(posicao, corPerigo, ROTULO_TIPO[o.tipo], () => setDetalhe({ tipo: "ocorrencia", titulo: ROTULO_TIPO[o.tipo], linhas: [o.local, `${o.registradaEm} · Veículo ${o.veiculoCodigo}`, nomeRotaPorCodigo(o.linhaCodigo, linhas), `Status: ${o.status.replaceAll("_", " ")}`], posicao, gravidade: o.gravidade }), "!");
      });
      if (rotaDestacada) {
        const caminho = rotaDestacada.paradas.map((p) => COORDENADAS_LOCAIS[p]).filter((p): p is CoordenadaMapa => Boolean(p));
        if (caminho.length > 1) {
          const coordenadas = caminho.map((p): [number, number] => [p.lat, p.lng]);
          L.polyline(coordenadas, { color: corToken("--primary", "#2563eb"), weight: 5 }).addTo(camadas);
          mapaAlternativo.current.fitBounds(L.latLngBounds(coordenadas), { padding: [24, 24], maxZoom: 13 });
        }
      } else if (detalhe?.tipo === "onibus") {
        const veiculo = veiculos.find((v) => detalhe.titulo === `Ônibus ${v.codigo}`);
        const rota = linhas.find((item) => item.codigo === veiculo?.linhaCodigo);
        const caminho = rota?.paradas.map((p) => COORDENADAS_LOCAIS[p]).filter((p): p is CoordenadaMapa => Boolean(p)) ?? [];
        if (caminho.length > 1) L.polyline(caminho.map((p): [number, number] => [p.lat, p.lng]), { color: corToken("--primary", "#2563eb"), weight: 5 }).addTo(camadas);
      }
      return;
    }
    if (!mapa.current) return;
    elementos.current.forEach((item) => item.setMap(null));
    elementos.current = [];
    const adicionar = (posicao: CoordenadaMapa, cor: string, rotulo: string, aoClicar: () => void, forma?: google.maps.SymbolPath) => {
      const marker = new google.maps.Marker({
        map: mapa.current,
        position: posicao,
        title: rotulo,
        icon: {
          path: forma ?? google.maps.SymbolPath.CIRCLE,
          fillColor: cor,
          fillOpacity: 1,
          strokeColor: corToken("--card", "#ffffff"),
          strokeWeight: 2,
          scale: forma ? 6 : 7,
        },
      });
      marker.addListener("click", aoClicar);
      elementos.current.push(marker);
    };

    const corPrimaria = corToken("--primary", "#2563eb");
    const corSucesso = corToken("--success", "#22c55e");
    const corAlerta = corToken("--warning", "#f59e0b");
    const corPerigo = corToken("--danger", "#ef4444");
    const corNeutra = corToken("--brand-ink", "#0f172a");
    const comOcorrencia = new Set(ocorrenciasVisiveis.map((o) => o.veiculoCodigo));

    if (ativas.includes("onibus")) {
      veiculosVisiveis.forEach((v) => {
        const indice = veiculos.findIndex((item) => item.id === v.id);
        const posicao = COORDENADAS_VEICULOS[indice] ?? CENTRO_CURITIBA;
        const motorista = MOTORISTAS.find((m) => m.id === v.motoristaId);
        const cor = comOcorrencia.has(v.codigo) ? corPerigo : v.atrasoMin >= 10 ? corAlerta : v.atrasoMin >= 5 ? corAlerta : corSucesso;
        adicionar(posicao, cor, `Ônibus ${v.codigo}`, () => {
          mapa.current?.panTo(posicao);
          setDetalhe({
            tipo: "onibus",
            titulo: `Ônibus ${v.codigo}`,
            linhas: [
              nomeRotaPorCodigo(v.linhaCodigo, linhas),
              `Motorista: ${motorista?.nome ?? "Não informado"}`,
              `${v.velocidadeKmh} km/h · previsão em ${Math.max(2, v.atrasoMin + 2)} min`,
              `Atualizado há ${segundosDesdeAtualizacao}s`,
            ],
            posicao,
            lotacao: v.lotacao,
          });
        });
      });
    }

    if (ativas.includes("paradas")) {
      PARADAS.forEach((p) => {
        const posicao = COORDENADAS_LOCAIS[p.nome];
        if (!posicao) return;
        adicionar(posicao, corNeutra, p.nome, () => setDetalhe({
          tipo: "parada",
          titulo: p.nome,
          linhas: [p.endereco, ...rotasPorCodigos(p.linhas, linhas), p.abrigo ? "Ponto com abrigo" : "Ponto sem abrigo"],
          posicao,
        }));
      });
    }

    if (ativas.includes("transito")) {
      TRANSITO_SIMULADO.forEach((t) => adicionar(t.posicao, corAlerta, `Trânsito em ${t.via}`, () => setDetalhe({
        tipo: "transito",
        titulo: `Trânsito ${t.nivel.toLowerCase()}`,
        linhas: [t.via, "Condição simulada para avaliação do produto"],
        posicao: t.posicao,
      }), google.maps.SymbolPath.BACKWARD_CLOSED_ARROW));
    }

    if (ativas.includes("ocorrencias")) {
      ocorrenciasVisiveis.forEach((o) => {
        const indice = ocorrencias.findIndex((item) => item.id === o.id);
        const posicao = COORDENADAS_OCORRENCIAS[indice] ?? COORDENADAS_VEICULOS[veiculos.findIndex((v) => v.codigo === o.veiculoCodigo)] ?? CENTRO_CURITIBA;
        adicionar(posicao, corPerigo, `${ROTULO_TIPO[o.tipo]} — ${o.protocolo}`, () => setDetalhe({
          tipo: "ocorrencia",
          titulo: ROTULO_TIPO[o.tipo],
          linhas: [o.local, `${o.registradaEm} · Veículo ${o.veiculoCodigo}`, nomeRotaPorCodigo(o.linhaCodigo, linhas), `Status: ${o.status.replaceAll("_", " ")}`],
          posicao,
          gravidade: o.gravidade,
        }), google.maps.SymbolPath.BACKWARD_CLOSED_ARROW);
      });
    }

    if (rotaDestacada) {
      const caminho = rotaDestacada.paradas.map((p) => COORDENADAS_LOCAIS[p]).filter((p): p is CoordenadaMapa => Boolean(p));
      if (caminho.length > 1) {
        elementos.current.push(new google.maps.Polyline({ map: mapa.current, path: caminho, strokeColor: corPrimaria, strokeOpacity: 0.85, strokeWeight: 5 }));
        const limites = new google.maps.LatLngBounds();
        caminho.forEach((p) => limites.extend(p));
        mapa.current.fitBounds(limites, 24);
      }
    } else if (detalhe?.tipo === "onibus") {
      const linha = veiculos.find((v) => detalhe.titulo.includes(v.codigo));
      const rota = linhas.find((item) => item.codigo === linha?.linhaCodigo);
      if (rota) {
        const caminho = rota.paradas.map((p) => COORDENADAS_LOCAIS[p]).filter((p): p is CoordenadaMapa => Boolean(p));
        if (caminho.length > 1) {
          const polyline = new google.maps.Polyline({ map: mapa.current, path: caminho, strokeColor: corPrimaria, strokeOpacity: 0.85, strokeWeight: 5 });
          elementos.current.push(polyline);
        }
      }
    }
  }, [ativas, detalhe?.tipo, detalhe?.titulo, linhas, mapaPronto, provedor, ocorrencias, ocorrenciasVisiveis, rotaDestacada, segundosDesdeAtualizacao, veiculos, veiculosVisiveis]);

  function alternar(camada: Camada) {
    setAtivas((atual) => atual.includes(camada) ? atual.filter((item) => item !== camada) : [...atual, camada]);
  }

  function localizar() {
    setErroLocalizacao("");
    if (!navigator.geolocation) {
      setErroLocalizacao("Localização não disponível neste dispositivo.");
      return;
    }
    setLocalizando(true);
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      const posicao = { lat: coords.latitude, lng: coords.longitude };
      mapa.current?.panTo(posicao);
      mapa.current?.setZoom(15);
      mapaAlternativo.current?.setView([posicao.lat, posicao.lng], 15);
      marcadorUsuario.current?.setMap(null);
      if (mapa.current) marcadorUsuario.current = new google.maps.Marker({ map: mapa.current, position: posicao, title: "Sua localização" });
      if (mapaAlternativo.current && leaflet.current) {
        marcadorUsuarioAlternativo.current?.remove();
        marcadorUsuarioAlternativo.current = leaflet.current.circleMarker([posicao.lat, posicao.lng], { radius: 8, color: corToken("--primary", "#2563eb"), fillOpacity: 0.8 }).addTo(mapaAlternativo.current);
      }
      setLocalizando(false);
    }, () => {
      setErroLocalizacao("Localização não disponível. Verifique a permissão do navegador.");
      setLocalizando(false);
    }, { enableHighAccuracy: true, timeout: 8000 });
  }

  const IconeDetalhe = detalhe?.tipo === "ocorrencia" ? iconeOcorrencia(ocorrenciasVisiveis.find((o) => ROTULO_TIPO[o.tipo] === detalhe.titulo)?.tipo ?? "outro") : detalhe?.tipo === "onibus" ? BusFront : detalhe?.tipo === "transito" ? TrafficCone : MapPin;

  return (
    <Card className="gap-0 overflow-hidden rounded-lg border-border/70 p-0 shadow-soft">
      <div className="border-b border-border/70 bg-card p-3 sm:p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-bold">Mapa operacional</h2>
            <p className="truncate text-xs text-muted-foreground">Acompanhe a operação do transporte em Curitiba.</p>
          </div>
          <SeloAtualizacao />
        </div>
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {CAMADAS.map((item) => (
            <Button key={item.valor} type="button" size="sm" variant={ativas.includes(item.valor) ? "default" : "outline"} className="shrink-0 rounded-full" aria-pressed={ativas.includes(item.valor)} onClick={() => alternar(item.valor)}>
              {item.rotulo}
            </Button>
          ))}
        </div>
        {!compacto && <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
          {SITUACOES.map((item) => (
            <Button key={item.valor} type="button" size="sm" variant={situacao === item.valor ? "secondary" : "ghost"} className="shrink-0 rounded-full" aria-pressed={situacao === item.valor} onClick={() => setSituacao(item.valor)}>
              {item.rotulo}
            </Button>
          ))}
        </div>}
      </div>

      <div className={cn("relative w-full overflow-hidden bg-muted", altura)}>
        <div ref={elementoMapa} className="absolute inset-0" aria-label="Mapa geográfico de Curitiba" />
        {!mapaPronto && !erroMapa && <div className="absolute inset-0 grid place-items-center bg-muted"><p className="text-sm text-muted-foreground">Carregando mapa de Curitiba…</p></div>}
        {erroMapa && <div className="absolute inset-0 grid place-items-center bg-muted p-6 text-center"><div><AlertTriangle className="mx-auto size-8 text-warning"/><p className="mt-3 font-semibold">{erroMapa}</p><Button className="mt-4" variant="outline" onClick={() => window.location.reload()}>Tentar novamente</Button></div></div>}

        <div className="absolute right-3 top-3 flex flex-col gap-2">
          <Button size="icon" variant="secondary" className="shadow-lift" aria-label="Aumentar zoom" onClick={() => { mapa.current?.setZoom((mapa.current.getZoom() ?? 12) + 1); mapaAlternativo.current?.zoomIn(); }}><Plus /></Button>
          <Button size="icon" variant="secondary" className="shadow-lift" aria-label="Diminuir zoom" onClick={() => { mapa.current?.setZoom((mapa.current.getZoom() ?? 12) - 1); mapaAlternativo.current?.zoomOut(); }}><Minus /></Button>
          <Button size="icon" variant="secondary" className="shadow-lift" aria-label="Centralizar em Curitiba" onClick={() => { mapa.current?.panTo(CENTRO_CURITIBA); mapa.current?.setZoom(12); mapaAlternativo.current?.setView([CENTRO_CURITIBA.lat, CENTRO_CURITIBA.lng], 12); }}><Crosshair /></Button>
          <Button size="icon" variant="secondary" className="shadow-lift" aria-label="Usar minha localização" disabled={localizando} onClick={localizar}><LocateFixed /></Button>
        </div>

        {erroLocalizacao && <div className="absolute left-3 right-16 top-3 rounded-lg border border-border bg-card p-3 text-xs shadow-lift sm:right-auto sm:max-w-sm">{erroLocalizacao}</div>}

        {detalhe && <Card className="absolute inset-x-3 bottom-3 gap-2 rounded-lg border-border/70 p-4 shadow-lift sm:left-4 sm:right-auto sm:max-w-sm">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary"><IconeDetalhe className="size-4" /></span>
            <div className="min-w-0 flex-1">
              <p className="font-bold">{detalhe.titulo}</p>
              {detalhe.linhas.map((linha) => <p key={linha} className="mt-0.5 text-xs text-muted-foreground">{linha}</p>)}
              <div className="mt-2 flex flex-wrap gap-2">{detalhe.lotacao && <BadgeLotacao lotacao={detalhe.lotacao} />}{detalhe.gravidade && <BadgeGravidade gravidade={detalhe.gravidade} />}</div>
            </div>
            <Button size="icon" variant="ghost" className="size-8" aria-label="Fechar detalhes" onClick={() => setDetalhe(null)}><X /></Button>
          </div>
        </Card>}
      </div>

      {!compacto && <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border/70 bg-card px-4 py-3 text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">Situação:</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-2 rounded-full bg-success" /> Normal</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-2 rounded-full bg-warning" /> Atenção ou atraso</span>
        <span className="inline-flex items-center gap-1.5"><i className="size-2 rounded-full bg-danger" /> Ocorrência</span>
        <span className="sm:ml-auto">Posições operacionais simuladas sobre mapa real.</span>
      </div>}
    </Card>
  );
}