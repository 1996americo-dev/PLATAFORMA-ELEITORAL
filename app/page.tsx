"use client"
import React from "react"

const PIX = "62981796690"
const NOME = "AMERICO QUISPE QUISPE"
const ZAP = "5562981796690"

const CANDIDATOS_INI = [
{name:"Bolsonaro",part:"PL - 22",foto:"https://i.pravatar.cc/100?img=1"},
{name:"Ciro Gomes",part:"PDT - 12",foto:"https://i.pravatar.cc/100?img=2"},
{name:"Eduardo Leite",part:"PSDB - 45",foto:"https://i.pravatar.cc/100?img=3"},
{name:"Erika Hilton",part:"PSOL - 50",foto:"https://i.pravatar.cc/100?img=4"},
{name:"Lula",part:"PT - 13",foto:"https://i.pravatar.cc/100?img=5"},
{name:"Simone Tebet",part:"MDB - 15",foto:"https://i.pravatar.cc/100?img=6"},
{name:"Marina Silva",part:"REDE - 18",foto:"https://i.pravatar.cc/100?img=7"},
{name:"Nikolas Ferreira",part:"PL - 22",foto:"https://i.pravatar.cc/100?img=8"},
{name:"Tabata Amaral",part:"PSB - 40",foto:"https://i.pravatar.cc/100?img=9"},
{name:"Romeu Zema",part:"NOVO - 30",foto:"https://i.pravatar.cc/100?img=10"},
{name:"Ronaldo Caiado",part:"UNIÃO - 44",foto:"https://i.pravatar.cc/100?img=11"},
]

