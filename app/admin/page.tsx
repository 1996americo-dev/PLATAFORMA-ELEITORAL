"use client"
import { useState, useEffect } from 'react'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AdminV55() {
  const [senha, setSenha] = useState("")
  const [logado, setLogado] = useState(false)
  const [votos, setVotos] = useState<any[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const SENHA = "2026"

  const carregar = async () => {
    const { data } = await supabase.from('votos').select('*').order('created_at', { ascending: false })
    if (data) { setVotos(data); const c: Record<string, number> = {}; data.forEach(r=>{ if(r.candidato_id!=='branco' && r.candidato_id!=='nulo') c[r.candidato_id]=(c[r.candidato_id]||0)+1 }); setStats(c) }
  }
  useEffect(()=>{if(logado) carregar()},[logado])

  const exportCSV = () => {
    const header = "candidato_id,quantidade,percentual,total\n"
    const total = votos.length
    const linhas = Object.entries(stats).map(([id,qtd])=>`${id},${qtd},${total?((qtd/total)*100).toFixed(2):0}%,${total}`).join('\n')
    const blob = new Blob([header+linhas], {type:'text/csv'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href=url; a.download=`votos-2026-${new Date().toISOString().slice(0,10)}.csv`; a.click()
  }

  if (!logado) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
      <div className="bg-white rounded-[24px] p-8 max-w-sm w-full border-[4px] border-slate-900 shadow-[0_20px_60px_rgba(0,0,0,0.5)]">
        <h1 className="font-black text-2xl text-slate-900">ADMIN V5.5 🔒</h1><p className="text-sm text-slate-900 font-bold mt-1">Senha: 2026 • Contraste Forte</p>
        <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Digite a senha" className="w-full bg-slate-100 border-2 border-slate-900 rounded-full px-4 py-3 text-sm mt-6 font-bold text-black placeholder:text-slate-500"/>
        <button onClick={()=> senha===SENHA?setLogado(true):alert("Errou! 2026")} className="w-full bg-slate-900 text-white py-3 rounded-full font-black mt-4 text-sm tracking-widest">ENTRAR NO ADMIN</button>
      </div>
    </div>
  )

  const total = votos.length
  const ranking = Object.entries(stats).sort((a,b)=>b[1]-a[1])

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6 bg-white border-[3px] border-slate-900 rounded-2xl p-4">
          <div><h1 className="font-black text-2xl text-slate-900 tracking-tight">ADMIN V5.5 • CONTRASTE FORTE</h1><p className="text-sm font-bold text-slate-900">{total} votos totais • 9 votos do seu print ainda aqui!</p></div>
          <div className="flex gap-2"><button onClick={exportCSV} className="bg-emerald-600 border-2 border-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-black">📥 EXPORTAR CSV</button><button onClick={carregar} className="bg-white border-[3px] border-slate-900 text-slate-900 px-5 py-2.5 rounded-full text-xs font-black">ATUALIZAR</button><a href="/" className="bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-black border-2 border-slate-900">SITE V5.5</a></div>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white border-[3px] border-slate-900 rounded-2xl p-5"><p className="text-[11px] font-black text-slate-900 tracking-widest">TOTAL GERAL</p><p className="text-5xl font-black text-slate-900 mt-1">{total}</p><p className="text-xs font-bold text-slate-600 mt-1">votos computados</p></div>
          <div className="bg-slate-900 border-[3px] border-slate-900 text-white rounded-2xl p-5"><p className="text-[11px] font-black text-yellow-400 tracking-widest">LÍDER ATUAL</p><p className="text-xl font-black mt-2 truncate">{ranking[0]?.[0] || "-"}</p><p className="text-sm font-bold mt-1">{ranking[0]?.[1]||0} votos • {total?((ranking[0]?.[1]/total)*100).toFixed(1):0}%</p></div>
          <div className="bg-white border-[3px] border-slate-900 rounded-2xl p-5"><p className="text-[11px] font-black text-slate-900">STATUS</p><p className="text-sm font-black text-slate-900 mt-2">✅ Supabase Online</p><p className="text-xs font-bold text-slate-600">Urna + V5 integrados</p><p className="text-xs font-bold text-emerald-600 mt-2">● AO VIVO</p></div>
          <div className="bg-white border-[3px] border-slate-900 rounded-2xl p-4 flex flex-col gap-2"><button onClick={()=>{localStorage.removeItem('meu_voto_v55'); localStorage.removeItem('meu_voto_v6'); localStorage.removeItem('meu_voto_v4'); alert('Seu celular resetado! Pode votar de novo')}} className="w-full bg-amber-300 border-2 border-slate-900 text-slate-900 py-2.5 rounded-full text-xs font-black">🔄 RESETAR MEU CELULAR</button><button onClick={async()=>{if(confirm('ZERAR TODOS OS VOTOS? Vai apagar os 9 votos!')){const {error}=await supabase.from('votos').delete().neq('id','00000000-0000-0000-0000-000000000000'); if(error) alert(error.message); else carregar()}}} className="w-full bg-red-600 border-2 border-slate-900 text-white py-2.5 rounded-full text-xs font-black">🗑️ ZERAR TUDO</button></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white border-[3px] border-slate-900 rounded-[24px] p-6">
            <h2 className="font-black text-slate-900 text-sm tracking-widest border-b-[3px] border-slate-900 pb-2">🍕 PIZZA - VOTOS POR CANDIDATO</h2>
            <div className="flex justify-center my-6"><div className="relative w-60 h-60 rounded-full border-[3px] border-slate-900" style={{background:`conic-gradient(${ranking.slice(0,6).map((r,i)=>{const cores=['#DC2626','#2563EB','#1E40AF','#EAB308','#16A34A','#BE123C']; const start=ranking.slice(0,i).reduce((a,b)=>a+b[1],0)/total*100; const end=start+r[1]/total*100; return `${cores[i%6]} ${start}% ${end}%`}).join(',')})`}}><div className="absolute inset-8 bg-white border-[3px] border-slate-900 rounded-full flex items-center justify-center flex-col"><span className="text-4xl font-black text-slate-900">{total}</span><span className="text-[10px] font-black text-slate-900 tracking-widest">VOTOS</span></div></div></div>
            <div className="space-y-2">{ranking.map(([id,qtd],i)=>{const cores=['#DC2626','#2563EB','#1E40AF','#EAB308','#16A34A','#BE123C']; return <div key={id} className="flex items-center gap-3 text-sm bg-slate-50 border-2 border-slate-200 rounded-xl p-2"><span className="w-4 h-4 rounded-full border-2 border-slate-900" style={{background:cores[i%6]}}/><span className="flex-1 truncate font-black text-slate-900">{id}</span><span className="font-black text-slate-900">{qtd}</span><span className="font-bold text-slate-600 w-12 text-right">{total?((qtd/total)*100).toFixed(1):0}%</span></div>})}</div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border-[3px] border-slate-900 rounded-[24px] p-6">
              <h2 className="font-black text-slate-900 text-sm tracking-widest border-b-[3px] border-slate-900 pb-2">🏆 RANKING COMPLETO</h2>
              <div className="mt-4 space-y-2">{ranking.map(([id,qtd],i)=><div key={id} className="flex items-center gap-3 bg-white border-2 border-slate-900 rounded-xl p-3"><span className="w-7 h-7 bg-slate-900 text-white rounded-full flex items-center justify-center text-xs font-black">{i+1}</span><span className="flex-1 text-sm font-black text-slate-900 truncate">{id}</span><div className="w-20 h-3 bg-slate-200 border-2 border-slate-900 rounded-full overflow-hidden"><div className="h-full bg-slate-900" style={{width:`${total?(qtd/total*100):0}%`}}/></div><span className="text-xs font-black text-slate-900 w-10 text-right">{qtd}</span></div>)}</div>
            </div>

            <div className="bg-slate-900 border-[3px] border-slate-900 rounded-[24px] p-6 text-white">
              <h2 className="font-black text-sm tracking-widest border-b-2 border-white/20 pb-2">📋 ÚLTIMOS VOTOS - TEMPO REAL</h2>
              <div className="mt-4 space-y-2 max-h-[300px] overflow-auto">{votos.slice(0,20).map((v:any)=><div key={v.id} className="flex justify-between text-xs bg-white/10 border border-white/20 p-3 rounded-xl"><span className="font-black">{v.candidato_id}</span><span className="font-mono text-white/70">{new Date(v.created_at).toLocaleString('pt-BR')}</span></div>)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
