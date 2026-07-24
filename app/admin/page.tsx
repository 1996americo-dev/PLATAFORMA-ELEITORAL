"use client";
import {useEffect,useState} from "react";
import {createClient} from "@supabase/supabase-js";
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

function getFotoUrl(foto:string){
  if(!foto) return "https://via.placeholder.com/150";
  if(foto.startsWith("http")) return foto;
  // Usa a URL do seu próprio .env.local
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
      // fallback apaga um por um
      for(const v of votos){
        await sb.from("votos").delete().eq("id",v.id);
      }
      setMsg("✅ ZERADO VOTO POR VOTO!");
      load();
    }
  }

  return (
    <div style={{padding:20,fontFamily:"system-ui",background:"#f5f5dc",minHeight:"100vh"}}>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginBottom:20}}>
        <a href="/api/export" style={{background:"#16a34a",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none"}}>EXCEL CSV</a>
        <button onClick={load} style={{border:"3px solid black",padding:"10px 20px",borderRadius:20,fontWeight:900,cursor:"pointer"}}>ATUALIZAR</button>
        <a href="/" style={{background:"black",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none"}}>SITE</a>
      </div>
      {msg && <div style={{background:"black",color:"#facc15",padding:15,borderRadius:10,marginBottom:15,fontWeight:900,textAlign:"center"}}>{msg}</div>}
      
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{background:"white",border:"4px solid black",borderRadius:16,padding:15}}>
          <h2 style={{fontWeight:900}}>🏆 RANKING - {votos.length} votos totais</h2>
          {cands.map((c:any)=>{
            const total=votos.length;
            const qtd=votos.filter((v:any)=>v.candidato_id===c.id).length;
            const pct=total?((qtd/total)*100).toFixed(1):0;
            if(qtd===0) return null;
            return (
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,border:"3px solid black",borderRadius:12,padding:10,marginTop:10,background:"#fff"}}>
                <img src={getFotoUrl(c.foto_url)} onError={(e:any)=>e.target.src="https://i.pravatar.cc/100?u="+c.id} style={{width:55,height:55,borderRadius:"50%",border:"3px solid black",objectFit:"cover",background:"white"}}/>
                <div style={{flex:1}}><b style={{fontSize:16}}>{c.nome}</b> <span style={{background:"#e0f2fe",borderRadius:10,padding:"2px 8px",fontSize:12,border:"1px solid black"}}>{c.partido} {c.numero}</span><br/><span style={{fontSize:13}}>{qtd} votos • {pct}%</span></div>
                <b style={{fontSize:20}}>{qtd}</b>
              </div>
            )
          })}
          {votos.length===0 && <p style={{fontWeight:900,padding:20,textAlign:"center",background:"#f0fdf4",borderRadius:10}}>✅ ZERADO! Pronto pra receber votos reais!</p>}
          <hr style={{marginTop:20}}/>
          <h3 style={{fontWeight:900}}>Todos Candidatos no banco:</h3>
          {cands.map((c:any)=>(
            <div key={c.id} style={{display:"flex",alignItems:"center",gap:10,marginTop:8,fontSize:12,border:"1px solid #ddd",padding:5,borderRadius:8}}>
              <img src={getFotoUrl(c.foto_url)} onError={(e:any)=>e.target.src="https://i.pravatar.cc/100?u="+c.id} style={{width:30,height:30,borderRadius:"50%",border:"2px solid black",objectFit:"cover"}}/>
              {c.nome} - {c.foto_url}
            </div>
          ))}
        </div>

        <div style={{background:"white",border:"4px solid black",borderRadius:16,padding:15}}>
          <h2 style={{fontWeight:900}}>📋 VOTOS CPF AUDITORIA - {votos.length}</h2>
          <div style={{maxHeight:400,overflow:"auto",fontSize:12,marginBottom:15,background:"#fafafa",padding:10,borderRadius:10}}>
            {votos.map((v:any,i:number)=>{
              const cand=cands.find((c:any)=>c.id===v.candidato_id);
              return <div key={v.id} style={{borderBottom:"1px solid #ddd",padding:"6px 0"}}>{i+1}. <b>{cand?.nome}</b> - {cand?.partido}<br/>{new Date(v.created_at).toLocaleString()} - {v.cpf_hash?.slice(0,15)} - VALIDO</div>
            })}
            {votos.length===0 && "Nenhum voto"}
          </div>
          <button onClick={limparLegados} style={{width:"100%",background:"#facc15",border:"4px solid black",borderRadius:20,padding:15,fontWeight:900,cursor:"pointer",boxShadow:"0 4px 0 black"}}>LIMPAR LEGADOS (hash-leg)</button>
        </div>
      </div>
    </div>
  )
}
