"use client"
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, Scale, Award, X, Trophy, CheckCircle, Share2, Camera, Download, PieChart, Sparkles } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

const SUPABASE_URL = "https://xvhtuacgagthzvusybsg.supabase.co"
const BUCKET = "fotos-candidatos"
const SITE_URL = typeof window !== 'undefined' ? window.location.origin : "https://plataforma-eleitoral-2026.vercel.app"

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

function Avatar({ id, nome, cor, size=56 }: {id:string, nome:string, cor:string, size?:number}) {
  const [erro, setErro] = useState(false)
  const iniciais = nome.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()
  const url = fotosReais[id]
  if (erro) return <div style={{width:size, height:size, background:cor, fontSize:size!*0.32}} className="rounded-full flex items-center justify-center text-white font-black shrink-0 border-2">{iniciais}</div>
  return <img src={url} onError={()=>setErro(true)} style={{width:size, height:size, border:`3px solid ${cor}`}} className="rounded-full object-cover shrink-0 bg-white" alt={nome} />
}

const candidatosData = [
  { id: "13-lula", nome: "Luiz Inácio Lula", partido: "PT", numero: "13", cor: "#DC2626", propostas: ["Bolsa Família turbinado", "Fim da fome", "Taxar super-ricos"], bio: "Presidente do Brasil" },
  { id: "22-bolsonaro", nome: "Jair Bolsonaro", partido: "PL", numero: "22", cor: "#2563EB", propostas: ["Segurança total", "Valores cristãos", "Economia liberal"], bio: "Ex-presidente, capitão" },
  { id: "PL-nikolas", nome: "Nikolas Ferreira", partido: "PL", numero: "PL", cor: "#1E40AF", propostas: ["Família e pátria", "Fim da doutrinação", "Redes livres"], bio: "Deputado federal mais votado" },
  { id: "12-ciro", nome: "Ciro Gomes", partido: "PDT", numero: "12", cor: "#EAB308", propostas: ["Projeto Nacional", "Reforma tributária", "Indústria forte"], bio: "Ex-governador CE" },
  { id: "15-tebet", nome: "Simone Tebet", partido: "MDB", numero: "15", cor: "#16A34A", propostas: ["Educação integral", "Conciliação", "Frente ampla"], bio: "Ministra Planejamento" },
  { id: "10-marina", nome: "Marina Silva", partido: "REDE", numero: "18", cor: "#059669", propostas: ["Amazônia de pé", "Economia verde", "Clima"], bio: "Ministra Meio Ambiente" },
  { id: "40-tabata", nome: "Tabata Amaral", partido: "PSB", numero: "40", cor: "#CA8A04", propostas: ["Educação que funciona", "Ciência", "Juventude"], bio: "Deputada, Harvard" },
  { id: "50-erika", nome: "Erika Hilton", partido: "PSOL", numero: "50", cor: "#DC2626", propostas: ["Direitos humanos", "Pop trans", "Cultura"], bio: "Deputada, ativista" },
  { id: "65-doria", nome: "João Doria", partido: "PSDB", numero: "45", cor: "#2563EB", propostas: ["Gestão empresarial", "Privatizações", "SP modelo"], bio: "Ex-governador SP" },
  { id: "45-leite", nome: "Eduardo Leite", partido: "PSDB", numero: "45", cor: "#2563EB", propostas: ["Reforma do RS", "Centro democrático", "Gestão jovem"], bio: "Governador RS" },
]

