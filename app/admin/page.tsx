"use client"
import React from "react"
const SENHA="62981796690"
export default function AdminV21TOP(){
const [ok,setOk]=React.useState(false)
const [s,setS]=React.useState("")
const [cands,setCands]=React.useState<any[]>([])
const [nome,setNome]=React.useState("")
const [sigla,setSigla]=React.useState("")
React.useEffect(()=>{const c=localStorage.getItem("cands"); if(c) setCands(JSON.parse(c))},[])
function entrar(){if(s===SENHA||s==="GRAZI2026"||s==="AMERICO2026") setOk(true); else alert("Senha errada! 62981796690")}
function add(){if(!nome) return alert("Nome!"); const n={id:Date.now(),nome,sigla:sigla||"PARTIDO",foto:`https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}`,cor:"#facc15"}; const nn=[...cands,n]; setCands(nn); localStorage.setItem("cands",JSON.stringify(nn)); setNome(""); setSigla("")}
function del(id:number){const nn=cands.filter((c:any)=>c.id!==id); setCands(nn); localStorage.setItem("cands",JSON.stringify(nn))}
if(!ok) return <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#000,#1a1a2e)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}><div style={{background:"white",borderRadius:20,padding:30,border:"4px solid #facc15",textAlign:"center",maxWidth:360,width:"100%"}}><h2 style={{fontWeight:900}}>🔐 ADMIN V21 TOP</h2><input value={s} onChange={e=>setS(e.target.value)} type="password" placeholder="62981796690" style={{width:"100%",padding:12,border:"3px solid black",borderRadius:10,textAlign:"center",fontWeight:900,boxSizing:"border-box",marginTop:10}}/><button onClick={entrar} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:10,cursor:"pointer"}}>ENTRAR</button></div></div>
return <div style={{minHeight:"100vh",background:"#f1f5f9",padding:16,fontFamily:"system-ui"}}>
<div style={{background:"black",color:"#facc15",fontWeight:900,padding:14,borderRadius:12,border:"3px solid black",display:"flex",justifyContent:"space-between"}}><span>👩‍💼 ADMIN V21 TOP - {cands.length} CANDIDATOS</span><span style={{background:"#facc15",color:"black",padding:"4px 10px",borderRadius:20,fontSize:11}}>V21</span></div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:15,marginTop:14,display:"flex",gap:8,flexWrap:"wrap"}}><input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome ex: Lula" style={{flex:1,padding:10,border:"3px solid black",borderRadius:8,fontWeight:700}}/><input value={sigla} onChange={e=>setSigla(e.target.value)} placeholder="Sigla ex: PT - 13" style={{flex:1,padding:10,border:"3px solid black",borderRadius:8,fontWeight:700}}/><button onClick={add} style={{background:"#22c55e",color:"white",fontWeight:900,padding:"10px 16px",borderRadius:8,border:"3px solid black",cursor:"pointer"}}>+ ADD</button></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:10,marginTop:14}}>{cands.map((c:any)=><div key={c.id} style={{background:"white",border:"3px solid black",borderRadius:12,padding:10,textAlign:"center"}}><img src={c.foto} style={{width:60,height:60,borderRadius:"50%",border:"3px solid black"}}/><div style={{fontWeight:900,marginTop:6}}>{c.nome}</div><div style={{fontSize:11,background:"#facc15",display:"inline-block",padding:"2px 8px",borderRadius:10,border:"2px solid black",fontWeight:800}}>{c.sigla}</div><br/><button onClick={()=>del(c.id)} style={{marginTop:8,background:"#ef4444",color:"white",fontWeight:800,padding:"6px 12px",borderRadius:8,border:"2px solid black",cursor:"pointer"}}>REMOVER</button></div>)}</div>
<div style={{marginTop:14}}><a href="/" style={{background:"black",color:"white",padding:"10px 15px",borderRadius:8,fontWeight:900,textDecoration:"none"}}>← SITE</a><a href="/admin/vendas" style={{marginLeft:10,background:"#facc15",color:"black",padding:"10px 15px",borderRadius:8,fontWeight:900,textDecoration:"none",border:"3px solid black"}}>💰 VENDAS</a></div>
</div>
}