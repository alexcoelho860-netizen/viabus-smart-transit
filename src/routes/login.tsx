import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoViaBus } from "@/components/viabus/ui-bits";
import { useViaBus } from "@/store/viabus-store";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Entrar — ViaBus" }, { name: "description", content: "Entre na sua conta de passageiro ViaBus." }, { property: "og:title", content: "Entrar — ViaBus" }, { property: "og:description", content: "Acesse sua conta de passageiro ou experimente a demonstração ViaBus." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }),
  component: Login,
});

function Login() {
  const { entrar } = useViaBus();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [ver, setVer] = useState(false);
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => { if (data.user) void nav({ to: "/passageiro" }); });
  }, [nav]);

  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    setEnviando(true);
    try {
      const r = await entrar(email, senha);
      if (!r.ok) { setErro(r.erro ?? "Não foi possível entrar."); return; }
      toast.success("Acesso realizado com sucesso.");
      await nav({ to: "/passageiro" });
    } catch { setErro("Não foi possível conectar. Tente novamente."); }
    finally { setEnviando(false); }
  }

  async function entrarGoogle() {
    setErro("");
    setEnviando(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/login" });
      if (result.error) setErro("Não foi possível entrar com Google. Tente novamente.");
      else if (!result.redirected) await nav({ to: "/passageiro" });
    } catch { setErro("Não foi possível conectar ao Google."); }
    finally { setEnviando(false); }
  }

  return <main className="grid min-h-screen place-items-center bg-muted px-4 py-10"><Card className="w-full max-w-md rounded-lg p-6 shadow-lift"><LogoViaBus/><h1 className="mt-5 text-2xl font-extrabold">Entrar no ViaBus</h1><p className="text-sm text-muted-foreground">Acesse sua conta de passageiro ou explore a demonstração.</p><form className="mt-6 space-y-4" onSubmit={enviar}><div><Label htmlFor="email">E-mail</Label><div className="relative mt-2"><Mail className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input id="email" className="pl-9" type="email" required value={email} onChange={e => { setEmail(e.target.value); setErro(""); }}/></div></div><div><Label htmlFor="senha">Senha</Label><div className="relative mt-2"><LockKeyhole className="absolute left-3 top-3 size-4 text-muted-foreground"/><Input id="senha" className="px-9" type={ver ? "text" : "password"} required value={senha} onChange={e => { setSenha(e.target.value); setErro(""); }}/><Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setVer(!ver)} aria-label={ver ? "Ocultar senha" : "Mostrar senha"}>{ver ? <EyeOff className="size-4"/> : <Eye className="size-4"/>}</Button></div></div>{erro && <p role="alert" className="text-sm text-danger">{erro}</p>}<div className="flex justify-end"><Link to="/recuperar-senha" className="text-sm font-semibold text-primary">Esqueci minha senha</Link></div><Button className="w-full" type="submit" disabled={enviando}>{enviando ? "Aguarde..." : "Entrar"}</Button></form><Button variant="outline" className="mt-3 w-full" disabled={enviando} onClick={entrarGoogle}>Continuar com Google</Button><Button asChild variant="ghost" className="mt-3 w-full"><Link to="/demo">Acesso rápido aos 4 perfis</Link></Button><p className="mt-5 text-center text-sm">Ainda não possui conta? <Link to="/cadastro" className="font-semibold text-primary">Criar conta</Link></p></Card></main>;
}