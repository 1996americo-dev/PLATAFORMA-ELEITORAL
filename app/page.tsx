"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

function getFotoReal(url: string, nome: string) {
  if (!url) return `https://ui-avatars.com/api/?name=${encodeURIComponent(nome)}&background=0D47A1&color=fff&bold=true&size=256`;
  // Se for wikimedia, passa pelo proxy pra desbloquear
  if (url.includes("wikimedia.org")) {
    const clean = url.replace(/^https?:\/\//, "");
    return `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&w=300&h=300&fit=cover&output=jpg`;
  }
  return url;
}

export default function Home() {
  const [candidatos, setCandidatos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("candidatos").select("*").order("numero");
      if (data) setCandidatos(data);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Carregando 2026...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white">
      <header className="p-4 flex justify-between items-center bg-black/20 backdrop-blur">
        <h1 className="font-black text-lg"><span className="bg-green-600 px-2 py-1 rounded">BR</span> PLATAFORMA 2026</h1>
        <div className="flex gap-2">
          <a href="/votacao" className="bg-yellow-400 text-black px-4 py-1 rounded-full font-bold text-sm">Urna</a>
          <a href="/resultados" className="bg-green-500 px-4 py-1 rounded-full font-bold text-sm">Admin</a>
        </div>
      </header>

      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
        {candidatos.map((c) => (
          <div key={c.id} className="bg-gradient-to-b from-blue-900/60 to-slate-900 border border-blue-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="relative bg-slate-800 h-40 flex items-center justify-center overflow-hidden">
              <img
                src={getFotoReal(c.foto_url, c.nome)}
                alt={c.nome}
                className="w-32 h-32 rounded-full object-cover border-4 border-cyan-400 shadow-xl bg-cyan-400"
                onError={(e: any) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(c.nome)}&background=06B6D4&color=fff&bold=true&size=256`;
                }}
              />
              <span className="absolute top-2 right-2 bg-cyan-400 text-black text- px-2 py-0.5 rounded-full font-bold">
                {c.cargo || 'Presidente'}
              </span>
            </div>
            <div className="p-3">
              <h2 className="font-bold">{c.nome} - {c.numero}</h2>
              <p className="text- text-blue-300">{c.partido} | {c.estado || 'Brasil'}</p>
              <div className="grid grid-cols-2 gap-2 mt-3">
                <button className="bg-white/10 py-1.5 rounded text-xs">Perfil</button>
                <a href="/votacao" className="bg-yellow-400 text-black py-1.5 rounded text-xs font-bold text-center">Votar</a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}