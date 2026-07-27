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

  const exibir = (cod:string) => cod==="DONO"?"PRINCIPAL":cod

  React.useEffect(()=>{
    const cod=localStorage.getItem("codigo_liberado")
    if(cod && (cod.startsWith("LIBERADO-")||cod==="DONO")){
      setCodigoAtual(cod)
      setLiberado(true)
    }
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
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
    if(!cod.startsWith("LIBERADO-")&&cod!=="DONO"){alert("Use LIBERADO-XXXX");return}
    localStorage.setItem("codigo_liberado",cod)
    setCodigoAtual(cod)
    setLiberado(true)
    window.location.reload()
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
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
        <div style={{background:"white",borderRadius:16,padding:24,width:380,border:"3px solid black"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:30}}>🔒</div><h1 style={{fontWeight:900}}>ADMIN BLOQUEADO</h1><p style={{fontSize:11,color:"#64748b"}}>Digite LIBERADO-XXXX da venda</p></div>
          <input value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:12,padding:12,border:"3px solid black",borderRadius:10,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:8,background:"black",color:"#facc15",padding:12,borderRadius:10,fontWeight:900,border:"2px solid black"}}>LIBERAR ADMIN →</button>
          <p style={{fontSize:9,color:"#94a3b8",textAlign:"center",marginTop:8}}>?dono=americo não entra mais direto, precisa senha!</p>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <style>{`@media print{.no-print{display:none!important}}`}</style>
      <div style={{background:"linear-gradient(90deg,#0f172a,#1e293b)",color:"white",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"4px solid black"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"#facc15",color:"black",width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12,border:"2px solid black"}}>ADM</div>
          <div>
            <div style={{fontWeight:900,fontSize:13}}>PAINEL ADMIN • {exibir(codigoAtual)} • 2026</div>
            <div style={{fontSize:10,opacity:0.9}}>{candidatos.length} candidatos • {total} votos • Cliente: {exibir(codigoAtual)}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <a href="/" className="no-print" style={{background:"white",color:"black",padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:800,textDecoration:"none",border:"2px solid black"}}>Ver Site</a>
          <a href="/admin/vendas?dono=americo" className="no-print" style={{background:"#22c55e",color:"white",padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:800,textDecoration:"none",border:"2px solid black"}}>Vendas</a>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:16,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="no-print">
          <div style={{background:"white",borderRadius:12,padding:14,border:"3px solid black",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:10,fontWeight:900}}>TOTAL VOTOS - {exibir(codigoAtual)}</div><div style={{fontSize:22,fontWeight:900}}>{total}</div></div>
            <div style={{background:"#dcfce7",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:"2px solid black"}}>📊</div>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"3px solid black",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:10,fontWeight:900}}>CANDIDATOS</div><div style={{fontSize:22,fontWeight:900}}>{candidatos.length}</div></div>
            <div style={{background:"#fef9c3",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:"2px solid black"}}>👥</div>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"3px solid black",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:10,fontWeight:900}}>LÍDER</div><div style={{fontSize:14,fontWeight:900}}>{total>0?ranking[0]?.nome:"-"} {total>0?`• ${ranking[0]?.pct}%`:""}</div></div>
            <div style={{background:"black",color:"white",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,border:"2px solid black"}}>🏆</div>
          </div>
        </div>

        <div style={{background:"white",borderRadius:14,border:"3px solid black",overflow:"hidden"}}>
          <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"3px solid black",background:"#f8fafc"}}>
            <div style={{fontWeight:900,fontSize:13}}>🏆 RANKING - CLIENTE {exibir(codigoAtual)} - {total} VOTOS</div>
            <button onClick={()=>window.print()} className="no-print" style={{background:"black",color:"#facc15",border:"2px solid black",padding:"6px 14px",borderRadius:8,fontWeight:900,fontSize:11,cursor:"pointer"}}>🖨 IMPRIMIR</button>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",fontSize:12,borderCollapse:"collapse"}}>
              <thead><tr style={{background:"black",color:"#facc15",textAlign:"left",fontSize:10}}><th style={{padding:"10px 12px"}}>#</th><th style={{padding:"10px 12px"}}>CANDIDATO</th><th style={{padding:"10px 12px"}}>PARTIDO</th><th style={{padding:"10px 12px"}}>Nº</th><th style={{padding:"10px 12px"}}>VOTOS</th><th style={{padding:"10px 12px"}}>%</th><th style={{padding:"10px 12px"}}>BARRA</th></tr></thead>
              <tbody>
                {total===0?<tr><td colSpan={7} style={{padding:20,textAlign:"center",fontWeight:900}}>Nenhum voto</td></tr>:ranking.map((r,i)=><tr key={i} style={{borderTop:"2px solid black",background:i===0?"#fef9c3":"white"}}><td style={{padding:"10px 12px",fontWeight:900}}>{i+1}º</td><td style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}><img src={r.foto} style={{width:28,height:28,borderRadius:"50%",border:"2px solid black"}}/><b>{r.nome}</b></td><td style={{padding:"10px 12px",fontWeight:700}}>{r.partido}</td><td style={{padding:"10px 12px"}}><span style={{background:"black",color:"white",padding:"3px 8px",borderRadius:20,fontWeight:900,fontSize:11}}>{r.numero}</span></td><td style={{padding:"10px 12px",fontWeight:900}}>{r.v}</td><td style={{padding:"10px 12px",fontWeight:900}}>{r.pct}%</td><td style={{padding:"10px 12px",width:120}}><div style={{height:10,background:"white",border:"2px solid black",borderRadius:10}}><div style={{width:`${r.pct}%`,height:"100%",background:i===0?"#eab308":"black",borderRadius:10}}></div></div></td></tr>)}
              </tbody>
            </table>
          </div>
        </div>

        <div className="no-print" style={{background:"white",borderRadius:14,border:"3px solid black",padding:16}}>
          <div style={{fontWeight:900,fontSize:13,marginBottom:10,background:"black",color:"#facc15",padding:"6px 10px",borderRadius:8,display:"inline-block"}}>➕ CADASTRAR - CLIENTE {exibir(codigoAtual)}</div>
          <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 0.3fr 140px 120px",gap:8,marginTop:10}}>
            <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo" style={{border:"3px solid black",borderRadius:8,padding:10,fontSize:12,fontWeight:700}}/>
            <input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Partido ex: PL" style={{border:"3px solid black",borderRadius:8,padding:10,fontSize:12,fontWeight:700}}/>
            <input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Nº" style={{border:"3px solid black",borderRadius:8,padding:10,fontSize:12,fontWeight:900,textAlign:"center"}}/>
            <select value={cargo} onChange={e=>setCargo(e.target.value)} style={{border:"3px solid black",borderRadius:8,padding:10,fontSize:12,fontWeight:700}}>
              <option>Presidente</option><option>Governador</option><option>Senador</option><option>Deputado Federal</option><option>Deputado Estadual</option><option>Prefeito</option><option>Vereador</option><option>Outros</option>
            </select>
            <div><input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{display:"none"}}/><button onClick={()=>fileRef.current?.click()} style={{width:"100%",background:"#3b82f6",color:"white",border:"3px solid black",borderRadius:8,padding:10,fontSize:10,fontWeight:900,cursor:"pointer"}}>📸 SUBIR FOTOS</button></div>
          </div>
          {cargo==="Outros" && <input value={cargoCustom} onChange={e=>setCargoCustom(e.target.value)} placeholder="Digite o cargo: ex: Vice-Prefeito..." style={{width:"100%",marginTop:8,border:"3px solid #eab308",borderRadius:8,padding:10,fontSize:12,boxSizing:"border-box",background:"#fef9c3",fontWeight:700}}/>}
          <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Link da foto ou use SUBIR FOTOS" style={{width:"100%",marginTop:8,border:"3px solid black",borderRadius:8,padding:10,fontSize:12,boxSizing:"border-box",fontWeight:700}}/>
          <textarea value={propostas} onChange={e=>setPropostas(e.target.value)} placeholder="Propostas separadas por ;" style={{width:"100%",marginTop:8,border:"3px solid black",borderRadius:8,padding:10,fontSize:12,boxSizing:"border-box",fontWeight:700,minHeight:60}}/>
          {link && <div style={{marginTop:8,display:"flex",alignItems:"center",gap:8}}><img src={link} style={{width:60,height:60,borderRadius:"50%",border:"3px solid black"}}/><span style={{fontSize:11,color:"#22c55e",fontWeight:900}}>✅ Foto pronta!</span></div>}
          <button onClick={salvar} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",border:"3px solid black",borderRadius:10,padding:12,fontWeight:900,fontSize:13,cursor:"pointer"}}>ADICIONAR CANDIDATO - {exibir(codigoAtual)} +</button>
        </div>

        <div className="no-print" style={{background:"white",borderRadius:14,border:"3px solid black",padding:16}}>
          <div style={{fontWeight:900,fontSize:13,marginBottom:10}}>📋 LISTA - {exibir(codigoAtual)} - {candidatos.length} CANDIDATOS</div>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {candidatos.map((c,i)=>(
              <div key={i} style={{border:"3px solid black",background:"#f8fafc",borderRadius:10,padding:"10px 12px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}><img src={c.foto} style={{width:32,height:32,borderRadius:"50%",border:"2px solid black"}}/><span style={{fontSize:12}}><b>{c.nome}</b> • {c.partido} • Nº {c.numero} • {c.cargo}</span></div>
                  <button onClick={()=>remover(i)} style={{background:"#fee2e2",color:"#dc2626",border:"2px solid black",width:28,height:28,borderRadius:8,fontWeight:900,cursor:"pointer"}}>X</button>
                </div>
                <div style={{marginTop:6,background:"white",border:"2px solid black",borderRadius:6,padding:6,fontSize:10}}><b>Propostas:</b> {(c.propostas||[]).join(" • ")}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}