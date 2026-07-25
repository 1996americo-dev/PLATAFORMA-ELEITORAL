"use client"
import { useState, useEffect } from "react"

export default function AdminCompleto() {
  const [senha, setSenha] = useState("")
  const [ok, setOk] = useState(false)
  const [novaSenha, setNovaSenha] = useState("")
  const [cands, setCands] = useState<any[]>([])
  const [nome, setNome] = useState("")
  const [partido, setPartido] = useState("")
  const [foto, setFoto] = useState("")

  const SENHA_MESTRA = "62981796690"

  useEffect(() => {
    const c = localStorage.getItem("cands_v21")
    if (c) setCands(JSON.parse(c))
    if (localStorage.getItem("admin_logado") === "true") setOk(true)
  }, [])

  function entrar() {
    const codigoCliente = localStorage.getItem("codigo_cliente") || ""
    const senhaPersonalizada = localStorage.getItem("senha_admin_personalizada") || ""
    const vendas = JSON.parse(localStorage.getItem("vendas_lista") || "[]")
    const codigosValidos = vendas.map((v: any) => v.codigo)

    if (
      senha === SENHA_MESTRA ||
      senha === "GRAZI2026" ||
      senha === codigoCliente ||
      codigosValidos.includes(senha) ||
      senha === senhaPersonalizada ||
      senha === "123456"
    ) {
      if (senha.startsWith("LIBERADO-")) localStorage.setItem("codigo_cliente", senha)
      localStorage.setItem("admin_logado", "true")
      setOk(true)
    } else {
      alert("Senha errada! Use seu código LIBERADO-XXXX ou 62981796690")
    }
  }

  function salvarNovaSenha() {
    if (novaSenha.length < 4) { alert("Mínimo 4 letras"); return }
    localStorage.setItem("senha_admin_personalizada", novaSenha)
    alert(`NOVA SENHA SALVA: ${novaSenha}`)
    setNovaSenha("")
  }

  function salvarCands(novos: any[]) {
    setCands(novos)
    localStorage.setItem("cands_v21", JSON.stringify(novos))
  }

  function adicionarCand() {
    if (!nome || !partido) { alert("Nome e partido"); return }
    const novo = { id: Date.now(), nome, partido, votos: 0, foto: foto || `https://i.pravatar.cc/100?img=${Math.floor(Math.random()*70)}` }
    salvarCands([...cands, novo])
    setNome(""); setPartido(""); setFoto("")
  }

  function removerCand(id: number) {
    if (confirm("Remover candidato?")) {
      salvarCands(cands.filter(c => c.id !== id))
    }
  }

  if (!ok) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 16, border: "4px solid #facc15", width: 360, textAlign: "center" }}>
          <h2 style={{ fontWeight: 900 }}>ADMIN V21 FINAL</h2>
          <input value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha ou LIBERADO-XXXX" style={{ width: "100%", padding: 12, border: "3px solid black", borderRadius: 10, textAlign: "center", fontWeight: 900, marginTop: 10, boxSizing: "border-box" }} />
          <button onClick={entrar} style={{ width: "100%", marginTop: 10, padding: 12, background: "black", color: "#facc15", fontWeight: 900, borderRadius: 10, cursor: "pointer" }}>ENTRAR</button>
          <a href="/" style={{ display: "block", marginTop: 10, fontWeight: 700, color: "black", fontSize: 13 }}>Voltar</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 12, background: "#f1f5f9", minHeight: "100vh", fontFamily: "system-ui" }}>
      <div style={{ background: "black", color: "#facc15", padding: 12, borderRadius: 10, fontWeight: 900, display: "flex", justifyContent: "space-between" }}>
        <span>ADMIN - {cands.length} CANDIDATOS - SENHA PRÓPRIA ATIVA ✅</span>
        <div style={{ display: "flex", gap: 6 }}>
          <a href="/" style={{ background: "white", color: "black", padding: "4px 10px", borderRadius: 6, textDecoration: "none", fontSize: 12, fontWeight: 900 }}>Site</a>
          <button onClick={() => { localStorage.removeItem("admin_logado"); setOk(false); }} style={{ background: "#ef4444", color: "white", padding: "4px 10px", borderRadius: 6, border: "none", fontWeight: 900, fontSize: 12, cursor: "pointer" }}>Sair</button>
        </div>
      </div>

      {/* BLOCO SENHA PROPRIA */}
      <div style={{ background: "white", border: "3px solid black", borderRadius: 10, padding: 12, marginTop: 12 }}>
        <div style={{ fontWeight: 900, fontSize: 13 }}>🔑 CADASTRAR SUA PRÓPRIA SENHA</div>
        <div style={{ fontSize: 11, color: "#64748b" }}>Crie sua senha pessoal para entrar no ADMIN. Ex: joao123, maria2026</div>
        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <input value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Digite nova senha ex: joao2026" style={{ flex: 1, padding: 10, border: "2px solid black", borderRadius: 6, fontWeight: 700 }} />
          <button onClick={salvarNovaSenha} style={{ background: "#16a34a", color: "white", fontWeight: 900, padding: "0 14px", borderRadius: 6, border: "2px solid black", cursor: "pointer", fontSize: 12 }}>SALVAR SENHA</button>
        </div>
        <div style={{ marginTop: 8, fontSize: 11, background: "#fef9c3", border: "2px solid black", padding: 6, borderRadius: 6 }}>
          <b>Senha atual:</b> {typeof window !== "undefined" ? (localStorage.getItem("senha_admin_personalizada") || localStorage.getItem("codigo_cliente") || "123456") : ""} | <b>Código original:</b> {typeof window !== "undefined" ? (localStorage.getItem("codigo_cliente") || "Nenhum") : ""}
        </div>
      </div>

      {/* BLOCO CADASTRAR CANDIDATO - VOLTOU! */}
      <div style={{ background: "white", border: "3px solid black", borderRadius: 10, padding: 12, marginTop: 12 }}>
        <div style={{ fontWeight: 900, fontSize: 13 }}>➕ CADASTRAR CANDIDATO</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 90px", gap: 6, marginTop: 8 }}>
          <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" style={{ padding: 10, border: "2px solid black", borderRadius: 6 }} />
          <input value={partido} onChange={e => setPartido(e.target.value)} placeholder="Partido - ex: PL - 22" style={{ padding: 10, border: "2px solid black", borderRadius: 6 }} />
          <input value={foto} onChange={e => setFoto(e.target.value)} placeholder="Link foto (opcional)" style={{ padding: 10, border: "2px solid black", borderRadius: 6 }} />
          <button onClick={adicionarCand} style={{ background: "black", color: "#facc15", fontWeight: 900, borderRadius: 6, border: "2px solid black", cursor: "pointer" }}>ADD</button>
        </div>
      </div>

      {/* LISTA CANDIDATOS */}
      <div style={{ background: "white", border: "3px solid black", borderRadius: 10, padding: 12, marginTop: 12 }}>
        <div style={{ fontWeight: 900, fontSize: 13 }}>📋 LISTA - {cands.length} CANDIDATOS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(160px,1fr))", gap: 8, marginTop: 10 }}>
          {cands.map(c => (
            <div key={c.id} style={{ border: "2px solid black", borderRadius: 8, padding: 8, textAlign: "center" }}>
              <img src={c.foto} style={{ width: 50, height: 50, borderRadius: "50%", border: "2px solid black" }} alt="" />
              <div style={{ fontWeight: 900, fontSize: 12, marginTop: 4 }}>{c.nome}</div>
              <div style={{ fontSize: 10, fontWeight: 700 }}>{c.partido}</div>
              <div style={{ fontSize: 10 }}>{c.votos} votos</div>
              <button onClick={() => removerCand(c.id)} style={{ marginTop: 6, background: "#ef4444", color: "white", fontWeight: 800, fontSize: 10, padding: "4px 8px", borderRadius: 4, border: "1px solid black", cursor: "pointer" }}>REMOVER</button>
            </div>
          ))}
        </div>
        {cands.length === 0 && <div style={{ textAlign: "center", padding: 20, color: "#64748b", fontWeight: 700 }}>Nenhum candidato - cadastre acima!</div>}
      </div>
    </div>
  )
}