"use client"
import React from "react"

const DEFAULT = [
{nome:"Bolsonaro",partido:"PL - 22",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=1",propostas:""},
{nome:"Ciro Gomes",partido:"PDT - 12",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=2",propostas:""},
{nome:"Eduardo Leite",partido:"PSDB - 45",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=3",propostas:""},
{nome:"Erika Hilton",partido:"PSOL - 50",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=4",propostas:""},
{nome:"Lula",partido:"PT - 13",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=5",propostas:""},
{nome:"Simone Tebet",partido:"MDB - 15",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=6",propostas:""},
{nome:"Marina Silva",partido:"REDE - 18",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=7",propostas:""},
{nome:"Nikolas Ferreira",partido:"PL - 22",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=8",propostas:""},
{nome:"Tabata Amaral",partido:"PSB - 40",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=9",propostas:""},
{nome:"Romeu Zema",partido:"NOVO - 30",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=10",propostas:""},
{nome:"Ronaldo Caiado",partido:"UNIÃO - 44",cargo:"Presidente",foto:"https://i.pravatar.cc/100?img=11",propostas:""},
]

export default function Admin(){
const [liberado,setLiberado]=React.useState(false)
const [ehDono,setEhDono]=React.useState(false)
const [codigoInput,setCodigoInput]=React.useState("")
const [lista,setLista]=React.useState<any[]>([])
const [nome,setNome]=React.useState("")
const [partido,setPartido]=React.useState("")
const [foto,setFoto]=React.useState("")
const [senha,setSenha]=React.useState("sua2026")

React.useEffect(()=>{
  const url = new URL(window.location.href)
  const codUrl = url.searchParams.get("codigo")
  const bloqueados: string[] = JSON.parse(localStorage.getItem("codigos_bloqueados")||"[]")

  if(url.searchParams.get("dono")==="americo"){
    localStorage.setItem("dono_americo","true")
    localStorage.setItem("codigo_liberado","DONO")
    setEhDono(true); setLiberado(true)
  } else {
    if(codUrl && codUrl.toUpperCase().startsWith("LIBERADO-")){
      if(!bloqueados.includes(codUrl.toUpperCase())){
        localStorage.setItem("codigo_liberado",codUrl.toUpperCase())
        setLiberado(true)
      }
    }
    const cod = localStorage.getItem("codigo_liberado")
    if(cod && (cod.toUpperCase().startsWith("LIBERADO-") || cod==="DONO")){
      if(cod==="DONO" || !bloqueados.includes(cod)){
        if(localStorage.getItem("dono_americo")==="true") setEhDono(true)
        setLiberado(true)
      }
    }
  }

  const s = localStorage.getItem("admin_candidatos")
  if(s && JSON.parse(s).length>0) setLista(JSON.parse(s))
  else { setLista(DEFAULT); localStorage.setItem("admin_candidatos",JSON.stringify(DEFAULT)) }
},[])

function entrar(){
  const cod = codigoInput.toUpperCase().trim()
  const bloqueados: string[] = JSON.parse(localStorage.getItem("codigos_bloqueados")||"[]")
  if(bloqueados.includes(cod)){ alert("Código CANCELADO!"); return }
  if(!cod.startsWith("LIBERADO-")){ alert("Senha errada! Use LIBERADO-XXXX"); return }
  localStorage.setItem("codigo_liberado",cod)
  setLiberado(true)
}

function adicionar(){
  if(!nome) return alert("Nome")
  const novo = {nome,partido,cargo:"Presidente",foto:foto||`https://i.pravatar.cc/100?img=${lista.length+1}`,propostas:""}
  const nova=[...lista,novo]
  setLista(nova); localStorage.setItem("admin_candidatos",JSON.stringify(nova))
  setNome(""); setPartido(""); setFoto("")
}

if(!liberado){
return(
<div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
<div style={{background:"white",border:"4px solid #facc15",borderRadius:14,padding:20,width:"100%",maxWidth:360,textAlign:"center"}}>
<div style={{fontWeight:900}}>ADMIN - 11 CANDIDATOS</div>
<input value={codigoInput} onChange={e=>setCodigoInput(e.target.value)} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:12,padding:12,border:"3px solid black",borderRadius:8,fontWeight:900,textAlign:"center",boxSizing:"border-box"}}/>
<button onClick={entrar} style={{width:"100%",marginTop:8,background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:8,border:"3px solid black",cursor:"pointer"}}>ENTRAR</button>
<a href="/" style={{display:"block",marginTop:8,fontSize:12}}>Voltar</a>
</div>
</div>
)
}

return(
<div style={{fontFamily:"system-ui",background:"#f0efe5",minHeight:"100vh"}}>
<div style={{background:"black",color:"#facc15",padding:10,fontWeight:900,borderBottom:"4px solid #facc15",display:"flex",justifyContent:"space-between"}}>
<span>ADMIN - {lista.length} CANDIDATOS - {ehDono?"SENHA PRÓPRIA ATIVA ✅":"CLIENTE ATIVO ✅"} - 0 VOTOS</span>
<div style={{display:"flex",gap:6}}>
<a href="/" style={{background:"white",color:"black",padding:"4px 8px",borderRadius:6,fontSize:10,textDecoration:"none",fontWeight:900}}>Site</a>
{ehDono && <a href="/admin/vendas" style={{background:"#22c55e",color:"white",padding:"4px 8px",borderRadius:6,fontSize:10,textDecoration:"none",fontWeight:900}}>Vendas</a>}
<a href="/" style={{background:"#ef4444",color:"white",padding:"4px 8px",borderRadius:6,fontSize:10,textDecoration:"none",fontWeight:900}}>Sair</a>
</div>
</div>

<div style={{display:"grid",gridTemplateColumns:"1fr 280px",gap:10,padding:10}}>
<div>
<div style={{background:"white",border:"3px solid black",borderRadius:10,padding:10}}>
<div style={{fontWeight:900,fontSize:11}}>+ CADASTRAR CANDIDATO</div>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 150px 100px",gap:6,marginTop:8}}>
<input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome" style={{border:"2px solid black",borderRadius:6,padding:6,fontSize:12}}/>
<input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Partido" style={{border:"2px solid black",borderRadius:6,padding:6,fontSize:12}}/>
<select style={{border:"2px solid black",borderRadius:6,padding:6,fontSize:12}}><option>Presidente</option></select>
<button style={{background:"#3b82f6",color:"white",border:"2px solid black",borderRadius:6,fontWeight:900,fontSize:10}}>SUBIR FOTOS</button>
</div>
<input value={foto} onChange={e=>setFoto(e.target.value)} placeholder="Link foto https://..." style={{width:"100%",marginTop:6,border:"2px solid black",borderRadius:6,padding:6,fontSize:12,boxSizing:"border-box"}}/>
<button onClick={adicionar} style={{width:"100%",marginTop:6,background:"black",color:"#facc15",fontWeight:900,padding:10,borderRadius:8,border:"3px solid black",cursor:"pointer"}}>ADICIONAR CANDIDATO</button>
</div>
<div style={{background:"white",border:"3px solid black",borderRadius:10,padding:10,marginTop:10}}>
<div style={{fontWeight:900,fontSize:11}}>LISTA - {lista.length} CANDIDATOS</div>
{lista.map((c,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",border:"1px solid black",padding:6,borderRadius:6,marginBottom:4,fontSize:12}}><span><b>{c.nome}</b> - {c.partido}</span><button onClick={()=>{const n=lista.filter((_,idx)=>idx!==i); setLista(n); localStorage.setItem("admin_candidatos",JSON.stringify(n))}} style={{background:"#ef4444",color:"white",border:"1px solid black",borderRadius:4,fontSize:10}}>X</button></div>)}
</div>
</div>
<div>
<div style={{background:"white",border:"3px solid black",borderRadius:10,padding:10}}>
<div style={{fontWeight:900,fontSize:10}}>{ehDono?"SUA SENHA DE DONA":"SEU ACESSO"}</div>
<div style={{marginTop:6,fontSize:12,background:"#f1f5f9",border:"2px solid black",padding:8,borderRadius:6,fontWeight:900,textAlign:"center"}}>{typeof window!=="undefined"?localStorage.getItem("codigo_liberado"):""}</div>
</div>
</div>
</div>
</div>
)
}