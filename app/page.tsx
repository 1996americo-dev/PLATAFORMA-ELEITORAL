"use client";
import {useState,useEffect} from "react";
import {createClient} from "@supabase/supabase-js";
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
function getFoto(f:string){ if(!f) return "https://via.placeholder.com/150"; if(f.startsWith("http")) return f; return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos-candidatos/${f}`; }
export default function Home(){
  const [cands,setCands]=useState<any[]>([]); const [votos,setVotos]=useState<any[]>([]); const [cpf,setCpf]=useState(""); const [valido,setValido]=useState(false); const [votou,setVotou]=useState(false);
  useEffect(()=>{ (async()=>{ const {data:c}=await sb.from("candidatos").select("*").order("nome"); const {data:v}=await sb.from("votos").select("*"); setCands(c||[]); setVotos(v||[]); })() },[]);
  function validarCPF(c:string){ c=c.replace(/\D/g,""); if(c.length!==11) return false; if(/^(\d)\1{10}$/.test(c)) return false; let s=0; for(let i=0;i<9;i++) s+=parseInt(c[i])*(10-i); let r=11-(s%11); if(r>9) r=0; if(parseInt(c[9])!==r) return false; s=0; for(let i=0;i<10;i++) s+=parseInt(c[i])*(11-i); r=11-(s%11); if(r>9) r=0; return parseInt(c[10])===r; }
  async function handleValidar(){ const limpo=cpf.replace(/\D/g,""); if(!validarCPF(limpo)){ alert("CPF inválido!"); return; } const hash=btoa(limpo).slice(0,20); const {data}=await sb.from("votos").select("*").eq("cpf_hash",hash); if(data && data.length>0){ alert("CPF já votou!"); return; } setValido(true); alert("CPF validado! Agora escolha seu candidato!"); }
  async function votar(id:string){ if(!valido){ alert("Valide o CPF primeiro!"); return; } const limpo=cpf.replace(/\D/g,""); const hash=btoa(limpo).slice(0,20); const {error}=await sb.from("votos").insert({candidato_id:id,cpf_hash:hash}); if(error){ alert("Erro: "+error.message); return; } setVotou(true); setVotos([...votos,{candidato_id:id}]); setTimeout(()=>{ setVotou(false); setValido(false); setCpf(""); },3000); }
  return (
    <div style={{background:"#FFFFFF",minHeight:"100vh",padding:20,fontFamily:"system-ui",opacity:1}}>
      <div style={{background:"#FFFFFF",border:"4px solid black",borderRadius:12,padding:10,marginBottom:15,textAlign:"center",fontWeight:900,fontSize:12,opacity:1,color:"black",boxShadow:"0 4px 0 black"}}>V22 BRANCO NITIDO 100% - BUCKET fotos-candidatos - {cands.length} CANDIDATOS - {votos.length} VOTOS</div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:20,opacity:1,boxShadow:"0 8px 0 black"}}>
          <h2 style={{fontWeight:900,fontSize:20,color:"black"}}>🏆 RANKING - {votos.length} VOTOS</h2>
          <div style={{border:"3px dashed black",borderRadius:12,padding:20,textAlign:"center",margin:"15px 0",background:"#FFFFFF",color:"black",fontWeight:900,opacity:1}}>{votos.length===0?"Nenhum voto ainda":`Total: ${votos.length} votos`}</div>
          <h3 style={{fontWeight:900,color:"black",opacity:1}}>TODOS CANDIDATOS - {cands.length} NITIDOS 100%</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginTop:10}}>
            {cands.map((c:any)=>{
              const qtd=votos.filter((v:any)=>v.candidato_id===c.id).length;
              return (
                <div key={c.id} style={{border:"4px solid black",borderRadius:12,padding:12,background:"#FFFFFF",opacity:1,boxShadow:"0 4px 0 black",cursor:"pointer"}} onClick={()=>votar(c.id)}>
                  <div style={{display:"flex",gap:10,alignItems:"center"}}>
                    <img src={getFoto(c.foto_url)} onError={(e:any)=>e.target.src=`https://i.pravatar.cc/100?u=${c.id}`} style={{width:50,height:50,borderRadius:"50%",border:"3px solid black",objectFit:"cover",background:"white",opacity:1}}/>
                    <div style={{flex:1}}><b style={{color:"black",fontSize:14}}>{c.nome}</b><br/><span style={{fontSize:12,border:"2px solid black",borderRadius:8,padding:"2px 6px",background:"#e0f2fe",color:"black",fontWeight:800}}>{c.partido} • {c.numero}</span><br/><span style={{fontSize:10,background:"black",color:"white",padding:"2px 6px",borderRadius:6,fontWeight:900}}>{valido?"CLIQUE PARA VOTAR":"VALIDE CPF PARA VOTAR"}</span></div>
                  </div>
                  {qtd>0 && <div style={{marginTop:8,fontWeight:900,textAlign:"center",background:"#facc15",borderRadius:8,padding:4,border:"2px solid black",color:"black"}}>{qtd} votos - {votos.length?((qtd/votos.length)*100).toFixed(1):0}%</div>}
                </div>
              )
            })}
          </div>
        </div>
        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:20,height:"fit-content",opacity:1,boxShadow:"0 8px 0 black"}}>
          <h3 style={{fontWeight:900,color:"black"}}>🔐 VALIDACAO CPF</h3>
          <input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",border:"4px solid black",borderRadius:20,padding:15,textAlign:"center",fontWeight:900,fontSize:18,marginTop:10,background:"#FFFFFF",color:"black",opacity:1}}/>
          <button onClick={handleValidar} style={{width:"100%",background:"black",color:"white",border:"4px solid black",borderRadius:20,padding:15,fontWeight:900,marginTop:10,cursor:"pointer",opacity:1}}>VALIDAR CPF - LIBERAR URNA</button>
          {valido && <div style={{background:"#22c55e",color:"white",border:"4px solid black",borderRadius:12,padding:10,textAlign:"center",fontWeight:900,marginTop:10}}>✅ CPF VALIDADO! VOTE!</div>}
          {votou && <div style={{background:"#16a34a",color:"white",border:"4px solid black",borderRadius:12,padding:15,textAlign:"center",fontWeight:900,marginTop:10}}>✅ VOTO COMPUTADO!</div>}
          <a href="/admin" style={{display:"block",textAlign:"center",marginTop:15,background:"#FFFFFF",border:"3px solid black",borderRadius:20,padding:10,fontWeight:900,textDecoration:"none",color:"black"}}>ADMIN</a>
        </div>
      </div>
    </div>
  )
}
