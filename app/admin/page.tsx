"use client"
import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AdminPage() {
  const [senha, setSenha] = useState("")
  const [logado, setLogado] = useState(false)
  const [votos, setVotos] = useState<any[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const SENHA_ADMIN = "2026"

  const carregar = async () => {
    if (!isSupabaseConfigured) return
    const { data } = await supabase.from('votos').select('*').order('created_at', { ascending: false })
    if (data) {
      setVotos(data)
      const cont: Record<string, number> = {}
      data.forEach(r => { cont[r.candidato_id] = (cont[r.candidato_id] || 0) + 1 })
      setStats(cont)
    }
  }

  useEffect(() => { if (logado) carregar() }, [logado])

  const resetarTudo = async () => {
    if (!confirm("Tem certeza que quer apagar TODOS os votos?")) return
    await supabase.from('votos').delete().neq('id', 0)
    setVotos([])
    setStats({})
    localStorage.removeItem('meu_voto_v4')
    alert("Todos os votos apagados!")
  }

  const resetarMeuCelular = () => {
    localStorage.removeItem('meu_voto_v4')
    alert("Você pode votar de novo no seu celular!")
    window.location.href = "/"
  }

  if (!logado) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-white rounded-[24px] p-8 max-w-sm w-full">
          <h1 className="font-black text-2xl mb-2">ADMIN SECRETO 🔒</h1>
          <p className="text-sm text-slate-500 mb-6">Digite a senha pra ver o painel. Dica: 2026</p>
          <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha" className="w-full bg-slate-100 rounded-full px-4 py-3 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-slate-900"/>
          <button onClick={()=> senha===SENHA_ADMIN ? setLogado(true) : alert("Senha errada! Dica: 2026")} className="w-full bg-slate-900 text-white py-3 rounded-full font-bold">Entrar no Painel</button>
          <a href="/" className="block text-center text-xs text-slate-400 mt-4">← Voltar pro site</a>
        </div>
      </div>
    )
  }

  const total = votos.length
  const ranking = Object.entries(stats).sort((a,b)=>b[1]-a[1])

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="font-black text-3xl">Painel Admin V4 📊</h1>
            <p className="text-sm text-slate-500">{total} votos totais • Atualizado agora</p>
          </div>
          <div className="flex gap-2">
            <button onClick={carregar} className="bg-white border px-4 py-2 rounded-full text-xs font-bold">Atualizar</button>
            <a href="/" className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold">Ver Site</a>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 border">
            <p className="text-xs text-slate-500 font-bold tracking-widest">TOTAL DE VOTOS</p>
            <p className="text-4xl font-black mt-2">{total}</p>
            <p className="text-xs text-emerald-600 mt-1">● Ao vivo do Supabase</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border">
            <p className="text-xs text-slate-500 font-bold tracking-widest">LÍDER ATUAL</p>
            <p className="text-xl font-black mt-2">{ranking[0]?.[0] || "Nenhum"} </p>
            <p className="text-xs text-slate-500 mt-1">{ranking[0]?.[1] || 0} votos • {total ? ((ranking[0]?.[1]||0)/total*100).toFixed(1):0}%</p>
          </div>
          <div className="bg-white rounded-2xl p-6 border">
            <p className="text-xs text-slate-500 font-bold tracking-widest">AÇÕES</p>
            <div className="flex flex-col gap-2 mt-3">
              <button onClick={resetarMeuCelular} className="bg-amber-100 text-amber-800 py-2 rounded-full text-xs font-bold">Resetar meu celular (votar de novo)</button>
              <button onClick={resetarTudo} className="bg-red-50 text-red-600 border border-red-200 py-2 rounded-full text-xs font-bold">🗑️ Zerar TODOS os votos</button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border p-6 mb-6">
          <h2 className="font-bold mb-4">Ranking Completo</h2>
          <div className="space-y-3">
            {ranking.map(([id, qtd], i)=>{
              const pct = total ? (qtd/total*100) : 0
              return (
                <div key={id} className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span>
                  <span className="w-32 font-bold text-sm truncate">{id}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-900 transition-all" style={{width:`${pct}%`}}/></div>
                  <span className="text-sm font-bold w-20 text-right">{qtd} votos</span>
                  <span className="text-xs text-slate-500 w-12 text-right">{pct.toFixed(1)}%</span>
                </div>
              )
            })}
            {ranking.length===0 && <p className="text-sm text-slate-400">Nenhum voto ainda. Vai votar!</p>}
          </div>
        </div>

        <div className="bg-white rounded-[24px] border p-6">
          <h2 className="font-bold mb-4">Últimos 20 votos (tempo real)</h2>
          <div className="space-y-2 max-h-96 overflow-auto">
            {votos.slice(0,20).map((v:any)=>(
              <div key={v.id} className="flex justify-between text-xs bg-slate-50 p-3 rounded-xl">
                <span className="font-bold">{v.candidato_id}</span>
                <span className="text-slate-500">{new Date(v.created_at).toLocaleString('pt-BR')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
