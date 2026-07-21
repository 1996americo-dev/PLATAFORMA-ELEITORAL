"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

const FOTOS:any={
"12":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/6/6d/Ciro_Gomes_2024.jpg&w=200&h=200&fit=cover",
"13":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/1/1a/Luiz_In%C3%A1cio_Lula_da_Silva.jpg&w=200&h=200&fit=cover",
"15":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/5/5a/Simone_Tebet_2022.jpg&w=200&h=200&fit=cover",
"18":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/b/b8/Marina_Silva_2024.jpg&w=200&h=200&fit=cover",
"22":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/4/4b/Jair_Bolsonaro_2019.jpg&w=200&h=200&fit=cover",
"2222":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/8/8a/Nikolas_Ferreira_2023.jpg&w=200&h=200&fit=cover",
"40":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/c/c0/Tabata_Amaral_2023.jpg&w=200&h=200&fit=cover",
"45":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/0/0e/Joao_Doria_2022.jpg&w=200&h=200&fit=cover",
}

export default function Home(){
 const [c,setC]=useState<any[]>([]);
 useEffect(()=>{supabase.from("candidatos").select("*").order("numero").then(r=>setC(r.data||[]))},[]);
 return <div className="min-h-screen bg-[#0a1a3a] p-4 grid grid-cols-2 md:grid-cols-4 gap-4">
 {c.map((x:any)=><div key={x.id} className="bg-[#10306b] rounded-xl p-4 text-center text-white">
   <img src={FOTOS[String(x.numero)]||x.foto_url} referrerPolicy="no-referrer" className="w-28 h-28 rounded-full mx-auto object-cover bg-cyan-400" />
   <div className="font-bold mt-2 text-sm">{x.nome} - {x.numero}</div><div className="text-xs opacity-70">{x.partido}</div>
 </div>)}
 </div>
}