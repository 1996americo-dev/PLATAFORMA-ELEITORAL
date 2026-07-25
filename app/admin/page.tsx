"use client"
import { useState, useEffect } from "react"

export default function AdminSenhaPropria() {
  const [senha, setSenha] = useState("")
  const [ok, setOk] = useState(false)
  const [novaSenha, setNovaSenha] = useState("")
  const [msg, setMsg] = useState("")
  const [cands, setCands] = useState<any[]>([])

  const SENHA_MESTRA = "62981796690"

  useEffect(() => {
    const c = localStorage.getItem("cands")
    if (c) setCands(JSON.parse(c))
    // Se já está logado como admin, entra direto
    if (localStorage.getItem("admin_logado") === "true") setOk(true)
  }, [])

  function entrar() {
    const codigoLiberado = localStorage.getItem("codigo_cliente") || ""
    const senhaPersonalizada = localStorage.getItem("senha_admin_personalizada") || ""
    const vendas = JSON.parse(localStorage.getItem("vendas_lista") || "[]")
    const codigosValidos = vendas.map((v: any) => v.codigo)

    // Aceita: senha mestra OU codigo LIBERADO-xxxx OU senha que cliente criou
    if (
      senha === SENHA_MESTRA ||
      senha === "GRAZI2026" ||
      senha === codigoLiberado ||
      codigosValidos.includes(senha) ||
      senha === senhaPersonalizada
    ) {
      // Salva o codigo que ele usou como senha dele se for a primeira vez
      if (senha.startsWith("LIBERADO-")) {
        localStorage.setItem("codigo_cliente", senha)
      }
      localStorage.setItem("admin_logado", "true")
      setOk(true)
      setMsg("")
    } else {
      alert(`Senha incorreta! \n\nSe você é cliente, use seu código LIBERADO-xxxx que recebeu no Zap!\nOu use sua senha pessoal que cadastrou.`)
    }
  }

  function salvarNovaSenha() {
    if (novaSenha.length < 4) { alert("Senha tem que ter no mínimo 4 letras"); return }
    localStorage.setItem("senha_admin_personalizada", novaSenha)
    alert(`SENHA ALTERADA COM SUCESSO!\n\nSua nova senha para entrar no ADMIN é: ${novaSenha}\n\nAnote!`)
    setNovaSenha("")
  }

  function logout() {
    localStorage.removeItem("admin_logado")
    setOk(false)
    setSenha("")
  }

  // --- TELA DE LOGIN ---
  if (!ok) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 16, border: "4px solid #facc15", width: 380, textAlign: "center" }}>
          <h2 style={{ fontWeight: 900, margin: 0 }}>ADMIN V21 FINAL</h2>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 6, color: "#64748b" }}>
            Cada cliente tem sua própria senha<br/>Use seu código LIBERADO-xxxx
          </div>
          <input value={senha} onChange={e => setSenha(e.target.value)} placeholder="Sua senha ou código LIBERADO" type="text" style={{ width: "100%", padding: 12, border: "3px solid black", borderRadius: 10, textAlign: "center", fontWeight: 900, marginTop: 14, boxSizing: "border-box" }} />
          <button onClick={entrar} style={{ width: "100%", marginTop: 10, padding: 12, background: "black", color: "#facc15", fontWeight: 900, borderRadius: 10, cursor: "pointer" }}>ENTRAR</button>
          <a href="/" style={{ display: "block", marginTop: 12, fontWeight: 700, fontSize: 13, color: "black" }}>Voltar para plataforma</a>
        </div>
      </div>
    )
  }

  // --- TELA ADMIN LOGADO ---
  return (
    <div style={{ padding: 16, background: "#f1f5f9", minHeight: "100vh" }}>
      <div style={{ background: "black", color: "#facc15", padding: 16, borderRadius: 12, display: "flex", justifyContent: "space-between", fontWeight: 900 }}>
        <span>ADMIN - {cands.length} CANDIDATOS - SENHA PRÓPRIA ATIVA ✅</span>
        <div style={{ display: "flex", gap: 8 }}>
          <a href="/" style={{ background: "white", color: "black", padding: "6px 10px", borderRadius: 8, textDecoration: "none", fontSize: 12 }}>Site</a>
          <button onClick={logout} style={{ background: "#ef4444", color: "white", padding: "6px 10px", borderRadius: 8, border: "none", fontWeight: 900, cursor: "pointer", fontSize: 12 }}>Sair</button>
        </div>
      </div>

      <div style={{ background: "white", border: "4px solid black", borderRadius: 12, padding: 16, marginTop: 16 }}>
        <h3 style={{ margin: 0, fontWeight: 900 }}>🔑 CADASTRAR SUA PRÓPRIA SENHA</h3>
        <div style={{ fontSize: 13, color: "#475569", marginTop: 4 }}>Você pode criar sua senha pessoal para entrar no ADMIN. Ex: joao123, maria2026</div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="Digite nova senha ex: joao2026" style={{ flex: 1, padding: 12, border: "3px solid black", borderRadius: 8, fontWeight: 700 }} />
          <button onClick={salvarNovaSenha} style={{ background: "#16a34a", color: "white", fontWeight: 900, padding: "0 16px", borderRadius: 8, border: "3px solid black", cursor: "pointer" }}>SALVAR SENHA</button>
        </div>
        <div style={{ marginTop: 10, fontSize: 12, background: "#fef08a", border: "2px solid black", padding: 8, borderRadius: 6 }}>
          <b>Sua senha atual:</b> {localStorage.getItem("senha_admin_personalizada") ? `✅ ${localStorage.getItem("senha_admin_personalizada")}` : `Ainda não criou, está usando ${localStorage.getItem("codigo_cliente") || "código LIBERADO"}`} <br/>
          <b>Código original:</b> {localStorage.getItem("codigo_cliente") || "Nenhum"}
        </div>
      </div>

      <div style={{ background: "white", border: "4px solid black", borderRadius: 12, padding: 16, marginTop: 16, textAlign: "center", color: "#64748b", fontWeight: 700 }}>
        Seu painel de candidatos continua aqui embaixo (mantém seu código antigo de cadastro)
      </div>
    </div>
  )
}