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
    const cod = localStorage.getItem("codigo_liberado") || "GERAL"
    if(cod) setCodigoAtual(cod)
    const cc=localStorage.getItem("candidatos_"+cod)
    const v=localStorage.getItem("votos_"+cod)
    if(cc) setCandidatos(JSON.parse(cc))
    else setCandidatos([
      {nome:"Bolsonaro",partido:"PL - 22",numero:"22",foto:"https://i.pravatar.cc/150?img=1",cargo:"Presidente",propostas:["Economia liberal","Segurança"]},
      {nome:"Lula",partido:"PT - 13",numero:"13",foto:"https://i.pravatar.cc/150?img=5",cargo:"Presidente",propostas:["Bolsa Família","Emprego"]},
    ])
    if(v) setVotos(JSON.parse(v))
    else setVotos([0,0])
    const ja = localStorage.getItem("ja_votou_"+cod)
    if(ja) setJaVotou(true)
  },[])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(!cod.startsWith("LIBERADO-") && cod!=="DONO"){
      alert("Código inválido! Use LIBERADO-XXXX ou DONO");return
    }
    // BLOQUEIO - SE FOI CANCELADO NAS VENDAS, NÃO ENTRA
    try{
      const listaPro = JSON.parse(localStorage.getItem("codigos_vendas_pro")||"[]")
      const cancelPro = Array.isArray(listaPro) && listaPro.some((c:any)=>c.codigo===cod && c.status==="cancelado")
      const cancelSimples = JSON.parse(localStorage.getItem("codigos_cancelados")||"[]")
      const cancel2 = Array.isArray(cancelSimples) && cancelSimples.includes(cod)
      if(cancelPro || cancel2){
        alert("⛔ ACESSO CANCELADO - Esse código foi cancelado. Fale com o suporte.");return
      }
      // Verifica se código existe nos ativos (se houver lista)
      const ativos = JSON.parse(localStorage.getItem("codigos_ativos")||"[]")
      const vendidos = JSON.parse(localStorage.getItem("codigos_vendas")||"[]")
      if(cod!=="DONO" && Array.isArray(vendidos) && vendidos.length>0){
        const existe = vendidos.includes(cod)
        if(!existe){
          alert("⛔ Código não encontrado nas vendas!");return
        }
        if(Array.isArray(ativos) && ativos.length>0 && !ativos.includes(cod)){
          alert("⛔ Código cancelado!");return
        }
      }
    }catch(e){}

    localStorage.setItem("codigo_liberado",cod)
    setCodigoAtual(cod)
    setLiberado(true)
    window.location.reload()
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
    alert("✅ Voto computado!")
  }

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:16, fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:20,padding:28,width:400,border:"4px solid black", boxShadow:"8px 8px 0px #000", textAlign:"center"}}>
          <div style={{width:70,height:70, background:"#fef9c3", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto", fontSize:32, border:"4px solid black"}}>🗳️</div>
          <h1 style={{fontWeight:900, marginTop:12, fontSize:18}}>PLATAFORMA 2026</h1>
          <p style={{fontSize:11,color:"#000", fontWeight:800, background:"#fee2e2", padding:"6px 10px", borderRadius:20, display:"inline-block", marginTop:6, border:"2px solid black"}}>🔐 Digite seu código de acesso</p>
          <input type="password" value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:14,padding:14,border:"4px solid black",borderRadius:12,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",padding:14,borderRadius:12,fontWeight:900,border:"4px solid black", boxShadow:"4px 4px 0px #000"}}>ENTRAR →</button>
          <p style={{fontSize:10,color:"#64748b",marginTop:10}}>Código liberado nas vendas ou DONO</p>
        </div>
      </div>
    )
  }

  const total=votos.reduce((a,b)=>a+b,0)

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <div style={{background:"black",color:"#facc15",padding:12,textAlign:"center",fontWeight:900,borderBottom:"4px solid #eab308"}}>PLATAFORMA ELEITORAL 2026 • Cliente: {codigoAtual} • {candidatos.length} candidatos</div>
      <div style={{maxWidth:900,margin:"20px auto",padding:16,display:"flex",flexDirection:"column",gap:16}}>
        {candidatos.map((c,i)=>(
          <div key={i} onClick={()=>!jaVotou && setVotoSel(i)} style={{background:"white",border:votoSel===i?"4px solid #22c55e":"4px solid black",borderRadius:16,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:jaVotou?"default":"pointer",boxShadow:"4px 4px 0px #000"}}>
            <div style={{display:"flex",gap:12,alignItems:"center"}}>
              <img src={c.foto} style={{width:60,height:60,borderRadius:"50%",border:"3px solid black"}}/>
              <div>
                <div style={{fontWeight:900,fontSize:16}}>{c.nome} - {c.partido}</div>
                <div style={{fontSize:12}}>Nº {c.numero} • {c.cargo}</div>
                <div style={{fontSize:11}}>{(c.propostas||[]).join(" • ")}</div>
              </div>
            </div>
            <div style={{fontWeight:900,background:votoSel===i?"#22c55e":"#f1f5f9",padding:"8px 14px",borderRadius:20,border:"3px solid black"}}>{votos[i]||0} votos</div>
          </div>
        ))}
        {!jaVotou ? <button onClick={votar} style={{background:"#22c55e",color:"black",border:"4px solid black",borderRadius:12,padding:16,fontWeight:900,fontSize:16,boxShadow:"4px 4px 0px #000"}}>CONFIRMAR VOTO →</button> : <div style={{background:"#fef9c3",border:"4px solid black",borderRadius:12,padding:16,textAlign:"center",fontWeight:900}}>✅ Você já votou! Total: {total} votos</div>}
        <button onClick={()=>{localStorage.removeItem("codigo_liberado");setLiberado(false)}} style={{background:"#ef4444",color:"white",border:"3px solid black",borderRadius:10,padding:10,fontWeight:900}}>SAIR</button>
      </div>
    </div>
  )
}
