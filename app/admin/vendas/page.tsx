"use client"
import { useState, useEffect } from "react"

export default function Vendas() {
  const [ok, setOk] = useState(false)
  const [s, setS] = useState("")
  const [vendas, setVendas] = useState<any[]>([])
  const [nome, setNome] = useState("")
  const [zap, setZap] = useState("")

  useEffect(() => {
    const v = localStorage.getItem("vendas_lista")
    if (v) setVendas(JSON.parse(v))
    if (localStorage.getItem("admin_logado") === "true") setOk(true)
  }, [])

  function entrar() {
    if (s === "62981796690" || s === "GRAZI2026") {
      localStorage.setItem("admin_logado", "true")
      setOk(true)
    } else {
      alert("Senha 62981796690")
    }
  }

  function gerar() {
    if (!nome) { alert("Nome"); return }
    const cod = "LIBERADO-" + Math.floor(1000 + Math.random() * 9000)
    const nova = { id: Date.now(), nome: nome, zap: zap, codigo: cod, data: new Date().toLocaleDateString() }
    const lista = [...vendas, nova]
    setVendas(lista)
    localStorage.setItem("vendas_lista", JSON.stringify(lista))
    setNome("")
    setZap("")
    alert("CODIGO: " + cod)
  }

  if (!ok) {
    return (
      <div style={{ minHeight: "100vh", background: "black", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ background: "white", padding: 20, borderRadius: 10, width: 320, textAlign: "center" }}>
          <h2>VENDAS - PIX 62981796690</h2>
          <input value={s} onChange={e => setS(e.target.value)} placeholder="Senha" type="password" style={{ width: "100%", padding: 10, marginTop: 10 }} />
          <button onClick={entrar} style={{ width: "100%", marginTop: 10, padding: 10, background: "black", color: "yellow" }}>ENTRAR</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 16 }}>
      <h1>VENDAS R$97 - AMERICO QUISPE QUISPE - PIX: 62981796690</h1>
      <a href="/">Voltar</a>
      <div style={{ marginTop: 16, background: "white", border: "2px solid black", padding: 16 }}>
        <h3>GERAR CODIGO</h3>
        <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome cliente" style={{ padding: 8, marginRight: 6 }} />
        <input value={zap} onChange={e => setZap(e.target.value)} placeholder="Zap" style={{ padding: 8, marginRight: 6 }} />
        <button onClick={gerar} style={{ padding: "8px 14px", background: "green", color: "white" }}>GERAR</button>
      </div>
      <div style={{ marginTop: 16 }}>
        <h3>TOTAL: R$ {vendas.length * 97},00 - {vendas.length} vendas</h3>
        {vendas.map((v: any) => (
          <div key={v.id} style={{ border: "1px solid black", padding: 8, marginTop: 6 }}>
            <b>{v.nome}</b> - {v.zap} - <b>{v.codigo}</b> - {v.data}
          </div>
        ))}
      </div>
    </div>
  )
}