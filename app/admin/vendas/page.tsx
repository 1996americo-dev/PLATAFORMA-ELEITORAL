"use client"
import React from "react"
export default function Vendas(){
const [ok,setOk]=React.useState(false)
const [s,setS]=React.useState("")
if(!ok) return <div style={{padding:40}}><h2>VENDAS - AMERICO QUISPE QUISPE - PIX 62981796690</h2><input value={s} onChange={e=>setS(e.target.value)} placeholder="62981796690"/><button onClick={()=>{if(s==="62981796690")setOk(true)}}>ENTRAR</button></div>
return <div style={{padding:20}}><h1>VENDAS R$97 - AMERICO QUISPE QUISPE</h1><p>PIX: 62981796690</p><a href="/">Voltar</a></div>
}