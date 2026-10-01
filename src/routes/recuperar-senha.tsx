import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoViaBus } from "@/components/viabus/ui-bits";
import { useViaBus } from "@/store/viabus-store";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/recuperar-senha")({ head: () => ({ meta: [{ title: "Recuperar senha — ViaBus" }, { name: "description", content: "Recupere o acesso à sua conta de passageiro ViaBus." }, { property: "og:title", content: "Recuperar senha — ViaBus" }, { property: "og:description", content: "Receba instruções para redefinir sua senha ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Recuperar });

function Recuperar() {
  const { recuperarSenha } = useViaBus();
  const [email, setEmail] = useState(""), [msg, setMsg] = useState(""), [erro, setErro] = useState(""), [senha, setSenha] = useState(""), [recuperando, setRecuperando] = useState(false), [enviando, setEnviando] = useState(false);
  useEffect(() => {
    if (typeof window !== "undefined" && (window.location.hash.includes("type=recovery") || new URLSearchParams(window.location.search).has("code"))) setRecuperando(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange(event => { if (event === "PASSWORD_RECOVERY") setRecuperando(true); });
    return () => subscription.unsubscribe();
  }, []);
  async function enviar(e: React.FormEvent) {
    e.preventDefault(); setEnviando(true); setErro("");
    try {
      if (recuperando) {
        const { error } = await supabase.auth.updateUser({ password: senha });
        if (error) { setErro(error.message); return; }
        setMsg("Senha atualizada. Você já pode entrar."); setRecuperando(false);
      } else {
        const r = await recuperarSenha(email);
        if (!r.ok) { setErro(r.erro ?? "Não foi possível enviar o e-mail."); return; }
        setMsg("Se a conta existir, enviaremos as instruções para este e-mail.");
      }
    } catch { setErro("Não foi possível conectar. Tente novamente."); }
    finally { setEnviando(false); }
  }
  return <main className="grid min-h-screen place-items-center bg-muted px-4"><Card className="w-full max-w-md rounded-lg p-6"><LogoViaBus/><h1 className="mt-5 text-2xl font-extrabold">{recuperando ? "Definir nova senha" : "Recuperar senha"}</h1><p className="text-sm text-muted-foreground">{recuperando ? "Escolha uma nova senha para sua conta." : "Enviaremos um link para o e-mail da sua conta."}</p><form onSubmit={enviar}><Label className="mt-5 block" htmlFor="recuperacao">{recuperando ? "Nova senha" : "E-mail"}</Label><Input id="recuperacao" className="mt-2" type={recuperando ? "password" : "email"} required minLength={recuperando ? 6 : undefined} value={recuperando ? senha : email} onChange={e => recuperando ? setSenha(e.target.value) : setEmail(e.target.value)}/>{msg && <p role="status" className="mt-3 rounded-lg bg-muted p-3 text-sm">{msg}</p>}{erro && <p role="alert" className="mt-3 text-sm text-danger">{erro}</p>}<Button type="submit" disabled={enviando} className="mt-4 w-full">{enviando ? "Aguarde..." : recuperando ? "Salvar nova senha" : "Enviar instruções"}</Button></form><Button asChild variant="ghost" className="mt-2 w-full"><Link to="/login">Voltar ao login</Link></Button></Card></main>;
}