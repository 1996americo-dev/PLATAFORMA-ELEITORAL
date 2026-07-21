'use client'
import { useEffect, useState, Suspense } from 'react'
import { createClient } from '@supabase/supabase-js'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

function ConteudoComparar() {
  const params = useSearchParams()
  const id1 = params.get('id1')
  const id2 = params.get('id2')
  const [c1, setC1] = useState<any>(null)
  const [c2, setC2] = useState<any>(null)

  useEffect(() => {
    async function load() {
      if (id1) { const { data } = await supabase.from('candidatos').select('*').eq('id', id1).single(); if(data) setC1(data) }
      if (id2) { const { data } = await supabase.from('candidatos').select('*').eq('id', id2).single(); if(data) setC2(data) }
    }
    load()
  }, [id1, id2])

  if (!c1 || !c2) return <div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>Carregando comparação... <Link href="/" style={{ color:'#00ff88', marginLeft:10 }}>Voltar</Link></div>

  const Row = ({ label, v1, v2 }: any) => (
    <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 1fr', gap:1, background:'#1e293b', borderRadius:8, overflow:'hidden', marginBottom:8 }}>
      <div style={{ background:'#151a29', padding:12, fontSize:11, fontWeight:700, color:'#00ff88', display:'flex', alignItems:'center' }}>{label}</div>
      <div style={{ background:'#0a0e1a', padding:12, fontSize:12 }}>{v1 || '-'}</div>
      <div style={{ background:'#0a0e1a', padding:12, fontSize:12 }}>{v2 || '-'}</div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:16 }}>
        <Link href="/" style={{ color:'#00ff88', textDecoration:'none', fontSize:13 }}>← Voltar</Link>
        <h1 style={{ textAlign:'center', margin:'16px 0', fontSize:22, fontWeight:800 }}>⚔️ COMPARADOR DE CANDIDATOS</h1>
        
        <div style={{ display:'grid', gridTemplateColumns:'120px 1fr 1fr', gap:10, marginBottom:10, padding:'0 4px' }}>
          <div></div>
          <div style={{ textAlign:'center' }}>
            {c1.foto_url && <img src={c1.foto_url} style={{ width:90, height:90, borderRadius:'50%', objectFit:'cover', border:'3px solid #00ff88' }} />}
            <div style={{ fontWeight:800, color:'#00ff88', marginTop:8 }}>{c1.nome}</div><div style={{ fontSize:11, opacity:0.5 }}>{c1.numero}</div>
          </div>
          <div style={{ textAlign:'center' }}>
            {c2.foto_url && <img src={c2.foto_url} style={{ width:90, height:90, borderRadius:'50%', objectFit:'cover', border:'3px solid #facc15' }} />}
            <div style={{ fontWeight:800, color:'#facc15', marginTop:8 }}>{c2.nome}</div><div style={{ fontSize:11, opacity:0.5 }}>{c2.numero}</div>
          </div>
        </div>

        <Row label="Cargo" v1={c1.cargo} v2={c2.cargo} />
        <Row label="Partido" v1={c1.partido} v2={c2.partido} />
        <Row label="Número" v1={c1.numero} v2={c2.numero} />
        <Row label="Cidade" v1={c1.cidade} v2={c2.cidade} />
        <Row label="Propostas" v1={c1.propostas?.slice(0,300)} v2={c2.propostas?.slice(0,300)} />
        <Row label="Biografia" v1={c1.biografia?.slice(0,300)} v2={c2.biografia?.slice(0,300)} />

        <div style={{ display:'flex', gap:10, marginTop:20 }}>
          <Link href={`/votacao?cargo=${c1.cargo}`} style={{ flex:1, background:'#00ff88', color:'#000', padding:14, borderRadius:12, textAlign:'center', textDecoration:'none', fontWeight:800 }}>🗳️ Votar em {c1.nome.split(' ')[0]}</Link>
          <Link href={`/votacao?cargo=${c2.cargo}`} style={{ flex:1, background:'#facc15', color:'#000', padding:14, borderRadius:12, textAlign:'center', textDecoration:'none', fontWeight:800 }}>🗳️ Votar em {c2.nome.split(' ')[0]}</Link>
        </div>
      </div>
    </div>
  )
}

export default function PageComparar() {
  return <Suspense fallback={<div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white', display:'flex', alignItems:'center', justifyContent:'center' }}>Carregando...</div>}><ConteudoComparar /></Suspense>
}
