"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Admin(){
  const [votos,setVotos]=useState<any[]>([]);const[cands,setCands]=useState<any[]>([]);const[stats,setStats]=useState<Record<string,number>>({})
  const getFotoUrl = (f:string) => {
    if(!f) return ""
    if(f.startsWith('http')) return f
    const {data} = supabase.storage.from('fotos-candidatos').getPublicUrl(f.trim())
    return data.publicUrl
  }
  const load=async()=>{
    const {data:c}=await supabase.from('candidatos').select('*')
    if(c) setCands(c)
    const {data}=await supabase.from('votos').select('*').order('created_at',{ascending:false})
    if(data){setVotos(data);const m:Record<string,number>={};data.forEach((r:any)=>{m[r.candidato_id]=(m[r.candidato_id]||0)+1});setStats(m)}
  }
  useEffect(()=>{load()},[])
  const total=votos.length
  const rank=Object.entries(stats).sort((a:any,b:any)=>b[1]-a[1])
  return(
    <div style={{minHeight:'100vh', background:'#F8FAFC', padding:12}}>
      <div style={{maxWidth:1200, margin:'0 auto'}}>
        <div style={{background:'white', border:'4px solid black', borderRadius:16, padding:12, display:'flex', justifyContent:'space-between', boxShadow:'0 6px 0 black'}}><div style={{fontWeight:900}}>V11 ADMIN • BUCKET fotos-candidatos • {total} VOTOS</div><div><button onClick={load} style={{background:'white', border:'3px solid black', borderRadius:999, padding:'6px 12px', fontWeight:900, marginRight:6}}>ATUALIZAR</button><a href="/" style={{background:'black', color:'white', padding:'6px 12px', borderRadius:999, fontWeight:900, textDecoration:'none'}}>SITE</a></div></div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:12, marginTop:12}}>
          <div style={{background:'white', border:'4px solid black', borderRadius:16, padding:14, boxShadow:'0 6px 0 black'}}>
            <div style={{fontWeight:900, fontSize:18, marginBottom:10}}>🏆 RANKING COM FOTO</div>
            {rank.map(([id,qtd]:any,i)=>{
              const c=cands.find(x=>x.id===id)
              return(
              <div key={id} style={{border:'3px solid black', borderRadius:12, padding:10, display:'flex', alignItems:'center', gap:10, marginBottom:8, background:i===0?'#FEF3C7':'white'}}>
                <div style={{background:'black', color:'white', width:28, height:28, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>{i+1}</div>
                <div style={{width:44, height:44, borderRadius:999, border:'2px solid black', overflow:'hidden', background:'#EEE'}}><img src={c?getFotoUrl(c.foto_url):''} style={{width:'100%', height:'100%', objectFit:'cover'}}/></div>
                <div style={{flex:1}}><div style={{fontWeight:900}}>{c?.nome||id}</div><div style={{fontSize:12}}>{qtd} votos • {total?((qtd/total)*100).toFixed(1):0}% • {c?.partido} {c?.numero}</div></div>
                <div style={{fontWeight:900, fontSize:18}}>{qtd}</div>
              </div>
            )})}
          </div>
          <div style={{background:'white', border:'4px solid black', borderRadius:16, padding:14, boxShadow:'0 6px 0 black'}}>
            <div style={{fontWeight:900}}>📋 VOTOS CPF AUDITORIA</div>
            <div style={{marginTop:10, display:'grid', gap:6, maxHeight:600, overflow:'auto'}}>
              {votos.map((v:any,i)=><div key={v.id} style={{border:'2px solid #E2E8F0', borderRadius:8, padding:8, fontSize:11}}><div style={{fontWeight:800}}>{i+1}. {v.candidato_id.slice(0,8)}... → {cands.find(c=>c.id===v.candidato_id)?.nome}</div><div style={{fontSize:10, opacity:0.7}}>{new Date(v.created_at).toLocaleString()} • HASH:{v.cpf_hash?.slice(0,8)}</div></div>)}
            </div>
            <button onClick={async()=>{if(confirm('Limpar todos votos?')){await supabase.from('votos').delete().neq('id','00000000-0000-0000-0000-000000000000');load()}}} style={{width:'100%', background:'#FBBF24', border:'3px solid black', borderRadius:999, padding:10, fontWeight:900, marginTop:10}}>LIMPAR LEGADOS</button>
          </div>
        </div>
      </div>
    </div>
  )
}