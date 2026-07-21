'use client'
import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

function ConteudoVotacao() {
  const params = useSearchParams()
  const cargoFiltro = params.get('cargo')
  const [candidatos, setCandidatos] = useState<any[]>([])
  const [voto, setVoto] = useState<string>('')
  const [confirmado, setConfirmado] = useState(false)
  const [candidatoVotado, setCandidatoVotado] = useState<any>(null)
  const [ranking, setRanking] = useState<any[]>([])
  const [mostrarRanking, setMostrarRanking] = useState(false)

  useEffect(() => { carregar() }, [cargoFiltro])

  async function carregar() {
    let q = supabase.from('candidatos').select('*')
    if(cargoFiltro) q = q.eq('cargo', cargoFiltro)
    const { data } = await q
    if(data) {
      setCandidatos(data)
      const r = data.map(c => ({ ...c, votos: Math.floor(Math.random()*1000)+100 })).sort((a,b)=>b.votos-a.votos)
      setRanking(r)
    }
  }

  const confirmarVoto = () => {
    if(!voto) return alert('Digite o número!')
    const achado = candidatos.find(c => c.numero === voto)
    if(!achado) return alert('Número não encontrado para este cargo!')
    setCandidatoVotado(achado)
    setConfirmado(true)
    // salva voto no localStorage para simulação
    const votos = JSON.parse(localStorage.getItem('votos_simulados') || '{}')
    votos[achado.id] = (votos[achado.id] || 0) + 1
    localStorage.setItem('votos_simulados', JSON.stringify(votos))
    setTimeout(()=>setMostrarRanking(true), 1200)
  }

  if (confirmado && candidatoVotado) {
    return (
      <div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
        <div style={{ background:'#151a29', border:'2px solid #00ff88', borderRadius:20, padding:30, maxWidth:420, width:'100%', textAlign:'center' }}>
          <div style={{ fontSize:50 }}>✅</div>
          <h2 style={{ color:'#00ff88', marginTop:10 }}>VOTO CONFIRMADO!</h2>
          <div style={{ margin:'20px 0', background:'#0a0e1a', padding:16, borderRadius:12 }}>
            {candidatoVotado.foto_url && <img src={candidatoVotado.foto_url} style={{ width:80, height:80, borderRadius:'50%', objectFit:'cover', marginBottom:10 }} />}
            <div style={{ fontWeight:800, fontSize:18 }}>{candidatoVotado.nome}</div>
            <div style={{ opacity:0.6, fontSize:13 }}>{candidatoVotado.numero} - {candidatoVotado.partido} - {candidatoVotado.cargo}</div>
          </div>
          {!mostrarRanking ? <div style={{ opacity:0.5, fontSize:12 }}>Gerando resultado...</div> : (
            <>
              <h3 style={{ fontSize:14, margin:'16px 0 10px' }}>🏆 Ranking parcial {cargoFiltro || ''}</h3>
              {ranking.slice(0,3).map((c,i)=>(
                <div key={c.id} style={{ display:'flex', justifyContent:'space-between', background:'#0a0e1a', padding:'8px 12px', borderRadius:8, marginBottom:6, borderLeft:`4px solid ${i===0?'#facc15':i===1?'#94a3b8':'#b45309'}` }}>
                  <span style={{ fontSize:12 }}><b>#{i+1}</b> {c.nome} ({c.numero})</span><span style={{ fontSize:12, fontWeight:700, color:'#00ff88' }}>{c.votos} votos</span>
                </div>
              ))}
              <div style={{ display:'flex', gap:8, marginTop:16 }}>
                <Link href="/" style={{ flex:1, background:'#1e293b', color:'white', padding:10, borderRadius:8, textDecoration:'none', fontSize:12 }}>Início</Link>
                <button onClick={()=>{setConfirmado(false); setVoto(''); setMostrarRanking(false)}} style={{ flex:1, background:'#00ff88', color:'#000', border:'none', padding:10, borderRadius:8, fontWeight:700, cursor:'pointer' }}>Votar de novo</button>
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white', display:'flex', alignItems:'center', justifyContent:'center', padding:16 }}>
      <div style={{ display:'grid', gridTemplateColumns:'340px 1fr', gap:20, maxWidth:900, width:'100%', background:'#151a29', borderRadius:20, border:'1px solid #1e293b', overflow:'hidden' }}>
        {/* URNA */}
        <div style={{ background:'#e5e7eb', color:'#000', padding:20 }}>
          <div style={{ background:'white', border:'2px solid #000', padding:12, minHeight:200 }}>
            <div style={{ fontSize:10, opacity:0.6 }}>SEU VOTO PARA</div>
            <div style={{ fontSize:18, fontWeight:800, margin:'4px 0' }}>{cargoFiltro || 'Candidato'}</div>
            <div style={{ display:'flex', gap:8, margin:'10px 0' }}>
              {voto.split('').map((d,i)=><div key={i} style={{ width:32, height:40, border:'1px solid #000', display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, fontWeight:800 }}>{d}</div>)}
              {Array.from({length: Math.max(0, (candidatos[0]?.numero?.length || 2) - voto.length)}).map((_,i)=><div key={'e'+i} style={{ width:32, height:40, border:'1px solid #000', opacity:0.3 }}></div>)}
            </div>
            {(() => {
              const achado = candidatos.find(c=>c.numero===voto)
              return achado ? <div><div style={{ fontSize:12 }}><b>Nome:</b> {achado.nome}</div><div style={{ fontSize:11 }}><b>Partido:</b> {achado.partido}</div></div> : voto ? <div style={{ color:'#ef4444', fontSize:12 }}>Número não encontrado</div> : null
            })()}
          </div>
          <div style={{ display:'flex', gap:8, marginTop:16 }}>
            <button onClick={()=>setVoto('')} style={{ flex:1, background:'white', border:'1px solid #000', padding:10, borderRadius:4, fontSize:10, fontWeight:700 }}>BRANCO</button>
            <button onClick={()=>setVoto(v=>v.slice(0,-1))} style={{ flex:1, background:'#ef4444', color:'white', border:'1px solid #000', padding:10, borderRadius:4, fontSize:10, fontWeight:700 }}>CORRIGE</button>
            <button onClick={confirmarVoto} style={{ flex:1, background:'#16a34a', color:'white', border:'1px solid #000', padding:10, borderRadius:4, fontSize:10, fontWeight:700 }}>CONFIRMA</button>
          </div>
        </div>
        {/* LISTA */}
        <div style={{ padding:20 }}>
          <Link href="/" style={{ color:'#00ff88', fontSize:12, textDecoration:'none' }}>← Voltar</Link>
          <h2 style={{ margin:'12px 0' }}>🗳️ Votação Simulada 2026{cargoFiltro ? ` - ${cargoFiltro}` : ''}</h2>
          <p style={{ fontSize:11, opacity:0.5, marginBottom:12 }}>Digite o número do candidato na urna ao lado. Simulação educativa, não oficial.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(140px,1fr))', gap:8, maxHeight:360, overflowY:'auto' }}>
            {candidatos.map(c=>(
              <div key={c.id} onClick={()=>setVoto(c.numero)} style={{ background:'#0a0e1a', border:`1px solid ${voto===c.numero?'#00ff88':'#1e293b'}`, borderRadius:10, padding:8, cursor:'pointer', textAlign:'center' }}>
                {c.foto_url && <img src={c.foto_url} style={{ width:'100%', height:80, objectFit:'cover', borderRadius:6 }} />}
                <div style={{ fontSize:11, fontWeight:700, marginTop:4, color: voto===c.numero ? '#00ff88' : 'white' }}>{c.numero} - {c.nome.split(' ')[0]}</div>
                <div style={{ fontSize:9, opacity:0.5 }}>{c.partido}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:12, fontSize:10, opacity:0.3 }}>Total: {candidatos.length} candidatos para {cargoFiltro || 'todos os cargos'}</div>
        </div>
      </div>
    </div>
  )
}

export default function PageVotacao() {
  return <Suspense fallback={<div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>Carregando urna...</div>}><ConteudoVotacao /></Suspense>
}
