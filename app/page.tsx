"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const SUPABASE_URL = "https://xvhtuacgagthzvusybsg.supabase.co"
const BUCKET = "fotos-candidatos"

const fotosReais: Record<string, string> = {
  "13-lula": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/lula.jpg`,
  "22-bolsonaro": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/bolsonaro.webp`,
  "PL-nikolas": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/nicolas.jpg`,
  "12-ciro": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/ciro.png`,
  "15-tebet": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/tebete.jpg`,
  "10-marina": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/marina.jpg`,
  "40-tabata": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/tabata.jpg`,
  "50-erika": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/erika.jpg`,
  "65-doria": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/doria.jpg`,
  "45-leite": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/leite.jpg`,
}

const candidatosData = [
  { id: "13-lula", nome: "Luiz Inácio Lula", partido: "PT", numero: "13", cor: "#DC2626", propostas: ["Bolsa Família", "Fim da fome", "Taxar super-ricos"], bio: "Presidente do Brasil", vice: "Alckmin" },
  { id: "22-bolsonaro", nome: "Jair Bolsonaro", partido: "PL", numero: "22", cor: "#2563EB", propostas: ["Segurança", "Valores cristãos", "Economia liberal"], bio: "Ex-presidente", vice: "Braga Netto" },
  { id: "PL-nikolas", nome: "Nikolas Ferreira", partido: "PL", numero: "77", cor: "#1E40AF", propostas: ["Família", "Fim doutrinação", "Redes livres"], bio: "Deputado federal", vice: "A definir" },
  { id: "12-ciro", nome: "Ciro Gomes", partido: "PDT", numero: "12", cor: "#EAB308", propostas: ["Projeto Nacional", "Indústria forte"], bio: "Ex-governador CE", vice: "Ana Paula" },
  { id: "15-tebet", nome: "Simone Tebet", partido: "MDB", numero: "15", cor: "#16A34A", propostas: ["Educação integral", "Frente ampla"], bio: "Ministra Planejamento", vice: "Mara Gabrilli" },
  { id: "10-marina", nome: "Marina Silva", partido: "REDE", numero: "18", cor: "#059669", propostas: ["Amazônia", "Economia verde"], bio: "Ministra Meio Ambiente", vice: "A definir" },
  { id: "40-tabata", nome: "Tabata Amaral", partido: "PSB", numero: "40", cor: "#CA8A04", propostas: ["Educação", "Ciência"], bio: "Deputada, Harvard", vice: "A definir" },
  { id: "50-erika", nome: "Erika Hilton", partido: "PSOL", numero: "50", cor: "#DC2626", propostas: ["Direitos humanos", "Cultura"], bio: "Deputada", vice: "A definir" },
]

function Avatar({ id, nome, cor, size=56 }: {id:string, nome:string, cor:string, size?:number}) {
  const [erro, setErro] = useState(false)
  const url = fotosReais[id]
  if (erro) return <div style={{width:size, height:size, background:cor}} className="rounded-full flex items-center justify-center text-white font-black shrink-0 border-2 text-[10px]">{nome.slice(0,2).toUpperCase()}</div>
  return <img src={url} onError={()=>setErro(true)} style={{width:size, height:size, border:`3px solid ${cor}`}} className="rounded-full object-cover shrink-0 bg-white" alt={nome} />
}

