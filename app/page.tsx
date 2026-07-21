'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const CARGOS = ['Todos', 'Presidente', 'Governador', 'Senador', 'Deputado Federal', 'Deputado Estadual', 'Prefeito', 'Vereador']

export default function HomeFinalSemErro() {
  const [candidatos, setCandidatos] = useState<any[]>([])
  const [busca, setBusca] = useState('')
  const [filtro, setFiltro] = useState('Todos')

  useEffect(() => { carregar() }, [])
  async function carregar() {
    const { data } = await supabase.from('candidatos').select('*').order('created_at', { ascending: false })
    if (data) setCandidatos(data)
  }

  const filtrados = candidatos.filter(c => {
    const b = `${c.nome} ${c.numero} ${c.partido} ${c.cidade} ${c.cargo}`.toLowerCase().includes(busca.toLowerCase())
    const cf = filtro === 'Todos' || c.cargo === filtro
    return b && cf
  })

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'white' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@700;800&display=swap'); *{font-family:Inter,sans-serif} .card:hover{transform:translateY(-4px);border-color:#00ff88!important}`}</style>
      
      <header style={{ borderBottom: '1px solid #1e293b', padding: '12px 0', position: 'sticky', top: 0, background: '#0a0e1a', zIndex: 10 }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ color: '#00ff88', fontWeight: 800, fontSize: 18 }}><span style={{ background: '#00ff88', color: '#000', padding: '2px 6px', borderRadius: 4, marginRight: 6 }}>BR</span>PLATAFORMA 2026</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <Link href="/votacao" style={{ background: '#facc15', color: '#000', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>🗳️ Urna</Link>
            <Link href="/admin" style={{ background: '#00ff88', color: '#000', padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>Admin</Link>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
        <div style={{ textAlign: 'center', margin: '20px 0' }}><h2 style={{ fontSize: 24, fontWeight: 800 }}>ELEITORAL 2026</h2><p style={{ opacity: 0.5, fontSize: 13 }}>{filtrados.length} candidatos</p></div>
        
        <div style={{ maxWidth: 600, margin: '0 auto 14px', position: 'relative' }}>
          <input value={busca} onChange={e => setBusca(e.target.value)} placeholder="Buscar candidato, partido, cidade..." style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: 12, background: '#111827', border: '1px solid #1e293b', color: 'white', outline: 'none' }} />
          <span style={{ position: 'absolute', left: 12, top: 11 }}>🔍</span>
        </div>
        
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 20 }}>
          {CARGOS.map(c => (<button key={c} onClick={() => setFiltro(c)} style={{ padding: '5px 12px', borderRadius: 20, border: '1px solid #1e293b', background: filtro === c ? '#00ff88' : '#151a29', color: filtro === c ? '#000' : '#94a3b8', fontSize: 11, fontWeight: filtro === c ? 700 : 400, cursor: 'pointer' }}>{c}</button>))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 16 }}>
          {filtrados.map(c => (
            <div key={c.id} className="card" style={{ background: '#151a29', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden', transition: '0.2s' }}>
              <Link href={`/candidato?id=${c.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div style={{ height: 190, background: '#0f172a', position: 'relative' }}>
                  {c.foto_url ? <img src={c.foto_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={c.nome} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>Sem foto</div>}
                  <span style={{ position: 'absolute', top: 8, right: 8, background: '#00ff88', color: '#000', padding: '3px 8px', borderRadius: 6, fontSize: 10, fontWeight: 800 }}>{c.cargo}</span>
                </div>
              </Link>
              <div style={{ padding: 12 }}>
                <Link href={`/candidato?id=${c.id}`} style={{ textDecoration: 'none' }}><h3 style={{ color: '#00ff88', fontSize: 14, fontWeight: 700 }}>{c.nome} - {c.numero}</h3></Link>
                <p style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}><b>{c.partido}</b> | {c.cidade}</p>
                <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
                  <Link href={`/candidato?id=${c.id}`} style={{ flex: 1, background: '#1e293b', color: 'white', padding: 6, borderRadius: 6, fontSize: 11, textAlign: 'center', textDecoration: 'none' }}>Perfil</Link>
                  <Link href={`/votacao?cargo=${c.cargo}`} style={{ flex: 1, background: '#facc15', color: '#000', padding: 6, borderRadius: 6, fontSize: 11, textAlign: 'center', textDecoration: 'none', fontWeight: 700 }}>Votar</Link>
                </div>
                <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                  <Link href={`/comparar?id1=${c.id}&id2=${filtrados[0]?.id}`} style={{ flex: 1, background: '#151a29', border: '1px solid #1e293b', color: '#94a3b8', padding: 5, borderRadius: 6, fontSize: 10, textAlign: 'center', textDecoration: 'none' }}>⚔️ Comparar</Link>
                  <a href={`https://wa.me/?text=${encodeURIComponent(`Veja ${c.nome}: https://plataforma-eleitoral-blond.vercel.app/candidato?id=${c.id}`)}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, background: '#25D366', color: 'white', padding: 5, borderRadius: 6, fontSize: 10, textAlign: 'center', textDecoration: 'none' }}>WhatsApp</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
