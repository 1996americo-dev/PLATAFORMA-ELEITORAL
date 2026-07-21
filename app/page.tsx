"use client";
import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const FOTOS: any = {
"12":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/6/6d/Ciro_Gomes_2024.jpg&w=300&h=300&fit=cover&output=jpg",
"13":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/1/1a/Luiz_In%C3%A1cio_Lula_da_Silva.jpg&w=300&h=300&fit=cover&output=jpg",
"15":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/5/5a/Simone_Tebet_2022.jpg&w=300&h=300&fit=cover&output=jpg",
"18":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/b/b8/Marina_Silva_2024.jpg&w=300&h=300&fit=cover&output=jpg",
"22":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/4/4b/Jair_Bolsonaro_2019.jpg&w=300&h=300&fit=cover&output=jpg",
"2222":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/8/8a/Nikolas_Ferreira_2023.jpg&w=300&h=300&fit=cover&output=jpg",
"40":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/c/c0/Tabata_Amaral_2023.jpg&w=300&h=300&fit=cover&output=jpg",
"45":"https://wsrv.nl/?url=https://upload.wikimedia.org/wikipedia/commons/0/0e/Joao_Doria_2022.jpg&w=300&h=300&fit=cover&output=jpg",
};

export default function Home(){
 const [lista,setLista]=useState<any[]>([]);
 useEffect(()=>{
  supabase.from("candidatos").select("*").order("numero").then(r=>{
    if(r.data) setLista(r.data);
  });
 },[]);
 return(
  <div style={{minHeight:"100vh", background:"#081a3a", padding:16, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16}}>
   {lista.map((c:any)=>(
    <div key={c.id} style={{background:"#12367a", borderRadius:16, padding:16, textAlign:"center", color:"white"}}>
     <img src={FOTOS[String(c.numero)]} style={{width:110, height:110, borderRadius:"50%", objectFit:"cover", margin:"0 auto", background:"#00e5ff", display:"block"}} />
     <div style={{fontWeight:"bold", marginTop:8, fontSize:12}}>{c.nome} - {c.numero}</div>
     <div style={{fontSize:10, opacity:0.7}}>{c.partido}</div>
    </div>
   ))}
  </div>
 )
}