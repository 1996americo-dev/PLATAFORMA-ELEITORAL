'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Candidato = {
  id: string
  nome: string
  numero: string
  partido: string
  cargo: string
  cidade: string
  propostas: string
  foto_url: string
}

const CARGOS = ['Todos', 'Presidente', 'Governador', 'Senador', 'Deputado Federal', 'Deputado Estadual', 'Prefeito', 'Vereador']

export default function Home() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  const [busca, setBusca] = useState('')
  const [filtroCargo, setFiltroCargo] = useState('Todos')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('candidatos').select('*').order('created_at', { ascending: false })
      if (data) setCandidatos(data)
      setLoading(false)
    }
    carregar()
  }, [])

  const filtrados = candidatos.filter(c => {
    const buscaOk = `${c.nome} ${c.numero} ${c.partido} ${c.cidade} ${c.cargo}`.toLowerCase().includes(busca.toLowerCase())
    const cargoOk = filtroCargo === 'Todos' || c.cargo.toLowerCase().includes(filtroCargo.toLowerCase())
    return buscaOk && cargoOk
  })

  const compartilhar = (c: Candidato) => {
    const texto = `Confira ${c.nome} - ${c.numero} (${c.partido}) para ${c.cargo} em ${c.cidade}! Veja na Plataforma Eleitoral 2026: https://plataforma-eleitoral-blond.vercel.app/`
    window.open(`https://wa.me/?text=${encodeURIComponent(texto)}`, '_blank')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        * { font-family: 'Inter', sans-serif; }
        .card:hover { transform: translateY(-5px); border-color: #00ff88 !important; box-shadow: 0 15px 50px rgba(0,255,136,0.2); }
        .chip-active { background: #00ff88 !important; color: #0a0e1a !important; font-weight: 700; }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '25px 16px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800 }}>
            <span style={{ background: '#00ff88', color: '#0a0e1a', padding: '2px 8px', borderRadius: 6, fontSize: 16, marginRight: 8 }}>BR</span>
            <span style={{ color: '#00ff88' }}>PLATAFORMA ELEITORAL 2026</span>
          </h1>
          <p style={{ opacity: 0.5, marginTop: 6, fontSize: 13 }}>Transparência e informação para o eleitor brasileiro</p>
        </div>

        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto 16px' }}>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, número, partido, cidade..."
            style={{ width: '100%', padding: '13px 18px 13px 42px', borderRadius: 12, border: '1px solid #1e293b', background: '#111827', color: 'white', fontSize: 14, outline: 'none' }}
          />
          <span style={{ position: 'absolute', left: 14, top: 13 }}>🔍</span>
        </div>

        <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8, marginBottom: 24, justifyContent: 'center', flexWrap: 'wrap' }}>
          {CARGOS.map(cargo => (
            <button
              key={cargo}
              onClick={() => setFiltroCargo(cargo)}
              className={filtroCargo === cargo ? 'chip-active' : ''}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid #1e293b',
                background: '#151a29',
                color: '#94a3b8',
                fontSize: 12,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.2s'
              }}
            >
              {cargo}
            </button>
          ))}
        </div>

        {loading ? <p style={{ textAlign: 'center', opacity: 0.5 }}>Carregando...</p> : filtrados.length === 0 ? <p style={{ textAlign: 'center', opacity: 0.5, marginTop: 40 }}>Nenhum candidato para {filtroCargo}</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {filtrados.map(c => (
              <div key={c.id} className="card" style={{ background: '#151a29', border: '1px solid #1e293b', borderRadius: 16, overflow: 'hidden', transition: 'all 0.3s' }}>
                <div style={{ height: 200, background: '#0f172a', overflow: 'hidden', position: 'relative' }}>
                  {c.foto_url ? <img src={c.foto_url} alt={c.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', opacity: 0.3 }}>Sem foto</div>}
                  <span style={{ position: 'absolute', top: 10, right: 10, background: '#00ff88', color: '#000', padding: '3px 8px', borderRadius: 6, fontSize: 11, fontWeight: 800 }}>{c.cargo}</span>
                </div>
                <div style={{ padding: 14 }}>
                  <h3 style={{ color: '#00ff88', fontWeight: 700, fontSize: 15, textTransform: 'lowercase' }}>{c.nome} - {c.numero}</h3>
                  <p style={{ fontSize: 12, opacity: 0.7, marginTop: 6, lineHeight: 1.4 }}>
                    <b>Partido:</b> {c.partido} | <b>Cargo:</b> {c.cargo}<br />
                    <b>Cidade:</b> {c.cidade}
                  </p>
                  {c.propostas && <div style={{ marginTop: 10, background: '#0f172a', borderRadius: 8, padding: '8px 10px', fontSize: 12 }}>{c.propostas}</div>}
                  <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                    <button onClick={() => compartilhar(c)} style={{ flex: 1, background: '#25D366', color: 'white', border: 'none', padding: '8px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>📱 WhatsApp</button>
                    <a href={`/candidato/${c.id}`} style={{ flex: 1, textAlign: 'center', background: '#1e293b', color: 'white', padding: '8px', borderRadius: 8, fontSize: 12, textDecoration: 'none' }}>Ver perfil</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 50, opacity: 0.2, fontSize: 11 }}>1996americo-dev | Plataforma Eleitoral 2026 • Total: {candidatos.length} candidatos</div>
      </div>
    </div>
  )
}
