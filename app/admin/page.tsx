"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Admin() {
  const [logado, setLogado] = useState(false);
  const [senha, setSenha] = useState("");
  const [form, setForm] = useState({ nome: "", numero: "", partido: "", cargo: "Vereador", cidade: "", propostas: "" });
  const [foto, setFoto] = useState<File | null>(null);
  const [lista, setLista] = useState<any[]>([]);

  const carregar = async () => {
    const { data } = await supabase.from("candidatos").select("*").order("created_at", { ascending: false });
    if (data) setLista(data);
  };
  useEffect(() => { if (logado) carregar(); }, [logado]);

  const salvar = async () => {
    try {
      let foto_url = "";
      if (foto) {
        const nomeArq = Date.now() + "-" + foto.name;
        const { error: upErr } = await supabase.storage.from("fotos-candidatos").upload(nomeArq, foto);
        if (upErr) throw upErr;
        const { data } = supabase.storage.from("fotos-candidatos").getPublicUrl(nomeArq);
        foto_url = data.publicUrl;
      }
      const { error } = await supabase.from("candidatos").insert([{...form, foto_url }]);
      if (error) throw error;
      alert("Salvo!");
      setForm({ nome: "", numero: "", partido: "", cargo: "Vereador", cidade: "", propostas: "" });
      carregar();
    } catch (e: any) { alert("Erro: " + e.message); }
  };

  if (!logado) return (
    <div style={{ display: "flex", height: "100vh", justifyContent: "center", alignItems: "center", background: "#0a0a0a", color: "white", flexDirection: "column", gap: 12 }}>
      <h1>Painel Admin</h1><input type="password" placeholder="Senha: 123456" value={senha} onChange={e => setSenha(e.target.value)} style={{ padding: 10, borderRadius: 6 }} />
      <button onClick={() => senha === "123456"? setLogado(true) : alert("Senha errada")} style={{ padding: "10px 20px", background: "#22c55e", border: "none", borderRadius: 6, cursor: "pointer" }}>Entrar</button>
    </div>
  );

  return (
    <div style={{ padding: 20, background: "#111", minHeight: "100vh", color: "white" }}>
      <h1 style={{ color: "#22c55e" }}>Cadastrar Candidato</h1>
      <div style={{ display: "grid", gap: 10, maxWidth: 500 }}>
        <input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value })} style={{ padding: 10 }} />
        <input placeholder="Número" value={form.numero} onChange={e => setForm({...form, numero: e.target.value })} style={{ padding: 10 }} />
        <input placeholder="Partido" value={form.partido} onChange={e => setForm({...form, partido: e.target.value })} style={{ padding: 10 }} />
        <select value={form.cargo} onChange={e => setForm({...form, cargo: e.target.value })} style={{ padding: 10 }}><option>Vereador</option><option>Prefeito</option><option>Deputado</option></select>
        <input placeholder="Cidade" value={form.cidade} onChange={e => setForm({...form, cidade: e.target.value })} style={{ padding: 10 }} />
        <textarea placeholder="Propostas" value={form.propostas} onChange={e => setForm({...form, propostas: e.target.value })} style={{ padding: 10 }} />
        <input type="file" onChange={e => setFoto(e.target.files?.[0] || null)} />
        <button onClick={salvar} style={{ padding: 12, background: "#22c55e", border: "none", borderRadius: 6, fontWeight: "bold", cursor: "pointer" }}>Salvar Candidato</button>
      </div>
      <hr style={{ margin: "20px 0" }} />
      {lista.map(c => <div key={c.id} style={{ background: "#222", marginBottom: 8, padding: 10, borderRadius: 6, display: "flex", justifyContent: "space-between" }}><span>{c.nome} - {c.numero} - {c.partido}</span><button onClick={async () => { await supabase.from("candidatos").delete().eq("id", c.id); carregar(); }} style={{ background: "red", color: "white", border: "none", padding: "4px 8px", borderRadius: 4 }}>Excluir</button></div>)}
    </div>
  );
}