export default function V5_5() {
  const [numero, setNumero] = useState("")
  const [votos, setVotos] = useState<Record<string, number>>({})
  const [meuVoto, setMeuVoto] = useState<string|null>(null)
  const [filtro, setFiltro] = useState("TODOS")
  const [confete, setConfete] = useState(false)
  const [toast, setToast] = useState<string|null>(null)

  useEffect(()=>{ const s=localStorage.getItem('meu_voto_v55'); if(s) setMeuVoto(s) },[])

  const carregar = async () => {
    if(!isSupabaseConfigured) return
    const { data } = await supabase.from('votos').select('candidato_id')
    if(data){ const c:Record<string,number>={}; data.forEach(r=>{ if(r.candidato_id!=='branco' && r.candidato_id!=='nulo') c[r.candidato_id]=(c[r.candidato_id]||0)+1 }); setVotos(c) }
  }
  useEffect(()=>{ carregar(); if(isSupabaseConfigured){ const ch=supabase.channel('v55').on('postgres_changes',{event:'INSERT',schema:'public',table:'votos'},carregar).subscribe(); return()=>{supabase.removeChannel(ch)} } },[])

  const candidatoAtual = useMemo(()=> candidatosData.find(c=>c.numero===numero), [numero])
  const total = Object.values(votos).reduce((a,b)=>a+b,0)
  const ranking = useMemo(()=> [...candidatosData].sort((a,b)=>(votos[b.id]||0)-(votos[a.id]||0)), [votos])
  const partidos = ["TODOS", ...Array.from(new Set(candidatosData.map(c=>c.partido)))]

  const digitar = (n:string) => { if(numero.length<2) setNumero(numero+n) }
  const corrige = () => setNumero("")
  const branco = async () => { if(meuVoto){ setToast("Você já votou!"); setTimeout(()=>setToast(null),2000); return } if(!confirm('Confirma BRANCO?')) return; await votar('branco') }
  const confirma = async () => {
    if(meuVoto){ setToast("Você já votou!"); setTimeout(()=>setToast(null),2000); return }
    if(numero==='' ){ setToast("Digite o número!"); setTimeout(()=>setToast(null),2000); return }
    if(!candidatoAtual){ if(!confirm(`Número ${numero} não existe. Voto NULO?`)) return; await votar('nulo'); return }
    await votar(candidatoAtual.id)
  }

  const votar = async (id:string) => {
    if(isSupabaseConfigured){ const {error}=await supabase.from('votos').insert({candidato_id:id}); if(error){ setToast(error.message); return } }
    if(id!=='branco' && id!=='nulo'){ setVotos(prev=>({...prev,[id]:(prev[id]||0)+1})) }
    localStorage.setItem('meu_voto_v55', id); setMeuVoto(id); setConfete(true); setToast(id==='branco'? 'Voto BRANCO computado!' : id==='nulo' ? 'Voto NULO computado!' : `Voto em ${candidatosData.find(c=>c.id===id)?.nome} confirmado!`); setTimeout(()=>{setConfete(false); setToast(null); setNumero("")},3000)
  }

  const pizzaData = ranking.slice(0,5).map(c=>({c, v:votos[c.id]||0, pct: total? (votos[c.id]||0)/total*100 : 0}))

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative">
      {confete && <div className="fixed inset-0 pointer-events-none z-[100] text-3xl flex flex-wrap justify-center pt-20">{"🎉🗳️🇧🇷".repeat(100).split('').map((e,i)=><span key={i} className="animate-bounce" style={{animationDelay:`${i*0.03}s`}}>{e}</span>)}</div>}
      
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">26</div><div><h1 className="font-black text-sm leading-none">PLATAFORMA 2026 • V5.5 OFICIAL</h1><p className="text-[10px] tracking-widest text-slate-500 font-bold">V5 + URNA REAL • SEM STORY • /ADMIN DO LADO</p></div></div>
          <a href="/admin" className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold">ADMIN V5.5</a>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-6 mt-6 grid lg:grid-cols-3 gap-6">
        {/* ESQUERDA - RANKING E CARDS (V5) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="md:col-span-2 bg-white rounded-[24px] p-5 shadow-sm border">
              <h2 className="font-bold text-sm mb-3">🏆 Ranking ao vivo • {total} votos</h2>
              <div className="grid grid-cols-2 gap-3">{ranking.slice(0,4).map((c,i)=>{const v=votos[c.id]||0; const pct=total?(v/total*100).toFixed(1):"0"; return <div key={c.id} className={`rounded-2xl p-3 ${i===0?'bg-slate-900 text-white':'bg-slate-50 border'}`}><div className="flex items-center gap-2"><span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${i===0?'bg-white text-slate-900':'bg-slate-900 text-white'}`}>{i+1}</span><Avatar id={c.id} nome={c.nome} cor={c.cor} size={24}/><span className="font-bold text-xs truncate">{c.nome.split(' ')[0]}</span></div><div className="h-2 bg-black/20 rounded-full overflow-hidden mt-2"><div className="h-full bg-yellow-400 transition-all" style={{width:`${pct}%`}}/></div><div className="flex justify-between mt-1 text-[10px]"><span>{v} votos</span><span className="font-bold">{pct}%</span></div></div>})}</div>
            </div>
            <div className="bg-white rounded-[24px] p-5 shadow-sm border">
              <h2 className="font-bold text-sm mb-3">🍕 Pizza</h2>
              <div className="flex justify-center"><div className="relative w-32 h-32 rounded-full" style={{background:`conic-gradient(${pizzaData.map((d,i)=>{const start=pizzaData.slice(0,i).reduce((a,b)=>a+b.pct,0); return `${d.c.cor} ${start}% ${start+d.pct}%`}).join(',')})`}}><div className="absolute inset-3 bg-white rounded-full flex items-center justify-center flex-col"><span className="text-xl font-black">{total}</span><span className="text-[8px] font-bold">VOTOS</span></div></div></div>
              <div className="mt-3 space-y-1">{pizzaData.slice(0,3).map(d=><div key={d.c.id} className="flex items-center gap-1 text-[10px]"><span className="w-2 h-2 rounded-full" style={{background:d.c.cor}}/><span className="flex-1 truncate">{d.c.nome.split(' ')[0]}</span><span className="font-bold">{d.pct.toFixed(0)}%</span></div>)}</div>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">{partidos.map(p=><button key={p} onClick={()=>setFiltro(p)} className={`px-3 py-1.5 rounded-full text-[11px] font-bold whitespace-nowrap ${filtro===p?'bg-slate-900 text-white':'bg-white border'}`}>{p}</button>)}</div>

          <div className="grid md:grid-cols-2 gap-3">
            {candidatosData.filter(c=>filtro==="TODOS"||c.partido===filtro).map(c=>{const v=votos[c.id]||0; const pct=total?(v/total*100).toFixed(1):"0"; const meu=c.id===meuVoto; return <div key={c.id} className={`bg-white rounded-2xl border-2 p-3 flex gap-3 items-center ${meu?'border-emerald-500':''}`}><Avatar id={c.id} nome={c.nome} cor={c.cor} size={48}/><div className="flex-1 min-w-0"><p className="font-bold text-xs truncate">{c.nome}</p><p className="text-[10px] text-slate-500">{c.numero} • {c.partido} • {v} votos • {pct}%</p><div className="h-1 bg-slate-100 rounded-full overflow-hidden mt-1"><div className="h-full transition-all" style={{width:`${pct}%`, background:c.cor}}/></div></div>{meu && <span className="text-[10px] bg-emerald-500 text-white px-2 py-1 rounded-full font-bold">✓</span>}</div>})}
          </div>
        </div>

        {/* DIREITA - URNA REAL */}
        <div className="lg:sticky lg:top-24 h-fit">
          <div className="bg-[#F3F4F6] border-[5px] border-slate-800 rounded-2xl p-3 shadow-[0_15px_40px_rgba(0,0,0,0.25)]">
            <div className="bg-[#E5E7EB] border-2 border-slate-800 p-3 min-h-[300px] flex flex-col">
              <div className="flex justify-between text-[9px] border-b border-slate-400 pb-1 mb-2"><span>PRESIDENTE</span><span>V5.5</span></div>
              {meuVoto ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xl">✓</div>
                  <p className="font-black text-sm mt-2">VOCÊ JÁ VOTOU</p>
                  <p className="text-[11px] mt-1">{candidatosData.find(c=>c.id===meuVoto)?.nome || meuVoto.toUpperCase()}</p>
                  <button onClick={()=>{localStorage.removeItem('meu_voto_v55'); setMeuVoto(null)}} className="mt-4 text-[10px] bg-white border px-3 py-1 rounded">Resetar (teste)</button>
                </div>
              ) : (
                <>
                  <p className="text-[10px]">Seu voto para</p><h3 className="font-black text-sm tracking-widest">PRESIDENTE</h3>
                  <div className="mt-4"><p className="text-[10px]">Número:</p><div className="flex gap-2 mt-1"><div className="w-10 h-12 border-2 border-black bg-white flex items-center justify-center text-2xl font-black">{numero[0]||''}</div><div className="w-10 h-12 border-2 border-black bg-white flex items-center justify-center text-2xl font-black">{numero[1]||''}</div></div></div>
                  {numero.length===2 && !candidatoAtual && <div className="mt-4"><p className="font-black text-sm animate-pulse">NÚMERO ERRADO</p><p className="text-[10px]">VOTO NULO</p></div>}
                  {candidatoAtual && <div className="mt-4 flex gap-3"><div className="flex-1"><p className="text-[10px]">Nome:</p><p className="font-bold text-[11px] leading-tight">{candidatoAtual.nome}</p><p className="text-[10px] mt-1">{candidatoAtual.partido} • {candidatoAtual.vice}</p></div><img src={fotosReais[candidatoAtual.id]} className="w-16 h-20 object-cover border-2 border-black bg-white" alt=""/></div>}
                  {numero==='' && <p className="mt-8 text-[10px] text-slate-500">Digite: 13 Lula<br/>22 Bolsonaro<br/>77 Nikolas<br/>12 Ciro etc</p>}
                  <div className="mt-auto border-t-2 border-black pt-1 text-[8px] leading-tight">CONFIRMA = confirma voto<br/>CORRIGE = apaga</div>
                </>
              )}
            </div>
            <div className="bg-[#1F2937] p-3 rounded-xl mt-3">
              <div className="grid grid-cols-3 gap-2">{[1,2,3,4,5,6,7,8,9].map(n=><button key={n} onClick={()=>digitar(String(n))} disabled={!!meuVoto} className="h-10 bg-black text-white rounded text-lg font-bold disabled:opacity-30">{n}</button>)}<div/><button onClick={()=>digitar('0')} disabled={!!meuVoto} className="h-10 bg-black text-white rounded text-lg font-bold disabled:opacity-30">0</button><div/></div>
              <div className="grid grid-cols-3 gap-1.5 mt-3"><button onClick={branco} disabled={!!meuVoto} className="h-9 bg-white text-black rounded text-[9px] font-bold disabled:opacity-30">BRANCO</button><button onClick={corrige} className="h-9 bg-[#F97316] rounded text-[9px] font-bold">CORRIGE</button><button onClick={confirma} disabled={!!meuVoto} className="h-12 bg-[#16A34A] text-white rounded text-[9px] font-bold disabled:opacity-30">CONFIRMA</button></div>
            </div>
          </div>
          <p className="text-[9px] text-center text-slate-500 mt-2">© Simulador Urna V5.5 • TSE • 9 votos atuais</p>
        </div>
      </div>

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-xs font-bold z-50">{toast}</div>}
    </div>
  )
}
