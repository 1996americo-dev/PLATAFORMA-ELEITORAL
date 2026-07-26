"use client"
import React from "react"

const CAND = [
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
{name:"Ronaldo Caiado",part:"UNIAO - 44",foto:"https://i.pravatar.cc/100?img=11"},
]

export default function Home(){
const [liberado,setLiberado]=React.useState(false)
const [ehDono,setEhDono]=React.useState(false)
const [codigoInput,setCodigoInput]=React.useState("")
const [cpf,setCpf]=React.useState("")
const [cpfOk,setCpfOk]=React.useState(false)
const [votos,setVotos]=React.useState<number[]>(Array(11).fill(0))
const [msg,setMsg]=React.useState("")

React.useEffect(()=>{
  const url=new URL(window.location.href)
  if(url.searchParams.get("dono")==="americo"){
    localStorage.setItem("dono_americo","true")
    localStorage.setItem("codigo_liberado","DONO")
    setEhDono(true); setLiberado(true)
  }
  const c=url.searchParams.get("codigo")
  if(c && c.toUpperCase().startsWith("LIBERADO-")){
    localStorage.setItem("codigo_liberado",c.toUpperCase())
    setLiberado(true)
  }
  const cod=localStorage.getItem("codigo_liberado")
  if(cod && (cod.startsWith("LIBERADO-")||cod==="DONO")){
    setLiberado(true)
    if(localStorage.getItem("dono_americo")==="true") setEhDono(true)
  }
  const v=localStorage.getItem("votos_v21")
  if(v) setVotos(JSON.parse(v))
  const cv=localStorage.getItem("cpf_validado")
  if(cv){ setCpf(cv); setCpfOk(true) }
},[])

function doLiberar(){
  const cod=codigoInput.toUpperCase().trim()
  if(!cod.startsWith("LIBERADO-")&&cod!=="DONO"){ alert("Use LIBERADO-XXXX"); return }
  localStorage.setItem("codigo_liberado",cod)
  setLiberado(true)
}

function doValidar(){
  const limpo=cpf.replace(/\D/g,"")
  if(limpo.length!==11){ alert("CPF tem que ter 11 numeros"); return }
  const ja: string[]=JSON.parse(localStorage.getItem("cpfs_votaram")||"[]")
  if(ja.includes(limpo)){ alert("Este CPF ja votou!"); return }
  localStorage.setItem("cpf_validado",limpo)
  setCpfOk(true)
  setMsg("CPF VALIDADO - Agora pode votar")
}

function doVotar(i:number){
  if(!cpfOk){ alert("Valide o CPF primeiro na lateral"); return }
  const limpo=cpf.replace(/\D/g,"")
  const ja: string[]=JSON.parse(localStorage.getItem("cpfs_votaram")||"[]")
  if(ja.includes(limpo)){ alert("Este CPF ja votou"); return }
  const n=[...votos]; n[i]++; setVotos(n)
  localStorage.setItem("votos_v21",JSON.stringify(n))
  ja.push(limpo); localStorage.setItem("cpfs_votaram",JSON.stringify(ja))
  localStorage.removeItem("cpf_validado")
  setCpfOk(false); setCpf(""); setMsg("Voto computado em "+CAND[i].name)
  alert("Voto computado!")
}

const total=votos.reduce((a,b)=>a+b,0)

if(!liberado){
  return(
    <div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:"white",padding:20,borderRadius:10,width:320,textAlign:"center",border:"4px solid #facc15"}}>
        <div style={{fontWeight:900}}>SITE BLOQUEADO</div>
        <input value={codigoInput} onChange={e=>setCodigoInput(e.target.value)} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:10,padding:10,border:"3px solid black",borderRadius:8,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
        <button onClick={doLiberar} style={{width:"100%",marginTop:8,background:"black",color:"#facc15",padding:10,borderRadius:8,fontWeight:900,cursor:"pointer"}}>LIBERAR</button>
      </div>
    </div>
  )
}

return(
<div style={{minHeight:"100vh",background:"#f0efe5",fontFamily:"system-ui"}}>
<div style={{background:"black",color:"#facc15",padding:8,display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:12}}>
<span>PLATAFORMA 2026 - {total} VOTOS</span>
<div style={{display:"flex",gap:6}}>
<a href="/admin" style={{background:"white",color:"black",padding:"3px 8px",borderRadius:8,fontSize:10,textDecoration:"none"}}>ADMIN</a>
{ehDono && <a href="/admin/vendas" style={{background:"#22c55e",color:"white",padding:"3px 8px",borderRadius:8,fontSize:10,textDecoration:"none"}}>VENDAS</a>}
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:10,padding:10}}>
<div>
<div style={{background:"white",border:"3px solid black",borderRadius:8,padding:8}}>
<div style={{fontWeight:900,fontSize:11}}>VALIDACAO CPF</div>
<input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",marginTop:6,padding:8,border:"2px solid black",borderRadius:6,boxSizing:"border-box"}}/>
<button onClick={doValidar} style={{width:"100%",marginTop:6,background:cpfOk?"#16a34a":"black",color:cpfOk?"white":"#facc15",padding:8,borderRadius:6,fontWeight:900,cursor:"pointer"}}>{cpfOk?"VALIDADO":"VALIDAR CPF"}</button>
{msg && <div style={{fontSize:10,marginTop:4,fontWeight:700}}>{msg}</div>}
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8}}>
{CAND.map((c,i)=>(
<div key={i} style={{background:"white",border:"2px solid black",borderRadius:8,padding:6,textAlign:"center"}}>
<img src={c.foto} alt="" style={{width:50,height:50,borderRadius:"50%",border:"2px solid black"}}/>
<div style={{fontWeight:900,fontSize:11}}>{c.name}</div>
<div style={{fontSize:9}}>{c.part}</div>
<div style={{fontSize:10,marginTop:2}}>{votos[i]} votos</div>
<button onClick={()=>doVotar(i)} style={{width:"100%",marginTop:4,background:cpfOk?"#16a34a":"#bfdbfe",color:cpfOk?"white":"black",border:"2px solid black",borderRadius:6,padding:4,fontSize:10,fontWeight:900,cursor:"pointer"}}>VOTAR CPF</button>
</div>
))}
</div>
</div>
</div>
)
}