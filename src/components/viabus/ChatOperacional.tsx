import { useEffect, useRef, useState } from "react";
import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RESPOSTAS_RAPIDAS_FISCAL, RESPOSTAS_RAPIDAS_MOTORISTA } from "@/data/mock";
import { cn } from "@/lib/utils";
import { useViaBus } from "@/store/viabus-store";

export function ChatOperacional({ papel }: { papel: "motorista" | "fiscal" }) {
  const { mensagens, enviarMensagem } = useViaBus();
  const [texto, setTexto] = useState("");
  const fim = useRef<HTMLDivElement>(null);

  const interlocutor = papel === "motorista" ? "Carla Nogueira" : "João da Silva";
  const funcao = papel === "motorista" ? "Fiscal de operações" : "Motorista · Veículo 4821";
  const rapidas = papel === "motorista" ? RESPOSTAS_RAPIDAS_MOTORISTA : RESPOSTAS_RAPIDAS_FISCAL;

  useEffect(() => {
    fim.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensagens]);

  function enviar(valor: string) {
    const limpo = valor.trim();
    if (!limpo) return;
    enviarMensagem(papel, limpo);
    setTexto("");
  }

  return (
    <Card className="flex h-[calc(100vh-14rem)] min-h-[26rem] flex-col gap-0 overflow-hidden rounded-2xl border-border/70 p-0 shadow-soft">
      <div className="flex items-center gap-3 border-b border-border/70 px-4 py-3">
        <span className="relative grid size-10 place-items-center rounded-full bg-primary/10 font-bold text-primary">
          {interlocutor
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
          <span className="absolute bottom-0 right-0 size-3 rounded-full bg-success ring-2 ring-card" />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-foreground">{interlocutor}</p>
          <p className="text-xs text-success-foreground">Online · {funcao}</p>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-muted/40 p-4">
        {mensagens.map((m) => {
          const meu = m.papel === papel;
          return (
            <div key={m.id} className={cn("flex", meu ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-2xl px-3.5 py-2.5 text-sm shadow-soft",
                  meu
                    ? "rounded-br-sm bg-primary text-primary-foreground"
                    : "rounded-bl-sm bg-card text-card-foreground",
                )}
              >
                {!meu && <p className="mb-0.5 text-xs font-bold opacity-70">{m.autor}</p>}
                <p>{m.texto}</p>
                <p className={cn("mt-1 text-[10px]", meu ? "opacity-75" : "text-muted-foreground")}>
                  {m.hora}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={fim} />
      </div>

      <div className="border-t border-border/70 bg-card p-3">
        <div className="mb-2 flex flex-wrap gap-2">
          {rapidas.map((r) => (
            <button
              key={r}
              onClick={() => enviar(r)}
              className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/30 hover:bg-primary/5 hover:text-primary"
            >
              {r}
            </button>
          ))}
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            enviar(texto);
          }}
        >
          <Input
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder="Escreva uma mensagem..."
            className="h-11 rounded-xl"
          />
          <Button type="submit" size="icon" className="size-11 shrink-0 rounded-xl">
            <Send className="size-4" />
            <span className="sr-only">Enviar</span>
          </Button>
        </form>
      </div>
    </Card>
  );
}
