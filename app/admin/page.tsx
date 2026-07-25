"use client"
import { useState, useEffect, useRef } from "react"

export default function AdminFinal() {
  const [senha, setSenha] = useState("")
  const [ok, setOk] = useState(false)
  const [novaSenha, setNovaSenha] = useState("")
  const [cands, setCands] = useState<any[]>([])
  const [nome, setNome] = useState("")
  const [partido, setPartido] = useState("")
  const [cargo, setCargo] = useState("Presidente")
  const [cargoOutros, setCargoOutros] = useState("")
  const [foto, setFoto] = useState("")
  const [propostas, setPropostas] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

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
    if (senha === SENHA_MESTRA || senha === "GRAZI2026" || senha === codigoCliente || codigosValidos.includes(senha) || senha === senhaPersonalizada || senha === "123456") {
      if (senha.startsWith("LIBERADO-")) localStorage.setItem("codigo_cliente", senha)
      localStorage.setItem("admin_logado", "true")
      setOk(true)
    } else alert("Senha errada! Use LIBERADO-XXXX")
  }

  function salvarNovaSenha() {
    if (novaSenha.length < 4) { alert("Min 4"); return }
    localStorage.setItem("senha_admin_personalizada", novaSenha)
    alert(`SALVA: ${novaSenha}`); setNovaSenha("")
  }

  function salvarCands(novos: any[]) {
    setCands(novos)
    localStorage.setItem("cands_v21", JSON.stringify(novos))
  }

  function handleFotoUpload(e: any) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setFoto(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  function adicionarCand() {
    if (!nome || !partido) { alert("Nome e Partido"); return }
    const cargoFinal = cargo === "Outros" ? cargoOutros : cargo
    if (!cargoFinal) { alert("Digite o cargo"); return }
    const novo = { id: Date.now(), nome, partido, cargo: cargoFinal, votos: 0, foto: foto || `https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}`, propostas }
    salvarCands([...cands, novo])
    setNome(""); setPartido(""); setFoto(""); setPropostas(""); setCargoOutros("")
  }

  function removerCand(id: number) {
    if (confirm("Remover?")) salvarCands(cands.filter(c => c.id !== id))
  }

  if (!ok) {
    return (
      <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
        <div style={{ background: "white", padding: 24, borderRadius: 16, border: "4px solid #facc15", width: 360, textAlign: "center" }}>
          <h2 style={{ fontWeight: 900 }}>ADMIN - 11 CANDIDATOS</h2>
          <input value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha ou LIBERADO-XXXX" style={{ width: "100%", padding: 12, border: "3px solid black", borderRadius: 10, textAlign: "center", fontWeight: 900, marginTop: 10, boxSizing: "border-box" }} />
          <button onClick={entrar} style={{ width: "100%", marginTop: 10, padding: 12, background: "black", color: "#facc15", fontWeight: 900, borderRadius: 10, cursor: "pointer" }}>ENTRAR</button>
          <a href="/" style={{ display: "block", marginTop: 10, fontWeight: 700, color: "black", fontSize: 13 }}>Voltar</a>
        </div>
      </div>
    )
  }

  const totalVotos = cands.reduce((s, c) => s + c.votos, 0)
  const ranking = [...cands].sort((a, b) => b.votos - a.votos)

  return (
    <div style={{ padding: 10, background: "#f1f5f9", minHeight: "100vh", fontFamily: "system-ui" }}>
      <div style={{ background: "black", color: "#facc15", padding: 10, borderRadius: 10, fontWeight: 900, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>ADMIN - {cands.length} CANDIDATOS - SENHA PRÓPRIA ATIVA ✅ - {totalVotos} VOTOS</span>
        <div style={{ display: "flex", gap: 6 }}>
          <a href="/" style={{ background: "white", color: "black", padding: "5px 10px", borderRadius: 6, textDecoration: "none", fontSize: 11, fontWeight: 900 }}>Site</a>
          <a href="/admin/vendas" style={{ background: "#22c55e", color: "white", padding: "5px 10px", borderRadius: 6, textDecoration: "none", fontSize: 11, fontWeight: 900 }}>Vendas</a>
          <button onClick={() => { localStorage.removeItem("admin_logado"); setOk(false) }} style={{ background: "#ef4444", color: "white", padding: "5px 10px", borderRadius: 6, border: "none", fontWeight: 900, fontSize: 11, cursor: "pointer" }}>Sair</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 10, marginTop: 10 }}>
        <div>
          {/* CADASTRAR CANDIDATO COM TUDO */}
          <div style={{ background: "white", border: "3px solid black", borderRadius: 10, padding: 10 }}>
            <div style={{ fontWeight: 900, fontSize: 12 }}>+ CADASTRAR CANDIDATO</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginTop: 6 }}>
              <input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome" style={{ padding: 8, border: "2px solid black", borderRadius: 6, fontSize: 12 }} />
              <input value={partido} onChange={e => setPartido(e.target.value)} placeholder="Partido - ex PL - 22" style={{ padding: 8, border: "2px solid black", borderRadius: 6, fontSize: 12 }} />
              <div style={{ display: "flex", gap: 4 }}>
                <select value={cargo} onChange={e => setCargo(e.target.value)} style={{ flex: 1, padding: 8, border: "2px solid black", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>
                  <option>Presidente</option><option>Governador</option><option>Senador</option><option>Deputado Federal</option><option>Deputado Estadual</option><option>Prefeito</option><option>Vereador</option><option>Outros</option>
                </select>
                <button onClick={() => fileRef.current?.click()} style={{ background: "#3b82f6", color: "white", fontWeight: 900, borderRadius: 6, border: "2px solid black", fontSize: 10, padding: "0 8px", cursor: "pointer" }}>📸 SUBIR FOTOS</button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoUpload} style={{ display: "none" }} />
              </div>
            </div>
            {cargo === "Outros" && <input value={cargoOutros} onChange={e => setCargoOutros(e.target.value)} placeholder="Digite o cargo: Ex: Conselheiro, Síndico..." style={{ width: "100%", padding: 8, border: "2px dashed #f59e0b", borderRadius: 6, marginTop: 6, fontSize: 12, boxSizing: "border-box" }} />}
            <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
              <input value={foto} onChange={e => setFoto(e.target.value)} placeholder="Ou cole link foto https://..." style={{ flex: 1, padding: 8, border: "2px solid black", borderRadius: 6, fontSize: 11 }} />
              {foto && <img src={foto} style={{ width: 36, height: 36, borderRadius: 6, border: "2px solid black", objectFit: "cover" }} alt="" />}
            </div>
            <textarea value={propostas} onChange={e => setPropostas(e.target.value)} placeholder="Propostas do candidato..." style={{ width: "100%", padding: 8, border: "2px solid black", borderRadius: 6, marginTop: 6, fontSize: 11, height: 50, boxSizing: "border-box" }} />
            <button onClick={adicionarCand} style={{ width: "100%", marginTop: 6, background: "black", color: "#facc15", fontWeight: 900, padding: 8, borderRadius: 6, border: "2px solid black", cursor: "pointer" }}>ADICIONAR CANDIDATO</button>
          </div>

          {/* LISTA */}
          <div style={{ background: "white", border: "3px solid black", borderRadius: 10, padding: 10, marginTop: 10 }}>
            <div style={{ fontWeight: 900, fontSize: 12 }}>LISTA - {cands.length} CANDIDATOS</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(150px,1fr))", gap: 6, marginTop: 8 }}>
              {cands.map(c => (
                <div key={c.id} style={{ border: "2px solid black", borderRadius: 8, padding: 6, textAlign: "center", background: "white" }}>
                  <img src={c.foto} style={{ width: 50, height: 50, borderRadius: "50%", border: "2px solid black", objectFit: "cover" }} alt="" />
                  <div style={{ fontWeight: 900, fontSize: 11 }}>{c.nome}</div>
                  <div style={{ fontSize: 8, background: "#facc15", border: "1px solid black", borderRadius: 3, fontWeight: 800, marginTop: 2 }}>{c.cargo}</div>
                  <div style={{ fontSize: 9 }}>{c.partido}</div>
                  <div style={{ fontSize: 9, fontWeight: 700 }}>{c.votos} votos</div>
                  {c.propostas && <div style={{ fontSize: 7, background: "#f1f5f9", padding: 3, borderRadius: 3, marginTop: 2, textAlign: "left", maxHeight: 30, overflow: "hidden" }}>{c.propostas.slice(0, 60)}</div>}
                  <button onClick={() => removerCand(c.id)} style={{ marginTop: 4, background: "#ef4444", color: "white", fontSize: 9, fontWeight: 900, padding: "2px 6px", borderRadius: 4, border: "1px solid black", cursor: "pointer" }}>REMOVER</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* LADO DIREITO - RANKING + SENHA PEQUENA NO CANTO */}
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {/* SENHA PEQUENA NO CANTO */}
          <div style={{ background: "white", border: "2px solid black", borderRadius: 8, padding: 8 }}>
            <div style={{ fontWeight: 900, fontSize: 10 }}>🔑 SUA SENHA</div>
            <div style={{ fontSize: 8, color: "#64748b" }}>Troque sua senha aqui</div>
            <input value={novaSenha} onChange={e => setNovaSenha(e.target.value)} placeholder="ex: joao2026" style={{ width: "100%", padding: 6, border: "2px solid black", borderRadius: 4, fontSize: 10, marginTop: 4, boxSizing: "border-box" }} />
            <button onClick={salvarNovaSenha} style={{ width: "100%", marginTop: 4, background: "#16a34a", color: "white", fontWeight: 900, fontSize: 10, padding: 6, borderRadius: 4, border: "1px solid black", cursor: "pointer" }}>SALVAR SENHA</button>
            <div style={{ fontSize: 8, background: "#fef9c3", border: "1px solid black", padding: 3, borderRadius: 3, marginTop: 4 }}>
              Atual: <b>{typeof window !== "undefined" ? (localStorage.getItem("senha_admin_personalizada") || localStorage.getItem("codigo_cliente") || "123456") : ""}</b>
            </div>
          </div>

          {/* RANKING */}
          <div style={{ background: "white", border: "3px solid black", borderRadius: 10, padding: 10 }}>
            <div style={{ fontWeight: 900, fontSize: 11 }}>🏆 RANKING - {totalVotos} VOTOS - 100%</div>
            <div style={{ marginTop: 6 }}>
              {totalVotos === 0 ? <div style={{ textAlign: "center", padding: 20, color: "#3b82f6", fontWeight: 700, fontSize: 11 }}>Nenhum voto ainda</div> :
                ranking.map((c, i) => (
                  <div key={c.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "5px 2px", borderBottom: "1px solid #e2e8f0", background: i === 0 ? "#fef08a" : "white", borderRadius: 3 }}>
                    <div style={{ fontWeight: 900, fontSize: 10 }}>{i + 1}º</div>
                    <img src={c.foto} style={{ width: 24, height: 24, borderRadius: "50%", border: "1px solid black" }} alt="" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: 9 }}>{c.nome}</div>
                      <div style={{ fontSize: 7 }}>{c.cargo} - {c.partido}</div>
                    </div>
                    <div style={{ fontWeight: 900, fontSize: 9 }}>{c.votos} - {totalVotos ? Math.round(c.votos * 100 / totalVotos) : 0}%</div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}