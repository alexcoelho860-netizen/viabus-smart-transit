import { useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { AlertTriangle, Bus, MapPin, Route as RouteIcon, UserSquare2 } from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { PARADAS, ROTULO_TIPO } from "@/data/mock";
import { nomeRota } from "@/lib/viabus-display";
import { useViaBus } from "@/store/viabus-store";

/** Pesquisa global: rotas, veículos, motoristas, paradas, ocorrências e protocolos. */
export function BuscaGlobal({ aberta, aoFechar }: { aberta: boolean; aoFechar: () => void }) {
  const { linhas, veiculos, motoristas, ocorrencias, perfil } = useViaBus();
  const [termo, setTermo] = useState("");
  const navigate = useNavigate();

  const papel = perfil?.role ?? "passageiro";

  const resultados = useMemo(() => {
    const t = termo.trim().toLowerCase();
    const filtra = (texto: string) => !t || texto.toLowerCase().includes(t);
    return {
      rotas: linhas.filter((l) => filtra(`${l.codigo} ${l.nome} ${l.origem} ${l.destino}`)).slice(0, 5),
      veiculos: veiculos.filter((v) => filtra(`${v.codigo} ${v.placa} ${v.modelo}`)).slice(0, 5),
      motoristas: motoristas.filter((m) => filtra(`${m.nome} ${m.matricula}`)).slice(0, 5),
      paradas: PARADAS.filter((p) => filtra(`${p.nome} ${p.bairro} ${p.endereco}`)).slice(0, 5),
      ocorrencias: ocorrencias
        .filter((o) => filtra(`${o.protocolo} ${o.local} ${ROTULO_TIPO[o.tipo]}`))
        .slice(0, 5),
    };
  }, [linhas, motoristas, ocorrencias, termo, veiculos]);

  function ir(destino: "rotas" | "veiculos" | "motoristas" | "paradas" | "ocorrencias") {
    aoFechar();
    if (papel === "admin") {
      const mapa = {
        rotas: "/admin/rotas",
        veiculos: "/admin/veiculos",
        motoristas: "/admin/motoristas",
        paradas: "/admin/rotas",
        ocorrencias: "/admin/ocorrencias",
      } as const;
      navigate({ to: mapa[destino] });
      return;
    }
    if (papel === "fiscal") {
      const mapa = {
        rotas: "/fiscal/mapa",
        veiculos: "/fiscal/veiculos",
        motoristas: "/fiscal/motoristas",
        paradas: "/fiscal/mapa",
        ocorrencias: "/fiscal/ocorrencias",
      } as const;
      navigate({ to: mapa[destino] });
      return;
    }
    if (papel === "motorista") {
      navigate({ to: destino === "ocorrencias" ? "/motorista/historico" : "/motorista/rota" });
      return;
    }
    const mapa = {
      rotas: "/passageiro/linhas",
      veiculos: "/passageiro/mapa",
      motoristas: "/passageiro/mapa",
      paradas: "/passageiro/pontos",
      ocorrencias: "/passageiro/notificacoes",
    } as const;
    navigate({ to: mapa[destino] });
  }

  return (
    <CommandDialog open={aberta} onOpenChange={(v) => (v ? undefined : aoFechar())}>
      <CommandInput
        placeholder="Buscar rota, veículo, motorista, parada ou protocolo..."
        value={termo}
        onValueChange={setTermo}
      />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>

        {resultados.rotas.length > 0 && (
          <CommandGroup heading="Rotas">
            {resultados.rotas.map((l) => (
              <CommandItem key={l.id} onSelect={() => ir("rotas")}>
                <RouteIcon className="size-4" /> {nomeRota(l)}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {resultados.veiculos.length > 0 && (
          <CommandGroup heading="Veículos">
            {resultados.veiculos.map((v) => (
              <CommandItem key={v.id} onSelect={() => ir("veiculos")}>
                <Bus className="size-4" /> {v.codigo} · {v.placa}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {resultados.motoristas.length > 0 && (
          <CommandGroup heading="Motoristas">
            {resultados.motoristas.map((m) => (
              <CommandItem key={m.id} onSelect={() => ir("motoristas")}>
                <UserSquare2 className="size-4" /> {m.nome} · {m.matricula}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {resultados.paradas.length > 0 && (
          <CommandGroup heading="Pontos e terminais">
            {resultados.paradas.map((p) => (
              <CommandItem key={p.id} onSelect={() => ir("paradas")}>
                <MapPin className="size-4" /> {p.nome} · {p.bairro}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {resultados.ocorrencias.length > 0 && (
          <CommandGroup heading="Ocorrências e protocolos">
            {resultados.ocorrencias.map((o) => (
              <CommandItem key={o.id} onSelect={() => ir("ocorrencias")}>
                <AlertTriangle className="size-4" /> {o.protocolo} — {ROTULO_TIPO[o.tipo]}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
