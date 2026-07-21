'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CARGOS_LISTA = ['Presidente', 'Governador', 'Senador', 'Deputado Federal', 'Deputado Estadual', 'Prefeito', 'Vereador']

export default function Admin() {
  const [logado, setLogado] = useState(false)
  const [senha, setSenha] = useState('')
  const [form, setForm] = useState({ nome: '', numero: '', partido: '', cargo: 'Presidente', cidade: '', propostas: '' })
  const [foto, setFoto] = useState<File | null>(null)
  const [lista, setLista] = useState<any[]>([])

  useEffect(() => { if (logado) carregar() }, [logado])

  async function carregar() {
    const { data } = await supabase.from('candidatos').select('*').order('created_at', { ascending: false })
    if (data) setLista(data)
  }

  const login = () => {
    if (senha === '123456') setLogado(true)
    else alert('Senha errada! Use 123456')
  }

  const salvar = async () => {
    if (!form.nome || !form.numero) return alert('Nome e número obrigatório!')
    let foto_url = ''
    if (foto) {
      const nomeArq = `${Date.now()}-${foto.name}`
      const { error } = await supabase.storage.from('fotos-candidatos').upload(nomeArq, foto)
      if (error) return alert('Erro foto: ' + error.message)
      const { data } = supabase.storage.from('fotos-candidatos').getPublicUrl(nomeArq)
      foto_url = data.publicUrl
    }
    const { error } = await supabase.from('candidatos').insert([{ ...form, foto_url }])
    if (error) alert(error.message)
    else {
      alert('Candidato cadastrado!')
      setForm({ nome: '', numero: '', partido: '', cargo: 'Presidente', cidade: '', propostas: '' })
      setFoto(null)
      carregar()
    }
  }

  const excluir = async (id: string) => {
    if (!confirm('Excluir?')) return
    await supabase.from('candidatos').delete().eq('id', id)
    carregar()
  }

  if (!logado) return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#151a29', padding: 30, borderRadius: 16, width: '100%', maxWidth: 360, border: '1px solid #1e293b' }}>
        <h2 style={{ color: '#00ff88', marginBottom: 20, textAlign: 'center' }}>Admin - Plataforma 2026</h2>
        <input type="password" value={senha} onChange={e => setSenha(e.target.value)} placeholder="Senha: 123456" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1px solid #1e293b', background: '#0a0e1a', color: 'white', marginBottom: 12 }} />
        <button onClick={login} style={{ width: '100%', background: '#00ff88', color: '#000', padding: 12, borderRadius: 8, border: 'none', fontWeight: 700, cursor: 'pointer' }}>Entrar</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0a0e1a', color: 'white', padding: 20 }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <h1 style={{ color: '#00ff88', marginBottom: 20 }}>Cadastrar Candidato - 2026</h1>

        <div style={{ background: '#151a29', padding: 20, borderRadius: 16, border: '1px solid #1e293b', marginBottom: 30, display: 'grid', gap: 12 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} placeholder="Nome completo" style={inputStyle} />
            <input value={form.numero} onChange={e => setForm({ ...form, numero: e.target.value })} placeholder="Número (ex: 13, 22)" style={inputStyle} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <input value={form.partido} onChange={e => setForm({ ...form, partido: e.target.value })} placeholder="Partido (PT, PL...)" style={inputStyle} />
            <select value={form.cargo} onChange={e => setForm({ ...form, cargo: e.target.value })} style={inputStyle}>
              {CARGOS_LISTA.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <input value={form.cidade} onChange={e => setForm({ ...form, cidade: e.target.value })} placeholder="Cidade / Estado (São Paulo, Goiás, Brasil...)" style={inputStyle} />
          <textarea value={form.propostas} onChange={e => setForm({ ...form, propostas: e.target.value })} placeholder="Propostas (ex: Saúde, Educação, Estradas...)" style={{ ...inputStyle, height: 80 }} />
          <input type="file" accept="image/*" onChange={e => setFoto(e.target.files?.[0] || null)} style={{ ...inputStyle, padding: 10 }} />
          <button onClick={salvar} style={{ background: '#00ff88', color: '#000', padding: 14, borderRadius: 10, border: 'none', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>✅ SALVAR CANDIDATO</button>
        </div>

        <h3 style={{ marginBottom: 12 }}>Candidatos ({lista.length})</h3>
        <div style={{ display: 'grid', gap: 10 }}>
          {lista.map(c => (
            <div key={c.id} style={{ background: '#151a29', padding: 12, borderRadius: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #1e293b' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                {c.foto_url && <img src={c.foto_url} style={{ width: 40, height: 40, borderRadius: 8, objectFit: 'cover' }} />}
                <div><b style={{ color: '#00ff88' }}>{c.nome} - {c.numero}</b><br /><small style={{ opacity: 0.6 }}>{c.cargo} | {c.partido} | {c.cidade}</small></div>
              </div>
              <button onClick={() => excluir(c.id)} style={{ background: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 6, cursor: 'pointer' }}>Excluir</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const inputStyle = { padding: 12, borderRadius: 8, border: '1px solid #1e293b', background: '#0a0e1a', color: 'white', width: '100%', outline: 'none' } as const
