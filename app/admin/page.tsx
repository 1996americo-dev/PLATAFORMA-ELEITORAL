'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const CARGOS = ['Presidente','Governador','Senador','Deputado Federal','Deputado Estadual','Prefeito','Vereador']

export default function AdminCompleto() {
  const [logado, setLogado] = useState(false)
  const [senha, setSenha] = useState('')
  const [form, setForm] = useState({ nome:'', numero:'', partido:'', cargo:'Presidente', cidade:'', propostas:'', biografia:'', instagram:'', site:'' })
  const [foto, setFoto] = useState<File|null>(null)
  const [lista, setLista] = useState<any[]>([])
  const [stats, setStats] = useState({ total:0, porCargo:{} as any, porPartido:{} as any })

  useEffect(()=>{ if(logado) carregar() },[logado])
  async function carregar(){
    const { data } = await supabase.from('candidatos').select('*').order('created_at',{ascending:false})
    if(data){
      setLista(data)
      const porCargo: any = {}
      const porPartido: any = {}
      data.forEach(c=>{
        porCargo[c.cargo] = (porCargo[c.cargo]||0)+1
        porPartido[c.partido] = (porPartido[c.partido]||0)+1
      })
      setStats({ total: data.length, porCargo, porPartido })
    }
  }

  const salvar = async () => {
    if(!form.nome || !form.numero) return alert('Nome e número obrigatório')
    let foto_url=''
    if(foto){
      const nomeArq = `${Date.now()}-${foto.name}`
      const { error } = await supabase.storage.from('fotos-candidatos').upload(nomeArq, foto)
      if(error) return alert('Erro foto: '+error.message)
      const { data } = supabase.storage.from('fotos-candidatos').getPublicUrl(nomeArq)
      foto_url = data.publicUrl
    }
    const { error } = await supabase.from('candidatos').insert([{...form, foto_url}])
    if(error) alert(error.message)
    else { alert('✅ Candidato salvo!'); setForm({ nome:'', numero:'', partido:'', cargo:'Presidente', cidade:'', propostas:'', biografia:'', instagram:'', site:'' }); setFoto(null); carregar() }
  }

  const excluir = async (id:string) => { if(!confirm('Excluir?')) return; await supabase.from('candidatos').delete().eq('id',id); carregar() }

  if(!logado) return (
    <div style={{ minHeight:'100vh', background:'#0a0e1a', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ background:'#151a29', padding:30, borderRadius:16, width:'100%', maxWidth:360, border:'1px solid #1e293b' }}>
        <h2 style={{ color:'#00ff88', marginBottom:20, textAlign:'center' }}>🔐 Admin Completo 2026</h2>
        <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha: 123456" style={iS} />
        <button onClick={()=> senha==='123456'?setLogado(true):alert('Senha errada')} style={{ width:'100%', background:'#00ff88', color:'#000', padding:12, borderRadius:8, border:'none', fontWeight:700, cursor:'pointer', marginTop:10 }}>Entrar</button>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#0a0e1a', color:'white', padding:16 }}>
      <div style={{ maxWidth:1000, margin:'0 auto' }}>
        <h1 style={{ color:'#00ff88', fontSize:20, marginBottom:16 }}>📊 Dashboard Eleitoral 2026 - Completo</h1>
        
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:12, marginBottom:20 }}>
          <div style={cardStat}><div style={{ opacity:0.5, fontSize:12 }}>Total Candidatos</div><div style={{ fontSize:28, fontWeight:800, color:'#00ff88' }}>{stats.total}</div></div>
          <div style={cardStat}><div style={{ opacity:0.5, fontSize:12 }}>Cargos diferentes</div><div style={{ fontSize:28, fontWeight:800 }}>{Object.keys(stats.porCargo).length}</div><div style={{ fontSize:10, opacity:0.5, marginTop:4 }}>{Object.entries(stats.porCargo).map(([k,v]:any)=>`${k}: ${v}`).join(' • ')}</div></div>
          <div style={cardStat}><div style={{ opacity:0.5, fontSize:12 }}>Partidos</div><div style={{ fontSize:28, fontWeight:800 }}>{Object.keys(stats.porPartido).length}</div><div style={{ fontSize:10, opacity:0.5, marginTop:4 }}>{Object.entries(stats.porPartido).slice(0,3).map(([k,v]:any)=>`${k}: ${v}`).join(' • ')}</div></div>
        </div>

        <div style={{ background:'#151a29', padding:16, borderRadius:16, border:'1px solid #1e293b', marginBottom:20 }}>
          <h3 style={{ marginBottom:12, fontSize:14 }}>➕ Cadastrar Novo Candidato (Protótipo Completo)</h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            <input value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} placeholder="Nome completo *" style={iS} />
            <input value={form.numero} onChange={e=>setForm({...form,numero:e.target.value})} placeholder="Número *" style={iS} />
            <input value={form.partido} onChange={e=>setForm({...form,partido:e.target.value})} placeholder="Partido (PT, PL...)" style={iS} />
            <select value={form.cargo} onChange={e=>setForm({...form,cargo:e.target.value})} style={iS}>
              {CARGOS.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
            <input value={form.cidade} onChange={e=>setForm({...form,cidade:e.target.value})} placeholder="Cidade / Estado" style={iS} />
            <input value={form.instagram} onChange={e=>setForm({...form,instagram:e.target.value})} placeholder="Instagram @ (opcional)" style={iS} />
          </div>
          <textarea value={form.propostas} onChange={e=>setForm({...form,propostas:e.target.value})} placeholder="Propostas curtas (ex: Saúde, Educação...)" style={{...iS, height:60, marginTop:10}} />
          <textarea value={form.biografia} onChange={e=>setForm({...form,biografia:e.target.value})} placeholder="Biografia completa (opcional - para página de perfil)" style={{...iS, height:70, marginTop:8}} />
          <input value={form.site} onChange={e=>setForm({...form,site:e.target.value})} placeholder="Site oficial (opcional)" style={{...iS, marginTop:8}} />
          <input type="file" accept="image/*" onChange={e=>setFoto(e.target.files?.[0]||null)} style={{...iS, padding:8, marginTop:8}} />
          <button onClick={salvar} style={{ width:'100%', background:'#00ff88', color:'#000', padding:14, borderRadius:10, border:'none', fontWeight:800, cursor:'pointer', marginTop:12 }}>✅ SALVAR CANDIDATO COMPLETO</button>
        </div>

        <div style={{ background:'#151a29', borderRadius:12, border:'1px solid #1e293b', overflow:'hidden' }}>
          <div style={{ padding:12, borderBottom:'1px solid #1e293b', display:'flex', justifyContent:'space-between' }}><b>Lista ({lista.length})</b><a href="/" style={{ color:'#00ff88', fontSize:12, textDecoration:'none' }}>Ver site →</a></div>
          {lista.map(c=>(
            <div key={c.id} style={{ padding:10, borderBottom:'1px solid #1e293b', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                {c.foto_url && <img src={c.foto_url} style={{ width:36, height:36, borderRadius:6, objectFit:'cover' }} />}
                <div><b style={{ fontSize:13, color:'#00ff88' }}>{c.nome} - {c.numero}</b><br/><span style={{ fontSize:11, opacity:0.5 }}>{c.cargo} | {c.partido} | {c.cidade}</span></div>
              </div>
              <button onClick={()=>excluir(c.id)} style={{ background:'#ef4444', color:'white', border:'none', padding:'5px 10px', borderRadius:6, fontSize:11, cursor:'pointer' }}>Excluir</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
const iS = { padding:10, borderRadius:8, border:'1px solid #1e293b', background:'#0a0e1a', color:'white', width:'100%', outline:'none', fontSize:13 } as const
const cardStat = { background:'#151a29', border:'1px solid #1e293b', borderRadius:12, padding:14 } as const
