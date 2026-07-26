"use client"
import React from "react"

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
const [cpfValido,setCpfValido]=React.useState(false)
const [msg,setMsg]=React.useState("")
const [votos,setVotos]=React.useState<number[]>(Array(11).fill(0))

React.useEffect(()=>{
  const url = new URL(window.location.href)
  if(url.searchParams.get("dono")==="americo"){
    localStorage.setItem("dono_americo","true")
    localStorage.setItem("codigo_liberado","DONO")
    setEhDono(true); setLiberado(true)
  }
  const codUrl = url.searchParams.get("codigo")
  if(codUrl && codUrl.toUpperCase().startsWith("LIBERADO-")){
    localStorage.setItem("codigo_liberado",codUrl.toUpperCase())
    setLiberado(true)
  }
  const cod = localStorage.getItem("codigo_liberado")
  if(cod && (cod.startsWith("LIBERADO-") || cod==="DONO")){
    setLiberado(true)
    if(localStorage.getItem("dono_americo")==="true") setEhDono(true)
  }
  const v = localStorage.getItem("votos_v21")
  if(v) setVotos(JSON.parse(v))
  const cpfOk = localStorage.getItem("cpf_validado")
  if(cpfOk){ setCpf(cpfOk); setCpfValido(true) }
},[])

function liberar(){
  const cod = codigoInput.toUpperCase().trim()
  if(!cod.startsWith("LIBERADO-") && cod!=="DONO"){ alert("Código inválido! Use LIBERADO-XXXX"); return }
  localStorage.setItem("codigo_liberado",cod)
  setLiberado(true)
}

function validarCPF(){
  const limpo = cpf.replace(/\D/g,"")
  if(limpo.length!==11){ alert("CPF precisa ter 11 números!"); return }
  const jaVotou: string[] = JSON.parse(localStorage.getItem("cpfs_votaram")||"[]")
  if(jaVotou.includes(limpo)){ setMsg("Este CPF já votou!"); alert("Este CPF já votou!"); return }
  localStorage.setItem("cpf_validado",limpo)
  setCpfValido(true)
  setMsg("CPF VALIDADO ✅ Agora pode votar!")
  alert("CPF VALIDADO ✅ Agora clique em VOTAR CPF")
}

function votar(i:number){
  if(!cpfValido){ alert("Primeiro VALIDE o CPF na lateral!"); return }
  const limpo = cpf.replace(/\D/g,"")
  const jaVotou: string[] = JSON.parse(localStorage.getItem("cpfs_votaram")||"[]")
  if(jaVotou.includes(limpo)){ alert("Este CPF já votou!"); return }
  const n=[...votos]; n[i]++; setVotos(n)
  localStorage.setItem("votos_v21",JSON.stringify(n))
  jaVotou.push(limpo); localStorage.setItem("cpfs_votaram",JSON.stringify(jaVotou))
  localStorage.removeItem("cpf_validado")
  setCpfValido(false); setCpf(""); setMsg(`Voto computado em ${CANDIDATOS_INI[i].name} ✅`)
  alert(`Voto computado em ${CANDIDATOS_INI[i].name} ✅`)
}

const total = votos.reduce((a,b)=>a+b,0)

if(!liberado){
return(
<div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
<div style={{background:"white",borderRadius:14,padding:20,maxWidth:360,width:"100%",textAlign:"center",border:"4px solid #facc15"}}>
<h2 style={{fontWeight:900}}>SITE BLOQUEADO</h2>
<input value={codigoInput} onChange={e=>setCodigoInput(e.target.value)} placeholder="LIBERADO-XXXX" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,fontWeight:900,textAlign:"center",marginTop:10,boxSizing:"border-box"}}/>
<button onClick={liberar} style={{width:"100%",marginTop:8,background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:8,cursor:"pointer"}}>LIBERAR</button>
</div>
</div>
)
}

