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

  // CONFIG PROFISSIONAL - ALTERE AQUI
  const WHATSAPP = "5562999999999" // seu whatsapp com DDD
  const PIX = "seu-pix@email.com" // sua chave pix
  const VALOR = "R$ 97,00"

  React.useEffect(()=>{
    const cod = localStorage.getItem("codigo_liberado") || ""
    if(!cod) return
    try{
      const pro = JSON.parse(localStorage.getItem("codigos_vendas_pro")||"[]")
      const canc = pro.some((c:any)=>c.codigo===cod && c.status==="cancelado")
      const canc2 = JSON.parse(localStorage.getItem("codigos_cancelados")||"[]").includes(cod)
      if((canc||canc2) && cod!=="DONO"){
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
      {nome:"Simone Tebet",partido:"MDB",numero:"15",foto:"https://i.pravatar.cc/150?img=6",cargo:"Presidente",propostas:["Justiça social","Educação"]},
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
          alert("⛔ ACESSO CANCELADO - Fale com o suporte no WhatsApp.");return
        }
        const canc = JSON.parse(localStorage.getItem("codigos_cancelados")||"[]")
        if(canc.includes(cod)){
          alert("⛔ ACESSO CANCELADO");return
        }
      }catch{}
    }
    localStorage.setItem("codigo_liberado",cod)
    setCodigoAtual(cod)
    setLiberado(true)
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

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"radial-gradient(120% 120% at 20% 10%, #1e40af 0%, #0f172a 50%, #1e3a8a 100%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:24,padding:32,width:380,border:"4px solid black",boxShadow:"10px 10px 0px #000",textAlign:"center"}}>
          <div style={{width:72,height:72,background:"#f8fafc",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:30,border:"4px solid black"}}>🏛️</div>
          <h1 style={{fontWeight:900,marginTop:14,fontSize:18,letterSpacing:"0.5px"}}>PLATAFORMA 2026</h1>
          <div style={{marginTop:10,display:"inline-block",background:"#f1f5f9",border:"2px solid black",borderRadius:20,padding:"6px 14px",fontSize:11,fontWeight:800}}>Digite seu código de acesso</div>
          <input type="text" value={codInput} onChange={e=>setCodInput(e.target.value.toUpperCase())} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:18,padding:16,border:"3px solid black",borderRadius:12,textAlign:"center",fontWeight:900,boxSizing:"border-box",fontSize:13,letterSpacing:"1px"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:12,background:"black",color:"#facc15",padding:14,borderRadius:12,fontWeight:900,border:"3px solid black",boxShadow:"4px 4px 0px #000",fontSize:13,cursor:"pointer"}}>ENTRAR →</button>
          <div style={{marginTop:16,background:"#f8fafc",border:"2px solid black",borderRadius:12,padding:10}}>
            <div style={{fontSize:11,fontWeight:800}}>💬 Suporte: WhatsApp</div>
            <div style={{fontSize:10,marginTop:4}}>Valor: <b>{VALOR}</b> • PIX: {PIX}</div>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <div style={{background:"black",color:"white",padding:"12px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"4px solid #facc15"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{background:"#facc15",color:"black",width:32,height:32,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,border:"2px solid black"}}>26</div>
          <div>
            <div style={{fontWeight:900,fontSize:13}}>PLATAFORMA 2026 • VOTAÇÃO</div>
            <div style={{fontSize:10,background:"#22c55e",color:"black",padding:"2px 8px",borderRadius:20,display:"inline-block",fontWeight:900,marginTop:2}}>ACESSO LIBERADO • {total} VOTOS</div>
          </div>
        </div>
        <div style={{display:"flex",gap:6}}>
          <a href="/admin" style={{background:"white",color:"black",padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:900,textDecoration:"none",border:"2px solid black"}}>Admin</a>
          <button onClick={()=>{localStorage.removeItem("codigo_liberado");setLiberado(false)}} style={{background:"#ef4444",color:"white",padding:"6px 12px",borderRadius:8,fontSize:11,fontWeight:900,border:"2px solid black",cursor:"pointer"}}>SAIR</button>
        </div>
      </div>

      <div style={{maxWidth:900,margin:"16px auto",padding:12,display:"flex",flexDirection:"column",gap:12}}>
        {/* BARRA PROFISSIONAL COM WHATSAPP / PIX / VALOR - SEM MOSTRAR LIBERADO-XXXX */}
        <div style={{background:"white",border:"3px solid black",borderRadius:12,padding:12,display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"4px 4px 0px #000",flexWrap:"wrap",gap:8}}>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            <div style={{fontSize:11,fontWeight:900,background:"black",color:"#facc15",padding:"6px 10px",borderRadius:8}}>VALOR: {VALOR}</div>
            <div style={{fontSize:11,fontWeight:800,background:"#f1f5f9",padding:"6px 10px",borderRadius:8,border:"2px solid black"}}>PIX: {PIX} <button onClick={()=>{navigator.clipboard.writeText(PIX);alert("PIX copiado!")}} style={{marginLeft:6,background:"#22c55e",border:"2px solid black",borderRadius:6,padding:"2px 6px",fontWeight:900,fontSize:10,cursor:"pointer"}}>COPIAR</button></div>
          </div>
          <a href={`https://wa.me/${WHATSAPP}?text=Olá, preciso de suporte na Plataforma 2026`} target="_blank" style={{background:"#25D366",color:"black",padding:"8px 14px",borderRadius:8,fontSize:11,fontWeight:900,textDecoration:"none",border:"3px solid black",boxShadow:"2px 2px 0px #000"}}>💬 WhatsApp Suporte</a>
        </div>

        {candidatos.map((c,i)=>(
          <div key={i} onClick={()=>setVotoSel(i)} style={{background:"white",border:votoSel===i?"4px solid #22c55e":"3px solid black",borderRadius:16,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",boxShadow:"4px 4px 0px #000"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <img src={c.foto} style={{width:56,height:56,borderRadius:"50%",border:"3px solid black"}}/>
              <div>
                <div style={{fontWeight:900,fontSize:14}}>{c.nome} • {c.partido}</div>
                <div style={{fontSize:11,fontWeight:700}}>Nº {c.numero} • {c.cargo}</div>
                <div style={{fontSize:10,marginTop:2}}>{(c.propostas||[]).join(" • ")}</div>
              </div>
            </div>
            <div style={{fontWeight:900,background:votoSel===i?"#22c55e":"#f1f5f9",padding:"8px 14px",borderRadius:20,border:"3px solid black",fontSize:12}}>{votos[i]||0}</div>
          </div>
        ))}

        <button onClick={votar} style={{background:"black",color:"#facc15",border:"4px solid black",borderRadius:12,padding:16,fontWeight:900,fontSize:14,boxShadow:"4px 4px 0px #000",cursor:"pointer"}}>CONFIRMAR VOTO →</button>
        <div style={{textAlign:"center",fontSize:11,fontWeight:800,background:"white",border:"2px solid black",borderRadius:8,padding:8}}>Total: {total} votos • Acesso protegido • Código escondido por segurança</div>
      </div>
    </div>
  )
}
