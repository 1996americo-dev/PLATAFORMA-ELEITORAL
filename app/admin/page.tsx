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

    const cc = localStorage.getItem("candidatos_v21")
    const v = localStorage.getItem("votos_v21")
    if(cc) setCandidatos(JSON.parse(cc))
    else {
      setCandidatos([
        {nome:"Bolsonaro",partido:"PL - 22",numero:"22",foto:"https://i.pravatar.cc/100?img=1"},
        {nome:"Ciro Gomes",partido:"PDT - 12",numero:"12",foto:"https://i.pravatar.cc/100?img=2"},
        {nome:"Eduardo Leite",partido:"PSDB - 45",numero:"45",foto:"https://i.pravatar.cc/100?img=3"},
        {nome:"Erika Hilton",partido:"PSOL - 50",numero:"50",foto:"https://i.pravatar.cc/100?img=4"},
        {nome:"Lula",partido:"PT - 13",numero:"13",foto:"https://i.pravatar.cc/100?img=5"},
        {nome:"Simone Tebet",partido:"MDB - 15",numero:"15",foto:"https://i.pravatar.cc/100?img=6"},
        {nome:"Marina Silva",partido:"REDE - 18",numero:"18",foto:"https://i.pravatar.cc/100?img=7"},
        {nome:"Nikolas Ferreira",partido:"PL - 22",numero:"22",foto:"https://i.pravatar.cc/100?img=8"},
        {nome:"Tabata Amaral",partido:"PSB - 40",numero:"40",foto:"https://i.pravatar.cc/100?img=9"},
        {nome:"Romeu Zema",partido:"NOVO - 30",numero:"30",foto:"https://i.pravatar.cc/100?img=10"},
        {nome:"Ronaldo Caiado",partido:"UNIAO - 44",numero:"44",foto:"https://i.pravatar.cc/100?img=11"},
      ])
    }
    if(v) setVotos(JSON.parse(v))
    else setVotos(Array(11).fill(0))
  },[])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(!cod.startsWith("LIBERADO-")&&cod!=="DONO"){ alert("Use LIBERADO-XXXX"); return }
    localStorage.setItem("codigo_liberado",cod)
    setLiberado(true)
  }

  function salvar(){
    if(!nome) return alert("Nome")
    if(!numero) return alert("Digite o Número!")
    const lista = [...candidatos,{nome,partido:partido+" - "+numero,numero,foto:link||`https://i.pravatar.cc/100?img=${candidatos.length+1}`,cargo}]
    setCandidatos(lista)
    localStorage.setItem("candidatos_v21",JSON.stringify(lista))
    const nv=[...votos,0]; setVotos(nv); localStorage.setItem("votos_v21",JSON.stringify(nv))
    setNome("");setPartido("");setNumero("");setLink("")
  }

  function remover(i:number){
    if(!confirm("Remover?")) return
    const lista=candidatos.filter((_,idx)=>idx!==i)
    const nv=votos.filter((_,idx)=>idx!==i)
    setCandidatos(lista);setVotos(nv)
    localStorage.setItem("candidatos_v21",JSON.stringify(lista))
    localStorage.setItem("votos_v21",JSON.stringify(nv))
  }

  const total=votos.reduce((a,b)=>a+b,0)
  const ranking=candidatos.map((c,i)=>({nome:c.nome,partido:c.partido,numero:c.numero,v:votos[i]||0,pct:total>0?Math.round((votos[i]||0)/total*100):0})).sort((a,b)=>b.v-a.v)

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f0f0f",display:"flex",alignItems:"center",justifyContent:"center",padding:15}}>
        <div style={{background:"white",border:"4px solid #facc15",borderRadius:12,padding:18,width:360,textAlign:"center"}}>
          <div style={{fontWeight:900}}>ADMIN BLOQUEADO 🔒 - USE MESMO LIBERADO DAS VENDAS</div>
          <input value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:10,padding:8,border:"3px solid black",borderRadius:8,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:6,background:"black",color:"#facc15",padding:8,borderRadius:8,fontWeight:900}}>LIBERAR ADMIN</button>
          <div style={{fontSize:10,marginTop:6}}>PIX: 6291796690 - WhatsApp mesmo número</div>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f0efe5",fontFamily:"system-ui"}}>
      <div style={{background:"#1c1c1c",color:"#facc15",padding:"8px 12px",display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:11}}>
        <span>ADMIN - {candidatos.length} CANDIDATOS - DONA - {total} VOTOS</span>
        <div style={{display:"flex",gap:6}}>
          <a href="/" style={{background:"white",color:"black",padding:"4px 8px",borderRadius:8,fontSize:10,textDecoration:"none"}}>Site</a>
          <a href="/admin/vendas?dono=americo" style={{background:"#22c55e",color:"white",padding:"4px 8px",borderRadius:8,fontSize:10,textDecoration:"none"}}>Vendas</a>
          <a href="/" style={{background:"#ef4444",color:"white",padding:"4px 8px",borderRadius:8,fontSize:10,textDecoration:"none"}}>Sair</a>
        </div>
      </div>

      <div style={{background:"white",border:"3px solid black",borderRadius:10,margin:10,padding:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontWeight:900,fontSize:11}}>🏆 RANKING FINAL - {total} VOTOS - RESULTADO OFICIAL</div>
          <button onClick={()=>window.print()} style={{background:"black",color:"#facc15",border:"2px solid black",padding:"5px 10px",borderRadius:8,fontWeight:900,fontSize:10,cursor:"pointer"}}>🖨️ IMPRIMIR RESULTADOS FINAIS</button>
        </div>
        <div style={{marginTop:8,border:"2px solid black",borderRadius:8,overflow:"hidden"}}>
          <table style={{width:"100%",fontSize:11,borderCollapse:"collapse"}}>
            <thead><tr style={{background:"black",color:"#facc15"}}><td style={{padding:6}}>#</td><td style={{padding:6}}>CANDIDATO</td><td style={{padding:6}}>PARTIDO</td><td style={{padding:6}}>VOTOS</td><td style={{padding:6}}>%</td></tr></thead>
            <tbody>{total===0?<tr><td colSpan={5} style={{padding:10,textAlign:"center"}}>Nenhum voto ainda</td></tr>:ranking.map((r,i)=><tr key={i} style={{borderTop:"1px solid #ddd",background:i===0?"#fef9c3":"white"}}><td style={{padding:6}}>{i+1}º</td><td style={{padding:6}}>{r.nome}</td><td style={{padding:6}}>{r.partido}</td><td style={{padding:6}}>{r.v}</td><td style={{padding:6}}>{r.pct}%</td></tr>)}</tbody>
          </table>
        </div>
      </div>

      <div style={{background:"white",border:"3px solid black",borderRadius:10,margin:10,padding:10}}>
        <div style={{fontWeight:900,fontSize:10}}>+ CADASTRAR CANDIDATO</div>
        <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr 0.4fr 100px 90px",gap:6,marginTop:6}}>
          <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome" style={{border:"2px solid black",borderRadius:6,padding:6,fontSize:11}}/>
          <input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Partido" style={{border:"2px solid black",borderRadius:6,padding:6,fontSize:11}}/>
          <input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Número" style={{border:"2px solid black",borderRadius:6,padding:6,fontSize:11,fontWeight:900,textAlign:"center"}}/>
          <select value={cargo} onChange={e=>setCargo(e.target.value)} style={{border:"2px solid black",borderRadius:6,padding:6,fontSize:11}}><option>Presidente</option><option>Governador</option></select>
          <button style={{background:"#3b82f6",color:"white",border:"2px solid black",borderRadius:6,fontWeight:900,fontSize:8}}>SUBIR FOTOS</button>
        </div>
        <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Link foto https://..." style={{width:"100%",marginTop:6,border:"2px solid black",borderRadius:6,padding:6,fontSize:11,boxSizing:"border-box"}}/>
        <button onClick={salvar} style={{width:"100%",marginTop:6,background:"black",color:"#facc15",border:"2px solid black",borderRadius:6,padding:8,fontWeight:900,fontSize:11,cursor:"pointer"}}>ADICIONAR CANDIDATO</button>
      </div>

      <div style={{background:"white",border:"3px solid black",borderRadius:10,margin:10,padding:10}}>
        <div style={{fontWeight:900,fontSize:10}}>LISTA - {candidatos.length} CANDIDATOS</div>
        <div style={{marginTop:6}}>
          {candidatos.map((c,i)=>(
            <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",border:"1px solid #ddd",borderRadius:6,padding:6,marginBottom:4,fontSize:11}}>
              <span>{c.nome} - {c.partido} - {votos[i]||0} votos - {total>0?Math.round((votos[i]||0)/total*100):0}%</span>
              <button onClick={()=>remover(i)} style={{background:"#ef4444",color:"white",border:"1px solid black",borderRadius:4,padding:"2px 6px",fontSize:10,cursor:"pointer"}}>X</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}