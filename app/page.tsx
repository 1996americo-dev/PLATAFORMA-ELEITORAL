"use client"
import React from "react"

export default function Home(){
  const [liberado,setLiberado]=React.useState(false)
  const [codInput,setCodInput]=React.useState("")
  const [codigoAtual,setCodigoAtual]=React.useState("")
  const [candidatos,setCandidatos]=React.useState<any[]>([])
  const [votos,setVotos]=React.useState<number[]>([])
  const [votoSel,setVotoSel]=React.useState<number|null>(null)
  const [jaVotou,setJaVotou]=React.useState(false)

  React.useEffect(()=>{
    const cod = localStorage.getItem("codigo_liberado") || ""
    if(!cod){ return }
    // Se já liberado antes, verifica se não foi cancelado
    try{
      const pro = JSON.parse(localStorage.getItem("codigos_vendas_pro")||"[]")
      const cancel = pro.some((c:any)=>c.codigo===cod && c.status==="cancelado")
      const cancel2 = JSON.parse(localStorage.getItem("codigos_cancelados")||"[]").includes(cod)
      if(cancel || cancel2){
        localStorage.removeItem("codigo_liberado")
        setLiberado(false)
        return
      }
    }catch{}
    setCodigoAtual(cod)
    setLiberado(true)
    const cc=localStorage.getItem("candidatos_"+cod)
    const v=localStorage.getItem("votos_"+cod)
    if(cc) setCandidatos(JSON.parse(cc))
    if(v) setVotos(JSON.parse(v))
    if(localStorage.getItem("ja_votou_"+cod)) setJaVotou(true)
  },[])

  React.useEffect(()=>{
    if(!codigoAtual) return
    const cc=localStorage.getItem("candidatos_"+codigoAtual)
    const v=localStorage.getItem("votos_"+codigoAtual)
    if(cc) setCandidatos(JSON.parse(cc))
    else{
      setCandidatos([
        {nome:"Bolsonaro",partido:"PL - 22",numero:"22",foto:"https://i.pravatar.cc/150?img=1",cargo:"Presidente",propostas:["Economia liberal","Segurança"]},
        {nome:"Lula",partido:"PT - 13",numero:"13",foto:"https://i.pravatar.cc/150?img=5",cargo:"Presidente",propostas:["Bolsa Família","Emprego"]},
        {nome:"Ciro Gomes",partido:"PDT - 12",numero:"12",foto:"https://i.pravatar.cc/150?img=2",cargo:"Presidente",propostas:["Desenvolvimento","Educação"]},
      ])
    }
    if(v) setVotos(JSON.parse(v))
    else setVotos([0,0,0])
  },[codigoAtual])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(!cod.startsWith("LIBERADO-") && cod!=="DONO"){
      alert("Código inválido! Use LIBERADO-XXXX ou DONO");return
    }
    // BLOQUEIO CANCELADOS - ÚNICA COISA ADICIONADA, NÃO MUDA VISUAL
    try{
      const pro = JSON.parse(localStorage.getItem("codigos_vendas_pro")||"[]")
      const ehCancelPro = Array.isArray(pro) && pro.some((c:any)=>c.codigo===cod && c.status==="cancelado")
      const cancSimples = JSON.parse(localStorage.getItem("codigos_cancelados")||"[]")
      const ehCancelSimples = Array.isArray(cancSimples) && cancSimples.includes(cod)
      if(ehCancelPro || ehCancelSimples){
        alert("⛔ ACESSO CANCELADO - Esse código foi cancelado. Fale com o suporte.");return
      }
    }catch{}

    localStorage.setItem("codigo_liberado",cod)
    setCodigoAtual(cod)
    setLiberado(true)
  }

  function votar(){
    if(votoSel===null){alert("Escolha um candidato!");return}
    if(jaVotou){alert("Você já votou!");return}
    const nv=[...votos]
    nv[votoSel]=(nv[votoSel]||0)+1
    setVotos(nv)
    localStorage.setItem("votos_"+codigoAtual,JSON.stringify(nv))
    localStorage.setItem("ja_votou_"+codigoAtual,"true")
    setJaVotou(true)
  }

  const total=votos.reduce((a,b)=>a+b,0)

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1e293b 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:24,padding:36,width:400,border:"4px solid black",boxShadow:"12px 12px 0px #000",textAlign:"center"}}>
          <div style={{width:64,height:64,background:"#f8fafc",border:"3px solid black",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:28}}>🏛️</div>
          <h1 style={{fontWeight:900,marginTop:14,fontSize:16,letterSpacing:"0.5px"}}>PLATAFORMA 2026</h1>
          <div style={{marginTop:10,display:"inline-block",background:"#f1f5f9",border:"2px solid black",borderRadius:20,padding:"6px 14px",fontSize:11,fontWeight:800}}>Digite seu código de acesso</div>
          <input type="text" value={codInput} onChange={e=>setCodInput(e.target.value.toUpperCase())} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:18,padding:16,border:"3px solid black",borderRadius:12,textAlign:"center",fontWeight:900,boxSizing:"border-box",fontSize:14,letterSpacing:"1px",background:"white"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:12,background:"black",color:"#facc15",padding:14,borderRadius:12,fontWeight:900,border:"3px solid black",boxShadow:"4px 4px 0px #000",fontSize:13,letterSpacing:"0.5px",cursor:"pointer"}}>ENTRAR →</button>
          <div style={{marginTop:14,fontSize:10,color:"#64748b",fontWeight:600}}>Código liberado nas vendas ou DONO</div>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <div style={{background:"black",color:"#facc15",padding:14,textAlign:"center",fontWeight:900,borderBottom:"4px solid #eab308",fontSize:14}}>PLATAFORMA ELEITORAL 2026 • {codigoAtual}</div>
      <div style={{maxWidth:800,margin:"20px auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:"white",border:"4px solid black",borderRadius:12,padding:12,textAlign:"center",fontWeight:900,boxShadow:"4px 4px 0px #000"}}>TOTAL: {total} VOTOS {jaVotou && "• VOCÊ JÁ VOTOU"}</div>
        {candidatos.map((c,i)=>(
          <div key={i} onClick={()=>!jaVotou && setVotoSel(i)} style={{background:"white",border:votoSel===i?"4px solid #22c55e":"3px solid black",borderRadius:16,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:jaVotou?"default":"pointer",boxShadow:"4px 4px 0px #000"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <img src={c.foto} style={{width:56,height:56,borderRadius:"50%",border:"3px solid black"}}/>
              <div>
                <div style={{fontWeight:900,fontSize:15}}>{c.nome} - {c.partido}</div>
                <div style={{fontSize:12,fontWeight:700}}>Nº {c.numero} • {c.cargo}</div>
                <div style={{fontSize:11}}>{(c.propostas||[]).join(" • ")}</div>
              </div>
            </div>
            <div style={{fontWeight:900,background:"#f1f5f9",padding:"6px 12px",borderRadius:20,border:"3px solid black",fontSize:13}}>{votos[i]||0}</div>
          </div>
        ))}
        {!jaVotou ? <button onClick={votar} style={{background:"#22c55e",color:"black",border:"4px solid black",borderRadius:12,padding:16,fontWeight:900,boxShadow:"4px 4px 0px #000",cursor:"pointer"}}>CONFIRMAR VOTO</button> : <div style={{background:"#fef9c3",border:"4px solid black",borderRadius:12,padding:16,textAlign:"center",fontWeight:900}}>✅ Voto computado!</div>}
        <div style={{display:"flex",gap:8}}>
          <a href="/admin" style={{flex:1,background:"black",color:"#facc15",border:"3px solid black",borderRadius:10,padding:12,textAlign:"center",fontWeight:900,textDecoration:"none",boxShadow:"3px 3px 0px #000"}}>Admin</a>
          <button onClick={()=>{localStorage.removeItem("codigo_liberado");setLiberado(false)}} style={{flex:1,background:"#ef4444",color:"white",border:"3px solid black",borderRadius:10,padding:12,fontWeight:900,boxShadow:"3px 3px 0px #000",cursor:"pointer"}}>SAIR</button>
        </div>
      </div>
    </div>
  )
}
