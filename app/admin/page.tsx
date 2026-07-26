"use client"
import React from "react"

export default function AdminPage(){
  const [liberado,setLiberado]=React.useState(false)
  const [codInput,setCodInput]=React.useState("")
  const [candidatos,setCandidatos]=React.useState<any[]>([])
  const [votos,setVotos]=React.useState<number[]>([])
  const [nome,setNome]=React.useState("")
  const [partido,setPartido]=React.useState("")
  const [numero,setNumero]=React.useState("")
  const [link,setLink]=React.useState("")
  const [cargo,setCargo]=React.useState("Presidente")

  React.useEffect(()=>{
    const url=new URL(window.location.href)
    if(url.searchParams.get("dono")==="americo"){
      localStorage.setItem("dono_americo","true")
      localStorage.setItem("codigo_liberado","DONO")
      setLiberado(true)
    }
    const c=url.searchParams.get("codigo")
    if(c && c.toUpperCase().startsWith("LIBERADO-")){
      localStorage.setItem("codigo_liberado",c.toUpperCase())
      setLiberado(true)
    }
    const cod=localStorage.getItem("codigo_liberado")
    if(cod && (cod.startsWith("LIBERADO-")||cod==="DONO")) setLiberado(true)
    const cc=localStorage.getItem("candidatos_v21")
    const v=localStorage.getItem("votos_v21")
    if(cc) setCandidatos(JSON.parse(cc))
    else{
      setCandidatos([
        {nome:"Bolsonaro",partido:"PL",numero:"22",foto:"https://i.pravatar.cc/150?img=1"},
        {nome:"Ciro Gomes",partido:"PDT",numero:"12",foto:"https://i.pravatar.cc/150?img=2"},
        {nome:"Eduardo Leite",partido:"PSDB",numero:"45",foto:"https://i.pravatar.cc/150?img=3"},
        {nome:"Erika Hilton",partido:"PSOL",numero:"50",foto:"https://i.pravatar.cc/150?img=4"},
        {nome:"Lula",partido:"PT",numero:"13",foto:"https://i.pravatar.cc/150?img=5"},
        {nome:"Simone Tebet",partido:"MDB",numero:"15",foto:"https://i.pravatar.cc/150?img=6"},
        {nome:"Marina Silva",partido:"REDE",numero:"18",foto:"https://i.pravatar.cc/150?img=7"},
        {nome:"Nikolas Ferreira",partido:"PL",numero:"22",foto:"https://i.pravatar.cc/150?img=8"},
        {nome:"Tabata Amaral",partido:"PSB",numero:"40",foto:"https://i.pravatar.cc/150?img=9"},
        {nome:"Romeu Zema",partido:"NOVO",numero:"30",foto:"https://i.pravatar.cc/150?img=10"},
        {nome:"Ronaldo Caiado",partido:"UNIAO",numero:"44",foto:"https://i.pravatar.cc/150?img=11"},
      ])
    }
    if(v) setVotos(JSON.parse(v))
    else setVotos(Array(11).fill(0))
  },[])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(!cod.startsWith("LIBERADO-")&&cod!=="DONO"){alert("Use LIBERADO-XXXX");return}
    localStorage.setItem("codigo_liberado",cod); setLiberado(true)
  }
  function salvar(){
    if(!nome) return alert("Nome obrigatório")
    if(!numero) return alert("Número obrigatório")
    const novo={nome,partido:partido+" - "+numero,numero,foto:link||`https://i.pravatar.cc/150?img=${candidatos.length+20}`}
    const lista=[...candidatos,novo]; setCandidatos(lista); localStorage.setItem("candidatos_v21",JSON.stringify(lista))
    const nv=[...votos,0]; setVotos(nv); localStorage.setItem("votos_v21",JSON.stringify(nv))
    setNome("");setPartido("");setNumero("");setLink("")
  }
  function remover(i:number){
    if(!confirm("Remover "+candidatos[i].nome+"?")) return
    const lista=candidatos.filter((_,idx)=>idx!==i)
    const nv=votos.filter((_,idx)=>idx!==i)
    setCandidatos(lista);setVotos(nv)
    localStorage.setItem("candidatos_v21",JSON.stringify(lista))
    localStorage.setItem("votos_v21",JSON.stringify(nv))
  }

  const total=votos.reduce((a,b)=>a+b,0)
  const ranking=candidatos.map((c,i)=>({nome:c.nome,partido:c.partido,numero:c.numero,foto:c.foto,v:votos[i]||0,pct:total>0?Math.round((votos[i]||0)/total*100):0})).sort((a,b)=>b.v-a.v)

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:16,padding:24,width:380}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:30}}>🔒</div><h1 style={{fontWeight:900}}>ADMIN BLOQUEADO</h1><p style={{fontSize:11,color:"#64748b"}}>Use mesmo LIBERADO-XXXX das vendas</p></div>
          <input value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="LIBERADO-XXXX ou DONO" style={{width:"100%",marginTop:12,padding:12,border:"2px solid #0f172a",borderRadius:10,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:8,background:"#0f172a",color:"white",padding:12,borderRadius:10,fontWeight:900}}>LIBERAR ADMIN →</button>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <style>{`@media print{.no-print{display:none!important}}`}</style>
      {/* HEADER */}
      <div style={{background:"linear-gradient(90deg,#0f172a,#1e293b)",color:"white",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"#facc15",color:"black",width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:12}}>ADM</div>
          <div><div style={{fontWeight:900,fontSize:13}}>PAINEL ADMIN • 2026</div><div style={{fontSize:10,opacity:0.7}}>{candidatos.length} candidatos • {total} votos • Dona</div></div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <a href="/?dono=americo" className="no-print" style={{background:"white",color:"black",padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:800,textDecoration:"none"}}>Ver Site</a>
          <a href="/admin/vendas?dono=americo" className="no-print" style={{background:"#22c55e",color:"white",padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:800,textDecoration:"none"}}>Vendas</a>
        </div>
      </div>

      <div style={{maxWidth:1100,margin:"0 auto",padding:16,display:"flex",flexDirection:"column",gap:16}}>
        {/* CARDS RESUMO */}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12}} className="no-print">
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:10,color:"#64748b",fontWeight:700}}>TOTAL VOTOS</div><div style={{fontSize:22,fontWeight:900}}>{total}</div></div><div style={{background:"#dcfce7",color:"#166534",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>📊</div>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:10,color:"#64748b",fontWeight:700}}>CANDIDATOS</div><div style={{fontSize:22,fontWeight:900}}>{candidatos.length}</div></div><div style={{background:"#fef9c3",color:"#854d0e",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>👥</div>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #e2e8f0",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><div style={{fontSize:10,color:"#64748b",fontWeight:700}}>LÍDER</div><div style={{fontSize:14,fontWeight:900}}>{total>0?ranking[0]?.nome:"-"} {total>0?`• ${ranking[0]?.pct}%`:""}</div></div><div style={{background:"#0f172a",color:"white",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>🏆</div>
          </div>
        </div>

        {/* RANKING */}
        <div style={{background:"white",borderRadius:14,border:"1px solid #e2e8f0",overflow:"hidden",boxShadow:"0 2px 10px rgba(0,0,0,0.04)"}}>
          <div style={{padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"1px solid #e2e8f0"}}>
            <div style={{fontWeight:900,fontSize:13}}>🏆 RANKING FINAL - RESULTADO OFICIAL - {total} VOTOS</div>
            <button onClick={()=>window.print()} className="no-print" style={{background:"#0f172a",color:"white",border:"none",padding:"6px 14px",borderRadius:8,fontWeight:800,fontSize:11,cursor:"pointer"}}>🖨️ IMPRIMIR RESULTADOS</button>
          </div>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",fontSize:12,borderCollapse:"collapse"}}>
              <thead><tr style={{background:"#f8fafc",textAlign:"left",color:"#64748b",fontSize:10}}><th style={{padding:"10px 12px"}}>#</th><th style={{padding:"10px 12px"}}>CANDIDATO</th><th style={{padding:"10px 12px"}}>PARTIDO</th><th style={{padding:"10px 12px"}}>Nº</th><th style={{padding:"10px 12px"}}>VOTOS</th><th style={{padding:"10px 12px"}}>%</th><th style={{padding:"10px 12px"}}>BARRA</th></tr></thead>
              <tbody>
                {total===0?<tr><td colSpan={7} style={{padding:20,textAlign:"center",color:"#94a3b8"}}>Nenhum voto ainda - Aguardando primeira votação</td></tr>:
                  ranking.map((r,i)=>(
                    <tr key={i} style={{borderTop:"1px solid #f1f5f9",background:i===0?"#fefce8":"white"}}>
                      <td style={{padding:"10px 12px",fontWeight:900}}>{i+1}º</td>
                      <td style={{padding:"10px 12px",display:"flex",alignItems:"center",gap:8}}><img src={r.foto} style={{width:28,height:28,borderRadius:"50%"}}/><b>{r.nome}</b></td>
                      <td style={{padding:"10px 12px"}}>{r.partido}</td>
                      <td style={{padding:"10px 12px"}}><span style={{background:"#0f172a",color:"white",padding:"2px 8px",borderRadius:20,fontWeight:800,fontSize:11}}>{r.numero}</span></td>
                      <td style={{padding:"10px 12px",fontWeight:800}}>{r.v}</td>
                      <td style={{padding:"10px 12px",fontWeight:800}}>{r.pct}%</td>
                      <td style={{padding:"10px 12px",width:120}}><div style={{height:8,background:"#e2e8f0",borderRadius:10}}><div style={{width:`${r.pct}%`,height:"100%",background:i===0?"#eab308":"#0f172a",borderRadius:10}}></div></div></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>
        </div>

        {/* CADASTRAR */}
        <div className="no-print" style={{background:"white",borderRadius:14,border:"1px solid #e2e8f0",padding:16}}>
          <div style={{fontWeight:900,fontSize:13,marginBottom:10}}>➕ CADASTRAR NOVO CANDIDATO</div>
          <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 0.3fr 110px 110px",gap:8}}>
            <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo" style={{border:"1.5px solid #e2e8f0",borderRadius:8,padding:10,fontSize:12}}/>
            <input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Partido ex: PL" style={{border:"1.5px solid #e2e8f0",borderRadius:8,padding:10,fontSize:12}}/>
            <input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Nº" style={{border:"1.5px solid #e2e8f0",borderRadius:8,padding:10,fontSize:12,fontWeight:900,textAlign:"center"}}/>
            <select value={cargo} onChange={e=>setCargo(e.target.value)} style={{border:"1.5px solid #e2e8f0",borderRadius:8,padding:10,fontSize:12}}><option>Presidente</option><option>Governador</option></select>
            <button style={{background:"#f1f5f9",border:"1.5px dashed #cbd5e1",borderRadius:8,fontSize:10,fontWeight:800}}>SUBIR FOTOS</button>
          </div>
          <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Link da foto https://..." style={{width:"100%",marginTop:8,border:"1.5px solid #e2e8f0",borderRadius:8,padding:10,fontSize:12,boxSizing:"border-box"}}/>
          <button onClick={salvar} style={{width:"100%",marginTop:10,background:"#0f172a",color:"white",border:"none",borderRadius:10,padding:12,fontWeight:900,fontSize:13,cursor:"pointer"}}>ADICIONAR CANDIDATO +</button>
        </div>

        {/* LISTA */}
        <div className="no-print" style={{background:"white",borderRadius:14,border:"1px solid #e2e8f0",padding:16}}>
          <div style={{fontWeight:900,fontSize:13,marginBottom:10}}>📋 LISTA - {candidatos.length} CANDIDATOS CADASTRADOS</div>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {candidatos.map((c,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #f1f5f9",background:"#f8fafc",borderRadius:10,padding:"10px 12px",fontSize:12}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}><img src={c.foto} style={{width:32,height:32,borderRadius:"50%"}}/><span><b>{c.nome}</b> • {c.partido} • Nº {c.numero} • <span style={{color:"#64748b"}}>{votos[i]||0} votos • {total>0?Math.round((votos[i]||0)/total*100):0}%</span></span></div>
                <button onClick={()=>remover(i)} style={{background:"#fee2e2",color:"#dc2626",border:"1px solid #fecaca",width:28,height:28,borderRadius:8,fontWeight:900,cursor:"pointer"}}>X</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}