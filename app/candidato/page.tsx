'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function PerfilSimples() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')
  const [c, setC] = useState<any>(null)
  const [votos, setVotos] = useState(0)

  useEffect(() => {
    async function load() {
      if(!id) return
      const { data } = await supabase.from('candidatos').select('*').eq('id', id).single()
      if (data) { setC(data); setVotos(Math.floor(Math.random()*500)+50) }
    }
    load()
  }, [id])

  if(!id) return <div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>Nenhum candidato selecionado. <Link href="/" style={{ color:'#00ff88', marginLeft:8 }}>Voltar</Link></div>
  if(!c) return <div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>Carregando...</div>

  return (
    <div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white' }}>
      <div style={{ maxWidth:900, margin:'0 auto', padding:16 }}>
        <Link href="/" style={{ color:'#00ff88', textDecoration:'none', fontSize:13 }}>← Voltar para lista</Link>
        <div style={{ background:'#151a29', border:'1px solid #1e293b', borderRadius:20, overflow:'hidden', marginTop:16 }}>
          <div style={{ height:320, position:'relative', background:'#0f172a' }}>
            {c.foto_url && <img src={c.foto_url} style={{ width:'100%', height:'100%', objectFit:'cover' }} />}
            <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:20, background:'linear-gradient(transparent, rgba(0,0,0,0.9))' }}>
              <span style={{ background:'#00ff88', color:'#000', padding:'4px 10px', borderRadius:20, fontSize:11, fontWeight:800 }}>{c.cargo}</span>
              <h1 style={{ fontSize:28, fontWeight:800, marginTop:8 }}>{c.nome} - {c.numero}</h1>
              <p style={{ opacity:0.7, fontSize:13 }}>{c.partido} • {c.cidade}</p>
            </div>
          </div>
          <div style={{ padding:20, display:'grid', gap:20 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
              <div style={{ background:'#0a0e1a', padding:12, borderRadius:12, textAlign:'center' }}><div style={{ fontSize:20, fontWeight:800, color:'#00ff88' }}>{votos}</div><div style={{ fontSize:10, opacity:0.5 }}>apoios</div></div>
              <div style={{ background:'#0a0e1a', padding:12, borderRadius:12, textAlign:'center' }}><div style={{ fontSize:20, fontWeight:800 }}>{c.numero}</div><div style={{ fontSize:10, opacity:0.5 }}>número</div></div>
              <div style={{ background:'#0a0e1a', padding:12, borderRadius:12, textAlign:'center' }}><div style={{ fontSize:20, fontWeight:800 }}>{c.partido}</div><div style={{ fontSize:10, opacity:0.5 }}>partido</div></div>
            </div>
            <div><h3 style={{ color:'#00ff88', marginBottom:8, fontSize:14 }}>📋 Propostas</h3><div style={{ background:'#0a0e1a', padding:14, borderRadius:12, lineHeight:1.6, fontSize:13 }}>{c.propostas || 'Sem propostas'}</div></div>
            {c.biografia && <div><h3 style={{ color:'#00ff88', marginBottom:8, fontSize:14 }}>👤 Biografia</h3><div style={{ background:'#0a0e1a', padding:14, borderRadius:12, fontSize:13, opacity:0.8 }}>{c.biografia}</div></div>}
            <div style={{ display:'flex', gap:10 }}>
              <button onClick={()=>setVotos(v=>v+1)} style={{ flex:1, background:'#00ff88', color:'#000', border:'none', padding:14, borderRadius:12, fontWeight:800, cursor:'pointer' }}>👍 Apoiar</button>
              <a href={`https://wa.me/?text=${encodeURIComponent(`Veja ${c.nome} ${c.numero} para ${c.cargo}: https://plataforma-eleitoral-blond.vercel.app/candidato?id=${c.id}`)}`} target="_blank" style={{ flex:1, background:'#25D366', color:'white', padding:14, borderRadius:12, textAlign:'center', textDecoration:'none', fontWeight:700 }}>📱 WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
