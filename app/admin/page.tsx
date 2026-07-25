"use client"
import React from "react"
const SENHA="62981796690"
export default function AdminV21(){
const [ok,setOk]=React.useState(false)
const [s,setS]=React.useState("")
const [cands,setCands]=React.useState<any[]>([])
React.useEffect(()=>{const c=localStorage.getItem("cands"); if(c) setCands(JSON.parse(c))},[])
function entrar(){if(s===SENHA||s==="GRAZI2026")setOk(true)}
if(!ok) return <div style={{padding:40,textAlign:"center"}}><h2>ADMIN V21</h2><input value={s} onChange={e=>setS(e.target.value)} placeholder="62981796690"/><button onClick={entrar}>ENTRAR</button></div>
return <div style={{padding:20}}><h1>ADMIN V21 - {cands.length} candidatos</h1>{cands.map((c:any)=><div key={c.id}>{c.nome} - {c.sigla}</div>)}<br/><a href="/">Voltar</a> <a href="/admin/vendas">Vendas</a></div>
}