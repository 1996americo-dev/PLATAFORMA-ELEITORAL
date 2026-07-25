"use client"
import React from "react"
const SENHA="62981796690"
export default function AdminCompleto(){
const [ok,setOk]=React.useState(false)
const [s,setS]=React.useState("")
const [cands,setCands]=React.useState<any[]>([])
const [votos,setVotos]=React.useState<any[]>([])
const [nome,setNome]=React.useState("")
const [numero,setNumero]=React.useState("")
const [partido,setPartido]=React.useState("")
const [sigla,setSigla]=React.useState("")
const [cargo,setCargo]=React.useState("Presidente")
const [foto,setFoto]=React.useState("")
React.useEffect(()=>{
const c=localStorage.getItem("cands")
const v=localStorage.getItem("votos")
if(c) setCands(JSON.parse(c))
if(v) setVotos(JSON.parse(v))
},[])
function entrar(){
if(s===SENHA||s==="GRAZI2026") setOk(true)
else alert("Senha errada 62981796690")
}
function handleFoto(e:any){
const file=e.target.files?.[0]
if(!file) return
const r=new FileReader()
r.onload=(ev)=> setFoto(ev.target?.result as string)
r.readAsDataURL(file)
}
function add(){
if(!nome) return alert("Nome")
if(!numero) return alert("Numero")
const novo={id:Date.now(),nome,numero,partido,sigla,cargo,foto_url:foto||`https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}`,foto:foto}
const nn=[...cands,novo]
setCands(nn)
localStorage.setItem("cands",JSON.stringify(nn))
setNome("")
setNumero("")
setPartido("")
setSigla("")
setFoto("")
alert("Cadastrado")
}
function del(id:number){
const nn=cands.filter((c:any)=>c.id!==id)
setCands(nn)
localStorage.setItem("cands",JSON.stringify(nn))
}
const ranking=cands.map((c:any)=>({...c,qtd:votos.filter((v:any)=>v.candidato_id===c.id).length})).sort((a:any,b:any)=>b.qtd-a.qtd)
if(!ok){
return(
<div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
<div style={{background:"white",padding:30,borderRadius:16,border:"4px solid #facc15",textAlign:"center"}}>
<h2>ADMIN V21 COMPLETO</h2>
<input value={s} onChange={e=>setS(e.target.value)} type="password" placeholder="62981796690" style={{width:"100%",padding:12,border:"3px solid black",borderRadius:10,textAlign:"center",fontWeight:900}}/>
<button onClick={entrar} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:10}}>ENTRAR</button>
</div>
</div>
)
}
return(
<div style={{padding:14,background:"#f1f5f9",minHeight:"100vh"}}>
<div style={{background:"black",color:"#facc15",fontWeight:900,padding:14,borderRadius:12}}>ADMIN V21 COMPLETO - {cands.length} CANDIDATOS</div>
<div style={{display:"grid",gridTemplateColumns:"350px 1fr",gap:14,marginTop:14}}>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14}}>
<h3>CADASTRAR CANDIDATO</h3>
<input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8}}/>
<input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Numero ex: 13" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8}}/>
<input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Partido ex: PT" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8}}/>
<input value={sigla} onChange={e=>setSigla(e.target.value)} placeholder="Sigla ex: PT - 13" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8}}/>
<select value={cargo} onChange={e=>setCargo(e.target.value)} style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8}}>
<option>Presidente</option>
<option>Governador</option>
<option>Senador</option>
<option>Deputado</option>
<option>Prefeito</option>
<option>Vereador</option>
</select>
<input type="file" accept="image/*" onChange={handleFoto} style={{width:"100%",padding:8,border:"3px dashed black",borderRadius:8,marginBottom:8}}/>
<input value={foto} onChange={e=>setFoto(e.target.value)} placeholder="Ou link foto" style={{width:"100%",padding:10,border:"2px solid gray",borderRadius:8,marginBottom:8}}/>
<button onClick={add} style={{width:"100%",background:"#22c55e",color:"white",fontWeight:900,padding:12,borderRadius:10,border:"3px solid black"}}>CADASTRAR</button>
</div>
<div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14,marginBottom:12}}>
<h3>RANKING - {votos.length} VOTOS</h3>
{ranking.map((c:any,i:number)=><div key={c.id} style={{display:"flex",justifyContent:"space-between",background:i===0?"#facc15":"#f8fafc",border:"2px solid black",borderRadius:8,padding:8,marginBottom:6,fontWeight:800}}><span>{i+1}º {c.nome}</span><span>{c.qtd} votos</span></div>)}
</div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14}}>
<h3>CANDIDATOS ({cands.length})</h3>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
{cands.map((c:any)=><div key={c.id} style={{border:"3px solid black",borderRadius:12,padding:10,textAlign:"center"}}><img src={c.foto_url||c.foto} style={{width:50,height:50,borderRadius:"50%"}}/><div style={{fontWeight:900}}>{c.nome}</div><div style={{fontSize:11}}>{c.numero} - {c.cargo}</div><button onClick={()=>del(c.id)} style={{background:"#ef4444",color:"white",padding:4,borderRadius:6,border:"2px solid black",marginTop:6}}>REMOVER</button></div>)}
</div>
</div>
</div>
</div>
</div>
)
}