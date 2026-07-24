"use client"
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function AdminV56(){
  const [senha,setSenha]=useState(""); const [logado,setLogado]=useState(false)
  const [votos,setVotos]=useState<any[]>([]); const [stats,setStats]=useState<Record<string,number>>({})
  const SENHA="2026"

  const carregar = async () => {
    const { data } = await supabase.from('votos').select('*').order('created_at',{ascending:false})
    if(data){ setVotos(data); const c:Record<string,number>={}; data.forEach(r=>{ if(!['branco','nulo'].includes(r.candidato_id)) c[r.candidato_id]=(c[r.candidato_id]||0)+1}); setStats(c) }
  }
  useEffect(()=>{if(logado) carregar()},[logado])

  const mascaraHash = (hash:string) => {
    if(!hash) return "***.***.***-** (legado)"
    if(hash.startsWith('hash-legado')) return "***.***.***-** (voto antigo)"
    // mostra só final do hash como auditoria
    return `***.***.***-${hash.slice(-2).toUpperCase()} • HASH:${hash.slice(0,8)}...`
  }

  if(!logado) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
      <div className="bg-white rounded-[24px] p-8 max-w-sm w-full border-[4px] border-slate-900 shadow-2xl">
        <h1 className="font-black text-2xl text-black">ADMIN V5.6 🔒 CPF</h1>
        <p className="text-sm font-black text-black mt-1">Anti-fraude • 1 CPF = 1 voto • Hash seguro</p>
        <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha 2026" className="w-full bg-slate-100 border-[3px] border-black rounded-full px-5 py-4 mt-6 text-center font-black text-xl text-black"/>
        <button onClick={()=>senha===SENHA?setLogado(true):alert("Senha errada!")} className="w-full bg-black text-white py-4 rounded-full font-black mt-4 tracking-widest">ENTRAR</button>
        <p className="text-[10px] text-center mt-3 font-bold text-slate-600">CPF vira HASH SHA-256 • LGPD OK</p>
      </div>
    </div>
  )

  const total=votos.length
  const ranking=Object.entries(stats).sort((a,b)=>b[1]-a[1])

  return (
    <div className="min-h-screen bg-[#F1F5F9] p-4">
      <div className="max-w-[1100px] mx-auto">
        <div className="bg-white border-[4px] border-black rounded-2xl p-4 flex flex-wrap justify-between gap-3 items-center">
          <div><h1 className="font-black text-xl text-black">ADMIN V5.6 • ANTI-FRAUDE CPF</h1><p className="font-bold text-black text-sm">{total} votos validados • CPF único • Hash SHA-256 • Nenhum CPF real salvo</p></div>
          <div className="flex gap-2"><button onClick={carregar} className="bg-white border-[3px] border-black text-black px-4 py-2 rounded-full font-black text-xs">ATUALIZAR</button><a href="/" className="bg-black text-white px-4 py-2 rounded-full font-black text-xs border-2 border-black">SITE V5.6</a></div>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white border-[3px] border-black rounded-2xl p-5"><p className="font-black text-[11px] tracking-widest text-black">TOTAL VALIDADO CPF</p><p className="text-5xl font-black text-black mt-1">{total}</p><p className="text-xs font-bold text-slate-600">votos únicos anti-fraude</p></div>
          <div className="bg-black text-white border-[3px] border-black rounded-2xl p-5"><p className="font-black text-[11px] tracking-widest text-yellow-400">LÍDER ANTI-FRAUDE</p><p className="text-lg font-black mt-2 truncate">{ranking[0]?.[0]||"-"}</p><p className="font-bold text-sm">{ranking[0]?.[1]||0} votos • {total?((ranking[0][1]/total)*100).toFixed(1):0}%</p></div>
          <div className="bg-white border-[3px] border-black rounded-2xl p-4 space-y-2"><p className="font-black text-[11px] text-black">CONTROLES</p><button onClick={()=>{localStorage.removeItem('cpf_hash_v56'); alert('Celular resetado! Pode testar outro CPF')}} className="w-full bg-amber-300 border-2 border-black text-black py-2 rounded-full font-black text-xs">🔄 RESETAR MEU TESTE</button><button onClick={async()=>{if(confirm('ZERAR TUDO? Apaga todos os votos CPF!')){await supabase.from('votos').delete().neq('id','00000000-0000-0000-0000-000000000000'); carregar()}}} className="w-full bg-red-600 border-2 border-black text-white py-2 rounded-full font-black text-xs">🗑️ ZERAR TODOS VOTOS</button></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-white border-[3px] border-black rounded-[24px] p-6">
            <h2 className="font-black text-black border-b-[3px] border-black pb-2">📋 VOTOS COM CPF - AUDITORIA</h2>
            <div className="mt-4 space-y-2 max-h-[600px] overflow-auto">
              {votos.map((v:any,i)=><div key={v.id} className="border-2 border-slate-200 rounded-xl p-3 bg-slate-50">
                <div className="flex justify-between items-center"><span className="font-black text-black text-sm">{i+1}. {v.candidato_id}</span><span className="text-[10px] font-bold bg-black text-white px-2 py-1 rounded-full">{new Date(v.created_at).toLocaleString('pt-BR')}</span></div>
                <p className="text-[11px] font-bold text-black mt-1 font-mono">{mascaraHash(v.cpf_hash)}</p>
                <p className="text-[9px] text-slate-600 font-bold mt-1">ID: {v.id.slice(0,8)}... • Validação Receita OK</p>
              </div>)}
              {votos.length===0 && <p className="text-center py-10 font-bold text-slate-500">Nenhum voto ainda. Vote com CPF no site!</p>}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white border-[3px] border-black rounded-[24px] p-6">
              <h2 className="font-black text-black border-b-[3px] border-black pb-2">🏆 RANKING ANTI-FRAUDE</h2>
              <div className="mt-4 space-y-2">{ranking.map(([id,qtd],i)=><div key={id} className="flex items-center gap-3 border-2 border-black rounded-xl p-3"><span className="w-7 h-7 bg-black text-white rounded-full flex items-center justify-center text-xs font-black">{i+1}</span><span className="flex-1 font-black text-black text-sm truncate">{id}</span><div className="w-20 h-3 bg-slate-200 border-2 border-black rounded-full overflow-hidden"><div className="h-full bg-black" style={{width:`${total?(qtd/total*100):0}%`}}/></div><span className="font-black text-black text-xs w-8">{qtd}</span></div>)}</div>
            </div>

            <div className="bg-amber-100 border-[3px] border-black rounded-[24px] p-5">
              <h2 className="font-black text-black text-xs">🔒 COMO FUNCIONA ANTI-FRAUDE</h2>
              <ul className="mt-3 space-y-2 text-[11px] font-bold text-black leading-tight">
                <li>✅ 1. Usuário digita CPF 000.000.000-00</li>
                <li>✅ 2. Sistema valida dígito verificador (Receita Federal)</li>
                <li>✅ 3. CPF vira HASH SHA-256 (ex: a1b2c3d4...) irreversível</li>
                <li>✅ 4. Salva só HASH, não o CPF real (LGPD ok)</li>
                <li>✅ 5. UNIQUE no banco bloqueia mesmo HASH = 1 CPF 1 voto</li>
                <li>✅ 6. Admin mostra só ***.***.***-25</li>
              </ul>
              <p className="mt-4 text-[10px] font-black bg-black text-white p-2 rounded-xl text-center">SIMULADOR EDUCATIVO - NÃO É TSE OFICIAL</p>
            </div>

            <div className="bg-white border-[3px] border-black rounded-[24px] p-5">
              <h3 className="font-black text-black text-xs">📤 EXPORTAR PARA EXCEL</h3>
              <button onClick={()=>{ const csv="candidato_id,cpf_hash_mascarado,data_hora\n"+votos.map(v=>`${v.candidato_id},${mascaraHash(v.cpf_hash)},${new Date(v.created_at).toLocaleString('pt-BR')}`).join('\n'); const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`votos-cpf-${new Date().toISOString().slice(0,10)}.csv`; a.click()}} className="w-full bg-emerald-600 border-2 border-black text-white py-3 rounded-full font-black text-xs mt-3">📥 BAIXAR CSV CPF MASCARADO</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
