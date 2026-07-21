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

    // Verifica se CPF já votou
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

    // Salva voto
    const { error } = await supabase.from("votos").insert({
      cpf: cpfLimpo,
      nome: nome,
      candidato_id: candidatoId,
    });

    if (error) {
      setMsg("❌ Erro ao votar: " + error.message);
    } else {
      // Toca o PLIM
      const audio = new Audio("https://www.soundjay.com/buttons/sounds/button-10.mp3");
      audio.play();
      setMsg("✅ Voto computado com sucesso! Obrigado " + nome.split(" ")[0] + "!");
      setCpf("");
      setNome("");
      setCandidatoId("");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-2">Urna Eletrônica 2026</h1>
      <p className="text-center text-sm text-gray-600 mb-6">Identifique-se para votar</p>

      <div className="bg-white p-6 rounded-xl shadow">
        <label className="block text-sm font-medium mb-1">CPF *</label>
        <input
          value={cpf}
          onChange={(e) => setCpf(mascararCPF(e.target.value))}
          placeholder="000.000.000-00"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block text-sm font-medium mb-1">Nome Completo *</label>
        <input
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Seu nome completo"
          className="w-full border p-3 rounded-lg mb-4"
        />

        <label className="block text-sm font-medium mb-1">Escolha seu Candidato *</label>
        <select
          value={candidatoId}
          onChange={(e) => setCandidatoId(e.target.value)}
          className="w-full border p-3 rounded-lg mb-4"
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
            Declaro que sou eleitor e concordo que meu CPF será criptografado conforme LGPD para evitar voto duplicado.
          </label>
        </div>

        <button
          onClick={votar}
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-bold hover:bg-green-700 disabled:opacity-50"
        >
          {loading? "Computando..." : "CONFIRMA - VOTAR"}
        </button>

        {msg && <div className="mt-4 p-3 rounded bg-gray-100 text-center font-medium">{msg}</div>}
      </div>

      <a href="/resultados" className="block text-center mt-6 text-blue-600 underline">
        Ver Ranking de Votos →
      </a>
    </div>
  );
}