export default function Home(){
const [liberado,setLiberado]=React.useState(false)
const [ehDono,setEhDono]=React.useState(false)
const [codigoInput,setCodigoInput]=React.useState("")
const [cpf,setCpf]=React.useState("")
const [votos,setVotos]=React.useState<number[]>(Array(11).fill(0))

React.useEffect(()=>{
  const url = new URL(window.location.href)
  if(url.searchParams.get("dono")==="americo"){
    localStorage.setItem("dono_americo","true")
    localStorage.setItem("codigo_liberado","DONO")
    setLiberado(true); setEhDono(true); return
  }
  const codigoUrl = url.searchParams.get("codigo")
  if(codigoUrl && codigoUrl.startsWith("LIBERADO-")){
    localStorage.setItem("codigo_liberado",codigoUrl)
    setLiberado(true); return
  }
  if(localStorage.getItem("dono_americo")==="true") setEhDono(true)
  const cod = localStorage.getItem("codigo_liberado")
  if(cod && (cod.startsWith("LIBERADO-") || cod==="DONO")) setLiberado(true)
  const v = localStorage.getItem("votos_v21")
  if(v) setVotos(JSON.parse(v))
},[])

function liberar(){
  if(!codigoInput.startsWith("LIBERADO-")){
    alert("Código inválido! Peça seu código no WhatsApp após o pagamento.")
    return
  }
  localStorage.setItem("codigo_liberado",codigoInput)
  setLiberado(true)
}
function votar(i:number){
  const n=[...votos]; n[i]++; setVotos(n); localStorage.setItem("votos_v21",JSON.stringify(n))
}
const total = votos.reduce((a,b)=>a+b,0)

if(!liberado){
return(
<div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
<div style={{background:"white",borderRadius:20,border:"6px solid #facc15",padding:24,maxWidth:400,width:"100%",textAlign:"center"}}>
<div style={{fontSize:44}}>🔒</div>
<h1 style={{fontWeight:900,margin:"8px 0"}}>SITE BLOQUEADO</h1>
<p style={{fontSize:13,fontWeight:700}}>Sua plataforma foi bloqueada. Faça o pagamento para liberar o acesso vitalício.</p>

{/* CAMPO DE CÓDIGO SEM MOSTRAR A SENHA */}
<div style={{background:"#f1f5f9",border:"3px solid black",borderRadius:12,padding:12,marginTop:14}}>
<div style={{fontWeight:900,fontSize:12,textAlign:"left"}}>JÁ TENHO CÓDIGO:</div>
<div style={{display:"flex",gap:6,marginTop:6}}>
<input
value={codigoInput}
onChange={e=>setCodigoInput(e.target.value)}
placeholder="Digite seu código"
type="password"
style={{flex:1,padding:12,border:"3px solid black",borderRadius:8,fontWeight:900,textAlign:"center"}}/>
<button onClick={liberar} style={{background:"black",color:"#facc15",fontWeight:900,padding:"10px 14px",borderRadius:8,border:"3px solid black",cursor:"pointer"}}>LIBERAR</button>
</div>
</div>

<div style={{background:"#fef9c3",border:"3px solid black",borderRadius:12,padding:14,marginTop:12}}>
<div style={{fontWeight:900,fontSize:16}}>R$97 - ACESSO VITALÍCIO</div>
<div style={{marginTop:6,fontWeight:800,fontSize:13}}>PIX: {PIX}</div>
<div style={{fontSize:11,fontWeight:700}}>{NOME}</div>
<button onClick={()=>{navigator.clipboard.writeText(PIX);alert("PIX COPIADO: "+PIX)}} style={{width:"100%",marginTop:8,background:"white",border:"2px solid black",borderRadius:8,padding:10,fontWeight:900,cursor:"pointer",fontSize:12}}>📋 COPIAR CHAVE PIX</button>
<a href={`https://wa.me/${ZAP}?text=Olá! Fiz o PIX ${PIX} segue comprovante:`} target="_blank" style={{display:"block",marginTop:8,background:"#22c55e",color:"white",fontWeight:900,padding:12,borderRadius:8,textDecoration:"none",border:"3px solid black",fontSize:13}}>ENVIAR COMPROVANTE NO WHATSAPP</a>
</div>
</div>
</div>
)
}

return(
<div style={{minHeight:"100vh",background:"#f0efe5",fontFamily:"system-ui"}}>
<div style={{background:"#1a1a1a",color:"#facc15",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"4px solid #facc15"}}>
<div style={{fontWeight:900,fontSize:13}}>PLATAFORMA ELEITORAL 2026<br/><span style={{fontSize:10,color:"white"}}>V21 • 11 CANDIDATOS • {total} VOTOS</span></div>
<div style={{display:"flex",gap:6}}>
<span style={{background:"#facc15",color:"black",padding:"4px 10px",borderRadius:20,fontSize:9,fontWeight:900,border:"2px solid black"}}>AO VIVO</span>
<a href="/admin" style={{background:"white",color:"black",padding:"4px 10px",borderRadius:20,fontSize:9,fontWeight:900,textDecoration:"none",border:"2px solid black"}}>ADMIN</a>
{ehDono && <a href="/admin/vendas" style={{background:"#22c55e",color:"white",padding:"4px 10px",borderRadius:20,fontSize:9,fontWeight:900,textDecoration:"none",border:"2px solid black"}}>VENDAS</a>}
</div>
</div>

<div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:12,padding:12}}>
<div>
<div style={{background:"white",border:"3px solid black",borderRadius:10,padding:10}}>
<div style={{fontWeight:900,fontSize:11}}>RANKING - {total} VOTOS</div>
<div style={{border:"2px dashed #cbd5e1",borderRadius:8,padding:20,marginTop:8,textAlign:"center",color:"#3b82f6",fontWeight:700,fontSize:11}}>{total===0?"Nenhum voto ainda":`${total} votos computados`}</div>
</div>
<div style={{background:"white",border:"3px solid black",borderRadius:10,padding:10,marginTop:10}}>
<div style={{fontWeight:900,fontSize:11}}>VALIDAÇÃO CPF</div>
<input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",marginTop:8,padding:8,border:"2px solid black",borderRadius:6,textAlign:"center",boxSizing:"border-box"}}/>
<button style={{width:"100%",marginTop:6,background:"black",color:"#facc15",fontWeight:900,padding:8,borderRadius:6,border:"2px solid black"}}>VALIDAR CPF</button>
</div>
</div>

<div style={{background:"white",border:"3px solid black",borderRadius:10,padding:10}}>
<div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:11}}><span>CANDIDATOS</span><span style={{background:"black",color:"white",padding:"2px 8px",borderRadius:10,fontSize:9}}>{CANDIDATOS_INI.length} CANDIDATOS</span></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:10}}>
{CANDIDATOS_INI.map((c,i)=>(
<div key={i} style={{border:"2px solid black",borderRadius:10,padding:8,textAlign:"center"}}>
<img src={c.foto} style={{width:50,height:50,borderRadius:"50%",border:"2px solid black"}}/>
<div style={{fontWeight:900,fontSize:11,marginTop:4}}>{c.name}</div>
<div style={{fontSize:8,fontWeight:700}}>{c.part}</div>
<div style={{background:"#facc15",border:"2px solid black",borderRadius:6,marginTop:4,padding:2,fontSize:9,fontWeight:900}}>{c.part}</div>
<div style={{fontSize:9,marginTop:2}}>{votos[i]} votos</div>
<button onClick={()=>votar(i)} style={{width:"100%",marginTop:4,background:"#bfdbfe",border:"2px solid black",borderRadius:6,padding:4,fontSize:9,fontWeight:900,cursor:"pointer"}}>VOTAR CPF</button>
</div>
))}
</div>
</div>
</div>
</div>
)
}