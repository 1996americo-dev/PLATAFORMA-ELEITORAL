"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const FOTOS_REAIS: any = {
  "12": "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Ciro_Gomes_2024.jpg/400px-Ciro_Gomes_2024.jpg&w=300&h=300&output=jpg",
  "13": "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Luiz_In%C3%A1cio_Lula_da_Silva_%28cropped%29.jpg/400px-Luiz_In%C3%A1cio_Lula_da_Silva_%28cropped%29.jpg&w=300&h=300&output=jpg",
  "15": "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/5/5a/Simone_Tebet_2022.jpg/400px-Simone_Tebet_2022.jpg&w=300&h=300&output=jpg",
  "18": "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/b/b8/Marina_Silva_%282024%29_%28cropped%29.jpg/400px-Marina_Silva_%28cropped%29.jpg&w=300&h=300&output=jpg",
  "22": "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/4/4b/Jair_Bolsonaro_%282019%29_crop.jpg/400px-Jair_Bolsonaro_%282019%29_crop.jpg&w=300&h=300&output=jpg",
  "2222": "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Nikolas_Ferreira_2023.jpg/400px-Nikolas_Ferreira_2023.jpg&w=300&h=300&output=jpg",
  "40": "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Tabata_Amaral_2023.jpg/400px-Tabata_Amaral_2023.jpg&w=300&h=300&output=jpg",
  "45": "https://wsrv.nl/?url=upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Joao_Doria_2022.jpg/400px-Joao_Doria_2022.jpg&w=300&h=300&output=jpg",
}

export default function Home(){
  const [candidatos,setCandidatos]=useState<any[]>([]);
  useEffect(()=>{ supabase.from("candidatos").select("*").order("numero").then(r=>{if(r.data)setCandidatos(r.data)}) },[]);

  return (
    <div className="min-h-screen bg-slate-900 text-white p-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-6xl mx-auto">
        {candidatos.map(c=>{
          const foto = FOTOS_REAIS[String(c.numero)] || c.foto_url;
          return (
            <div key={c.id} className="bg-blue-900/50 border border-blue-700 rounded-xl p-3 text-center">
              <img src={foto} className="w-24 h-24 rounded-full mx-auto object-cover bg-cyan-400 border-4 border-cyan-300" alt={c.nome} />
              <h2 className="font-bold mt-2 text-sm">{c.nome} - {c.numero}</h2>
              <p className="text-xs text-blue-300">{c.partido}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}