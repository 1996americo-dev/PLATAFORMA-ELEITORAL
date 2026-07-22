"use client"
import { useState, useMemo } from "react"
import { Search, Check, X, ShieldCheck, Users, ArrowUpRight } from "lucide-react"

type Party = "PDT" | "PT" | "MDB" | "REDE" | "PL" | "PSB" | "PSDB" | "PSOL"
type Candidate = { id: string; name: string; number: string; party: Party; color: string; bg: string; initials: string; role: string; state: string }

const partyColors: Record<Party, { main: string; light: string; border: string; text: string }> = {
  PDT: { main: "#1250A3", light: "#E6EEFF", border: "#1250A3", text: "#1250A3" },
  PT: { main: "#C41E1E", light: "#FDE8E8", border: "#C41E1E", text: "#9E1212" },
  MDB: { main: "#D4A500", light: "#FFF8DB", border: "#C79A00", text: "#7A5A00" },
  REDE: { main: "#2EB872", light: "#E6F9EF", border: "#2EB872", text: "#14633B" },
  PL: { main: "#155232", light: "#E5F3EB", border: "#155232", text: "#0F3D25" },
  PSB: { main: "#E86A17", light: "#FFF0E6", border: "#E86A17", text: "#9A3F00" },
  PSDB: { main: "#3B82F6", light: "#EAF2FF", border: "#3B82F6", text: "#1D4ED8" },
  PSOL: { main: "#7C3AED", light: "#F0E9FF", border: "#7C3AED", text: "#5B21B6" },
}

const candidates: Candidate[] = [
  { id: "ciro", name: "Ciro Gomes", number: "12", party: "PDT", initials: "CG", role: "Candidato à Presidência", state: "CE", color: "#1250A3", bg: "#E6EEFF" },
  { id: "lula", name: "Lula", number: "13", party: "PT", initials: "LS", role: "Candidato à Presidência", state: "SP", color: "#C41E1E", bg: "#FDE8E8" },
  { id: "simone", name: "Simone Tebet", number: "15", party: "MDB", initials: "ST", role: "Candidata à Presidência", state: "MS", color: "#D4A500", bg: "#FFF8DB" },
  { id: "marina", name: "Marina Silva", number: "18", party: "REDE", initials: "MS", role: "Candidata à Presidência", state: "SP", color: "#2EB872", bg: "#E6F9EF" },
  { id: "bolsonaro", name: "Bolsonaro", number: "22", party: "PL", initials: "JB", role: "Candidato à Presidência", state: "RJ", color: "#155232", bg: "#E5F3EB" },
  { id: "nikolas", name: "Nikolas Ferreira", number: "2222", party: "PL", initials: "NF", role: "Candidato", state: "MG", color: "#155232", bg: "#E5F3EB" },
  { id: "tabata", name: "Tabata Amaral", number: "40", party: "PSB", initials: "TA", role: "Candidata", state: "SP", color: "#E86A17", bg: "#FFF0E6" },
  { id: "doria", name: "João Doria", number: "45", party: "PSDB", initials: "JD", role: "Candidato", state: "SP", color: "#3B82F6", bg: "#EAF2FF" },
  { id: "eduardo", name: "Eduardo Leite", number: "45", party: "PSDB", initials: "EL", role: "Candidato", state: "RS", color: "#3B82F6", bg: "#EAF2FF" },
  { id: "erika", name: "Erika Hilton", number: "50", party: "PSOL", initials: "EH", role: "Candidata", state: "SP", color: "#7C3AED", bg: "#F0E9FF" },
]

