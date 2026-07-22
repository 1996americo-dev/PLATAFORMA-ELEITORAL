"use client"
import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AdminV5() {
  const [senha, setSenha] = useState("")
  const [logado, setLogado] = useState(false)
  const [votos, setVotos] = useState<any[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const SENHA = "2026"

  const carregar = async () => {
    const { data } = await supabase.from('votos').select('*').order('created_at', { ascending: false })
    if (data) { setVotos(data); const c: Record<string, number> = {}; data.forEach(r=>c[r.candidato_id]=(c[r.candidato_id]||0)+1); setStats(c) }
  }
  useEffect(()=>{if(logado) carregar()},[logado])

  const exportCSV = () => {
    const header = "candidato_id,quantidade,percentual,total\n"
    const total = votos.length
    const linhas = Object.entries(stats).map(([id,qtd])=>`${id},${qtd},${total?((qtd/total)*100).toFixed(2):0}%,${total}`).join('\n')
    const blob = new Blob([header+linhas], {type:'text/csv'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`votos-2026-${new Date().toISOString().slice(0,10)}.csv`; a.click()
  }

  if (!logado) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-[24px] p-8 max-w-sm w-full">
        <h1 className="font-black text-2xl">ADMIN V5 🔥📊</h1><p className="text-sm text-slate-500 mb-6">Senha: 2026 • Agora com CSV + Pizza</p>
        <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha" className="w-full bg-slate-100 rounded-full px-4 py-3 text-sm mb-4"/>
        <button onClick={()=> senha===SENHA?setLogado(true):alert("Errou! 2026")} className="w-full bg-slate-900 text-white py-3 rounded-full font-bold">Entrar</button>
      </div>
    </div>
  )

  const total = votos.length
  const ranking = Object.entries(stats).sort((a,b)=>b[1]-a[1])

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div><h1 className="font-black text-3xl">Admin V5 • Viral 📈</h1><p className="text-sm text-slate-500">{total} votos • Pizza + CSV + Tempo Real</p></div>
          <div className="flex gap-2"><button onClick={exportCSV} className="bg-emerald-600 text-white px-4 py-2 rounded-full text-xs font-bold">📥 Exportar CSV</button><button onClick={carregar} className="bg-white border px-4 py-2 rounded-full text-xs font-bold">Atualizar</button><a href="/" className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold">Site</a></div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 border"><p className="text-xs font-bold text-slate-400">TOTAL</p><p className="text-4xl font-black">{total}</p></div>
          <div className="bg-slate-900 text-white rounded-2xl p-6"><p className="text-xs font-bold text-yellow-400">LÍDER</p><p className="text-xl font-black mt-1">{ranking[0]?.[0] || "-"}</p><p className="text-xs mt-1">{ranking[0]?.[1]||0} votos</p></div>
          <div className="bg-white rounded-2xl p-6 border"><p className="text-xs font-bold text-slate-400">VIRAL</p><p className="text-sm font-bold mt-1">Stories 1080x1920</p><p className="text-xs text-slate-500">Gera imagem pra Insta</p></div>
          <div className="bg-white rounded-2xl p-6 border"><button onClick={()=>{localStorage.removeItem('meu_voto_v4'); alert('Resetado!')}} className="w-full bg-amber-100 text-amber-800 py-2 rounded-full text-xs font-bold mb-2">Resetar meu celular</button><button onClick={async()=>{if(confirm('Zerar tudo?')){await supabase.from('votos').delete().neq('id',0); carregar()}}} className="w-full bg-red-50 text-red-600 border border-red-200 py-2 rounded-full text-xs font-bold">Zerar votos</button></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-[24px] border p-6">
            <h2 className="font-bold mb-4">🍕 Pizza - Top 5</h2>
            <div className="flex justify-center mb-4">
              <div className="relative w-56 h-56 rounded-full" style={{background:`conic-gradient(${ranking.slice(0,5).map((r,i)=>{const cores=['#DC2626','#2563EB','#1E40AF','#EAB308','#16A34A']; const start=ranking.slice(0,i).reduce((a,b)=>a+b[1],0)/total*100; const end=start+r[1]/total*100; return `${cores[i]} ${start}% ${end}%`}).join(',')})`}}><div className="absolute inset-6 bg-white rounded-full flex items-center justify-center flex-col"><span className="text-3xl font-black">{total}</span><span className="text-[10px]">VOTOS</span></div></div>
            </div>
            {ranking.slice(0,5).map(([id,qtd],i)=>{const cores=['#DC2626','#2563EB','#1E40AF','#EAB308','#16A34A']; return <div key={id} className="flex items-center gap-2 text-sm py-1"><span className="w-3 h-3 rounded-full" style={{background:cores[i]}}/><span className="flex-1 truncate font-bold">{id}</span><span>{qtd} • {total?((qtd/total)*100).toFixed(1):0}%</span></div>})}
          </div>
          <div className="bg-white rounded-[24px] border p-6">
            <h2 className="font-bold mb-4">Ranking Completo</h2>
            <div className="space-y-2">{ranking.map(([id,qtd],i)=><div key={id} className="flex items-center gap-2"><span className="w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-bold">{i+1}</span><span className="flex-1 text-sm font-bold truncate">{id}</span><div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full bg-slate-900" style={{width:`${total?(qtd/total*100):0}%`}}/></div><span className="text-xs font-bold w-16 text-right">{qtd}</span></div>)}</div>
          </div>
        </div>

        <div className="bg-white rounded-[24px] border p-6 mt-6">
          <h2 className="font-bold mb-4">Últimos votos (tempo real)</h2>
          <div className="space-y-2 max-h-96 overflow-auto">{votos.slice(0,30).map((v:any)=><div key={v.id} className="flex justify-between text-xs bg-slate-50 p-3 rounded-xl"><span className="font-bold">{v.candidato_id}</span><span className="text-slate-500">{new Date(v.created_at).toLocaleString('pt-BR')}</span></div>)}</div>
        </div>
      </div>
    </div>
  )
}
