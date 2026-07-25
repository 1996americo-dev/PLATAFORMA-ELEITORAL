"use client"
import React from "react"
export default function Admin(){
const [s,setSs]=React.useState("")
const [ok,setOk]=React.useState(false)
if(!ok) return <div style={{padding:50,textAlign:"center"}}><h2>ADMIN CANDIDATOS</h2><input value={s} onChange={e=>setSs(e.target.value)} placeholder="Senha 62981796690"/><br/><br/><button onClick={()=>{if(s==="62981796690"||s==="GRAZI2026")setOk(true)}}>ENTRAR</button></div>
return <div style={{padding:20}}><h1>Admin OK - {localStorage.getItem("cands") ? JSON.parse(localStorage.getItem("cands")!).length : 0} candidatos</h1><a href="/">Voltar pro site</a></div>
}