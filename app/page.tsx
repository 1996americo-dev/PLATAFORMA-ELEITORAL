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

export default function Home() {
  const [candidatos, setCandidatos] = useState<Candidato[]>([])
  const [busca, setBusca] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function carregar() {
      const { data } = await supabase.from('candidatos').select('*').order('created_at', { ascending: false })
      if (data) setCandidatos(data)
      setLoading(false)
    }
    carregar()
  }, [])

  const filtrados = candidatos.filter(c =>
    `${c.nome} ${c.numero} ${c.partido} ${c.cidade} ${c.cargo}`.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'white', fontFamily: 'Inter, sans-serif' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
        .card:hover { transform: translateY(-4px); border-color: #00ff88 !important; box-shadow: 0 10px 40px rgba(0,255,136,0.15); }
      `}</style>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '30px 20px' }}>
        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, letterSpacing: 1 }}>
            <span style={{ background: '#00ff88', color: '#0a0e1a', padding: '2px 8px', borderRadius: 4, marginRight: 8, fontSize: 20 }}>BR</span>
            <span style={{ color: '#00ff88' }}>PLATAFORMA ELEITORAL 2026</span>
          </h1>
          <p style={{ opacity: 0.6, marginTop: 8 }}>Transparência e informação para o eleitor brasileiro</p>
        </div>

        {/* BUSCA */}
        <div style={{ position: 'relative', maxWidth: 600, margin: '0 auto 35px' }}>
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar por nome, número, partido, cidade..."
            style={{
              width: '100%',
              padding: '14px 18px 14px 45px',
              borderRadius: 12,
              border: '1px solid #1e293b',
              background: '#111827',
              color: 'white',
              fontSize: 15,
              outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', left: 15, top: 14, opacity: 0.5 }}>🔍</span>
        </div>

        {/* GRID */}
        {loading ? (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>Carregando candidatos...</p>
        ) : filtrados.length === 0 ? (
          <p style={{ textAlign: 'center', opacity: 0.5 }}>Nenhum candidato encontrado</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {filtrados.map(c => (
              <div key={c.id} className="card" style={{
                background: '#151a29',
                border: '1px solid #1e293b',
                borderRadius: 16,
                overflow: 'hidden',
                transition: 'all 0.3s'
              }}>
                <div style={{ height: 180, background: '#0f172a', overflow: 'hidden' }}>
                  {c.foto_url ? (
                    <img src={c.foto_url} alt={c.nome} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.3 }}>Sem foto</div>
                  )}
                </div>
                <div style={{ padding: 16 }}>
                  <h3 style={{ color: '#00ff88', fontWeight: 600, fontSize: 15, textTransform: 'lowercase', marginBottom: 8 }}>
                    {c.nome} - {c.numero}
                  </h3>
                  <p style={{ fontSize: 13, opacity: 0.8, lineHeight: 1.5 }}>
                    <b>Partido:</b> {c.partido} | <b>Cargo:</b> {c.cargo}<br />
                    <b>Cidade:</b> {c.cidade}
                  </p>
                  {c.propostas && (
                    <div style={{ marginTop: 10, background: '#0f172a', borderRadius: 8, padding: '10px 12px', fontSize: 13, opacity: 0.9 }}>
                      {c.propostas}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 60, opacity: 0.3, fontSize: 12 }}>
          Desenvolvido por 1996americo-dev | Plataforma Eleitoral 2026
        </div>
      </div>
    </div>
  )
}