export default function Page() {
  const [search, setSearch] = useState("")
  const [comparing, setComparing] = useState<string[]>([])
  const [selected, setSelected] = useState<Candidate | null>(null)

  const filtered = useMemo(() => {
    if (!search) return candidates
    return candidates.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.party.toLowerCase().includes(search.toLowerCase()) || c.number.includes(search))
  }, [search])

  const toggleCompare = (id: string) => {
    setComparing(prev => prev.includes(id)? prev.filter(x => x!== id) : prev.length < 3? [...prev, id] : prev)
  }

  return (
    <div className="min-h-screen bg-white text-[#0F2147] antialiased">
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-black/[0.06]">
        <div className="mx-auto max-w- px-6 h- flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="flex flex-col leading-[0.9]">
              <span className="text- font-extrabold tracking-[0.14em]">PLATAFORMA ELEITORAL</span>
              <span className="text- font-extrabold tracking-[0.14em]">2026</span>
              <div className="mt-1 h- w- bg-[#0F2147] rounded-full" />
            </div>
            <div className="hidden md:flex items-center gap-2.5 pl-5 border-l border-black/10">
              <div className="h-7 px-2.5 rounded-full bg-[#E6F9EF] border border-[#2EB872]/20 flex items-center gap-1.5">
                <div className="w-4 h-4 rounded-full bg-[#2EB872] flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white stroke-[3]" /></div>
                <span className="text- font-bold tracking-widest text-[#14633B]">OFICIAL</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text- text-black/50"><ShieldCheck className="w-4 h-4" /> Ambiente seguro</div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-[40%] left-[20%] w-[80%] h-[80%] rounded-full blur- bg-gradient-to-b from-[#E6EEFF] to-transparent opacity-60" />
        <div className="mx-auto max-w- px-6 py-12 md:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text- md:text- font-extrabold tracking-tight leading-[0.95]">Conheça os<br />Candidatos</h1>
              <p className="mt-3 text- md:text- text-black/50 max-w- leading-[1.5]">Plataforma transparente para comparação de propostas e votação consciente. Dados validados.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-black/30" />
                <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Buscar nome, partido, número..." className="h-11 w- rounded-full border border-black/10 bg-white pl-10 pr-4 text- outline-none focus:border-[#0F2147]/30" />
              </div>
            </div>
          </div>

          {comparing.length > 0 && (
            <div className="mt-6 rounded- border border-[#0F2147]/10 bg-[#F6F7F9] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-"><Users className="w-4 h-4" />{comparing.length} selecionados para comparação</div>
              <button onClick={()=>setComparing([])} className="text- font-semibold">Limpar</button>
            </div>
          )}

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map(c => {
              const isComparing = comparing.includes(c.id)
              return (
                <div key={c.id} className="group relative rounded- border border-black/[0.06] bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-0.5 transition-all">
                  <div className="flex gap-4">
                    <div className="w- h- rounded-full p- shrink-0" style={{ background: c.color }}>
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center"><span className="text- font-bold" style={{ color: c.color }}>{c.initials}</span></div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text- font-bold leading-tight truncate">{c.name}</h3>
                      <p className="text- text-black/50 mt-0.5">{c.role} • {c.state}</p>
                      <div className="mt-2 inline-flex h-6 px-2.5 rounded-full text- font-bold border" style={{ background: partyColors[c.party].light, borderColor: partyColors[c.party].border+"22", color: partyColors[c.party].text }}>{c.number} - {c.party}</div>
                    </div>
                  <div className="mt-4 flex gap-2">
                    <button onClick={()=>setSelected(c)} className="flex-1 h-9 rounded-full bg-[#0F2147] text-white text- font-semibold hover:bg-[#152C5E]">Ver Propostas</button>
                    <button onClick={()=>toggleCompare(c.id)} className={`flex-1 h-9 rounded-full border text- font-semibold transition ${isComparing? "bg-[#0F2147] text-white border-[#0F2147]" : "border-black/10 hover:bg-black/[0.03]"}`}>{isComparing? "Remover" : "Comparar"}</button>
                  </div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity"><ArrowUpRight className="w-4 h-4 text-black/20" /></div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <footer className="bg-[#0A1931] text-white mt-10">
        <div className="mx-auto max-w- px-6 py-10 flex justify-between items-center">
          <p className="text- font-semibold">Eleições 2026 - Dados oficiais TSE</p>
          <p className="text- text-white/40">© 2026 Plataforma Eleitoral</p>
        </div>
      </footer>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-6">
          <div className="absolute inset-0 bg-[#0F2147]/40 backdrop-blur-" onClick={()=>setSelected(null)} />
          <div className="relative w-full md:max-w- bg-white rounded-t- md:rounded- shadow-xl overflow-hidden max-h- flex flex-col">
            <div className="h-1 w-full" style={{ background: selected.color }} />
            <div className="p-8 overflow-y-auto">
              <button onClick={()=>setSelected(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center"><X className="w-4 h-4" /></button>
              <h2 className="text- font-bold">{selected.name}</h2>
              <p className="text- text-black/60 mt-2">Propostas ilustrativas. O oficial virá do DivulgaCand TSE.</p>
              <button onClick={()=>setSelected(null)} className="mt-6 w-full h-11 rounded-full bg-[#0F2147] text-white text- font-semibold">Fechar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}