"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function AdminV56(){
  const [senha,setSenha]=useState(""); const [logado,setLogado]=useState(false)
  const [votos,setVotos]=useState<any[]>([]); const [stats,setStats]=useState<Record<string,number>>({})
  const carregar = async ()=>{
    const {data} = await supabase.from('votos').select('*').order('created_at',{ascending:false})
    if(data){ setVotos(data); const c:Record<string,number>={}; data.forEach((r:any)=>{c[r.candidato_id]=(c[r.candidato_id]||0)+1}); setStats(c) }
  }
  useEffect(()=>{if(logado) carregar()},[logado])

  if(!logado) return (
    <div style={{minHeight:'100vh', background:'#0F172A', display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
      <div style={{background:'white', borderRadius:24, padding:24, maxWidth:360, width:'100%', border:'4px solid black'}}>
        <h1 style={{fontWeight:900, fontSize:22, color:'black'}}>ADMIN V5.6 CPF 🔒</h1>
        <p style={{fontWeight:700, fontSize:12, color:'black'}}>Anti-fraude • Hash SHA-256</p>
        <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha 2026" style={{width:'100%', background:'#F1F5F9', border:'3px solid black', borderRadius:999, padding:'14px', textAlign:'center', fontWeight:900, marginTop:16, color:'black'}}/>
        <button onClick={()=>senha==="2026"?setLogado(true):alert("Senha errada!")} style={{width:'100%', background:'black', color:'white', padding:14, borderRadius:999, fontWeight:900, marginTop:12}}>ENTRAR</button>
      </div>
    </div>
  )

  const total=votos.length
  const ranking=Object.entries(stats).sort((a:any,b:any)=>b[1]-a[1])

  return (
    <div style={{minHeight:'100vh', background:'#F1F5F9', padding:16}}>
      <div style={{maxWidth:1000, margin:'0 auto'}}>
        <div style={{background:'white', border:'4px solid black', borderRadius:16, padding:12, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:8}}>
          <div><h1 style={{fontWeight:900, color:'black'}}>ADMIN V5.6 • {total} VOTOS CPF VALIDADOS</h1><p style={{fontWeight:700, fontSize:12, color:'black'}}>***.***.***-XX • Hora exata • Hash</p></div>
          <div style={{display:'flex', gap:8}}><button onClick={carregar} style={{border:'3px solid black', padding:'6px 12px', borderRadius:999, fontWeight:900, fontSize:12}}>ATUALIZAR</button><a href="/" style={{background:'black', color:'white', padding:'6px 12px', borderRadius:999, fontWeight:900, fontSize:12, textDecoration:'none'}}>SITE</a></div>
        </div>

        <div style={{marginTop:16, display:'grid', gap:12}}>
          {votos.map((v:any,i)=>
            <div key={v.id} style={{background:'white', border:'3px solid black', borderRadius:16, padding:12, display:'flex', justifyContent:'space-between', flexWrap:'wrap'}}>
              <span style={{fontWeight:900, color:'black'}}>{i+1}. {v.candidato_id}</span>
              <span style={{fontWeight:700, fontSize:12, color:'black'}}>{new Date(v.created_at).toLocaleString('pt-BR')} | ***.***.***-{v.cpf_hash?.slice(-2) || "**"} | HASH:{v.cpf_hash?.slice(0,8) || "legado"}</span>
            </div>
          )}
          {votos.length===0 && <p style={{textAlign:'center', padding:40, fontWeight:700}}>Nenhum voto ainda</p>}
        </div>

        <div style={{marginTop:20, background:'black', color:'white', borderRadius:16, padding:16}}>
          <h2 style={{fontWeight:900}}>🏆 RANKING ANTI-FRAUDE</h2>
          {ranking.map(([id,qtd]:any,i)=><div key={id} style={{display:'flex', gap:8, marginTop:8}}><span style={{background:'white', color:'black', width:24, height:24, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:12}}>{i+1}</span><span style={{flex:1, fontWeight:700}}>{id}</span><span style={{fontWeight:900}}>{qtd}</span></div>)}
        </div>
      </div>
    </div>
  )
}