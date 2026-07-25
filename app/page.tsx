"use client"
import React from "react"
const PIX = "62981796690"
const NOME = "AMERICO QUISPE QUISPE"
const ZAP = "5562981796690"

export default function Home(){
const [liberado,setLiberado]=React.useState(false)
const [ehDono,setEhDono]=React.useState(false)

React.useEffect(()=>{
  const url = new URL(window.location.href)
  // DONA entra direto
  if(url.searchParams.get("dono")==="americo"){
    localStorage.setItem("dono_americo","true")
    localStorage.setItem("codigo_liberado","DONO")
    setLiberado(true); setEhDono(true); return
  }
  // CLIENTE libera por link com ?codigo=LIBERADO-XXXX que você manda no zap
  const codigoUrl = url.searchParams.get("codigo")
  if(codigoUrl && codigoUrl.startsWith("LIBERADO-")){
    localStorage.setItem("codigo_liberado",codigoUrl)
    setLiberado(true); return
  }
  if(localStorage.getItem("dono_americo")==="true") setEhDono(true)
  const cod = localStorage.getItem("codigo_liberado")
  if(cod && (cod.startsWith("LIBERADO-") || cod==="DONO")) setLiberado(true)
},[])

if(!liberado){
return(
<div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
<div style={{background:"white",borderRadius:20,border:"6px solid #facc15",padding:24,maxWidth:400,width:"100%",textAlign:"center"}}>
<div style={{fontSize:44}}>🔒</div>
<h1 style={{fontWeight:900,margin:"8px 0"}}>SITE BLOQUEADO</h1>
<p style={{fontSize:13,fontWeight:700}}>Sua plataforma foi bloqueada. Faça o pagamento para liberar o acesso vitalício.</p>
<div style={{background:"#fef9c3",border:"3px solid black",borderRadius:12,padding:16,marginTop:16}}>
<div style={{fontWeight:900,fontSize:18}}>R$97 - ACESSO VITALÍCIO</div>
<div style={{marginTop:8,fontWeight:800}}>PIX: {PIX}</div>
<div style={{fontSize:11,fontWeight:700}}>{NOME}</div>
<button onClick={()=>{navigator.clipboard.writeText(PIX);alert("PIX COPIADO: "+PIX)}} style={{width:"100%",marginTop:10,background:"white",border:"2px solid black",borderRadius:8,padding:10,fontWeight:900,cursor:"pointer"}}>📋 COPIAR CHAVE PIX</button>
<a href={`https://wa.me/${ZAP}?text=Olá! Fiz o PIX ${PIX} da plataforma eleitoral. Segue comprovante:`} target="_blank" style={{display:"block",marginTop:10,background:"#22c55e",color:"white",fontWeight:900,padding:14,borderRadius:10,textDecoration:"none",border:"3px solid black"}}>ENVIAR COMPROVANTE NO WHATSAPP</a>
<div style={{fontSize:10,marginTop:8,color:"#64748b",fontWeight:600}}>Após o comprovante você recebe o link liberado</div>
</div>
</div>
</div>
)
}

// AQUI VAI SUA PLATAFORMA NORMAL - COLEI A MESMA DA SUA FOTO
return(
<div style={{minHeight:"100vh",background:"#f0efe5",fontFamily:"system-ui"}}>
<div style={{background:"#1a1a1a",color:"#facc15",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div style={{fontWeight:900,fontSize:13}}>PLATAFORMA ELEITORAL 2026<br/><span style={{fontSize:10,color:"white"}}>V21 • 11 CANDIDATOS • 0 VOTOS</span></div>
<div style={{display:"flex",gap:6}}>
<span style={{background:"#facc15",color:"black",padding:"4px 10px",borderRadius:20,fontSize:9,fontWeight:900}}>AO VIVO</span>
<a href="/admin" style={{background:"white",color:"black",padding:"4px 10px",borderRadius:20,fontSize:9,fontWeight:900,textDecoration:"none"}}>ADMIN</a>
{ehDono && <a href="/admin/vendas" style={{background:"#22c55e",color:"white",padding:"4px 10px",borderRadius:20,fontSize:9,fontWeight:900,textDecoration:"none"}}>VENDAS</a>}
</div>
</div>
<div style={{padding:20,textAlign:"center",fontWeight:900}}>SUA PLATAFORMA LIBERADA AQUI - (cole o resto do seu código original aqui dentro se quiser)</div>
</div>
)
}