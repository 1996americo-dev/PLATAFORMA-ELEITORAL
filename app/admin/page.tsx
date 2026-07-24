"use client";
import {useEffect,useState} from "react";
import {createClient} from "@supabase/supabase-js";
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
export default function Admin(){
  const [votos,setVotos]=useState<any[]>([]);
  const [cands,setCands]=useState<any[]>([]);
  const [msg,setMsg]=useState("");
  async function load(){
    const {data:v}=await sb.from("votos").select("*").order("created_at",{ascending:false});
    const {data:c}=await sb.from("candidatos").select("*");
    setVotos(v||[]); setCands(c||[]);
  }
  useEffect(()=>{load()},[]);
  async function limparLegados(){
    if(!confirm("ZERAR TODOS OS VOTOS? Essa ação apaga tudo!")) return;
    setMsg("Limpando...");
    try{
      // Tenta 3 formas diferentes até uma funcionar
      let err=null;
      let res=await sb.from("votos").delete().neq("id","00000000-0000-0000-0000-000000000000");
      err=res.error;
      if(err){
        // tenta por id >0
        res=await sb.from("votos").delete().gt("created_at","1900-01-01");
        err=res.error;
      }
      if(err){
        // tenta via API route se tiver
        const r=await fetch("/api/limpar",{method:"POST"});
        const j=await r.json();
        if(!j.ok) throw new Error(j.error||"Falha API");
        setMsg("✅ ZERADO COM SUCESSO!");
        load(); return;
      }
      setMsg("✅ ZERADO COM SUCESSO!");
      load();
    }catch(e:any){
      setMsg("❌ Erro: "+e.message+" - Vá em Supabase > SQL e rode DELETE FROM votos;");
      alert("O RLS está bloqueando! Me avise que te mando o arquivo /api/limpar/route.ts pra limpar sem Supabase");
    }
  }
  return (
    <div style={{padding:20,fontFamily:"system-ui",background:"#f5f5dc",minHeight:"100vh"}}>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginBottom:20}}>
        <a href="/api/export" style={{background:"#16a34a",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none"}}>EXCEL CSV</a>
        <button onClick={load} style={{border:"3px solid black",padding:"10px 20px",borderRadius:20,fontWeight:900}}>ATUALIZAR</button>
        <a href="/" style={{background:"black",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none"}}>SITE</a>
      </div>
      {msg && <div style={{background:"black",color:"#facc15",padding:15,borderRadius:10,marginBottom:15,fontWeight:900,textAlign:"center"}}>{msg}</div>}
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{background:"white",border:"4px solid black",borderRadius:16,padding:15}}>
          <h2 style={{fontWeight:900}}>🏆 RANKING COM FOTO REAL</h2>
          {cands.map((c:any)=>{
            const total=votos.length;
            const qtd=votos.filter((v:any)=>v.candidato_id===c.id).length;
            const pct=total?((qtd/total)*100).toFixed(1):0;
            if(qtd===0) return null;
            return (
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,border:"3px solid black",borderRadius:12,padding:10,marginTop:10}}>
                <img src={c.foto_url?.startsWith("http")?c.foto_url:`https://yqfxhlwjdhybocoyonki.supabase.co/storage/v1/object/public/fotos-candidatos/${c.foto_url}`} style={{width:50,height:50,borderRadius:"50%",border:"3px solid black",objectFit:"cover"}}/>
                <div style={{flex:1}}><b>{c.nome}</b> <span style={{background:"#e0f2fe",borderRadius:10,padding:"2px 8px",fontSize:12}}>{c.partido} {c.numero}</span><br/>{qtd} votos • {pct}%</div>
                <b>{qtd}</b>
              </div>
            )
          })}
          {votos.length===0 && <p style={{fontWeight:900,padding:20}}>Nenhum voto - Zerado! ✅</p>}
        </div>
        <div style={{background:"white",border:"4px solid black",borderRadius:16,padding:15}}>
          <h2 style={{fontWeight:900}}>📋 VOTOS CPF AUDITORIA</h2>
          <div style={{maxHeight:300,overflow:"auto",fontSize:12,marginBottom:15}}>
            {votos.map((v:any,i:number)=>{
              const cand=cands.find((c:any)=>c.id===v.candidato_id);
              return <div key={v.id} style={{borderBottom:"1px solid #ddd",padding:"5px 0"}}>{i+1}. {cand?.nome} - {cand?.partido}<br/>{new Date(v.created_at).toLocaleString()} - {v.cpf_hash?.slice(0,10)} - VALIDO</div>
            })}
          </div>
          <button onClick={limparLegados} style={{width:"100%",background:"#facc15",border:"4px solid black",borderRadius:20,padding:15,fontWeight:900,cursor:"pointer"}}>LIMPAR LEGADOS (hash-leg)</button>
        </div>
      </div>
    </div>
  )
}
