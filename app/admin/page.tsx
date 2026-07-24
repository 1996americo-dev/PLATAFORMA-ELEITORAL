"use client";
// V21 FUNDO BRANCO NITIDO 100% - 24/07/2026 - FIX DEFINITIVO
import {useEffect,useState} from "react";
import {createClient} from "@supabase/supabase-js";
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
function getFotoUrl(foto:string){
  if(!foto) return "https://via.placeholder.com/150";
  if(foto.startsWith("http")) return foto;
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos-candidatos/${foto}`;
}
export default function Admin(){
  const [votos,setVotos]=useState<any[]>([]);
  const [cands,setCands]=useState<any[]>([]);
  const [msg,setMsg]=useState("");
  async function load(){
    const {data:v}=await sb.from("votos").select("*").order("created_at",{ascending:false});
    const {data:c}=await sb.from("candidatos").select("*").order("nome");
    setVotos(v||[]); setCands(c||[]);
  }
  useEffect(()=>{load()},[]);
  async function limparLegados(){
    if(!confirm("ZERAR TODOS OS VOTOS?")) return;
    setMsg("Limpando...");
    try{
      const r=await fetch("/api/limpar",{method:"POST"});
      const j=await r.json();
      if(!j.ok) throw new Error(j.error);
      setMsg("✅ ZERADO!");
      load();
    }catch(e:any){
      for(const v of votos){ await sb.from("votos").delete().eq("id",v.id); }
      setMsg("✅ ZERADO VOTO POR VOTO!");
      load();
    }
  }
  return (
    <div style={{padding:20,fontFamily:"system-ui",background:"#FFFFFF",minHeight:"100vh",opacity:1,filter:"none"}}>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginBottom:20}}>
        <a href="/api/export" style={{background:"#16a34a",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none",border:"3px solid black"}}>EXCEL CSV</a>
        <button onClick={load} style={{border:"4px solid black",padding:"10px 20px",borderRadius:20,fontWeight:900,cursor:"pointer",background:"#FFFFFF",color:"black",opacity:1}}>ATUALIZAR</button>
        <a href="/" style={{background:"black",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none",border:"3px solid black"}}>SITE</a>
      </div>
      {msg && <div style={{background:"black",color:"#facc15",padding:15,borderRadius:10,marginBottom:15,fontWeight:900,textAlign:"center",border:"3px solid black"}}>{msg}</div>}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:15,opacity:1,boxShadow:"0 8px 0 black"}}>
          <h2 style={{fontWeight:900,color:"black",opacity:1}}>🏆 RANKING - {votos.length} votos totais - FUNDO BRANCO NITIDO V21</h2>
          {cands.map((c:any)=>{
            const total=votos.length;
            const qtd=votos.filter((v:any)=>v.candidato_id===c.id).length;
            const pct=total?((qtd/total)*100).toFixed(1):0;
            if(qtd===0) return null;
            return (
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,border:"4px solid black",borderRadius:12,padding:10,marginTop:10,background:"#FFFFFF",opacity:1}}>
                <img src={getFotoUrl(c.foto_url)} onError={(e:any)=>e.target.src="https://i.pravatar.cc/100?u="+c.id} style={{width:55,height:55,borderRadius:"50%",border:"4px solid black",objectFit:"cover",background:"white",opacity:1}}/>
                <div style={{flex:1,color:"black",opacity:1}}><b style={{fontSize:16,color:"black"}}>{c.nome}</b> <span style={{background:"#e0f2fe",borderRadius:10,padding:"2px 8px",fontSize:12,border:"2px solid black",color:"black"}}>{c.partido} {c.numero}</span><br/><span style={{fontSize:13,color:"black",fontWeight:800}}>{qtd} votos • {pct}%</span></div>
                <b style={{fontSize:20,color:"black"}}>{qtd}</b>
              </div>
            )
          })}
          {votos.length===0 && <p style={{fontWeight:900,padding:20,textAlign:"center",background:"#FFFFFF",border:"4px solid black",borderRadius:10,color:"black",opacity:1}}>✅ ZERADO! Pronto pra receber votos reais!</p>}
        </div>
        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:15,opacity:1,boxShadow:"0 8px 0 black"}}>
          <h2 style={{fontWeight:900,color:"black"}}>📋 VOTOS CPF - {votos.length}</h2>
          <div style={{maxHeight:400,overflow:"auto",fontSize:12,marginBottom:15,background:"#FFFFFF",padding:10,borderRadius:10,border:"3px solid black",color:"black",opacity:1}}>
            {votos.map((v:any,i:number)=>{
              const cand=cands.find((c:any)=>c.id===v.candidato_id);
              return <div key={v.id} style={{borderBottom:"2px solid black",padding:"6px 0",color:"black"}}>{i+1}. <b>{cand?.nome}</b> - {cand?.partido}<br/>{new Date(v.created_at).toLocaleString()} - {v.cpf_hash?.slice(0,15)}</div>
            })}
            {votos.length===0 && <span style={{color:"black",fontWeight:900}}>Nenhum voto</span>}
          </div>
          <button onClick={limparLegados} style={{width:"100%",background:"#facc15",border:"4px solid black",borderRadius:20,padding:15,fontWeight:900,cursor:"pointer",boxShadow:"0 4px 0 black",color:"black",opacity:1}}>LIMPAR LEGADOS (hash-leg)</button>
        </div>
      </div>
    </div>
  )
}
