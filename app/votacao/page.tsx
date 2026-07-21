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
    async function load() {
      const { data } = await supabase.from("candidatos").select("*");
      if (data) setCandidatos(data);
    }
    load();
  }, []);

  async function votar() {
    setMsg("");
    const cpfLimpo = cpf.replace(/\D/g, "");

    if (!validarCPF(cpf)) {
      setMsg("❌ CPF inválido! Digite um CPF real.");
      return;
    }
    if (nome.length < 3) {
      setMsg("❌ Digite seu nome completo.");
      return;
    }
    if (!candidatoId) {
      setMsg("❌ Escolha um candidato.");
      return;
    }

    setLoading(true);

    const { data: jaVotou } = await supabase
    .from("votos")
    .select("id")
    .eq("cpf", cpfLimpo)
    .limit(1);

    if (jaVotou && jaVotou.length > 0) {
      setMsg("⚠️ Este CPF já votou! Cada CPF só pode votar 1 vez.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("votos").insert({
      cpf: cpfLimpo,
      nome: nome,
      candidato_id: candidatoId,
    });

    if (error) {
      setMsg("❌ Erro ao votar: " + error.message);
    } else {
      const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");
      audio.play().catch(() => {});
      setMsg("✅ Voto computado com sucesso! Obrigado " + nome.split(" ")[0] + "!");
      setCpf("");
      setNome("");
      setCandidatoId("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4 flex items-center justify-center">
      <div className="w-full max-w-xl">
        <h1 className="text-3xl font-bold text-center mb-2 text-white">
          Urna Eletrônica 2026
        </h1>
        <p className="text-center text-sm text-blue-200 mb-6">
          Identifique-se para votar
        </p>

        <div className="bg-white p-8 rounded-2xl shadow-2xl">
          <label className="block text-sm font-medium mb-1 text-black">CPF *</label>
          <input
            value={cpf}
            onChange={(e) => setCpf(mascararCPF(e.target.value))}
            placeholder="000.000.000-00"
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-black bg-white placeholder:text-gray-400"
          />

          <label className="block text-sm font-medium mb-1 text-black">Nome Completo *</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome completo"
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-black bg-white placeholder:text-gray-400"
          />

          <label className="block text-sm font-medium mb-1 text-black">Escolha seu Candidato *</label>
          <select
            value={candidatoId}
            onChange={(e) => setCandidatoId(e.target.value)}
            className="w-full border border-gray-300 p-3 rounded-lg mb-4 text-black bg-white"
          >
            <option value="">-- Selecione --</option>
            {candidatos.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome} - {c.partido} ({c.numero})
              </option>
            ))}
          </select>

          <div className="flex items-start gap-2 mb-4">
            <input type="checkbox" id="lgpd" className="mt-1" />
            <label htmlFor="lgpd" className="text-xs text-gray-600">
              Declaro que sou eleitor e concordo que meu CPF será usado apenas para evitar voto duplicado (LGPD).
            </label>
          </div>

          <button
            onClick={votar}
            disabled={loading}
            className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
          >
            {loading? "Computando..." : "CONFIRMA - VOTAR"}
          </button>

          {msg && (
            <div className="mt-4 p-3 rounded-lg bg-gray-100 text-center font-medium text-black">
              {msg}
            </div>
          )}
        </div>

        <a
          href="/resultados"
          className="block text-center mt-6 text-blue-300 underline hover:text-white"
        >
          Ver Ranking de Votos →
        </a>
      </div>
    </div>
  );
}