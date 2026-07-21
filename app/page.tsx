"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

// FOTO REAL - SEM PROXY, CARREGA EM QUALQUER WI-FI
const FOTOS_REAIS: any = {
  "12": "https://upload.wikimedia.org/wikipedia/commons/6/6d/Ciro_Gomes_2024.jpg",
  "13": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Luiz_In%C3%A1cio_Lula_da_Silva_%28cropped%29.jpg/400px-Luiz_In%C3%A1cio_Lula_da_Silva_%28cropped%29.jpg",
  "15": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Simone_Tebet_2022.jpg/400px-Simone_Tebet_2022.jpg",
  "18": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Marina_Silva_%282024%29_%28cropped%29.jpg/400px-Marina_Silva_%282024%29_%28cropped%29.jpg",
  "22": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Jair_Bolsonaro_%282019%29_crop.jpg/400px-Jair_Bolsonaro_%282019%29_crop.jpg",
  "2222": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nikolas_Ferreira_2023.jpg/400px-Nikolas_Ferreira_2023.jpg",
  "40": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tabata_Amaral_2023.jpg/400px-Tabata_Amaral_2023.jpg",
  "45": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Joao_Doria_2022.jpg/400px-Joao_Doria_2022.jpg",
  "451": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Eduardo_Leite_2023.jpg/400px-Eduardo_Leite_2023.jpg",
  "50": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Erika_Hilton_2023.jpg/400px-Erika_Hilton_2023.jpg",
}

export default function Home() {
  const [candidatos, setCandidatos] = useState<any[]>([]);

  useEffect(() => {
    supabase.from("candidatos").select("*").order("numero").then(({ data }) => {
      if (data) setCandidatos(data);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020c26] via-[#0a1f4a] to-[#12367a] p-6">
      <h1 className="text-white text-center text-3xl font-bold mb-8">Plataforma Eleitoral 2026</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 max-w-7xl mx-auto">
        {candidatos.map((c) => {
          // Pega a foto real pelo numero, se nao tiver usa a do banco
          let chave = String(c.numero);
          if (chave === "45" && c.nome.includes("Eduardo")) chave = "451"; // Edu Leite e Doria tem mesmo numero
          if (chave === "45" && c.nome.includes("Erika") || c.nome.includes("Érika")) chave = "50";

          const foto = FOTOS_REAIS[chave] || FOTOS_REAIS[String(c.numero)] || c.foto_url;

          return (
            <div key={c.id} className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-5 text-center hover:bg-white/20 transition">
              <img
                src={foto}
                alt={c.nome}
                referrerPolicy="no-referrer"
                className="w-32 h-32 rounded-full mx-auto object-cover border-4 border-cyan-300 shadow-lg bg-white"
                onError={(e) => { (e.target as any).src = `https://ui-avatars.com/api/?name=${c.nome}&background=00e5ff&color=fff&size=200` }}
              />
              <h2 className="text-white font-bold mt-3 text-sm">{c.nome}</h2>
              <p className="text-cyan-300 text-xs font-bold">{c.numero} - {c.partido}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}