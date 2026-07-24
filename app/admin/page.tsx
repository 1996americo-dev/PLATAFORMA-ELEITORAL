"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const CANDIDATOS: any = {
  "13-lula": { nome: "LULA", foto: "https://i.imgur.com/8Km9tLL.png", cor: "#CC0000" },
  "22-bolsonaro": { nome: "BOLSONARO", foto: "https://i.imgur.com/k2tG1aH.png", cor: "#0047AB" },
  "PL-nikolas": { nome: "NIKOLAS FERREIRA", foto: "https://i.imgur.com/Qp2v1aP.png", cor: "#0047AB" },
  "12-ciro": { nome: "CIRO GOMES", foto: "https://i.imgur.com/8Q7l6yB.png", cor: "#FFD700" },
  "branco": { nome: "BRANCO", foto: "", cor: "#FFF" },
  "nulo": { nome: "NULO", foto: "", cor: "#666" }
}

export default function AdminV57FINAL(){
  const [senha,setSenha]=useState(""); const [logado,setLogado]=useState(false)
  const [votos,setVotos]=useState<any[]>([]); const [stats,setStats]=useState<Record<string,number>>({})

  const carregar = async ()=>{
    const {data} = await supabase.from('votos').select('*').order('created_at',{ascending:false})
    if(data){ setVotos(data); const c:Record<string,number>={}; data.forEach((r:any)=>{ if(!['branco','nulo'].includes(r.candidato_id)) c[r.candidato_id]=(c[r.candidato_id]||0)+1 }); setStats(c) }
  }
  useEffect(()=>{if(logado) carregar()},[logado])

  if(!logado) return (
    <div style={{minHeight:'100vh', background:'#0F172A', display:'flex', alignItems:'center', justifyContent:'center', padding:20}}>
      <div style={{background:'white', borderRadius:24, padding:24, maxWidth:360, width:'100%', border:'4px solid black', textAlign:'center'}}>
        <h1 style={{fontWeight:900, fontSize:24, color:'black'}}>V5.7 FINAL 🔒</h1>
        <p style={{fontWeight:700, fontSize:12, color:'black'}}>ADMIN COMPLETO + FOTOS + EXCEL</p>
        <input type="password" value={senha} onChange={e=>setSenha(e.target.value)} placeholder="Senha 2026" style={{width:'100%', background:'#F1F5F9', border:'3px solid black', borderRadius:999, padding:14, textAlign:'center', fontWeight:900, marginTop:16, color:'black'}}/>
        <button onClick={()=>senha==="2026"?setLogado(true):alert("Senha errada")} style={{width:'100%', background:'black', color:'white', padding:14, borderRadius:999, fontWeight:900, marginTop:12}}>ENTRAR V5.7</button>
      </div>
    </div>
  )

  const total=votos.length
  const ranking=Object.entries(stats).sort((a:any,b:any)=>b[1]-a[1])

  return (
    <div style={{minHeight:'100vh', background:'#F1F5F9', padding:12}}>
      <div style={{maxWidth:1100, margin:'0 auto'}}>
        <div style={{background:'white', border:'4px solid black', borderRadius:20, padding:14, display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:10, alignItems:'center'}}>
          <div><h1 style={{fontWeight:900, fontSize:18, color:'black'}}>V5.7 FINAL • {total} VOTOS CPF VALIDADOS 🔒</h1><p style={{fontWeight:700, fontSize:11, color:'black'}}>Anti-fraude • Fotos • Hash • Excel</p></div>
          <div style={{display:'flex', gap:8}}>
            <button onClick={()=>{
              const csv="data,candidato,cpf_mascarado,hash\n"+votos.map((v:any)=>`${new Date(v.created_at).toLocaleString('pt-BR')},${v.candidato_id},***.***.***-${v.cpf_hash?.slice(-2)},${v.cpf_hash}`).join('\n')
              const blob=new Blob([csv],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download=`votos-v57-${new Date().toISOString().slice(0,10)}.csv`; a.click()
            }} style={{background:'#059669', color:'white', border:'3px solid black', padding:'8px 14px', borderRadius:999, fontWeight:900, fontSize:11}}>📥 EXCEL CSV</button>
            <button onClick={carregar} style={{border:'3px solid black', padding:'8px 14px', borderRadius:999, fontWeight:900, fontSize:11}}>ATUALIZAR</button>
            <a href="/" style={{background:'black', color:'white', padding:'8px 14px', borderRadius:999, fontWeight:900, fontSize:11, textDecoration:'none'}}>SITE</a>
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:12, marginTop:12}}>
          <div style={{background:'white', border:'3px solid black', borderRadius:20, padding:16}}>
            <h2 style={{fontWeight:900, color:'black', borderBottom:'3px solid black', paddingBottom:8}}>🏆 RANKING COM FOTO</h2>
            <div style={{marginTop:12, display:'grid', gap:10}}>
              {ranking.map(([id,qtd]:any,i)=>
                <div key={id} style={{display:'flex', alignItems:'center', gap:10, border:'3px solid black', borderRadius:16, padding:8, background:i===0?'#FEF08A':'white'}}>
                  <span style={{background:'black', color:'white', width:28, height:28, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:12}}>{i+1}</span>
                  <div style={{width:44, height:44, borderRadius:999, background:'#E2E8F0', border:'2px solid black', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:10}}>{CANDIDATOS[id]?.nome?.[0] || "?"}</div>
                  <div style={{flex:1}}><p style={{fontWeight:900, fontSize:13, color:'black', margin:0}}>{CANDIDATOS[id]?.nome || id}</p><p style={{fontWeight:700, fontSize:11, color:'#475569', margin:0}}>{qtd} votos • {total?((qtd/total)*100).toFixed(1):0}%</p></div>
                  <span style={{fontWeight:900, fontSize:16, color:'black'}}>{qtd}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{background:'white', border:'3px solid black', borderRadius:20, padding:16}}>
            <h2 style={{fontWeight:900, color:'black', borderBottom:'3px solid black', paddingBottom:8}}>📋 VOTOS CPF AUDITORIA</h2>
            <div style={{marginTop:12, maxHeight:500, overflow:'auto', display:'grid', gap:8}}>
              {votos.map((v:any,i)=>
                <div key={v.id} style={{border:'2px solid #CBD5E1', borderRadius:12, padding:8, background: v.cpf_hash?.includes('leg')?'#FEF9C3':'#F8FAFC'}}>
                  <div style={{display:'flex', justifyContent:'space-between'}}><span style={{fontWeight:900, fontSize:12, color:'black'}}>{i+1}. {CANDIDATOS[v.candidato_id]?.nome || v.candidato_id}</span><span style={{fontWeight:700, fontSize:10, background:'black', color:'white', padding:'2px 6px', borderRadius:999}}>{new Date(v.created_at).toLocaleString('pt-BR')}</span></div>
                  <div style={{fontWeight:700, fontSize:11, fontFamily:'monospace', marginTop:4, color:'black'}}>***.***.***-{v.cpf_hash?.slice(-2) || "**"} | HASH:{v.cpf_hash?.slice(0,8)} {v.cpf_hash?.includes('leg')?"(LEGADO)":"✓ VÁLIDO"}</div>
                </div>
              )}
            </div>
            <button onClick={async()=>{if(confirm('Limpar votos LEGADOS e deixar só CPF real?')){await supabase.from('votos').delete().like('cpf_hash','%leg%'); carregar()}}} style={{width:'100%', background:'#FBBF24', border:'2px solid black', padding:10, borderRadius:999, fontWeight:900, fontSize:11, marginTop:12}}>🧹 LIMPAR LEGADOS (hash-leg)</button>
          </div>
        </div>
      </div>
    </div>
  )
}