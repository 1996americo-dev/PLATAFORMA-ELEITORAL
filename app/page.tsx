"use client"
import React from "react"

export default function Home(){
  const [liberado,setLiberado]=React.useState(false)
  const [bloqueado,setBloqueado]=React.useState(false)
  const [codigoBloqueado,setCodigoBloqueado]=React.useState("")
  const [codInput,setCodInput]=React.useState("")
  const [codigoAtual,setCodigoAtual]=React.useState("")
  const [candidatos,setCandidatos]=React.useState<any[]>([])
  const [votos,setVotos]=React.useState<number[]>([])
  const [votoSel,setVotoSel]=React.useState<number|null>(null)
  const [jaVotou,setJaVotou]=React.useState(false)

  const WHATSAPP = "5562981796690"
  const PIX = "62981796690"
  const VALOR = "R$ 97,00"

  React.useEffect(()=>{
    const cod = localStorage.getItem("codigo_liberado") || ""
    if(!cod) return
    try{
      const pro = JSON.parse(localStorage.getItem("codigos_vendas_pro")||"[]")
      const canc = pro.some((c:any)=>c.codigo===cod && c.status==="cancelado")
      const canc2 = JSON.parse(localStorage.getItem("codigos_cancelados")||"[]").includes(cod)
      if((canc||canc2) && cod!=="DONO"){
        setCodigoBloqueado(cod)
        setBloqueado(true)
        localStorage.removeItem("codigo_liberado")
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
    else setCandidatos([
      {nome:"Bolsonaro",partido:"PL",numero:"22",foto:"https://i.pravatar.cc/150?img=1",cargo:"Presidente",propostas:["Economia liberal","Segurança"]},
      {nome:"Lula",partido:"PT",numero:"13",foto:"https://i.pravatar.cc/150?img=5",cargo:"Presidente",propostas:["Bolsa Família","Emprego"]},
      {nome:"Tarcísio",partido:"REP",numero:"10",foto:"https://i.pravatar.cc/150?img=8",cargo:"Presidente",propostas:["Gestão","Infraestrutura"]},
    ])
    if(v) setVotos(JSON.parse(v))
    else setVotos([0,0,0])
  },[codigoAtual])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(cod!=="DONO" && !cod.startsWith("LIBERADO-")){
      alert("Código inválido! Use LIBERADO-XXXX ou DONO");return
    }
    if(cod!=="DONO"){
      try{
        const pro = JSON.parse(localStorage.getItem("codigos_vendas_pro")||"[]")
        if(pro.some((c:any)=>c.codigo===cod && c.status==="cancelado")){
          setCodigoBloqueado(cod)
          setBloqueado(true)
          return
        }
        const canc = JSON.parse(localStorage.getItem("codigos_cancelados")||"[]")
        if(canc.includes(cod)){
          setCodigoBloqueado(cod)
          setBloqueado(true)
          return
        }
      }catch{}
    }
    localStorage.setItem("codigo_liberado",cod)
    setCodigoAtual(cod)
    setLiberado(true)
    setBloqueado(false)
  }

  function votar(){
    if(votoSel===null){alert("Escolha um candidato!");return}
    const nv=[...votos]
    nv[votoSel]=(nv[votoSel]||0)+1
    setVotos(nv)
    localStorage.setItem("votos_"+codigoAtual,JSON.stringify(nv))
    localStorage.setItem("ja_votou_"+codigoAtual,"true")
    setJaVotou(true)
  }

  const total=votos.reduce((a,b)=>a+b,0)

  // TELA DE BLOQUEADO - COM PIX E WHATSAPP PARA PAGAR
  if(bloqueado){
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#7f1d1d 0%,#000 60%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:24,padding:32,width:420,border:"4px solid black",boxShadow:"12px 12px 0px #000",textAlign:"center"}}>
          <div style={{width:80,height:80,background:"#fee2e2",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:36,border:"4px solid black"}}>⛔</div>
          <h1 style={{fontWeight:900,marginTop:16,fontSize:20,color:"#dc2626"}}>ACESSO CANCELADO</h1>
          <p style={{fontSize:12,fontWeight:700,marginTop:8,background:"#fee2e2",padding:"8px 12px",borderRadius:10,border:"2px solid black"}}>Código: {codigoBloqueado} foi cancelado</p>
          <p style={{fontSize:12,marginTop:12,color:"#475569",fontWeight:600}}>Seu acesso foi suspenso. Para reativar, faça o pagamento e fale com o suporte.</p>
          
          <div style={{marginTop:18,background:"#f8fafc",border:"3px solid black",borderRadius:16,padding:16,textAlign:"left",boxShadow:"4px 4px 0px #000"}}>
            <div style={{fontSize:13,fontWeight:900,textAlign:"center",marginBottom:10}}>💰 REATIVAR ACESSO</div>
            <div style={{background:"black",color:"#facc15",padding:"10px",borderRadius:10,textAlign:"center",fontWeight:900,fontSize:14,border:"2px solid black"}}>VALOR: {VALOR}</div>
            <div style={{marginTop:10,background:"white",border:"2px solid black",borderRadius:10,padding:10}}>
              <div style={{fontSize:11,fontWeight:900}}>PIX (Celular):</div>
              <div style={{fontSize:16,fontWeight:900,marginTop:4,letterSpacing:"1px"}}>{PIX}</div>
              <button onClick={()=>{navigator.clipboard.writeText(PIX);alert("PIX copiado: "+PIX)}} style={{width:"100%",marginTop:8,background:"#22c55e",color:"black",border:"3px solid black",borderRadius:8,padding:8,fontWeight:900,fontSize:12,cursor:"pointer",boxShadow:"2px 2px 0px #000"}}>📋 COPIAR CHAVE PIX</button>
            </div>
            <a href={`https://wa.me/${WHATSAPP}?text=Olá! Meu código ${codigoBloqueado} foi cancelado. Já fiz o PIX de ${VALOR} para reativar. Comprovante:`} target="_blank" style={{display:"block",marginTop:10,background:"#25D366",color:"black",textAlign:"center",padding:12,borderRadius:10,fontWeight:900,textDecoration:"none",border:"3px solid black",boxShadow:"3px 3px 0px #000",fontSize:13}}>💬 FALAR NO WHATSAPP<br/><span style={{fontSize:10}}>{WHATSAPP.replace("55","(62) ").replace("98179","98179-")}</span></a>
            <div style={{marginTop:10,fontSize:10,fontWeight:700,background:"#fef9c3",padding:"8px",borderRadius:8,border:"2px solid black",textAlign:"center"}}>📸 Após pagar, envie o comprovante no WhatsApp para reativação imediata</div>
          </div>

          <button onClick={()=>{setBloqueado(false);setCodInput("")}} style={{width:"100%",marginTop:16,background:"white",color:"black",border:"3px solid black",borderRadius:12,padding:12,fontWeight:900,fontSize:12,cursor:"pointer",boxShadow:"3px 3px 0px #000"}}>← VOLTAR E TENTAR OUTRO CÓDIGO</button>
        </div>
      </div>
    )
  }

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#1e293b 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:24,padding:36,width:400,border:"4px solid black",boxShadow:"12px 12px 0px #000",textAlign:"center"}}>
          <div style={{width:64,height:64,background:"#f8fafc",border:"3px solid black",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:28}}>🏛️</div>
          <h1 style={{fontWeight:900,marginTop:14,fontSize:16}}>PLATAFORMA 2026</h1>
          <div style={{marginTop:10,display:"inline-block",background:"#f1f5f9",border:"2px solid black",borderRadius:20,padding:"6px 14px",fontSize:11,fontWeight:800}}>Digite seu código de acesso</div>
          <input type="text" value={codInput} onChange={e=>setCodInput(e.target.value.toUpperCase())} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:18,padding:16,border:"3px solid black",borderRadius:12,textAlign:"center",fontWeight:900,boxSizing:"border-box",fontSize:14,letterSpacing:"1px",background:"white"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:12,background:"black",color:"#facc15",padding:14,borderRadius:12,fontWeight:900,border:"3px solid black",boxShadow:"4px 4px 0px #000",fontSize:13,cursor:"pointer"}}>ENTRAR →</button>
          <div style={{marginTop:14,fontSize:10,color:"#64748b",fontWeight:600}}>Código liberado nas vendas ou DONO</div>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <div style={{background:"black",color:"#facc15",padding:14,textAlign:"center",fontWeight:900,borderBottom:"4px solid #eab308",fontSize:14,display:"flex",justifyContent:"space-between",paddingLeft:20,paddingRight:20}}>
        <span>PLATAFORMA ELEITORAL 2026</span>
        <div style={{display:"flex",gap:8}}>
          <a href="/admin" style={{background:"white",color:"black",padding:"6px 10px",borderRadius:8,fontSize:11,fontWeight:900,textDecoration:"none",border:"2px solid black"}}>Admin</a>
          <button onClick={()=>{localStorage.removeItem("codigo_liberado");setLiberado(false)}} style={{background:"#ef4444",color:"white",border:"2px solid black",borderRadius:8,padding:"6px 10px",fontWeight:900,fontSize:11,cursor:"pointer"}}>SAIR</button>
        </div>
      </div>
      <div style={{maxWidth:800,margin:"20px auto",padding:16,display:"flex",flexDirection:"column",gap:12}}>
        <div style={{background:"white",border:"4px solid black",borderRadius:12,padding:12,textAlign:"center",fontWeight:900,boxShadow:"4px 4px 0px #000"}}>TOTAL: {total} VOTOS {jaVotou && "• VOCÊ JÁ VOTOU"}</div>
        {candidatos.map((c,i)=>(
          <div key={i} onClick={()=>!jaVotou && setVotoSel(i)} style={{background:"white",border:votoSel===i?"4px solid #22c55e":"3px solid black",borderRadius:16,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:jaVotou?"default":"pointer",boxShadow:"4px 4px 0px #000"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <img src={c.foto} style={{width:56,height:56,borderRadius:"50%",border:"3px solid black"}}/>
              <div><div style={{fontWeight:900,fontSize:15}}>{c.nome} - {c.partido}</div><div style={{fontSize:12,fontWeight:700}}>Nº {c.numero} • {c.cargo}</div></div>
            </div>
            <div style={{fontWeight:900,background:"#f1f5f9",padding:"6px 12px",borderRadius:20,border:"3px solid black",fontSize:13}}>{votos[i]||0}</div>
          </div>
        ))}
        {!jaVotou ? <button onClick={votar} style={{background:"#22c55e",color:"black",border:"4px solid black",borderRadius:12,padding:16,fontWeight:900,boxShadow:"4px 4px 0px #000",cursor:"pointer"}}>CONFIRMAR VOTO</button> : <div style={{background:"#fef9c3",border:"4px solid black",borderRadius:12,padding:16,textAlign:"center",fontWeight:900}}>✅ Voto computado!</div>}
      </div>
    </div>
  )
}
