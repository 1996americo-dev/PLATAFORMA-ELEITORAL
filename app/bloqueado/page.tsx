"use client"
import React from "react"

const PIX = "62981796690"
const NOME = "AMERICO QUISPE QUISPE"
const ZAP_DONO = "5562981796690"

type Candidato = { id:number, nome:string, partido:string, votos:number }

export default function Home(){
const [candidatos, setCandidatos] = React.useState<Candidato[]>([
{id:1,nome:"Candidato 1",partido:"PL",votos:0},
{id:2,nome:"Candidato 2",partido:"PT",votos:0},
{id:3,nome:"Candidato 3",partido:"MDB",votos:0},
{id:4,nome:"Candidato 4",partido:"PSDB",votos:0},
{id:5,nome:"Candidato 5",partido:"PSD",votos:0},
{id:6,nome:"Candidato 6",partido:"PP",votos:0},
{id:7,nome:"Candidato 7",partido:"UNIÃO",votos:0},
{id:8,nome:"Candidato 8",partido:"PDT",votos:0},
{id:9,nome:"Candidato 9",partido:"PSOL",votos:0},
{id:10,nome:"Candidato 10",partido:"NOVO",votos:0},
{id:11,nome:"Candidato 11",partido:"REDE",votos:0},
])
const [liberado, setLiberado] = React.useState(false)
const [codigoInput, setCodigoInput] = React.useState("")
const [ehDono, setEhDono] = React.useState(false)
const [totalVotos, setTotalVotos] = React.useState(0)

React.useEffect(()=>{
  const url = new URL(window.location.href)
  if(url.searchParams.get("dono")==="americo"){
    localStorage.setItem("dono_americo","true")
    localStorage.setItem("codigo_liberado","DONO")
    setLiberado(true)
    setEhDono(true)
  }
  const donoSalvo = localStorage.getItem("dono_americo")
  const codigoSalvo = localStorage.getItem("codigo_liberado")
  if(donoSalvo==="true") setEhDono(true)
  if(donoSalvo==="true" || (codigoSalvo && codigoSalvo.startsWith("LIBERADO-")) || codigoSalvo==="DONO"){
    setLiberado(true)
  }
  const votosSalvos = localStorage.getItem("votos_candidatos")
  if(votosSalvos) {
    const lista = JSON.parse(votosSalvos)
    setCandidatos(lista)
    setTotalVotos(lista.reduce((a:number,b:Candidato)=>a+b.votos,0))
  }
},[])

function liberarAcesso(){
  if(!codigoInput.startsWith("LIBERADO-")){
    alert("Código inválido! Tem que começar com LIBERADO- . Peça seu código no WhatsApp.")
    return
  }
  localStorage.setItem("codigo_liberado", codigoInput)
  setLiberado(true)
}

function votar(id:number){
  const nova = candidatos.map(c=> c.id===id ? {...c, votos:c.votos+1} : c)
  setCandidatos(nova)
  setTotalVotos(nova.reduce((a,b)=>a+b.votos,0))
  localStorage.setItem("votos_candidatos", JSON.stringify(nova))
}

// TELA BLOQUEADA PARA CLIENTE QUE NAO PAGOU
if(!liberado){
return(
<div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
<div style={{background:"white",borderRadius:20,border:"6px solid #facc15",padding:28,maxWidth:420,width:"100%",textAlign:"center"}}>
<div style={{fontSize:50}}>🔒</div>
<h1 style={{fontWeight:900,fontSize:28,margin:"8px 0"}}>SITE BLOQUEADO</h1>
<p style={{fontWeight:700,fontSize:14,lineHeight:"18px"}}>Esta plataforma está bloqueada.<br/>Libere seu acesso para usar com seus clientes.</p>

<div style={{background:"#f1f5f9",border:"3px solid black",borderRadius:12,padding:14,marginTop:14,textAlign:"left"}}>
<div style={{fontWeight:900,fontSize:13}}>JÁ TENHO CÓDIGO DE LIBERAÇÃO:</div>
<div style={{display:"flex",gap:8,marginTop:8}}>
<input value={codigoInput} onChange={e=>setCodigoInput(e.target.value)} placeholder="LIBERADO-1234" style={{flex:1,padding:12,border:"3px solid black",borderRadius:8,fontWeight:900,textAlign:"center"}}/>
<button onClick={liberarAcesso} style={{background:"black",color:"#facc15",fontWeight:900,padding:"10px 14px",borderRadius:8,border:"3px solid black",cursor:"pointer"}}>LIBERAR</button>
</div>
</div>

<div style={{background:"#fef9c3",border:"3px solid black",borderRadius:12,padding:16,marginTop:14}}>
<div style={{fontWeight:900,fontSize:14}}>AINDA NÃO TEM ACESSO?</div>
<div style={{fontWeight:800,fontSize:22,marginTop:6}}>R$97 LIBERAÇÃO VITALÍCIA</div>
<div style={{marginTop:8,fontSize:12,fontWeight:700}}>PIX: {PIX}</div>
<div style={{fontSize:11,fontWeight:700}}>{NOME}</div>
<button onClick={()=>{navigator.clipboard.writeText(PIX); alert("PIX COPIADO: "+PIX)}} style={{marginTop:10,width:"100%",background:"white",color:"black",fontWeight:900,padding:10,borderRadius:8,border:"2px solid black",cursor:"pointer",fontSize:12}}>📋 COPIAR CHAVE PIX</button>
<a href={`https://wa.me/${ZAP_DONO}?text=Olá! Fiz o PIX de R$97 para liberar minha plataforma. Segue comprovante:`} target="_blank" style={{display:"block",marginTop:8,background:"#22c55e",color:"white",fontWeight:900,padding:12,borderRadius:8,textDecoration:"none",border:"3px solid black",fontSize:13}}>💬 JÁ PAGUEI - ENVIAR COMPROVANTE NO WHATSAPP</a>
<div style={{fontSize:10,marginTop:8,color:"#64748b",fontWeight:600}}>Após enviar o comprovante, você recebe o código em até 5 minutos</div>
</div>
</div>
</div>
)
}

// TELA LIBERADA - PLATAFORMA NORMAL
return(
<div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
<div style={{background:"black",color:"white",padding:"14px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"4px solid #facc15"}}>
<div style={{fontWeight:900,letterSpacing:1}}>PLATAFORMA ELEITORAL 2026</div>
<div style={{display:"flex",gap:8}}>
<a href="/admin" style={{background:"white",color:"black",fontWeight:900,padding:"6px 14px",borderRadius:8,textDecoration:"none",fontSize:12,border:"2px solid black"}}>ADMIN</a>
{ehDono && <a href="/admin/vendas" style={{background:"#22c55e",color:"white",fontWeight:900,padding:"6px 14px",borderRadius:8,textDecoration:"none",fontSize:12,border:"2px solid black"}}>💰 VENDAS</a>}
</div>
</div>

<div style={{padding:16}}>
<div style={{background:"white",border:"4px solid black",borderRadius:12,padding:12,display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:13}}>
<span>V21 • 11 CANDIDATOS</span>
<span>{totalVotos} VOTOS</span>
</div>

<div style={{marginTop:16,display:"grid",gap:10}}>
{candidatos.map(c=>(
<div key={c.id} style={{background:"white",border:"3px solid black",borderRadius:12,padding:14,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontWeight:900}}>{c.nome}</div>
<div style={{fontSize:12,fontWeight:700,color:"#64748b"}}>{c.partido} • {c.votos} votos</div>
</div>
<button onClick={()=>votar(c.id)} style={{background:"#facc15",border:"3px solid black",borderRadius:8,padding:"8px 14px",fontWeight:900,cursor:"pointer"}}>VOTAR</button>
</div>
))}
</div>
</div>
</div>
)
}