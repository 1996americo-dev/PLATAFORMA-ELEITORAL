"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Scale, Award, X, Trophy, CheckCircle } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

function Avatar({ nome, cor, size=56, partido }: {nome:string, cor:string, size?:number, partido:string}) {
  const iniciais = nome.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()
  return (
    <div style={{width:size, height:size, background:cor, border:`3px solid ${cor}`, fontSize:size*0.35}} className="rounded-full flex items-center justify-center text-white font-black shrink-0 shadow-sm">
      {iniciais}
    </div>
  )
}

const candidatosData = [
  { id: "13-lula", nome: "Luiz Inácio Lula", partido: "PT", numero: "13", cor: "#DC2626", propostas: ["Bolsa Família turbinado", "Fim da fome", "Taxar super-ricos"], bio: "Presidente do Brasil, ex-sindicalista" },
  { id: "22-bolsonaro", nome: "Jair Bolsonaro", partido: "PL", numero: "22", cor: "#2563EB", propostas: ["Segurança total", "Valores cristãos", "Economia liberal"], bio: "Ex-presidente, capitão reformado" },
  { id: "PL-nikolas", nome: "Nikolas Ferreira", partido: "PL", numero: "PL", cor: "#1E40AF", propostas: ["Família e pátria", "Fim da doutrinação", "Redes livres"], bio: "Deputado federal mais votado" },
  { id: "12-ciro", nome: "Ciro Gomes", partido: "PDT", numero: "12", cor: "#EAB308", propostas: ["Projeto Nacional", "Reforma tributária", "Indústria forte"], bio: "Ex-governador do Ceará" },
  { id: "15-tebet", nome: "Simone Tebet", partido: "MDB", numero: "15", cor: "#16A34A", propostas: ["Educação em tempo integral", "Conciliação", "Frente ampla"], bio: "Ministra do Planejamento" },
  { id: "10-marina", nome: "Marina Silva", partido: "REDE", numero: "18", cor: "#059669", propostas: ["Amazônia de pé", "Economia verde", "Clima"], bio: "Ministra Meio Ambiente" },
  { id: "40-tabata", nome: "Tabata Amaral", partido: "PSB", numero: "40", cor: "#CA8A04", propostas: ["Educação que funciona", "Ciência", "Juventude"], bio: "Deputada federal, Harvard" },
  { id: "50-erika", nome: "Erika Hilton", partido: "PSOL", numero: "50", cor: "#DC2626", propostas: ["Direitos humanos", "População trans", "Cultura"], bio: "Deputada federal, ativista" },
  { id: "65-doria", nome: "João Doria", partido: "PSDB", numero: "45", cor: "#2563EB", propostas: ["Gestão empresarial", "Privatizações", "SP modelo"], bio: "Ex-governador de SP" },
  { id: "45-leite", nome: "Eduardo Leite", partido: "PSDB", numero: "45", cor: "#2563EB", propostas: ["Reforma do RS", "Centro democrático", "Gestão jovem"], bio: "Governador do RS" },
]

