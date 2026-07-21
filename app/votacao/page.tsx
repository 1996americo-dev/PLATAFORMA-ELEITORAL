"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { validarCPF, mascararCPF } from "@/lib/utils";

export default function Votacao() {
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [cpf, setCpf] = useState("");
  const [nome, setNome] = useState("");
  const [candidatoId, setCandidatoId] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    supabase.from("candidatos").select("*").then(({data}) => { if(data) setCandidatos(data) });
  }, []);

  async function votar() {
    const cpfLimpo = cpf.replace(/\D/g, "");
    if (!validarCPF(cpf)) { setMsg("❌ CPF inválido!"); return; }
    if (nome.length < 3) { setMsg("❌ Digite nome completo"); return; }
    if (!candidatoId) { setMsg("❌ Escolha candidato"); return; }
    setLoading(true);
    const { data: jaVotou } = await supabase.from("votos").select("id").eq("cpf", cpfLimpo).limit(1);
    if (jaVotou && jaVotou.length > 0) { setMsg("⚠️ Este CPF já votou!"); setLoading(false); return; }
    const { error } = await supabase.from("votos").insert({ cpf: cpfLimpo, nome, candidato_id: candidatoId });
    if (error) setMsg("❌ Erro: " + error.message);
    else { setMsg("✅ Voto computado!"); setCpf(""); setNome(""); setCandidatoId(""); }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">Urna Eletrônica 2026</h1>
        <p className="text-center text-sm text-blue-200 mb-6">Identifique-se para votar</p>
        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <label className="block text-sm font-medium mb-1">CPF *</label>
          <input value={cpf} onChange={e => setCpf(mascararCPF(e.target.value))} placeholder="000.000.000-00" className="w-full border p-3 rounded-lg mb-4" />
          <label className="block text-sm font-medium mb-1">Nome Completo *</label>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Seu nome" className="w-full border p-3 rounded-lg mb-4" />
          <label className="block text-sm font-medium mb-1">Candidato *</label>
          <select value={candidatoId} onChange={e => setCandidatoId(e.target.value)} className="w-full border p-3 rounded-lg mb-4">
            <option value="">-- Selecione --</option>
            {candidatos.map(c => <option key={c.id} value={c.id}>{c.nome} - {c.partido}</option>)}
          </select>
          <button onClick={votar} disabled={loading} className="w-full bg-green-600 text-white p-3 rounded-lg font-bold">
            {loading ? "Computando..." : "CONFIRMA - VOTAR"}
          </button>
          {msg && <div className="mt-4 p-3 rounded bg-gray-100 text-center">{msg}</div>}
        </div>
        <a href="/resultados" className="block text-center mt-6 text-blue-300 underline">Ver Ranking de Votos →</a>
      </div>
    </div>
  );
}