import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LogoViaBus } from "@/components/viabus/ui-bits";
import { useViaBus } from "@/store/viabus-store";

export const Route = createFileRoute("/cadastro")({ head: () => ({ meta: [{ title: "Criar conta — ViaBus" }, { name: "description", content: "Crie sua conta de passageiro no ViaBus." }, { property: "og:title", content: "Criar conta — ViaBus" }, { property: "og:description", content: "Cadastre-se para acessar o ViaBus como passageiro." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" }] }), component: Cadastro });

function Cadastro() {
  const { cadastrar } = useViaBus();
  const nav = useNavigate();
  const [nome, setNome] = useState(""), [email, setEmail] = useState(""), [fone, setFone] = useState(""), [senha, setSenha] = useState(""), [confirmar, setConfirmar] = useState(""), [aceito, setAceito] = useState(false), [erro, setErro] = useState(""), [pendente, setPendente] = useState(false), [enviando, setEnviando] = useState(false);
  async function enviar(e: React.FormEvent) {
    e.preventDefault();
    if (nome.trim().length < 3 || !email.includes("@") || senha.length < 6 || senha !== confirmar || !aceito) { setErro("Revise os dados, confirme a senha e aceite os termos."); return; }
    setErro(""); setEnviando(true);
    try {
      const r = await cadastrar({ nome, email, telefone: fone, senha, role: "passageiro" });
      if (!r.ok) { setErro(r.erro ?? "Não foi possível criar a conta."); return; }
      if (r.confirmacao) { setPendente(true); toast.success("Confira seu e-mail para confirmar o cadastro."); }
      else { toast.success("Conta criada com sucesso."); await nav({ to: "/passageiro" }); }
    } catch { setErro("Não foi possível conectar. Tente novamente."); }
    finally { setEnviando(false); }
  }
  return <main className="grid min-h-screen place-items-center bg-muted px-4 py-10"><Card className="w-full max-w-lg rounded-lg p-6"><LogoViaBus/><h1 className="mt-5 text-2xl font-extrabold">Criar conta de passageiro</h1>{pendente ? <div className="mt-6 space-y-4"><p role="status">Confira seu e-mail para confirmar o cadastro. Depois, entre com sua senha.</p><Button asChild><Link to="/login">Ir para o login</Link></Button></div> : <form className="mt-5 grid gap-4 sm:grid-cols-2" onSubmit={enviar}><div className="sm:col-span-2"><Label htmlFor="nome">Nome completo</Label><Input id="nome" className="mt-2" required value={nome} onChange={e => setNome(e.target.value)}/></div><div><Label htmlFor="email-cadastro">E-mail</Label><Input id="email-cadastro" className="mt-2" type="email" required value={email} onChange={e => setEmail(e.target.value)}/></div><div><Label htmlFor="fone">Telefone</Label><Input id="fone" className="mt-2" type="tel" value={fone} onChange={e => setFone(e.target.value)}/></div><div><Label htmlFor="nova-senha">Senha</Label><Input id="nova-senha" className="mt-2" type="password" minLength={6} required value={senha} onChange={e => setSenha(e.target.value)}/></div><div><Label htmlFor="confirmar">Confirmar senha</Label><Input id="confirmar" className="mt-2" type="password" required value={confirmar} onChange={e => setConfirmar(e.target.value)}/></div><label className="flex gap-2 text-sm sm:col-span-2"><Checkbox checked={aceito} onCheckedChange={v => setAceito(v === true)}/><span>Li e aceito os <Link to="/termos" className="text-primary">Termos de Uso</Link> e a <Link to="/privacidade" className="text-primary">Política de Privacidade</Link>.</span></label>{erro && <p role="alert" className="text-sm text-danger sm:col-span-2">{erro}</p>}<Button className="sm:col-span-2" type="submit" disabled={enviando}>{enviando ? "Criando conta..." : "Criar conta"}</Button></form>}<p className="mt-4 text-center text-sm">Já possui conta? <Link to="/login" className="font-semibold text-primary">Entrar</Link></p></Card></main>;
}