"use client";
import {useEffect,useState} from "react";
import {createClient} from "@supabase/supabase-js";
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
function getFotoUrl(foto:string){ if(!foto) return "https://via.placeholder.com/150"; if(foto.startsWith("http")) return foto; return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos-candidatos/${foto}`; }

export default function Admin(){
  const [votos,setVotos]=useState<any[]>([]);
  const [cands,setCands]=useState<any[]>([]);
  const [msg,setMsg]=useState("");
  // Form cadastro
  const [nome,setNome]=useState(""); const [numero,setNumero]=useState(""); const [partido,setPartido]=useState(""); const [propostas,setPropostas]=useState(""); const [fotoFile,setFotoFile]=useState<File|null>(null); const [uploading,setUploading]=useState(false);

  async function load(){ const {data:v}=await sb.from("votos").select("*").order("created_at",{ascending:false}); const {data:c}=await sb.from("candidatos").select("*").order("nome"); setVotos(v||[]); setCands(c||[]); }
  useEffect(()=>{load()},[]);

  async function cadastrar(e:any){
    e.preventDefault();
    if(!nome||!numero||!partido){ alert("Preencha Nome, Numero e Partido"); return; }
    setUploading(true); setMsg("Salvando candidato...");
    try{
      let fotoNome = "";
      if(fotoFile){
        fotoNome = `${Date.now()}_${fotoFile.name.replace(/\s/g,"_")}`;
        const {error:upErr}=await sb.storage.from("fotos-candidatos").upload(fotoNome,fotoFile);
        if(upErr) throw upErr;
      }
      const {error}=await sb.from("candidatos").insert({nome,numero,partido,propostas,foto_url:fotoNome});
      if(error) throw error;
      setMsg(`✅ ${nome} cadastrado!`);
      setNome(""); setNumero(""); setPartido(""); setPropostas(""); setFotoFile(null);
      (document.getElementById("fotoInput") as any).value="";
      load();
    }catch(err:any){ setMsg("❌ Erro: "+err.message); }
    setUploading(false);
  }

  async function excluir(id:string,nome:string,foto_url:string){
    if(!confirm(`Excluir ${nome} ? Vai apagar todos os votos dele também!`)) return;
    // apaga votos dele primeiro
    await sb.from("votos").delete().eq("candidato_id",id);
    // apaga candidato
    const {error}=await sb.from("candidatos").delete().eq("id",id);
    if(error){ alert(error.message); return; }
    if(foto_url && !foto_url.startsWith("http")){
      await sb.storage.from("fotos-candidatos").remove([foto_url]);
    }
    setMsg(`🗑️ ${nome} excluído`);
    load();
  }

  async function limparTudo(){
    if(!confirm("ZERAR TODOS OS VOTOS?")) return;
    setMsg("Limpando...");
    for(const v of votos){ await sb.from("votos").delete().eq("id",v.id); }
    setMsg("✅ VOTOS ZERADOS!");
    load();
  }

  return (
    <div style={{padding:20,fontFamily:"system-ui",background:"#FFFFFF",minHeight:"100vh"}}>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginBottom:20,flexWrap:"wrap"}}>
        <a href="/api/export" style={{background:"#16a34a",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none",border:"3px solid black"}}>EXCEL CSV</a>
        <button onClick={load} style={{border:"4px solid black",padding:"10px 20px",borderRadius:20,fontWeight:900,cursor:"pointer",background:"#FFFFFF"}}>ATUALIZAR</button>
        <a href="/" style={{background:"black",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none",border:"3px solid black"}}>SITE</a>
      </div>
      {msg && <div style={{background:"black",color:"#facc15",padding:15,borderRadius:10,marginBottom:15,fontWeight:900,textAlign:"center",border:"3px solid black"}}>{msg}</div>}

      {/* NOVO - CADASTRO DE CANDIDATO - SISTEMA UNIVERSAL */}
      <div style={{background:"#facc15",border:"5px solid black",borderRadius:16,padding:20,marginBottom:20,boxShadow:"0 8px 0 black"}}>
        <h2 style={{fontWeight:900,margin:0,color:"black"}}>➕ CADASTRAR NOVO CANDIDATO - USO UNIVERSAL (Escola, Município, Comunidade)</h2>
        <p style={{fontWeight:800,fontSize:13,margin:"5px 0 15px 0"}}>Preencha e o candidato aparece na hora na plataforma!</p>
        <form onSubmit={cadastrar} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:15}}>
          <div><label style={{fontWeight:900,fontSize:12}}>NOME *</label><input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex: João da Silva" style={{width:"100%",border:"3px solid black",borderRadius:10,padding:12,fontWeight:800,background:"white"}} required/></div>
          <div><label style={{fontWeight:900,fontSize:12}}>NÚMERO *</label><input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Ex: 13, 22, 10" style={{width:"100%",border:"3px solid black",borderRadius:10,padding:12,fontWeight:800,background:"white"}} required/></div>
          <div><label style={{fontWeight:900,fontSize:12}}>PARTIDO / CHAPA / TURMA *</label><input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Ex: PL, PT, 3ºA, Chapa 1" style={{width:"100%",border:"3px solid black",borderRadius:10,padding:12,fontWeight:800,background:"white"}} required/></div>
          <div style={{gridColumn:"1 / 3"}}><label style={{fontWeight:900,fontSize:12}}>PROPOSTAS (opcional - aparece no card)</label><textarea value={propostas} onChange={e=>setPropostas(e.target.value)} placeholder="Ex: Melhorar merenda, quadra esportiva, segurança..." style={{width:"100%",border:"3px solid black",borderRadius:10,padding:12,fontWeight:700,background:"white",minHeight:60}} /></div>
          <div><label style={{fontWeight:900,fontSize:12}}>FOTO (JPG/PNG)</label><input id="fotoInput" type="file" accept="image/*" onChange={e=>setFotoFile(e.target.files?.[0]||null)} style={{width:"100%",border:"3px solid black",borderRadius:10,padding:10,background:"white",fontWeight:700}}/><button type="submit" disabled={uploading} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",border:"3px solid black",borderRadius:12,padding:12,fontWeight:900,cursor:"pointer"}}>{uploading?"SALVANDO...":"CADASTRAR CANDIDATO"}</button></div>
        </form>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:15,boxShadow:"0 8px 0 black"}}>
          <h2 style={{fontWeight:900,color:"black"}}>🏆 RANKING - {votos.length} votos • {cands.length} candidatos cadastrados</h2>
          {cands.map((c:any)=>{
            const total=votos.length; const qtd=votos.filter((v:any)=>v.candidato_id===c.id).length; const pct=total?((qtd/total)*100).toFixed(1):0;
            return (
              <div key={c.id} style={{display:"flex",alignItems:"center",gap:12,border:"4px solid black",borderRadius:12,padding:10,marginTop:10,background:qtd>0?"#fefce8":"#FFFFFF"}}>
                <img src={getFotoUrl(c.foto_url)} onError={(e:any)=>e.target.src=`https://i.pravatar.cc/100?u=${c.id}`} style={{width:55,height:55,borderRadius:"50%",border:"4px solid black",objectFit:"cover",background:"white"}}/>
                <div style={{flex:1,color:"black"}}><b style={{fontSize:15}}>{c.nome}</b> <span style={{background:"#e0f2fe",borderRadius:10,padding:"2px 8px",fontSize:11,border:"2px solid black"}}>{c.partido} {c.numero}</span>{c.propostas && <div style={{fontSize:11,marginTop:4,fontWeight:600,background:"white",border:"1px solid #ddd",borderRadius:6,padding:4}}>{c.propostas.slice(0,100)}</div>}<div style={{fontSize:12,fontWeight:800}}>{qtd} votos • {pct}%</div></div>
                <div style={{display:"flex",flexDirection:"column",gap:5}}><b style={{fontSize:20,textAlign:"center"}}>{qtd}</b><button onClick={()=>excluir(c.id,c.nome,c.foto_url)} style={{background:"#ef4444",color:"white",border:"3px solid black",borderRadius:10,padding:"5px 10px",fontWeight:900,cursor:"pointer",fontSize:11}}>EXCLUIR</button></div>
              </div>
            )
          })}
          {cands.length===0 && <p style={{fontWeight:900,padding:20,textAlign:"center",background:"#FFFFFF",border:"4px solid black",borderRadius:10}}>Nenhum candidato. Cadastre acima!</p>}
        </div>

        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:15,boxShadow:"0 8px 0 black"}}>
          <h2 style={{fontWeight:900,color:"black"}}>📋 VOTOS - {votos.length}</h2>
          <div style={{maxHeight:300,overflow:"auto",fontSize:11,marginBottom:15,background:"#FFFFFF",padding:10,borderRadius:10,border:"3px solid black"}}>
            {votos.map((v:any,i:number)=>{ const cand=cands.find((c:any)=>c.id===v.candidato_id); return <div key={v.id} style={{borderBottom:"2px solid black",padding:"6px 0"}}>{i+1}. <b>{cand?.nome||"??"}</b> - {cand?.partido}<br/>{new Date(v.created_at).toLocaleString()}</div> })}
            {votos.length===0 && <b>Nenhum voto</b>}
          </div>
          <button onClick={limparTudo} style={{width:"100%",background:"#facc15",border:"4px solid black",borderRadius:20,padding:15,fontWeight:900,cursor:"pointer",boxShadow:"0 4px 0 black"}}>ZERAR VOTOS</button>
          <div style={{marginTop:15,background:"black",color:"white",borderRadius:10,padding:12,fontSize:11,fontWeight:800}}><b style={{color:"#facc15"}}>DICA USO UNIVERSAL:</b><br/>• Escola: Use TURMA no campo Partido<br/>• Município: Use PARTIDO<br/>• Comunidade: Use CHAPA<br/>• Grêmio: Use PROPOSTAS<br/>Foto sobe direto pro Supabase!</div>
        </div>
      </div>
    </div>
  )
}
