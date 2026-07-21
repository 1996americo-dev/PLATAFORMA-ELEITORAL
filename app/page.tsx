"use client";
import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FOTOS: any = {
  "12": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Ciro_Gomes_2024.jpg/400px-Ciro_Gomes_2024.jpg",
  "13": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Luiz_In%C3%A1cio_Lula_da_Silva_%28cropped%29.jpg/400px-Luiz_In%C3%A1cio_Lula_da_Silva_%28cropped%29.jpg",
  "15": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Simone_Tebet_2022.jpg/400px-Simone_Tebet_2022.jpg",
  "18": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Marina_Silva_%282024%29_%28cropped%29.jpg/400px-Marina_Silva_%282024%29_%28cropped%29.jpg",
  "22": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Jair_Bolsonaro_%282019%29_crop.jpg/400px-Jair_Bolsonaro_%282019%29_crop.jpg",
  "2222": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nikolas_Ferreira_2023.jpg/400px-Nikolas_Ferreira_2023.jpg",
  "40": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tabata_Amaral_2023.jpg/400px-Tabata_Amaral_2023.jpg",
  "45": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Joao_Doria_2022.jpg/400px-Joao_Doria_2022.jpg",
  "46": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Eduardo_Leite_2023.jpg/400px-Eduardo_Leite_2023.jpg",
  "50": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Erika_Hilton_2023.jpg/400px-Erika_Hilton_2023.jpg",
};

export default function Home() {
  const [lista, setLista] = useState<any[]>([]);
  useEffect(() => {
    supabase.from("candidatos").select("*").order("numero").then(r => setLista(r.data || []));
  }, []);

  return (
    <div className="min-h-screen bg-[#020c26] p-6">
      <h1 className="text-white text-center text-3xl font-bold mb-8">Plataforma Eleitoral 2026</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-5 max-w-7xl mx-auto">
        {lista.map((c: any) => {
          let num = String(c.numero);
          if (c.nome.includes("Eduardo")) num = "46";
          if (c.nome.includes("Erika") || c.nome.includes("Érika")) num = "50";
          if (c.nome.includes("Joao") || c.nome.includes("João")) num = "45";
          return (
            <div key={c.id} className="bg-gradient-to-b from-[#12367a] to-[#0a1f4a] border border-white/10 rounded-2xl p-4 text-center">
              <img src={FOTOS[num]} alt={c.nome} className="w-28 h-28 rounded-full mx-auto object-cover border-4 border-cyan-300 bg-white" />
              <div className="text-white font-bold mt-2 text-">{c.nome}</div>
              <div className="text-cyan-300 text-xs">{c.numero} - {c.partido}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}