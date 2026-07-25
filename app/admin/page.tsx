"use client";
import {useEffect,useState} from "react";
import {createClient} from "@supabase/supabase-js";
const sb=createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
function getFotoUrl(foto:string){ if(!foto) return "https://via.placeholder.com/150"; if(foto.startsWith("http")) return foto; return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/fotos-candidatos/${foto}`; }

export default function Admin(){
  const [votos,setVotos]=useState<any[]>([]); const [cands,setCands]=useState<any[]>([]); const [msg,setMsg]=useState("");
  const [nome,setNome]=useState(""); const [numero,setNumero]=useState(""); const [partido,setPartido]=useState(""); const [cargo,setCargo]=useState("Presidente"); const [propostas,setPropostas]=useState(""); const [fotoFile,setFotoFile]=useState<File|null>(null); const [uploading,setUploading]=useState(false);

  async function load(){ const {data:v}=await sb.from("votos").select("*").order("created_at",{ascending:false}); const {data:c}=await sb.from("candidatos").select("*").order("nome"); setVotos(v||[]); setCands(c||[]); }
  useEffect(()=>{load()},[]);

  async function cadastrar(e:any){
    e.preventDefault();
    if(!nome||!numero||!partido||!cargo){ alert("Preencha todos"); return; }
    setUploading(true); setMsg("Salvando...");
    try{
      let fotoNome="";
      if(fotoFile){ fotoNome=`${Date.now()}_${fotoFile.name.replace(/\s/g,"_")}`; const {error:upErr}=await sb.storage.from("fotos-candidatos").upload(fotoNome,fotoFile); if(upErr) throw upErr; }
      // tenta com coluna cargo, se não existir salva cargo dentro de propostas ou usa coluna existente
      let {error}=await sb.from("candidatos").insert({nome,numero,partido,cargo,propostas,foto_url:fotoNome});
      if(error && error.message.includes("cargo")){ // fallback se coluna cargo ainda não existe no banco
        console.log("Coluna cargo não existe, salvando sem");
        const res=await sb.from("candidatos").insert({nome,numero,partido,propostas:`[${cargo}] ${propostas}`,foto_url:fotoNome});
        if(res.error) throw res.error;
        setMsg(`✅ ${nome} para ${cargo} cadastrado! (Crie coluna 'cargo' no Supabase pra separar)`);
      } else {
        if(error) throw error;
        setMsg(`✅ ${nome} para ${cargo} cadastrado!`);
      }
      setNome(""); setNumero(""); setPartido(""); setPropostas(""); setCargo("Presidente"); setFotoFile(null); (document.getElementById("fotoInput") as any).value="";
      load();
    }catch(err:any){ setMsg("❌ Erro: "+err.message); }
    setUploading(false);
  }

  async function excluir(id:string,nome:string,foto_url:string){ if(!confirm(`Excluir ${nome}?`)) return; await sb.from("votos").delete().eq("candidato_id",id); const {error}=await sb.from("candidatos").delete().eq("id",id); if(error){ alert(error.message); return; } if(foto_url && !foto_url.startsWith("http")){ await sb.storage.from("fotos-candidatos").remove([foto_url]); } setMsg(`🗑️ ${nome} excluído`); load(); }
  async function limparTudo(){ if(!confirm("ZERAR VOTOS?")) return; setMsg("Limpando..."); for(const v of votos){ await sb.from("votos").delete().eq("id",v.id); } setMsg("✅ ZERADO!"); load(); }

  return (
    <div style={{padding:20,fontFamily:"system-ui",background:"#FFFFFF",minHeight:"100vh"}}>
      <div style={{display:"flex",gap:10,justifyContent:"flex-end",marginBottom:20,flexWrap:"wrap"}}>
        <a href="/api/export" style={{background:"#16a34a",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none",border:"3px solid black"}}>EXCEL</a>
        <button onClick={load} style={{border:"4px solid black",padding:"10px 20px",borderRadius:20,fontWeight:900,cursor:"pointer",background:"#FFFFFF"}}>ATUALIZAR</button>
        <a href="/" style={{background:"black",color:"white",padding:"10px 20px",borderRadius:20,fontWeight:900,textDecoration:"none",border:"3px solid black"}}>SITE</a>
      </div>
      {msg && <div style={{background:"black",color:"#facc15",padding:15,borderRadius:10,marginBottom:15,fontWeight:900,textAlign:"center",border:"3px solid black"}}>{msg}</div>}

      <div style={{background:"#facc15",border:"5px solid black",borderRadius:16,padding:20,marginBottom:20,boxShadow:"0 8px 0 black"}}>
        <h2 style={{fontWeight:900,margin:0,color:"black"}}>➕ CADASTRAR CANDIDATO - SISTEMA UNIVERSAL</h2>
        <form onSubmit={cadastrar} style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:15,marginTop:15}}>
          <div><label style={{fontWeight:900,fontSize:12}}>NOME *</label><input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Ex: João da Silva" style={{width:"100%",border:"3px solid black",borderRadius:10,padding:12,fontWeight:800,background:"white"}} required/></div>
          <div><label style={{fontWeight:900,fontSize:12}}>NÚMERO *</label><input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Ex: 13" style={{width:"100%",border:"3px solid black",borderRadius:10,padding:12,fontWeight:800,background:"white"}} required/></div>
          <div><label style={{fontWeight:900,fontSize:12}}>CARGO *</label>
            <select value={cargo} onChange={e=>setCargo(e.target.value)} style={{width:"100%",border:"3px solid black",borderRadius:10,padding:12,fontWeight:900,background:"white",cursor:"pointer"}}>
              <option>Presidente</option><option>Governador</option><option>Senador</option><option>Deputado Federal</option><option>Deputado Estadual</option><option>Prefeito</option><option>Vereador</option><option>Diretor</option><option>Presidente de Grêmio</option><option>Representante de Turma</option><option>Síndico</option><option>Conselho Tutelar</option><option>Outro</option>
            </select>
          </div>
          <div><label style={{fontWeight:900,fontSize:12}}>PARTIDO / CHAPA / TURMA *</label><input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Ex: PL, PT, Chapa 1, 3ºA" style={{width:"100%",border:"3px solid black",borderRadius:10,padding:12,fontWeight:800,background:"white"}} required/></div>
          <div style={{gridColumn:"1 / 3"}}><label style={{fontWeight:900,fontSize:12}}>PROPOSTAS (opcional)</label><textarea value={propostas} onChange={e=>setPropostas(e.target.value)} placeholder="Ex: Melhorar merenda, quadra..." style={{width:"100%",border:"3px solid black",borderRadius:10,padding:12,fontWeight:700,background:"white",minHeight:70}} /></div>
          <div style={{gridColumn:"3 / 5"}}><label style={{fontWeight:900,fontSize:12}}>FOTO (JPG/PNG)</label><input id="fotoInput" type="file" accept="image/*" onChange={e=>setFotoFile(e.target.files?.[0]||null)} style={{width:"100%",border:"3px solid black",borderRadius:10,padding:10,background:"white",fontWeight:700}}/><button type="submit" disabled={uploading} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",border:"3px solid black",borderRadius:12,padding:12,fontWeight:900,cursor:"pointer"}}>{uploading?"SALVANDO...":"CADASTRAR PARA "+cargo.toUpperCase()}</button></div>
        </form>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:15,boxShadow:"0 8px 0 black"}}>
          <h2 style={{fontWeight:900,color:"black"}}>🏆 RANKING - {votos.length} votos • {cands.length} cadastrados</h2>
          {cands.map((c:any)=>{ const total=votos.length; const qtd=votos.filter((v:any)=>v.candidato_id===c.id).length; const pct=total?((qtd/total)*100).toFixed(1):0; return (<div key={c.id} style={{display:"flex",alignItems:"center",gap:12,border:"4px solid black",borderRadius:12,padding:10,marginTop:10,background:qtd>0?"#fefce8":"#FFFFFF"}}><img src={getFotoUrl(c.foto_url)} onError={(e:any)=>e.target.src=`https://i.pravatar.cc/100?u=${c.id}`} style={{width:55,height:55,borderRadius:"50%",border:"4px solid black",objectFit:"cover",background:"white"}}/><div style={{flex:1,color:"black"}}><b style={{fontSize:14}}>{c.nome}</b> <span style={{background:"#facc15",borderRadius:10,padding:"2px 8px",fontSize:10,border:"2px solid black",fontWeight:900}}>{c.cargo||"Presidente"}</span> <span style={{background:"#e0f2fe",borderRadius:10,padding:"2px 8px",fontSize:11,border:"2px solid black"}}>{c.partido} {c.numero}</span>{c.propostas && <div style={{fontSize:11,marginTop:4,fontWeight:600,background:"white",border:"1px solid #ddd",borderRadius:6,padding:4}}>{c.propostas.slice(0,120)}</div>}<div style={{fontSize:12,fontWeight:800}}>{qtd} votos • {pct}%</div></div><div style={{display:"flex",flexDirection:"column",gap:5}}><b style={{fontSize:20,textAlign:"center"}}>{qtd}</b><button onClick={()=>excluir(c.id,c.nome,c.foto_url)} style={{background:"#ef4444",color:"white",border:"3px solid black",borderRadius:10,padding:"5px 10px",fontWeight:900,cursor:"pointer",fontSize:11}}>EXCLUIR</button></div></div>) })}
        </div>
        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:15,boxShadow:"0 8px 0 black"}}>
          <h2 style={{fontWeight:900,color:"black"}}>📋 VOTOS - {votos.length}</h2>
          <div style={{maxHeight:300,overflow:"auto",fontSize:11,marginBottom:15,background:"#FFFFFF",padding:10,borderRadius:10,border:"3px solid black"}}>{votos.map((v:any,i:number)=>{ const cand=cands.find((c:any)=>c.id===v.candidato_id); return <div key={v.id} style={{borderBottom:"2px solid black",padding:"6px 0"}}>{i+1}. <b>{cand?.nome||"??"}</b> - {cand?.cargo||""} {cand?.partido}<br/>{new Date(v.created_at).toLocaleString()}</div> })}{votos.length===0 && <b>Nenhum voto</b>}</div>
          <button onClick={limparTudo} style={{width:"100%",background:"#facc15",border:"4px solid black",borderRadius:20,padding:15,fontWeight:900,cursor:"pointer",boxShadow:"0 4px 0 black"}}>ZERAR VOTOS</button>
        </div>
      </div>

      <div style={{marginTop:20,background:"black",color:"white",borderRadius:12,padding:15,border:"3px solid black"}}>
        <b style={{color:"#facc15"}}>⚠️ IMPORTANTE - CRIAR COLUNA CARGO NO SUPABASE (1 minuto):</b><br/>
        Vai no Supabase → Table Editor → candidatos → Add Column → Name: cargo → Type: text → Default: Presidente → Save.<br/>Se não criar, funciona mesmo assim, salva o cargo dentro das propostas!
      </div>
    </div>
  )
}
