"use client"
import React from "react"
const SENHA="62981796690"
export default function Admin(){
const [logado,setLogado]=React.useState(false)
const [senha,setSenha]=React.useState("")
const [cands,setCands]=React.useState<any[]>([])
React.useEffect(()=>{const c=localStorage.getItem("cands"); if(c) setCands(JSON.parse(c))},[])
function entrar(){ if(senha===SENHA || senha==="GRAZI2026"){setLogado(true)} else alert("Senha errada")}
if(!logado) return <div style={{padding:20}}><input value={senha} onChange={e=>setSenha(e.target.value)} placeholder="62981796690"/><button onClick={entrar}>ENTRAR</button></div>
return <div style={{padding:20}}><h1>ADMIN - {cands.length} candidatos</h1>{cands.map((c:any)=><div key={c.id}>{c.nome} - {c.sigla}</div>)}<a href="/">Voltar</a></div>
}