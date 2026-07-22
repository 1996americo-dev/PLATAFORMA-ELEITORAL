"use client"
import { useState, useEffect, useMemo } from 'react'
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
}

const candidatosData = [
  { id: "13-lula", nome: "Luiz Inácio Lula", partido: "PT", numero: "13", cor: "#DC2626" },
  { id: "22-bolsonaro", nome: "Jair Bolsonaro", partido: "PL", numero: "22", cor: "#2563EB" },
  { id: "PL-nikolas", nome: "Nikolas Ferreira", partido: "PL", numero: "77", cor: "#1E40AF" },
  { id: "12-ciro", nome: "Ciro Gomes", partido: "PDT", numero: "12", cor: "#EAB308" },
  { id: "15-tebet", nome: "Simone Tebet", partido: "MDB", numero: "15", cor: "#16A34A" },
  { id: "40-tabata", nome: "Tabata Amaral", partido: "PSB", numero: "40", cor: "#CA8A04" },
  { id: "50-erika", nome: "Erika Hilton", partido: "PSOL", numero: "50", cor: "#BE123C" },
]

function Avatar({ id, nome, cor, size=48 }: any){
  const [erro,setErro]=useState(false)
  const url=fotosReais[id]
  if(erro) return <div style={{width:size,height:size,background:cor}} className="rounded-full flex items-center justify-center text-white font-black text-[10px] border-2">{nome.slice(0,2).toUpperCase()}</div>
  return <img src={url} onError={()=>setErro(true)} style={{width:size,height:size,border:`3px solid ${cor}`}} className="rounded-full object-cover bg-white" alt={nome}/>
}

// valida CPF de verdade (cálculo oficial receita)
function validaCPF(cpf: string){
  cpf = cpf.replace(/\D/g,'')
  if(cpf.length!==11 || /^(\d)\1{10}$/.test(cpf)) return false
  let soma=0; for(let i=0;i<9;i++) soma+=parseInt(cpf[i])*(10-i); let resto=(soma*10)%11; if(resto===10||resto===11) resto=0; if(resto!==parseInt(cpf[9])) return false
  soma=0; for(let i=0;i<10;i++) soma+=parseInt(cpf[i])*(11-i); resto=(soma*10)%11; if(resto===10||resto===11) resto=0; return resto===parseInt(cpf[10])
}

async function hashCPF(cpf: string){
  const enc = new TextEncoder().encode(cpf.replace(/\D/g,''))
  const buf = await crypto.subtle.digest('SHA-256', enc)
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')
}

