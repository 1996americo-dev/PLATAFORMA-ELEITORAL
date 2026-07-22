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
  "45-doria": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/doria.jpg`,
  "45-leite": `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/leite.jpg`,
}

const candidatos = [
  { id: "13-lula", numero: "13", nome: "LUIZ INÁCIO LULA DA SILVA", partido: "PT", vice: "Geraldo Alckmin", cor: "#DC2626", bio: "Presidente do Brasil" },
  { id: "22-bolsonaro", numero: "22", nome: "JAIR MESSIAS BOLSONARO", partido: "PL", vice: "Braga Netto", cor: "#2563EB", bio: "Ex-Presidente" },
  { id: "12-ciro", numero: "12", nome: "CIRO FERREIRA GOMES", partido: "PDT", vice: "Ana Paula Matos", cor: "#EAB308", bio: "Ex-Governador CE" },
  { id: "15-tebet", numero: "15", nome: "SIMONE NASSAR TEBET", partido: "MDB", vice: "Mara Gabrilli", cor: "#16A34A", bio: "Ministra Planejamento" },
  { id: "40-tabata", numero: "40", nome: "TABATA AMARAL", partido: "PSB", vice: "A definir", cor: "#CA8A04", bio: "Deputada Federal" },
  { id: "50-erika", numero: "50", nome: "ERIKA HILTON", partido: "PSOL", vice: "A definir", cor: "#BE123C", bio: "Deputada Federal" },
  { id: "45-leite", numero: "45", nome: "EDUARDO LEITE", partido: "PSDB", vice: "A definir", cor: "#2563EB", bio: "Governador RS" },
  { id: "PL-nikolas", numero: "77", nome: "NIKOLAS FERREIRA", partido: "PL", vice: "A definir", cor: "#1E40AF", bio: "Deputado Federal" },
]

function AvatarUrna({ id, nome, size=120 }: {id:string, nome:string, size?:number}) {
  const [erro, setErro] = useState(false)
  const url = fotosReais[id]
  if (erro) return <div style={{width:size, height:size*1.25}} className="bg-slate-200 border-2 border-slate-400 flex items-center justify-center font-black text-slate-600 text-2xl">FOTO</div>
  return <img src={url} onError={()=>setErro(true)} style={{width:size, height:size*1.25}} className="object-cover border-2 border-slate-800 bg-white" alt={nome}/>
}

export default function UrnaV6() {
  const [numeroDigitado, setNumeroDigitado] = useState("")
  const [votos, setVotos] = useState<Record<string, number>>({})
  const [votoBrancoCount, setVotoBrancoCount] = useState(0)
  const [votoNuloCount, setVotoNuloCount] = useState(0)
  const [meuVoto, setMeuVoto] = useState<string|null>(null)
  const [tela, setTela] = useState<'votando'|'fim'|'resultado'>('votando')
  const [comprovante, setComprovante] = useState<any>(null)

  useEffect(()=>{ const s=localStorage.getItem('meu_voto_v6'); if(s) setMeuVoto(s) },[])

  const carregar = async () => {
    if(!isSupabaseConfigured) return
    const { data } = await supabase.from('votos').select('candidato_id')
    if(data){ const c:Record<string,number>={}; let b=0, n=0; data.forEach(r=>{ if(r.candidato_id==='branco') b++; else if(r.candidato_id==='nulo') n++; else c[r.candidato_id]=(c[r.candidato_id]||0)+1}); setVotos(c); setVotoBrancoCount(b); setVotoNuloCount(n) }
  }
  useEffect(()=>{ carregar(); if(isSupabaseConfigured){ const ch=supabase.channel('v6').on('postgres_changes',{event:'INSERT',schema:'public',table:'votos'},carregar).subscribe(); return()=>{supabase.removeChannel(ch)} } },[])

  const candidatoAtual = useMemo(()=> candidatos.find(c=>c.numero===numeroDigitado), [numeroDigitado])

  const digitar = (n:string) => { if(numeroDigitado.length<2){ const novo=numeroDigitado+n; setNumeroDigitado(novo); const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA=='); audio.volume=0.2; audio.play().catch(()=>{}) } }
  const corrige = () => setNumeroDigitado("")
  const branco = async () => { if(meuVoto){ alert(`Você já votou!`); return } ; if(!confirm('Confirma voto em BRANCO?')) return; await votar('branco') }
  const confirma = async () => {
    if(meuVoto){ alert('Você já votou nesta urna!'); return }
    if(numeroDigitado==='' ){ alert('Digite o número ou aperte BRANCO'); return }
    if(!candidatoAtual && numeroDigitado.length===2){ if(!confirm(`Número ${numeroDigitado} não existe. Confirma voto NULO?`)) return; await votar('nulo'); return }
    if(!candidatoAtual) return
    await votar(candidatoAtual.id)
  }

  const votar = async (id:string) => {
    if(isSupabaseConfigured){ const {error}=await supabase.from('votos').insert({candidato_id:id}); if(error){alert(error.message); return} }
    setVotos(prev=> id==='branco'||id==='nulo' ? prev : {...prev, [id]:(prev[id]||0)+1})
    if(id==='branco') setVotoBrancoCount(v=>v+1)
    if(id==='nulo') setVotoNuloCount(v=>v+1)
    localStorage.setItem('meu_voto_v6', id)
    setMeuVoto(id)
    const cand = candidatos.find(c=>c.id===id)
    setComprovante({ id, nome: cand?.nome || id.toUpperCase(), numero: cand?.numero || id, hora: new Date().toLocaleTimeString('pt-BR'), data: new Date().toLocaleDateString('pt-BR') })
    setTela('fim')
    setNumeroDigitado("")
    // som urna
    try{ const ctx = new (window.AudioContext||(window as any).webkitAudioContext)(); const osc = ctx.createOscillator(); osc.frequency.value=800; osc.connect(ctx.destination); osc.start(); setTimeout(()=>osc.stop(), 300)}catch{}
    setTimeout(()=>setTela('resultado'), 2500)
  }

  const totalValidos = Object.values(votos).reduce((a,b)=>a+b,0)
  const totalGeral = totalValidos + votoBrancoCount + votoNuloCount
  const ranking = [...candidatos].sort((a,b)=>(votos[b.id]||0)-(votos[a.id]||0))

  if(tela==='fim'){
    return (
      <div className="min-h-screen bg-[#E5E7EB] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-[120px] font-black tracking-[0.2em] animate-pulse">FIM</h1>
          <p className="text-slate-600 font-mono mt-4">VOTO COMPUTADO COM SUCESSO</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#D1D5DB] text-black font-mono">
      {/* header TSE */}
      <div className="bg-[#1F2937] text-white px-6 py-3 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white text-slate-900 rounded flex items-center justify-center font-black">JE</div>
          <div><h1 className="font-bold text-sm tracking-widest">JUSTIÇA ELEITORAL • URNA ELETRÔNICA 2026 • V6</h1><p className="text-[10px] opacity-70">SIMULADOR OFICIAL • VOTO SECRETO • ANTI-FRAUDE</p></div>
        </div>
        <div className="flex gap-2 text-[10px]"><a href="/admin" className="bg-white/20 px-3 py-1 rounded">ADMIN</a><span className="bg-emerald-500 px-3 py-1 rounded-full animate-pulse">● AO VIVO {totalGeral} VOTOS</span></div>
      </div>

      <div className="max-w-6xl mx-auto p-4 md:p-8 grid lg:grid-cols-3 gap-6">
        {/* URNA */}
        <div className="lg:col-span-2 bg-[#F3F4F6] border-[6px] border-slate-800 rounded-2xl p-4 shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          <div className="grid md:grid-cols-5 gap-4">
            {/* tela */}
            <div className="md:col-span-3 bg-[#E5E7EB] border-2 border-slate-800 p-4 min-h-[420px] flex flex-col">
              {tela==='votando' && (
                <>
                  <div className="flex justify-between text-[10px] border-b border-slate-400 pb-2 mb-3"><span>PRESIDENTE</span><span>{new Date().toLocaleDateString('pt-BR')}</span></div>
                  {meuVoto ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center">
                      <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center text-2xl mb-4">✓</div>
                      <h2 className="font-black text-xl">VOCÊ JÁ VOTOU</h2>
                      <p className="text-sm mt-2 text-slate-600">Seu voto: {candidatos.find(c=>c.id===meuVoto)?.nome || meuVoto.toUpperCase()}</p>
                      <p className="text-xs mt-4 bg-white border p-3 rounded">Para votar de novo, vá em /admin e clique em Resetar meu celular</p>
                      <button onClick={()=>setTela('resultado')} className="mt-6 bg-slate-800 text-white px-6 py-2 rounded text-sm">VER APURAÇÃO</button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <p className="text-xs">Seu voto para</p>
                          <h2 className="font-black text-xl mt-2 tracking-widest">PRESIDENTE</h2>
                          <div className="mt-6">
                            <p className="text-xs">Número:</p>
                            <div className="flex gap-2 mt-2">
                              <div className="w-12 h-14 border-2 border-black bg-white flex items-center justify-center text-3xl font-black">{numeroDigitado[0]||''}</div>
                              <div className="w-12 h-14 border-2 border-black bg-white flex items-center justify-center text-3xl font-black">{numeroDigitado[1]||''}</div>
                            </div>
                          </div>
                          {numeroDigitado.length===2 && !candidatoAtual && (
                            <div className="mt-6"><p className="font-black text-xl animate-pulse">NÚMERO ERRADO</p><p className="text-xs mt-2">VOTO NULO</p></div>
                          )}
                          {candidatoAtual && (
                            <div className="mt-6">
                              <p className="text-xs">Nome:</p><p className="font-bold text-sm">{candidatoAtual.nome}</p>
                              <p className="text-xs mt-2">Partido:</p><p className="text-sm">{candidatoAtual.partido} - {candidatoAtual.vice}</p>
                              <p className="text-xs mt-2">Vice:</p><p className="text-sm">{candidatoAtual.vice}</p>
                            </div>
                          )}
                          {numeroDigitado==='' && <p className="mt-10 text-xs text-slate-500">Digite o número do candidato.<br/>Ex: 13 para Lula, 22 para Bolsonaro</p>}
                        </div>
                        <div className="w-[130px]">
                          {candidatoAtual && <AvatarUrna id={candidatoAtual.id} nome={candidatoAtual.nome} size={110}/>}
                          {numeroDigitado.length===2 && !candidatoAtual && <div className="w-[110px] h-[140px] bg-white border-2 border-black flex items-center justify-center text-xs text-center p-2">NÚMERO NÃO ENCONTRADO</div>}
                        </div>
                      </div>
                      <div className="mt-auto border-t-2 border-black pt-2 text-[10px] leading-tight">
                        Aperte a tecla:<br/>
                        CONFIRMA para CONFIRMAR este voto<br/>
                        CORRIGE para REINICIAR este voto
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* teclado */}
            <div className="md:col-span-2 bg-[#1F2937] p-4 rounded-xl">
              <div className="grid grid-cols-3 gap-3">
                {[1,2,3,4,5,6,7,8,9].map(n=><button key={n} onClick={()=>digitar(String(n))} disabled={!!meuVoto} className="h-14 bg-black text-white rounded-lg text-2xl font-bold shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1 disabled:opacity-30">{n}</button>)}
                <div/><button onClick={()=>digitar('0')} disabled={!!meuVoto} className="h-14 bg-black text-white rounded-lg text-2xl font-bold shadow-[0_4px_0_#000] active:shadow-none active:translate-y-1 disabled:opacity-30">0</button><div/>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-6">
                <button onClick={branco} disabled={!!meuVoto} className="h-12 bg-white text-black rounded text-[11px] font-bold leading-tight disabled:opacity-30">BRANCO</button>
                <button onClick={corrige} className="h-12 bg-[#F97316] text-black rounded text-[11px] font-bold">CORRIGE</button>
                <button onClick={confirma} disabled={!!meuVoto} className="h-16 bg-[#16A34A] text-white rounded text-[11px] font-bold shadow-[0_6px_0_#14532D] active:shadow-none active:translate-y-1 disabled:opacity-30">CONFIRMA</button>
              </div>
              <p className="text-[9px] text-white/50 mt-4 text-center">© Tribunal Superior Eleitoral<br/>Urna modelo UE2026</p>
            </div>
          </div>
        </div>

        {/* apuração lateral */}
        <div className="space-y-4">
          <div className="bg-white border-2 border-slate-800 rounded-xl p-4">
            <h3 className="font-black text-sm border-b-2 border-black pb-2">APURAÇÃO AO VIVO - {totalGeral} VOTOS</h3>
            <div className="mt-3 space-y-2 max-h-[300px] overflow-auto">
              {ranking.map((c,i)=>{
                const v = votos[c.id]||0
                const pct = totalValidos ? (v/totalValidos*100).toFixed(2) : "0.00"
                return (
                  <div key={c.id} className="flex items-center gap-2 text-xs border-b border-slate-100 pb-2">
                    <span className="font-black w-4">{i+1}º</span>
                    <span className="flex-1 truncate font-bold">{c.numero} - {c.nome.split(' ').slice(0,2).join(' ')}</span>
                    <span className="font-mono">{v}</span>
                    <span className="font-black w-12 text-right">{pct}%</span>
                  </div>
                )
              })}
            </div>
            <div className="mt-3 pt-3 border-t-2 border-black text-xs space-y-1">
              <div className="flex justify-between"><span>VÁLIDOS:</span><span className="font-bold">{totalValidos}</span></div>
              <div className="flex justify-between"><span>BRANCOS:</span><span className="font-bold">{votoBrancoCount}</span></div>
              <div className="flex justify-between"><span>NULOS:</span><span className="font-bold">{votoNuloCount}</span></div>
              <div className="flex justify-between font-black text-sm border-t pt-1 mt-1"><span>TOTAL:</span><span>{totalGeral}</span></div>
            </div>
          </div>

          {comprovante && (
            <div className="bg-yellow-50 border-2 border-dashed border-slate-800 p-4 font-mono text-[11px]">
              <p className="font-black text-center border-b border-black pb-1">COMPROVANTE DE VOTAÇÃO</p>
              <p className="mt-2">DATA: {comprovante.data}</p>
              <p>HORA: {comprovante.hora}</p>
              <p>VOTO: {comprovante.nome}</p>
              <p>NÚMERO: {comprovante.numero}</p>
              <p className="mt-2 text-[9px]">Este comprovante não contém o seu voto, apenas que você votou.</p>
              <p className="text-center mt-2 font-black">JUSTIÇA ELEITORAL</p>
            </div>
          )}

          <div className="bg-slate-900 text-white rounded-xl p-4 text-[10px] leading-relaxed">
            <p className="font-black mb-2">COMO VOTAR (igual urna real):</p>
            1. Digite 2 números<br/>
            13 = Lula<br/>
            22 = Bolsonaro<br/>
            12 = Ciro<br/>
            15 = Tebet<br/>
            77 = Nikolas<br/>
            2. Aperte CONFIRMA (verde)<br/>
            BRANCO = voto em branco<br/>
            Número errado = voto nulo
          </div>
        </div>
      </div>
    </div>
  )
}