export default function PageV5() {
  const [busca, setBusca] = useState("")
  const [filtro, setFiltro] = useState("TODOS")
  const [votos, setVotos] = useState<Record<string, number>>({})
  const [meuVoto, setMeuVoto] = useState<string|null>(null)
  const [selecionados, setSelecionados] = useState<string[]>([])
  const [showCompare, setShowCompare] = useState(false)
  const [showStory, setShowStory] = useState<string|null>(null)
  const [toast, setToast] = useState<string|null>(null)
  const [confete, setConfete] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => { const s = localStorage.getItem('meu_voto_v4'); if (s) setMeuVoto(s) }, [])

  const carregarVotos = async () => {
    if (!isSupabaseConfigured) { const salvo = localStorage.getItem('votos_v3'); if (salvo) setVotos(JSON.parse(salvo)); return }
    const { data } = await supabase.from('votos').select('candidato_id')
    if (data) { const cont: Record<string, number> = {}; data.forEach(r=>{cont[r.candidato_id]=(cont[r.candidato_id]||0)+1}); setVotos(cont) }
  }

  useEffect(()=>{ carregarVotos(); if(isSupabaseConfigured){ const ch = supabase.channel('v5').on('postgres_changes',{event:'INSERT',schema:'public',table:'votos'},carregarVotos).subscribe(); return ()=>{supabase.removeChannel(ch)} } },[])

  const handleVotar = async (id:string) => {
    if (meuVoto) { setToast(`Você já votou no ${candidatosData.find(c=>c.id===meuVoto)?.nome}!`); setTimeout(()=>setToast(null),3000); return }
    const cand = candidatosData.find(c=>c.id===id)!
    if (isSupabaseConfigured) { const {error} = await supabase.from('votos').insert({candidato_id:id}); if(error){setToast(error.message); return} }
    setVotos(prev=>({...prev,[id]:(prev[id]||0)+1})); localStorage.setItem('meu_voto_v4',id); setMeuVoto(id); setConfete(true); setToast(`🎉 Voto no ${cand.nome} computado!`); setTimeout(()=>{setConfete(false); setToast(null)},4000)
    setTimeout(()=>setShowStory(id), 1000)
  }

  const gerarStory = async (id:string) => {
    const c = candidatosData.find(x=>x.id===id)!; const v = votos[id]||0; const total = Object.values(votos).reduce((a,b)=>a+b,0); const pct = total?((v/total)*100).toFixed(1):"0"
    const canvas = canvasRef.current; if(!canvas) return; const ctx = canvas.getContext('2d')!; canvas.width=1080; canvas.height=1920
    ctx.fillStyle = '#0F172A'; ctx.fillRect(0,0,1080,1920)
    ctx.fillStyle = c.cor; ctx.fillRect(0,0,1080,20)
    ctx.fillStyle='white'; ctx.font='900 60px sans-serif'; ctx.fillText('PLATAFORMA', 60, 120); ctx.font='900 60px sans-serif'; ctx.fillStyle='#FACC15'; ctx.fillText('ELEITORAL 2026', 60, 190)
    ctx.fillStyle='white'; ctx.font='900 80px sans-serif'; const nomeQuebrado = c.nome.split(' '); ctx.fillText(nomeQuebrado[0], 60, 900); ctx.fillText(nomeQuebrado.slice(1).join(' '), 60, 990)
    ctx.font='bold 40px sans-serif'; ctx.fillStyle='#94A3B8'; ctx.fillText(`${c.partido} • Nº ${c.numero}`, 60, 1060)
    ctx.font='900 180px sans-serif'; ctx.fillStyle='white'; ctx.fillText(`${pct}%`, 60, 1300)
    ctx.font='bold 36px sans-serif'; ctx.fillStyle='#94A3B8'; ctx.fillText(`${v} votos • ${total} totais`, 60, 1370)
    ctx.fillStyle = '#FACC15'; ctx.fillRect(60,1500,960,120); ctx.fillStyle='#0F172A'; ctx.font='900 42px sans-serif'; ctx.fillText('VOTE TAMBÉM →', 320, 1575)
    ctx.fillStyle='#64748B'; ctx.font='28px sans-serif'; ctx.fillText(SITE_URL.replace('https://',''), 60, 1680)
    const link = document.createElement('a'); link.download=`story-${id}-${pct}.png`; link.href=canvas.toDataURL(); link.click()
    setToast('Story baixado! Posta no Instagram 📸'); setTimeout(()=>setToast(null),3000)
  }

  const handleShare = (c: any) => { const total = Object.values(votos).reduce((a,b)=>a+b,0); const pct = total?((votos[c.id]||0)/total*100).toFixed(1):"0"; const texto=`🗳️ Acabei de votar no ${c.nome} (${c.partido}) na Plataforma Eleitoral 2026! Ele está com ${pct}% dos votos (${total} totais). Vota você também: ${SITE_URL}`; window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`,'_blank') }

  const total = Object.values(votos).reduce((a,b)=>a+b,0)
  const filtrados = useMemo(()=>candidatosData.filter(c=>{const okB=c.nome.toLowerCase().includes(busca.toLowerCase())||c.partido.toLowerCase().includes(busca.toLowerCase()); const okF=filtro==="TODOS"||c.partido===filtro; return okB&&okF}),[busca,filtro])
  const ranking = useMemo(()=>[...candidatosData].sort((a,b)=>(votos[b.id]||0)-(votos[a.id]||0)),[votos])
  const partidos = ["TODOS",...Array.from(new Set(candidatosData.map(c=>c.partido)))]

  const pizzaData = ranking.slice(0,5).map((c,i)=>({c, v:votos[c.id]||0, pct: total?((votos[c.id]||0)/total*100):0}))

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans relative overflow-x-hidden">
      {confete && <div className="fixed inset-0 pointer-events-none z-[100] text-4xl animate-pulse flex flex-wrap justify-center items-start pt-20">{"🎉🎊🗳️✨🇧🇷🎉".repeat(50).split('').map((e,i)=><span key={i} className="animate-bounce" style={{animationDelay:`${i*0.05}s`}}>{e}</span>)}</div>}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold">26</div><div><h1 className="font-black leading-none">PLATAFORMA 2026 • V5 VIRAL</h1><p className="text-[10px] tracking-widest text-slate-500 font-bold">PIZZA • STORIES • CONFETE • /ADMIN</p></div></div>
          <div className="flex items-center gap-2"><a href="/admin" className="hidden md:flex bg-slate-900 text-white px-3 py-2 rounded-full text-xs font-bold">ADMIN V5</a><div className="relative"><Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400"/><input value={busca} onChange={e=>setBusca(e.target.value)} placeholder="Buscar" className="pl-10 pr-4 py-2 rounded-full bg-slate-100 text-sm w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-slate-900"/></div></div>
        </div>
      </header>

      {meuVoto && <div className="max-w-7xl mx-auto px-6 mt-4"><div className="bg-gradient-to-r from-emerald-50 to-yellow-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-3"><CheckCircle className="w-6 h-6 text-emerald-600"/><div className="flex-1"><p className="text-sm font-bold">Você votou no {candidatosData.find(c=>c.id===meuVoto)?.nome}! ✅</p><p className="text-xs text-slate-600">Gera seu story e compartilha pra viralizar!</p></div><button onClick={()=>setShowStory(meuVoto)} className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1"><Camera className="w-4 h-4"/> Gerar Story</button></div></div>}

      <div className="max-w-7xl mx-auto px-6 mt-6 grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white rounded-[24px] p-6 shadow-sm border">
          <h2 className="font-bold flex items-center gap-2 mb-4"><Trophy className="w-5 h-5"/> Ranking ao vivo • {total} votos</h2>
          <div className="grid grid-cols-2 gap-3">{ranking.slice(0,4).map((c,i)=>{const v=votos[c.id]||0; const pct=total?(v/total*100).toFixed(1):"0"; return <div key={c.id} className={`rounded-2xl p-4 ${i===0?'bg-slate-900 text-white':'bg-slate-50 border'}`}><div className="flex items-center gap-2"><span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i===0?'bg-white text-slate-900':'bg-slate-900 text-white'}`}>{i+1}</span><Avatar id={c.id} nome={c.nome} cor={c.cor} size={28}/><span className="font-bold text-sm truncate">{c.nome.split(' ')[0]}</span></div><div className="h-2 bg-black/20 rounded-full overflow-hidden mt-2"><div className="h-full bg-yellow-400 transition-all duration-700" style={{width:`${pct}%`}}/></div><div className="flex justify-between mt-1 text-xs"><span>{v} votos</span><span className="font-bold">{pct}%</span></div></div>})}</div>
        </div>
        <div className="bg-white rounded-[24px] p-6 shadow-sm border">
          <h2 className="font-bold flex items-center gap-2 mb-4"><PieChart className="w-5 h-5"/> Pizza dos votos</h2>
          <div className="flex items-center justify-center">
            <div className="relative w-48 h-48 rounded-full" style={{background:`conic-gradient(${pizzaData.map((d,i)=>{const start=pizzaData.slice(0,i).reduce((a,b)=>a+b.pct,0); const end=start+d.pct; return `${d.c.cor} ${start}% ${end}%`}).join(',')})`}}>
              <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col"><span className="text-3xl font-black">{total}</span><span className="text-[10px] text-slate-500 font-bold tracking-widest">VOTOS TOTAIS</span></div>
            </div>
          </div>
          <div className="mt-4 space-y-2">{pizzaData.map(d=><div key={d.c.id} className="flex items-center gap-2 text-xs"><span className="w-3 h-3 rounded-full" style={{background:d.c.cor}}/><span className="flex-1 truncate">{d.c.nome.split(' ')[0]}</span><span className="font-bold">{d.pct.toFixed(1)}%</span></div>)}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-4 flex gap-2 overflow-x-auto">{partidos.map(p=><button key={p} onClick={()=>setFiltro(p)} className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap ${filtro===p?'bg-slate-900 text-white':'bg-white border'}`}>{p}</button>)}</div>

      <div className="max-w-7xl mx-auto px-6 mt-6 grid md:grid-cols-3 lg:grid-cols-4 gap-4 pb-32">
        {filtrados.map(c=>{const v=votos[c.id]||0; const pct=total?(v/total*100).toFixed(1):"0"; const meu=c.id===meuVoto; return <div key={c.id} className={`bg-white rounded-[20px] border-2 p-4 relative overflow-hidden transition-all ${meu?'border-emerald-500 shadow-lg':''}`}><div className="flex gap-3"><Avatar id={c.id} nome={c.nome} cor={c.cor} size={56}/><div><h3 className="font-bold text-sm leading-tight">{c.nome}</h3><p className="text-xs text-slate-500">{c.numero} • {c.partido} • {pct}%</p></div></div><div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-3"><div className="h-full transition-all duration-700" style={{width:`${pct}%`, background:c.cor}}/></div><div className="grid grid-cols-3 gap-1 mt-3"><button onClick={()=>handleVotar(c.id)} disabled={!!meuVoto} className={`col-span-2 py-2.5 rounded-full text-xs font-bold flex items-center justify-center gap-1 ${meuVoto?'bg-slate-100 text-slate-400':'bg-slate-900 text-white hover:bg-black'}`}><Award className="w-4 h-4"/>{meu?'Votado':`VOTAR`}</button><button onClick={()=>handleShare(c)} className="py-2.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 flex justify-center"><Share2 className="w-4 h-4"/></button></div><button onClick={()=>setShowStory(c.id)} className="w-full mt-2 py-2 rounded-full bg-gradient-to-r from-pink-500 to-yellow-500 text-white text-xs font-bold flex items-center justify-center gap-1"><Camera className="w-4 h-4"/> Gerar Story</button></div>})}
      </div>

      {showStory && <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-6"><div className="bg-white rounded-[24px] p-6 max-w-sm w-full"><h3 className="font-black text-lg mb-2">Seu Story tá pronto! 📸</h3><p className="text-sm text-slate-500 mb-4">Baixa e posta no Instagram. Vai viralizar!</p><canvas ref={canvasRef} className="w-full rounded-xl border mb-4 bg-slate-900"/><div className="grid grid-cols-2 gap-2"><button onClick={()=>gerarStory(showStory)} className="bg-slate-900 text-white py-3 rounded-full font-bold flex items-center justify-center gap-2"><Download className="w-4 h-4"/> Baixar 1080x1920</button><button onClick={()=>setShowStory(null)} className="bg-slate-100 py-3 rounded-full font-bold">Fechar</button></div></div></div>}

      {selecionados.length>0 && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white rounded-full px-6 py-3 flex items-center gap-4 shadow-2xl z-50"><span className="text-sm font-bold">{selecionados.length} sel.</span><button onClick={()=>setShowCompare(true)} disabled={selecionados.length!==2} className="bg-white text-slate-900 px-4 py-1.5 rounded-full text-xs font-bold disabled:opacity-50 flex items-center gap-1"><Scale className="w-4 h-4"/> Comparar</button><button onClick={()=>setSelecionados([])}><X className="w-4 h-4"/></button></div>}

      {showCompare && <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"><div className="bg-white rounded-[24px] max-w-4xl w-full max-h-[90vh] overflow-auto p-6"><div className="flex justify-between mb-6"><h2 className="font-black text-xl flex items-center gap-2"><Scale/> Comparativo</h2><button onClick={()=>setShowCompare(false)}><X/></button></div><div className="grid grid-cols-2 gap-6">{selecionados.map(id=>{const c=candidatosData.find(x=>x.id===id)!; const v=votos[c.id]||0; return <div key={id} className="border rounded-2xl p-4 text-center"><div className="flex justify-center"><Avatar id={c.id} nome={c.nome} cor={c.cor} size={80}/></div><h3 className="font-bold mt-2">{c.nome}</h3><p className="text-xs text-slate-500">{c.partido} • {v} votos</p><div className="mt-4 space-y-2 text-left">{c.propostas.map((p,i)=><div key={i} className="bg-slate-50 p-2 rounded-xl text-xs">• {p}</div>)}</div></div>})}</div></div></div>}

      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-sm font-bold shadow-2xl z-50 max-w-[90%] text-center">{toast}</div>}
      <canvas ref={canvasRef} style={{display:'none'}}/>
    </div>
  )
}
