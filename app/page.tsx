"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [busca, setBusca] = useState("");

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from("candidatos").select("*").order("created_at", { ascending: false });
      if (data) setCandidatos(data);
    }
    carregar();
  }, []);

  const filtrados = candidatos.filter(c =>
    `${c.nome} ${c.numero} ${c.partido} ${c.cidade} ${c.cargo}`.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <main style={{ padding: 20, background: "#0a0a0a", minHeight: "100vh", color: "white", fontFamily: "Arial" }}>
      <h1 style={{ textAlign: "center", color: "#22c55e", fontSize: 32 }}>🇧🇷 PLATAFORMA ELEITORAL 2026</h1>
      <input placeholder="Buscar por nome, número, partido, cidade..." value={busca} onChange={e => setBusca(e.target.value)}
        style={{ width: "100%", padding: 12, margin: "20px 0", borderRadius: 8, border: "none", fontSize: 16 }} />

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
        {filtrados.map(c => (
          <div key={c.id} style={{ background: "#1a1a1a", padding: 16, borderRadius: 12, border: "1px solid #333" }}>
            <img src={c.foto_url || "https://via.placeholder.com/300"} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8 }} />
            <h2 style={{ color: "#22c55e" }}>{c.nome} - {c.numero}</h2>
            <p><b>Partido:</b> {c.partido} | <b>Cargo:</b> {c.cargo}</p>
            <p><b>Cidade:</b> {c.cidade}</p>
            <p style={{ background: "#222", padding: 8, borderRadius: 6 }}>{c.propostas}</p>
          </div>
        ))}
      </div>
      {filtrados.length === 0 && <p style={{ textAlign: "center", marginTop: 40 }}>Nenhum candidato cadastrado ainda. Vai em /admin</p>}
    </main>
  );
}