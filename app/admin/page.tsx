"use client"
import React from "react"

export default function AdminPage(){
  const [liberado,setLiberado]=React.useState(false)
  const [codInput,setCodInput]=React.useState("")
  const [codigoAtual,setCodigoAtual]=React.useState("")
  const [candidatos,setCandidatos]=React.useState<any[]>([])
  const [votos,setVotos]=React.useState<number[]>([])
  const [nome,setNome]=React.useState("")
  const [partido,setPartido]=React.useState("")
  const [numero,setNumero]=React.useState("")
  const [link,setLink]=React.useState("")
  const [propostas,setPropostas]=React.useState("")
  const [cargo,setCargo]=React.useState("Presidente")
  const [cargoCustom,setCargoCustom]=React.useState("")
  const fileRef=React.useRef<HTMLInputElement>(null)

  React.useEffect(()=>{
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    if(codAtual) setCodigoAtual(codAtual)
    const cc=localStorage.getItem("candidatos_"+codAtual)
    const v=localStorage.getItem("votos_"+codAtual)
    if(cc){
      setCandidatos(JSON.parse(cc))
    } else {
      setCandidatos([
        {nome:"Bolsonaro",partido:"PL - 22",numero:"22",foto:"https://i.pravatar.cc/150?img=1",cargo:"Presidente",propostas:["Economia liberal","Segurança"]},
        {nome:"Ciro Gomes",partido:"PDT - 12",numero:"12",foto:"https://i.pravatar.cc/150?img=2",cargo:"Presidente",propostas:["Desenvolvimento","Educação"]},
        {nome:"Eduardo Leite",partido:"PSDB - 45",numero:"45",foto:"https://i.pravatar.cc/150?img=3",cargo:"Presidente",propostas:["Gestão moderna","Inclusão"]},
        {nome:"Erika Hilton",partido:"PSOL - 50",numero:"50",foto:"https://i.pravatar.cc/150?img=4",cargo:"Presidente",propostas:["Direitos LGBTQIA+","Igualdade"]},
        {nome:"Lula",partido:"PT - 13",numero:"13",foto:"https://i.pravatar.cc/150?img=5",cargo:"Presidente",propostas:["Bolsa Família","Emprego"]},
        {nome:"Simone Tebet",partido:"MDB - 15",numero:"15",foto:"https://i.pravatar.cc/150?img=6",cargo:"Presidente",propostas:["Justiça social","Educação"]},
        {nome:"Marina Silva",partido:"REDE - 18",numero:"18",foto:"https://i.pravatar.cc/150?img=7",cargo:"Presidente",propostas:["Sustentabilidade","Amazônia"]},
        {nome:"Nikolas Ferreira",partido:"PL - 22",numero:"22",foto:"https://i.pravatar.cc/150?img=8",cargo:"Presidente",propostas:["Família","Liberdade"]},
        {nome:"Tabata Amaral",partido:"PSB - 40",numero:"40",foto:"https://i.pravatar.cc/150?img=9",cargo:"Presidente",propostas:["Educação","Tecnologia"]},
        {nome:"Romeu Zema",partido:"NOVO - 30",numero:"30",foto:"https://i.pravatar.cc/150?img=10",cargo:"Presidente",propostas:["Menos impostos","Gestão"]},
        {nome:"Ronaldo Caiado",partido:"UNIAO - 44",numero:"44",foto:"https://i.pravatar.cc/150?img=11",cargo:"Presidente",propostas:["Saúde","Agro"]},
      ])
    }
    if(v){
      setVotos(JSON.parse(v))
    } else {
      setVotos(Array(11).fill(0))
    }
  },[])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(!cod.startsWith("LIBERADO-")&&cod!=="DONO"){
      alert("Senha inválida! Use DONO ou LIBERADO-XXXX");return
    }
    setCodigoAtual(cod)
    setLiberado(true)
  }

  function handleFoto(e:any){
    const file=e.target.files?.[0]
    if(!file) return
    if(file.size>2*1024*1024){alert("Foto muito grande! Max 2MB");return}
    const reader=new FileReader()
    reader.onload=(ev)=>{const base64=ev.target?.result as string;setLink(base64);alert("✅ Foto carregada!")}
    reader.readAsDataURL(file)
  }

  function salvar(){
    if(!nome){alert("Nome obrigatório");return}
    if(!numero){alert("Número obrigatório");return}
    const cargoFinal=cargo==="Outros"?cargoCustom:cargo
    if(cargo==="Outros" &&!cargoCustom){alert("Digite o cargo em Outros");return}
    const listaProps=propostas.split(";").filter(p=>p.trim()!=="").map(p=>p.trim())
    const novo={nome,partido:partido+" - "+numero,numero,foto:link||`https://i.pravatar.cc/150?img=${candidatos.length+20}`,cargo:cargoFinal,propostas:listaProps.length>0?listaProps:["Sem propostas"]}
    const lista=[...candidatos,novo]
    setCandidatos(lista)
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    localStorage.setItem("candidatos_"+codAtual,JSON.stringify(lista))
    const nv=[...votos,0]
    setVotos(nv)
    localStorage.setItem("votos_"+codAtual,JSON.stringify(nv))
    setNome("");setPartido("");setNumero("");setLink("");setPropostas("");setCargoCustom("")
  }

  function remover(i:number){
    if(!confirm("Remover "+candidatos[i].nome+"?")) return
    const lista=candidatos.filter((_,idx)=>idx!==i)
    const nv=votos.filter((_,idx)=>idx!==i)
    setCandidatos(lista)
    setVotos(nv)
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    localStorage.setItem("candidatos_"+codAtual,JSON.stringify(lista))
    localStorage.setItem("votos_"+codAtual,JSON.stringify(nv))
  }

  const total=votos.reduce((a,b)=>a+b,0)
  const ranking=candidatos.map((c,i)=>({nome:c.nome,partido:c.partido,numero:c.numero,foto:c.foto,cargo:c.cargo,propostas:c.propostas||[],v:votos[i]||0,pct:total>0?Math.round((votos[i]||0)/total*100):0})).sort((a,b)=>b.v-a.v)

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:16, fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:20,padding:28,width:400,border:"4px solid black", boxShadow:"8px 8px 0px #000"}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:70,height:70, background:"#fef9c3", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto", fontSize:32, border:"4px solid black"}}>🔒</div>
            <h1 style={{fontWeight:900, marginTop:12, fontSize:18}}>ADMIN BLOQUEADO</h1>
            <p style={{fontSize:11,color:"#000", fontWeight:800, background:"#fee2e2", padding:"6px 10px", borderRadius:20, display:"inline-block", marginTop:6, border:"2px solid black"}}>🔐 Digite a senha para entrar</p>
          </div>
          <input type="password" value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="Digite a senha" style={{width:"100%",marginTop:14,padding:14,border:"4px solid black",borderRadius:12,textAlign:"center",fontWeight:900,boxSizing:"border-box", fontSize:14}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",padding:14,borderRadius:12,fontWeight:900,border:"4px solid black", boxShadow:"4px 4px 0px #000", fontSize:13}}>ENTRAR NO ADMIN →</button>
          <a href="/" style={{display:"block", marginTop:10, textAlign:"center", fontSize:11, fontWeight:800, color:"#000"}}>← Voltar ao site</a>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <style>{`@media print{.no-print{display:none!important}}`}</style>
      <div style={{background:"linear-gradient(90deg,#0f172a,#1e293b)",color:"white",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"4px solid black"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{background:"#facc15",color:"black",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,border:"3px solid black", boxShadow:"3px 3px 0px #000"}}>ADM</div>
          <div>
            <div style={{fontWeight:900,fontSize:15, letterSpacing:"0.5px"}}>PAINEL ADMIN • 2026</div>
            <div style={{fontSize:11,opacity:0.9, fontWeight:700, background:"white", color:"black", padding:"2px 8px", borderRadius:20, display:"inline-block", marginTop:3, border:"2px solid black"}}>{candidatos.length} candidatos • {total} votos</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <a href="/" className="no-print" style={{background:"white",color:"black",padding:"8px 14px",borderRadius:10,fontSize:11,fontWeight:900,textDecoration:"none",border:"3px solid black", boxShadow:"3px 3px 0px #000"}}>Ver Site</a>
          <a href="/admin/vendas" className="no-print" style={{background:"#22c55e",color:"white",padding:"8px 14px",borderRadius:10,fontSize:11,fontWeight:900,textDecoration:"none",border:"3px solid black", boxShadow:"3px 3px 0px #000"}}>Vendas</a>
          <button onClick={()=>setLiberado(false)} className="no-print" style={{background:"#ef4444",color:"white",padding:"8px 14px",borderRadius:10,fontSize:11,fontWeight:900,border:"3px solid black", boxShadow:"3px 3px 0px #000", cursor:"pointer"}}>SAIR</button>
        </div>
      </div>
      <div style={{maxWidth:1200,margin:"0 auto",padding:16,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"white",borderRadius:16,border:"4px solid black",overflow:"hidden", boxShadow:"6px 6px 0px #000"}}>
          <div style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"4px solid black",background:"#f8fafc"}}>
            <div style={{fontWeight:900,fontSize:14, background:"black", color:"#facc15", padding:"8px 14px", borderRadius:10, border:"3px solid black"}}>🏆 RANKING - {total} VOTOS</div>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",fontSize:12,borderCollapse:"collapse"}}>
              <thead><tr style={{background:"black",color:"#facc15",textAlign:"left",fontSize:11, fontWeight:900}}><th style={{padding:"12px 14px"}}>#</th><th style={{padding:"12px 14px"}}>CANDIDATO</th><th style={{padding:"12px 14px"}}>PARTIDO</th><th style={{padding:"12px 14px"}}>Nº</th><th style={{padding:"12px 14px"}}>VOTOS</th><th style={{padding:"12px 14px"}}>%</th><th style={{padding:"12px 14px"}}>BARRA</th></tr></thead>
              <tbody>
                {total===0?<tr><td colSpan={7} style={{padding:24,textAlign:"center",fontWeight:900, fontSize:13}}>Nenhum voto ainda</td></tr>:ranking.map((r,i)=><tr key={i} style={{borderTop:"3px solid black",background:i===0?"#fef9c3":"white"}}><td style={{padding:"12px 14px",fontWeight:900}}>{i+1}º</td><td style={{padding:"12px 14px",display:"flex",alignItems:"center",gap:10}}><img src={r.foto} style={{width:34,height:34,borderRadius:"50%",border:"3px solid black"}}/><b style={{fontSize:13}}>{r.nome}</b></td><td style={{padding:"12px 14px",fontWeight:800}}>{r.partido}</td><td style={{padding:"12px 14px"}}><span style={{background:"black",color:"white",padding:"4px 10px",borderRadius:20,fontWeight:900,fontSize:12, border:"2px solid black"}}>{r.numero}</span></td><td style={{padding:"12px 14px",fontWeight:900, fontSize:13}}>{r.v}</td><td style={{padding:"12px 14px",fontWeight:900}}><span style={{background:i===0?"#facc15":"black", color:i===0?"black":"white", padding:"4px 8px", borderRadius:8}}>{r.pct}%</span></td><td style={{padding:"12px 14px",width:140}}><div style={{height:12,background:"white",border:"3px solid black",borderRadius:10}}><div style={{width:`${r.pct}%`,height:"100%",background:i===0?"#eab308":"black",borderRadius:10}}></div></div></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>
        <div className="no-print" style={{background:"white",borderRadius:16,border:"4px solid black",padding:18, boxShadow:"6px 6px 0px #000"}}>
          <div style={{fontWeight:900,fontSize:14,marginBottom:12,background:"black",color:"#facc15",padding:"8px 14px",borderRadius:10,display:"inline-block", border:"3px solid black"}}>➕ CADASTRAR CANDIDATO</div>
          <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 0.3fr 140px 130px",gap:10,marginTop:10}}>
            <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo" style={{border:"3px solid black",borderRadius:10,padding:12,fontSize:13,fontWeight:800}}/>
            <input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Partido ex: PL" style={{border:"3px solid black",borderRadius:10,padding:12,fontSize:13,fontWeight:800}}/>
            <input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Nº" style={{border:"3px solid black",borderRadius:10,padding:12,fontSize:13,fontWeight:900,textAlign:"center"}}/>
            <select value={cargo} onChange={e=>setCargo(e.target.value)} style={{border:"3px solid black",borderRadius:10,padding:12,fontSize:13,fontWeight:800}}>
              <option>Presidente</option><option>Governador</option><option>Senador</option><option>Deputado Federal</option><option>Deputado Estadual</option><option>Prefeito</option><option>Vereador</option><option>Outros</option>
            </select>
            <div><input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{display:"none"}}/><button onClick={()=>fileRef.current?.click()} style={{width:"100%",background:"#3b82f6",color:"white",border:"3px solid black",borderRadius:10,padding:12,fontSize:11,fontWeight:900,cursor:"pointer", boxShadow:"3px 3px 0px #000"}}>📸 SUBIR FOTO</button></div>
          </div>
          {cargo==="Outros" && <input value={cargoCustom} onChange={e=>setCargoCustom(e.target.value)} placeholder="Digite o cargo: ex: Vice-Prefeito..." style={{width:"100%",marginTop:10,border:"4px solid #eab308",borderRadius:10,padding:12,fontSize:13,boxSizing:"border-box",background:"#fef9c3",fontWeight:800}}/>}
          <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Link da foto ou use SUBIR FOTOS" style={{width:"100%",marginTop:10,border:"3px solid black",borderRadius:10,padding:12,fontSize:13,boxSizing:"border-box",fontWeight:700}}/>
          <textarea value={propostas} onChange={e=>setPropostas(e.target.value)} placeholder="Propostas separadas por ;  ex: Saúde; Educação; Segurança" style={{width:"100%",marginTop:10,border:"3px solid black",borderRadius:10,padding:12,fontSize:13,boxSizing:"border-box",fontWeight:700,minHeight:70}}/>
          {link && <div style={{marginTop:10,display:"flex",alignItems:"center",gap:10, background:"#dcfce7", border:"3px solid black", padding:10, borderRadius:10}}><img src={link} style={{width:60,height:60,borderRadius:"50%",border:"3px solid black"}}/><span style={{fontSize:12,color:"#000",fontWeight:900}}>✅ Foto pronta!</span></div>}
          <button onClick={salvar} style={{width:"100%",marginTop:14,background:"black",color:"#facc15",border:"4px solid black",borderRadius:12,padding:14,fontWeight:900,fontSize:14,cursor:"pointer", boxShadow:"4px 4px 0px #000"}}>ADICIONAR CANDIDATO +</button>
        </div>
        <div className="no-print" style={{background:"white",borderRadius:16,border:"4px solid black",padding:18, boxShadow:"6px 6px 0px #000"}}>
          <div style={{fontWeight:900,fontSize:14,marginBottom:12, background:"#f1f5f9", padding:"8px 14px", borderRadius:10, border:"3px solid black", display:"inline-block"}}>📋 LISTA - {candidatos.length} CANDIDATOS</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {candidatos.map((c,i)=>(
              <div key={i} style={{border:"3px solid black",background:"#f8fafc",borderRadius:12,padding:"12px 14px", boxShadow:"3px 3px 0px #000"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}><img src={c.foto} style={{width:40,height:40,borderRadius:"50%",border:"3px solid black"}}/><span style={{fontSize:13}}><b style={{fontSize:14}}>{c.nome}</b> • {c.partido} • Nº <span style={{background:"black", color:"white", padding:"2px 6px", borderRadius:6}}>{c.numero}</span> • {c.cargo}</span></div>
                  <button onClick={()=>remover(i)} style={{background:"#fee2e2",color:"#dc2626",border:"3px solid black",width:32,height:32,borderRadius:10,fontWeight:900,cursor:"pointer", boxShadow:"2px 2px 0px #000"}}>X</button>
                </div>
                <div style={{marginTop:8,background:"white",border:"3px solid black",borderRadius:8,padding:8,fontSize:11, fontWeight:600}}><b>Propostas:</b> {(c.propostas||[]).join(" • ")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
