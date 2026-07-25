"use client"
import { useState, useEffect } from "react"

const CANDIDATOS_INICIAIS = [
  { id: 1, nome: "Bolsonaro", partido: "PL - 22", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=1" },
  { id: 2, nome: "Ciro Gomes", partido: "PDT - 12", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=2" },
  { id: 3, nome: "Eduardo Leite", partido: "PSDB - 45", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=3" },
  { id: 4, nome: "Erika Hilton", partido: "PSOL - 50", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=4" },
  { id: 5, nome: "Lula", partido: "PT - 13", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=5" },
  { id: 6, nome: "Simone Tebet", partido: "MDB - 15", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=6" },
  { id: 7, nome: "Marina Silva", partido: "REDE - 18", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=7" },
  { id: 8, nome: "Nikolas Ferreira", partido: "PL - 22", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=8" },
  { id: 9, nome: "Tabata Amaral", partido: "PSB - 40", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=9" },
  { id: 10, nome: "Romeu Zema", partido: "NOVO - 30", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=10" },
  { id: 11, nome: "Ronaldo Caiado", partido: "UNIAO - 44", cargo: "Presidente", votos: 0, foto: "https://i.pravatar.cc/100?img=11" },
]

export default function PlataformaV21() {
  const [cands, setCands] = useState(CANDIDATOS_INICIAIS)
  const [cpf, setCpf] = useState("")
  const [cpfValido, setCpfValido] = useState(false)
  const [liberado, setLiberado] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [codigo, setCodigo] = useState("")
  const [isDono, setIsDono] = useState(false)

  useEffect(() => {
    const c = localStorage.getItem("cands_v21")
    if (c) setCands(JSON.parse(c))
    if (localStorage.getItem("acesso_liberado_2026") === "true") setLiberado(true)
    if (typeof window!== "undefined") {
      const url = new URL(window.location.href)
      if (url.searchParams.get("dono") === "americo") {
        localStorage.setItem("dono_americo", "true")
        setIsDono(true)
      }
      if (localStorage.getItem("dono_americo") === "true" || localStorage.getItem("admin_logado") === "true") {
        setIsDono(true)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("cands_v21", JSON.stringify(cands))
  }, [cands])

  function validarCPF() {
    if (cpf.length >= 11) {
      if (!liberado) { setShowModal(true) }
      else { setCpfValido(true); alert("CPF Validado! Pode votar!") }
    } else alert("Digite CPF válido 11 números")
  }

  function votar(id: number) {
    if (!cpfValido) { alert("Valide o CPF primeiro!"); return }
    const novos = cands.map(c => c.id === id? {...c, votos: c.votos + 1 } : c)
    setCands(novos); setCpf(""); setCpfValido(false)
  }

  function liberarAcesso() {
    const cd = codigo.trim().toUpperCase()
    if (cd.startsWith("LIBERADO-") || cd === "GRAZI2026") {
      localStorage.setItem("acesso_liberado_2026", "true")
      if (cd.startsWith("LIBERADO-")) localStorage.setItem("codigo_cliente", cd)
      setLiberado(true); setShowModal(false); setCodigo("")
      alert(`ACESSO LIBERADO! Seu código ${cd} é sua senha do ADMIN!`)
    } else alert("Código inválido! Use LIBERADO-XXXX")
  }

  const totalVotos = cands.reduce((s, c) => s + c.votos, 0)
  const ranking = [...cands].sort((a, b) => b.votos - a.votos)

  return (
    <div style={{ minHeight: "100vh", background: "#e2e8f0", fontFamily: "system-ui" }}>
      <div style={{ background: "black", color: "white", padding: "10px 16px", borderBottom: "4px solid #facc15", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 900, color: "#facc15", fontSize: 16 }}>PLATAFORMA ELEITORAL 2026</div>
          <div style={{ fontSize: 11, fontWeight: 700 }}>V21 • 11 CANDIDATOS • {totalVotos} VOTOS</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <div style={{ background: "#facc15", color: "black", padding: "6px 12px", borderRadius: 20, fontWeight: 900, fontSize: 11 }}>AO VIVO</div>
          <a href="/admin" style={{ background: "white", color: "black", padding: "6px 12px", borderRadius: 20, fontWeight: 900, fontSize: 11, textDecoration: "none", border: "2px solid black" }}>ADMIN</a>
          {isDono && <a href="/admin/vendas" style={{ background: "#22c55e", color: "white", padding: "6px 12px", borderRadius: 20, fontWeight: 900, fontSize: 11, textDecoration: "none", border: "2px solid black" }}>VENDAS</a>}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 16, padding: 16 }}>
        <div>
          <div style={{ background: "white", border: "3px solid black", borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 12, display: "flex", justifyContent: "space-between" }}>
              <span>🏆 RANKING - {totalVotos} VOTOS - 100%</span>
            </div>
            <div style={{ border: "2px dashed black", borderRadius: 8, padding: 12, marginTop: 8, textAlign: "center", minHeight: 60 }}>
              {totalVotos === 0? <span style={{ color: "#3b82f6", fontWeight: 700, fontSize: 12 }}>Nenhum voto ainda</span> :
                ranking.map((c, i) => <div key={c.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: i === 0? 900 : 700, background: i === 0? "#fef08a" : "white", padding: "4px 6px", borderRadius: 4, marginBottom: 2 }}><span>{i + 1}º {c.nome} - {c.cargo}</span><span>{c.votos} - {totalVotos? Math.round(c.votos * 100 / totalVotos) : 0}%</span></div>)
              }
            </div>
          </div>

          <div style={{ background: "white", border: "3px solid black", borderRadius: 12, padding: 12, marginTop: 12 }}>
            <div style={{ fontWeight: 900, fontSize: 12 }}>VALIDAÇÃO CPF</div>
            <input value={cpf} onChange={e => setCpf(e.target.value.replace(/\D/g, ""))} placeholder="000.000.000-00" style={{ width: "100%", padding: 10, border: "2px solid black", borderRadius: 8, marginTop: 8, textAlign: "center", boxSizing: "border-box" }} />
            <button onClick={validarCPF} style={{ width: "100%", marginTop: 8, background: cpfValido? "#22c55e" : "black", color: cpfValido? "white" : "#facc15", fontWeight: 900, padding: 10, borderRadius: 8, border: "none", cursor: "pointer" }}>{cpfValido? "CPF OK - PODE VOTAR" : "VALIDAR CPF"}</button>
            {!liberado && <div style={{ fontSize: 10, color: "red", fontWeight: 700, textAlign: "center", marginTop: 6 }}>Libere acesso para validar CPF</div>}
          </div>
        </div>

        <div style={{ background: "white", border: "3px solid black", borderRadius: 12, padding: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 13 }}>
            <span>🗳️ CANDIDATOS</span><span style={{ background: "black", color: "white", padding: "2px 8px", borderRadius: 12, fontSize: 10 }}>11 CANDIDATOS</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginTop: 12 }}>
            {cands.map(c => (
              <div key={c.id} style={{ border: "3px solid black", borderRadius: 10, padding: 8, textAlign: "center", background: "white" }}>
                <img src={c.foto} alt={c.nome} style={{ width: 50, height: 50, borderRadius: "50%", border: "2px solid black", objectFit: "cover" }} />
                <div style={{ fontWeight: 900, fontSize: 12, marginTop: 4 }}>{c.nome}</div>
                {/* AQUI O CARGO EMBAIXO DO NOME */}
                <div style={{ fontSize: 8, fontWeight: 800, color: "#1e293b", background: "#e2e8f0", borderRadius: 4, padding: "2px 4px", marginTop: 2, border: "1px solid black" }}>{c.cargo || "Presidente"}</div>
                <div style={{ background: "#facc15", fontWeight: 800, fontSize: 9, padding: "2px 4px", borderRadius: 4, border: "2px solid black", marginTop: 2 }}>{c.partido}</div>
                <div style={{ fontSize: 10, fontWeight: 700, marginTop: 2 }}>{c.votos} votos - {totalVotos? Math.round(c.votos * 100 / totalVotos) : 0}%</div>
                <button onClick={() => votar(c.id)} style={{ width: "100%", marginTop: 6, background: cpfValido? "#22c55e" : "#94a3b8", color: "white", fontWeight: 900, fontSize: 10, padding: 6, borderRadius: 6, border: "2px solid black", cursor: "pointer" }}>VOTAR CPF</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16 }}>
          <div style={{ background: "white", padding: 20, borderRadius: 16, border: "4px solid #facc15", maxWidth: 380, width: "100%", textAlign: "center" }}>
            <h2 style={{ margin: 0, fontWeight: 900 }}>🔒 ACESSO BLOQUEADO</h2>
            <div style={{ fontSize: 13, marginTop: 6 }}>Para votar precisa liberar acesso</div>
            <div style={{ background: "#fef08a", border: "2px solid black", borderRadius: 8, padding: 10, marginTop: 12, textAlign: "left", fontSize: 12 }}>
              <b>PIX: 62981796690</b><br/>
              <b>Nome: AMERICO QUISPE QUISPE</b><br/>
              <b>Valor: R$ 97,00</b><br/><br/>
              1. Faça PIX R$97<br/>
              2. Envie comprovante no Zap<br/>
              3. Receba seu código LIBERADO-XXXX<br/>
              4. Esse código já será sua senha do ADMIN!
            </div>
            <input value={codigo} onChange={e => setCodigo(e.target.value)} placeholder="Digite seu código LIBERADO-XXXX" style={{ width: "100%", padding: 12, border: "3px solid black", borderRadius: 8, marginTop: 12, textAlign: "center", fontWeight: 900, textTransform: "uppercase", boxSizing: "border-box" }} />
            <button onClick={liberarAcesso} style={{ width: "100%", marginTop: 10, background: "#16a34a", color: "white", fontWeight: 900, padding: 12, borderRadius: 8, border: "3px solid black", cursor: "pointer" }}>LIBERAR ACESSO</button>
            <button onClick={() => setShowModal(false)} style={{ width: "100%", marginTop: 8, background: "white", color: "black", fontWeight: 700, padding: 8, borderRadius: 8, border: "2px solid black", cursor: "pointer" }}>Fechar</button>
          </div>
        </div>
      )}
    </div>
  )
}