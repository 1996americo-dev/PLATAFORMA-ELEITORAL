"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Resultados() {
  const [ranking, setRanking] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const { data } = await supabase
      .from("votos")
      .select("candidato_id, candidatos(nome, partido, numero)");

      if (!data) {
        setLoading(false);
        return;
      }

      setTotal(data.length);
      const contagem: any = {};

      data.forEach((v: any) => {
        const id = v.candidato_id;
        if (!contagem[id]) {
          contagem[id] = {...v.candidatos, id, votos: 0 };
        }
        contagem[id].votos++;
      });

      const sorted = Object.values(contagem).sort(
        (a: any, b: any) => b.votos - a.votos
      );
      setRanking(sorted);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-2">
          Resultados Parciais 2026
        </h1>
        <p className="text-center text-blue-200 mb-6">
          Total de votos: {total} {loading && "- Atualizando..."}
        </p>

        <div className="bg-white p-6 rounded-2xl shadow-2xl">
          {ranking.length === 0 &&!loading && (
            <p className="text-center text-gray-500 py-8">
              Nenhum voto ainda. Seja o primeiro!
            </p>
          )}

          {ranking.map((c: any, i) => (
            <div
              key={c.id}
              className="border border-gray-200 p-4 rounded-xl mb-3 flex justify-between items-center bg-white"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-900 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">
                    {i + 1}º
                  </span>
                  <div>
                    <div className="font-bold text-black text-lg leading-tight">
                      {c.nome}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      {c.partido} - {c.numero}
                    </div>
                  </div>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full mt-3 overflow-hidden">
                  <div
                    className="h-3 bg-green-600 rounded-full transition-all duration-1000"
                    style={{
                      width: `${total? (c.votos / total) * 100 : 0}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="text-right ml-4 min-w-">
                <div className="font-black text-black text-xl">{c.votos}</div>
                <div className="text-sm text-gray-500">votos</div>
                <div className="font-bold text-green-700 text-sm">
                  {total? ((c.votos / total) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          ))}
        </div>

        <a
          href="/votacao"
          className="block text-center mt-6 bg-white text-blue-900 p-4 rounded-xl font-bold shadow-xl hover:bg-gray-100"
        >
          ← Voltar para Urna
        </a>
      </div>
    </div>
  );
}