export default function Page() {
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState("TODOS")
  const [votos, setVotos] = useState<Record<string, number>>({})
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [toast, setToast] = useState<string|null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregar = async () => {
      setLoading(true)
      if (!isSupabaseConfigured) {
        const salvo = localStorage.getItem('votos_v3')
        if (salvo) setVotos(JSON.parse(salvo))
        setLoading(false)
        return
      }
      const { data } = await supabase.from('votos').select('candidato_id')
      if (data) {
        const cont: Record<string, number> = {}
        data.forEach(r => { cont[r.candidato_id] = (cont[r.candidato_id] || 0) + 1 })
        setVotos(cont)
      }
      const channel = supabase.channel('v3-final-avatares')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'votos' }, (payload:any) => {
          const id = payload.new.candidato_id
          setVotos(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }))
        }).subscribe()
      setLoading(false)
      return () => { supabase.removeChannel(channel) }
    }
    carregar()
  }, [])

  const handleVotar = async (id: string) => {
    const cand = candidatosData.find(c => c.id === id)
    if (isSupabaseConfigured) {
      await supabase.from('votos').insert({ candidato_id: id })
    } else {
      const novo = { ...votos, [id]: (votos[id] || 0) + 1 }
      setVotos(novo)
      localStorage.setItem('votos_v3', JSON.stringify(novo))
    }
    setToast(`Voto computado para ${cand?.nome}!`)
    setTimeout(() => setToast(null), 3000)
  }

  const total = Object.values(votos).reduce((a,b)=>a+b,0)
  const filtrados = useMemo(() => candidatosData.filter(c => {
    const okBusca = c.nome.toLowerCase().includes(busca.toLowerCase()) || c.partido.toLowerCase().includes(busca.toLowerCase())
    const okFiltro = filtro==="TODOS" || c.partido===filtro
    return okBusca && okFiltro
  }), [busca, filtro])

  const ranking = useMemo(() => [...candidatosData].sort((a,b)=>(votos[b.id]||0)-(votos[a.id]||0)), [votos])
  const partidos = ["TODOS", ...Array.from(new Set(candidatosData.map(c=>c.partido)))]

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans">
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">26</div>
            <div>
              <h1 className="font-black tracking-tight leading-none">PLATAFORMA ELEITORAL 2026</h1>
              <p className="text-[10px] tracking-[0.2em] text-slate-500 font-bold">OFICIAL • COMPARATIVO • VOTAÇÃO SIMULADA</p>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"/>
            <input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar candidato ou partido" className="pl-10 pr-4 py-2 rounded-full bg-slate-100 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-slate-900"/>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 mt-6">
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-slate-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center"><Trophy className="w-5 h-5"/></div>
            <div>
              <h2 className="font-bold">Ranking em tempo real</h2>
              <p className="text-xs text-emerald-600 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"/> {total.toLocaleString()} votos computados • atualiza ao vivo {loading && "(carregando...)"}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {ranking.slice(0,4).map((c,i)=> {
              const v = votos[c.id]||0
              const pct = total ? (v/total*100).toFixed(1) : "0"
              return (
                <div key={c.id} className={`rounded-2xl p-4 ${i===0?'bg-slate-900 text-white':'bg-slate-50 border'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i===0?'bg-white text-slate-900':'bg-slate-900 text-white'}`}>{i+1}</span>
                    <Avatar nome={c.nome} cor={c.cor} size={28} partido={c.partido}/>
                    <span className="font-bold text-sm truncate">{c.nome.split(' ')[0]}</span>
                  </div>
                  <div className="h-2 bg-black/10 rounded-full overflow-hidden"><div className="h-full bg-yellow-400" style={{width:`${pct}%`}}/></div>
                  <div className="flex justify-between mt-2 text-xs opacity-80"><span>{c.partido} • {v}</span><span className="font-bold">{pct}%</span></div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-4 flex gap-2 overflow-x-auto">
        {partidos.map(p=>(
          <button key={p} onClick={()=>setFiltro(p)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${filtro===p?'bg-slate-900 text-white':'bg-white border'}`}>{p}</button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-6 grid md:grid-cols-3 lg:grid-cols-4 gap-4 pb-32">
        {filtrados.map(c=>{
          const v = votos[c.id]||0
          const pct = total ? (v/total*100).toFixed(1) : "0"
          const sel = selecionados.includes(c.id)
          return (
            <div key={c.id} className={`bg-white rounded-[20px] border-2 p-4 transition-all ${sel?'border-slate-900 shadow-lg scale-[1.02]':'border-slate-100'}`}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar nome={c.nome} cor={c.cor} size={56} partido={c.partido}/>
                  <div>
                    <h3 className="font-bold text-sm leading-tight">{c.nome}</h3>
                    <p className="text-xs text-slate-500">{c.numero} • {c.partido}</p>
                  </div>
                </div>
                <button onClick={()=>setSelecionados(prev=> prev.includes(c.id)? prev.filter(x=>x!==c.id) : prev.length<2 ? [...prev, c.id] : prev)} className={`w-7 h-7 rounded-full border flex items-center justify-center ${sel?'bg-slate-900 text-white':'bg-slate-50'}`}>{sel && <CheckCircle className="w-4 h-4"/>}</button>
              </div>
              <p className="text-[11px] text-slate-600 mt-3">{c.bio}</p>
              <div className="mt-3">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="h-full" style={{width:`${pct}%`, background:c.cor}}/></div>
                <div className="flex justify-between text-[10px] mt-1 text-slate-500"><span>{v} votos</span><span>{pct}%</span></div>
              </div>
              <button onClick={()=>handleVotar(c.id)} className="w-full mt-3 py-2.5 rounded-full bg-slate-900 text-white text-xs font-bold hover:bg-black flex items-center justify-center gap-2"><Award className="w-4 h-4"/> VOTAR • {c.numero}</button>
            </div>
          )
        })}
      </div>

      {selecionados.length>0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl z-50">
          <span className="text-sm font-bold">{selecionados.length} selecionado(s)</span>
          <button onClick={()=>setShowCompare(true)} disabled={selecionados.length!==2} className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-50 flex items-center gap-1"><Scale className="w-4 h-4"/> Comparar</button>
          <button onClick={()=>setSelecionados([])}><X className="w-4 h-4"/></button>
        </div>
      )}

      {showCompare && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-4xl w-full max-h-[90vh] overflow-auto p-6">
            <div className="flex justify-between items-center mb-6"><h2 className="font-black text-xl flex items-center gap-2"><Scale/> Comparativo lado a lado</h2><button onClick={()=>setShowCompare(false)}><X/></button></div>
            <div className="grid grid-cols-2 gap-6">
              {selecionados.map(id=>{
                const c = candidatosData.find(x=>x.id===id)!
                const v = votos[c.id]||0
                return (
                  <div key={id} className="border rounded-2xl p-4 text-center">
                    <div className="flex justify-center"><Avatar nome={c.nome} cor={c.cor} size={80} partido={c.partido}/></div>
                    <h3 className="font-bold mt-2">{c.nome}</h3>
                    <p className="text-xs text-slate-500">{c.partido} • {v} votos • {total?((v/total)*100).toFixed(1):0}%</p>
                    <div className="mt-4 space-y-2 text-left">{c.propostas.map((p,i)=><div key={i} className="bg-slate-50 p-2 rounded-xl text-xs">• {p}</div>)}</div>
                    <button onClick={()=>handleVotar(c.id)} className="w-full mt-4 py-2 rounded-full bg-slate-900 text-white text-xs font-bold">VOTAR NESSE</button>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl z-50 animate-bounce">{toast}</div>}
    </div>
  )
}
