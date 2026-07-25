"use client"
import React from "react"
export default function Vendas(){
const [logado,setLogado]=React.useState(false)
const [senha,setSenha]=React.useState("")
function entrar(){ if(senha==="62981796690" || senha==="GRAZI2026") setLogado(true)}
if(!logado) return <div style={{padding:20}}><input value={senha} onChange={e=>setSenha(e.target.value)} placeholder="62981796690"/><button onClick={entrar}>VER VENDAS</button></div>
return <div style={{padding:20}}><h1>VENDAS - AMERICO QUISPE QUISPE</h1><p>PIX: 62981796690</p><p>Valor: R$ 97,00</p><a href="/">Voltar</a></div>
}