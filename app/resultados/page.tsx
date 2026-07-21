"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Resultados() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function load() {
      const { data } = await supabase.from("votos").select("candidato_id, candidatos(nome, partido)");
      if (!data) return;
      setTotal(data.length);
      const contagem: any = {};
      data.forEach((v: any) => {
        const id = v.candidato_id;
        if (!contagem[id]) contagem[id] = {...v.candidatos, id, votos: 0 };
        contagem[id].votos++;
      });
      const sorted = Object.values(contagem).sort((a: any, b: any) => b.votos - a.votos);
      setRanking(sorted);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-white p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-center">Resultados Parciais 2026</h1>
      <p className="text-center text-gray-600 mb-6">Total de votos: {total}</p>
      {ranking.map((c: any, i) => (
        <div key={c.id} className="border p-4 rounded-xl mb-3 flex justify-between items-center">
          <div>
            <span className="font-bold">{i + 1}º {c.nome}</span> <span className="text-sm text-gray-600">{c.partido}</span>
            <div className="w-48 h-2 bg-gray-200 rounded mt-1">
              <div className="h-2 bg-green-600 rounded" style={{ width: `${total? (c.votos / total) * 100 : 0}%` }}></div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-bold text-lg">{c.votos} votos</div>
            <div className="text-sm">{total? ((c.votos / total) * 100).toFixed(1) : 0}%</div>
          </div>
        </div>
      ))}
      <a href="/votacao" className="block text-center mt-6 bg-blue-600 text-white p-3 rounded-lg">Voltar para Urna</a>
    </div>
  );
}