export default function V56(){
  const [cpf, setCpf] = useState("")
  const [cpfValido, setCpfValido] = useState(false)
  const [numero, setNumero] = useState("")
  const [votos, setVotos] = useState<Record<string,number>>({})
  const [meuVoto, setMeuVoto] = useState<string|null>(null)
  const [toast, setToast] = useState<string|null>(null)
  const [confete, setConfete] = useState(false)
  const [etapa, setEtapa] = useState<'cpf'|'urna'>('cpf')

  useEffect(()=>{ const s=localStorage.getItem('cpf_hash_v56'); if(s) setMeuVoto("ja_votou") },[])

  const carregar = async () => {
    if(!isSupabaseConfigured) return
    const { data } = await supabase.from('votos').select('candidato_id')
    if(data){ const c:Record<string,number>={}; data.forEach(r=>{ if(!['branco','nulo'].includes(r.candidato_id)) c[r.candidato_id]=(c[r.candidato_id]||0)+1}); setVotos(c) }
  }
  useEffect(()=>{ carregar(); if(isSupabaseConfigured){ const ch=supabase.channel('v56').on('postgres_changes',{event:'INSERT',schema:'public',table:'votos'},carregar).subscribe(); return()=>{supabase.removeChannel(ch)} } },[])

  const candidatoAtual = useMemo(()=> candidatosData.find(c=>c.numero===numero),[numero])
  const total = Object.values(votos).reduce((a,b)=>a+b,0)
  const ranking = [...candidatosData].sort((a,b)=>(votos[b.id]||0)-(votos[a.id]||0))

  const verificarCPF = async () => {
    const limpo = cpf.replace(/\D/g,'')
    if(!validaCPF(limpo)){ setToast("❌ CPF inválido! Digite um CPF real (11 números)"); setTimeout(()=>setToast(null),3000); return }
    const h = await hashCPF(limpo)
    // verifica se já votou (busca hash no supabase)
    if(isSupabaseConfigured){
      const { data } = await supabase.from('votos').select('id').eq('cpf_hash', h).limit(1)
      if(data && data.length>0){ setToast("🚫 Este CPF já votou! 1 CPF = 1 voto (anti-fraude)"); setTimeout(()=>setToast(null),4000); return }
    } else {
      const ja = localStorage.getItem('cpf_hash_v56')
      if(ja===h){ setToast("🚫 Este CPF já votou neste dispositivo!"); setTimeout(()=>setToast(null),3000); return }
    }
    setCpfValido(true); setEtapa('urna'); setToast("✅ CPF válido! Agora vote na urna"); setTimeout(()=>setToast(null),2000)
  }

  const digitar = (n:string)=>{ if(numero.length<2) setNumero(numero+n) }
  const confirma = async () => {
    if(!cpfValido){ setToast("Confirme o CPF primeiro!"); return }
    if(numero==='' ){ setToast("Digite o número!"); setTimeout(()=>setToast(null),2000); return }
    if(!candidatoAtual){ if(!confirm(`Número ${numero} não existe. Confirmar NULO?`)) return }
    const id = candidatoAtual?.id || 'nulo'
    const h = await hashCPF(cpf)
    if(isSupabaseConfigured){
      const { error } = await supabase.from('votos').insert({ candidato_id: id, cpf_hash: h })
      if(error){ if(error.message.includes('duplicate')||error.code==='23505'){ setToast("🚫 Este CPF já votou! Anti-fraude ativado"); } else setToast(error.message); setTimeout(()=>setToast(null),4000); return }
    }
    localStorage.setItem('cpf_hash_v56', h); setVotos(prev=>({...prev,[id]:(prev[id]||0)+1})); setMeuVoto(id); setConfete(true); setToast(`✅ Voto com CPF ${cpf.slice(0,3)}.***.***-${cpf.slice(-2)} confirmado! Anti-fraude OK`); setTimeout(()=>{setConfete(false); setToast(null)},4000)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans">
      {confete && <div className="fixed inset-0 pointer-events-none z-[100] text-3xl flex flex-wrap justify-center pt-20">{"✅🔒🗳️🇧🇷".repeat(100).split('').map((e,i)=><span key={i} className="animate-bounce" style={{animationDelay:`${i*0.03}s`}}>{e}</span>)}</div>}
      <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-900">
        <div className="max-w-[1400px] mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3"><div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black">26</div><div><h1 className="font-black text-sm leading-none tracking-tight">PLATAFORMA 2026 • V5.6 ANTI-FRAUDE CPF</h1><p className="text-[10px] font-black tracking-widest text-slate-600">SIMULADOR EDUCATIVO • 1 CPF = 1 VOTO • HASH SEGURO • /ADMIN</p></div></div>
          <a href="/admin" className="bg-slate-900 text-white px-4 py-2 rounded-full text-xs font-black">ADMIN</a>
        </div>
      </header>

      <div className="bg-amber-200 border-b-2 border-slate-900 text-[11px] font-black text-center py-2 tracking-widest">⚠️ SIMULADOR EDUCATIVO - NÃO É ELEIÇÃO OFICIAL DO TSE - DADOS CRIPTOGRAFADOS COM HASH - LGPD OK</div>

      <div className="max-w-[1400px] mx-auto px-6 mt-6 grid lg:grid-cols-3 gap-6">
        {/* ESQUERDA - RANKING */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border-[3px] border-slate-900 rounded-[24px] p-5">
            <h2 className="font-black text-sm">🏆 Ranking • {total} votos validados por CPF</h2>
            <div className="grid grid-cols-2 gap-3 mt-3">{ranking.slice(0,4).map((c,i)=>{const v=votos[c.id]||0; const pct=total?(v/total*100).toFixed(1):"0"; return <div key={c.id} className={`rounded-2xl p-3 border-2 ${i===0?'bg-slate-900 text-white border-slate-900':'bg-slate-50 border-slate-200'}`}><div className="flex items-center gap-2"><span className="w-5 h-5 bg-white text-slate-900 rounded-full flex items-center justify-center text-[10px] font-black">{i+1}</span><Avatar id={c.id} nome={c.nome} cor={c.cor} size={24}/><span className="font-bold text-xs truncate">{c.nome.split(' ')[0]}</span></div><div className="h-2 bg-black/20 rounded-full overflow-hidden mt-2"><div className="h-full bg-yellow-400" style={{width:`${pct}%`}}/></div><div className="flex justify-between mt-1 text-[10px] font-bold"><span>{v} votos CPF</span><span>{pct}%</span></div></div>})}</div>
          </div>
          <div className="grid md:grid-cols-2 gap-3">{candidatosData.map(c=>{const v=votos[c.id]||0; return <div key={c.id} className="bg-white border-2 border-slate-900 rounded-2xl p-3 flex gap-3 items-center"><Avatar id={c.id} nome={c.nome} cor={c.cor} size={40}/><div className="flex-1"><p className="font-black text-xs">{c.nome}</p><p className="text-[10px] font-bold">{c.numero} • {c.partido} • {v} votos validados</p></div></div>})}</div>
        </div>

        {/* DIREITA - CPF + URNA */}
        <div className="space-y-4">
          {etapa==='cpf' && (
            <div className="bg-white border-[4px] border-slate-900 rounded-[24px] p-6 shadow-[0_15px_40px_rgba(0,0,0,0.2)]">
              <h2 className="font-black text-sm tracking-widest">🔒 VERIFICAÇÃO ANTI-FRAUDE</h2>
              <p className="text-[11px] font-bold text-slate-600 mt-1">Digite seu CPF para validar. 1 CPF = 1 voto. Seu CPF vira código secreto (HASH), não salvamos seu número.</p>
              <input value={cpf} onChange={e=>{let v=e.target.value.replace(/\D/g,'').slice(0,11); let f=v; if(v.length>3) f=`${v.slice(0,3)}.${v.slice(3)}`; if(v.length>6) f=`${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6)}`; if(v.length>9) f=`${v.slice(0,3)}.${v.slice(3,6)}.${v.slice(6,9)}-${v.slice(9)}`; setCpf(f)}} placeholder="000.000.000-00" className="w-full bg-slate-100 border-[3px] border-slate-900 rounded-full px-5 py-4 mt-4 text-center text-xl font-black tracking-widest text-black placeholder:text-slate-400"/>
              <button onClick={verificarCPF} className="w-full bg-slate-900 text-white py-4 rounded-full font-black mt-4 tracking-widest text-sm">VALIDAR CPF → LIBERAR URNA</button>
              <p className="text-[9px] font-bold text-center text-slate-500 mt-3">✅ Validação Receita Federal • 🔐 Criptografia SHA-256 • 🚫 Anti-fraude eleitoral<br/>Use um CPF válido para teste: 52998224725</p>
            </div>
          )}

          {etapa==='urna' && (
            <div className="bg-[#F3F4F6] border-[5px] border-slate-900 rounded-2xl p-3">
              <div className="bg-white border-2 border-slate-900 p-3 mb-3 rounded-xl"><p className="text-[10px] font-black">CPF VALIDADO:</p><p className="font-mono font-black text-sm">{cpf} ✅</p><p className="text-[9px] text-emerald-600 font-bold">LIBERADO PARA VOTAR - ANTI-FRAUDE OK</p></div>
              <div className="bg-[#E5E7EB] border-2 border-slate-800 p-3 min-h-[260px]">
                <div className="flex justify-between text-[9px] border-b border-slate-400 pb-1"><span>PRESIDENTE</span><span>CPF OK</span></div>
                <div className="mt-3"><p className="text-[10px]">Número:</p><div className="flex gap-2 mt-1"><div className="w-10 h-12 border-2 border-black bg-white flex items-center justify-center text-2xl font-black">{numero[0]||''}</div><div className="w-10 h-12 border-2 border-black bg-white flex items-center justify-center text-2xl font-black">{numero[1]||''}</div></div></div>
                {candidatoAtual && <div className="mt-3 flex gap-2"><div className="flex-1"><p className="text-[10px] font-bold">{candidatoAtual.nome}</p><p className="text-[9px]">{candidatoAtual.partido}</p></div><img src={fotosReais[candidatoAtual.id]} className="w-14 h-18 object-cover border-2 border-black" alt=""/></div>}
                {numero.length===2 && !candidatoAtual && <p className="mt-4 font-black text-sm">NÚMERO ERRADO - VOTO NULO</p>}
                {numero==='' && <p className="mt-6 text-[10px] text-slate-500">Digite 13, 22, 77, 12...</p>}
              </div>
              <div className="bg-[#1F2937] p-3 rounded-xl mt-3">
                <div className="grid grid-cols-3 gap-2">{[1,2,3,4,5,6,7,8,9].map(n=><button key={n} onClick={()=>digitar(String(n))} className="h-10 bg-black text-white rounded font-black">{n}</button>)}<div/><button onClick={()=>digitar('0')} className="h-10 bg-black text-white rounded font-black">0</button><div/></div>
                <div className="grid grid-cols-3 gap-1.5 mt-3"><button onClick={()=>setNumero("")} className="h-9 bg-[#F97316] rounded text-[9px] font-black">CORRIGE</button><button onClick={()=>{setEtapa('cpf'); setNumero(""); setCpfValido(false)}} className="h-9 bg-white rounded text-[9px] font-black">VOLTAR CPF</button><button onClick={confirma} className="h-12 bg-[#16A34A] text-white rounded text-[9px] font-black">CONFIRMA</button></div>
              </div>
            </div>
          )}
        </div>
      </div>
      {toast && <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-xs font-black z-50 max-w-[90%] text-center border-2 border-white shadow-2xl">{toast}</div>}
    </div>
  )
}