return(
<div style={{minHeight:"100vh",background:"#f0efe5",fontFamily:"system-ui"}}>
<div style={{background:"#1a1a1a",color:"#facc15",padding:"8px 12px",display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:12,borderBottom:"4px solid #facc15"}}>
<span>PLATAFORMA ELEITORAL 2026 - V21 • 11 CANDIDATOS • {total} VOTOS</span>
<div style={{display:"flex",gap:6}}>
<span style={{background:"#facc15",color:"black",padding:"3px 8px",borderRadius:12,fontSize:9,border:"2px solid black"}}>AO VIVO</span>
<a href="/admin" style={{background:"white",color:"black",padding:"3px 8px",borderRadius:12,fontSize:9,textDecoration:"none",border:"2px solid black"}}>ADMIN</a>
{ehDono && <a href="/admin/vendas" style={{background:"#22c55e",color:"white",padding:"3px 8px",borderRadius:12,fontSize:9,textDecoration:"none",border:"2px solid black"}}>VENDAS</a>}
</div>
</div>

<div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:10,padding:10}}>
<div>
<div style={{background:"white",border:"3px solid black",borderRadius:8,padding:8}}>
<div style={{fontWeight:900,fontSize:11}}>RANKING - {total} VOTOS</div>
<div style={{border:"2px dashed #cbd5e1",borderRadius:6,padding:12,marginTop:6,textAlign:"center",fontSize:11,fontWeight:700}}>
{total===0?"Nenhum voto ainda":votos.map((v,i)=>v>0?`${CANDIDATOS_INI[i].name}: ${v} votos (${Math.round(v/total*100)}%)`:"").filter(Boolean).join("\n")}
</div>
</div>
<div style={{background:"white",border:"3px solid black",borderRadius:8,padding:8,marginTop:8}}>
<div style={{fontWeight:900,fontSize:11}}>VALIDAÇÃO CPF</div>
<input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",marginTop:6,padding:8,border:"2px solid black",borderRadius:6,textAlign:"center",boxSizing:"border-box"}}/>
<button onClick={validarCPF} style={{width:"100%",marginTop:6,background:cpfValido?"#16a34a":"black",color:cpfValido?"white":"#facc15",fontWeight:900,padding:8,borderRadius:6,border:"2px solid black",cursor:"pointer",fontSize:11}}>{cpfValido?"CPF VALIDADO ✅":"VALIDAR CPF"}</button>
{msg && <div style={{fontSize:10,marginTop:6,fontWeight:700,color:cpfValido?"green":"black"}}>{msg}</div>}
</div>
</div>

<div style={{background:"white",border:"3px solid black",borderRadius:8,padding:8}}>
<div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:11}}><span>CANDIDATOS</span><span style={{background:"black",color:"white",padding:"2px 6px",borderRadius:10,fontSize:9}}>{CANDIDATOS_INI.length} CANDIDATOS</span></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:8}}>
{CANDIDATOS_INI.map((c,i)=>(
<div key={i} style={{border:"2px solid black",borderRadius:8,padding:6,textAlign:"center"}}>
<img src={c.foto} style={{width:50,height:50,borderRadius:"50%",border:"2px solid black"}}/>
<div style={{fontWeight:900,fontSize:11,marginTop:2}}>{c.name}</div>
<div style={{fontSize:8,fontWeight:700}}>{c.part}</div>
<div style={{background:"#facc15",border:"1px solid black",borderRadius:4,marginTop:2,padding:2,fontSize:8,fontWeight:900}}>{c.part}</div>
<div style={{fontSize:9,marginTop:2,fontWeight:700}}>{votos[i]} votos - {total>0?Math.round(votos[i]/total*100):0}%</div>
<button onClick={()=>votar(i)} style={{width:"100%",marginTop:4,background:cpfValido?"#16a34a":"#bfdbfe",color:cpfValido?"white":"black",border:"2px solid black",borderRadius:6,padding:4,fontSize:9,fontWeight:900,cursor:"pointer"}}>VOTAR CPF</button>
</div>
))}
</div>
</div>
</div>
</div>
</div>
)
}