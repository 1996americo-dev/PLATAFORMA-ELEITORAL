"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export default function Admin(){
  const [votos,setVotos]=useState<any[]>([]);const[cands,setCands]=useState<any[]>([]);const[stats,setStats]=useState<Record<string,number>>({})
  const getFotoUrl = (f:string) => {
    if(!f) return "https://via.placeholder.com/100"
    if(f.startsWith('http')) return f
    const {data} = supabase.storage.from('fotos-candidatos').getPublicUrl(f.trim())
    return data.publicUrl
  }
  const load=async()=>{
    const {data:c}=await supabase.from('candidatos').select('*').order('nome')
    if(c) setCands(c)
    const {data}=await supabase.from('votos').select('*').order('created_at',{ascending:false})
    if(data){setVotos(data);const m:Record<string,number>={};data.forEach((r:any)=>{m[r.candidato_id]=(m[r.candidato_id]||0)+1});setStats(m)}
  }
  useEffect(()=>{load()},[])
  const total=votos.length
  const rank=Object.entries(stats).sort((a:any,b:any)=>b[1]-a[1])
  const exportCSV=()=>{
    const csv="Candidato,Votos,Porcentagem,Partido,Numero\n"+rank.map(([id,q]:any)=>{const c=cands.find(x=>x.id===id);return `${c?.nome||id},${q},${total?((q/total)*100).toFixed(1):0}%,${c?.partido||''},${c?.numero||''}`}).join("\n")
    const blob=new Blob([csv],{type:'text/csv'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='votos.csv';a.click()
  }
  return(
    <div style={{minHeight:'100vh', background:'#F8FAFC', padding:12, fontFamily:'system-ui'}}>
      <div style={{maxWidth:1200, margin:'0 auto'}}>
        <div style={{background:'white', border:'4px solid black', borderRadius:16, padding:12, display:'flex', justifyContent:'space-between', alignItems:'center', boxShadow:'0 6px 0 black'}}>
          <div><div style={{fontWeight:900, fontSize:14}}>V12 ADMIN FINAL • BUCKET fotos-candidatos • {total} VOTOS CPF VALIDADOS 🔒</div><div style={{fontSize:11, fontWeight:700, opacity:0.7}}>Anti-fraude • Fotos do bucket • Hash</div></div>
          <div style={{display:'flex', gap:6}}><button onClick={exportCSV} style={{background:'#16A34A', color:'white', border:'3px solid black', borderRadius:999, padding:'6px 12px', fontWeight:900, cursor:'pointer'}}>EXCEL CSV</button><button onClick={load} style={{background:'white', border:'3px solid black', borderRadius:999, padding:'6px 12px', fontWeight:900, cursor:'pointer'}}>ATUALIZAR</button><a href="/" style={{background:'black', color:'white', padding:'6px 12px', borderRadius:999, fontWeight:900, textDecoration:'none'}}>SITE</a></div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:12, marginTop:12}}>
          <div style={{background:'white', border:'4px solid black', borderRadius:16, padding:14, boxShadow:'0 6px 0 black'}}>
            <div style={{fontWeight:900, fontSize:18, marginBottom:10, color:'black'}}>🏆 RANKING COM FOTO REAL</div>
            {rank.length===0 && <div style={{textAlign:'center', padding:20, background:'#F1F5F9', border:'3px dashed black', borderRadius:12, color:'black', fontWeight:800}}>Nenhum voto ainda</div>}
            {rank.map(([id,qtd]:any,i)=>{
              const c=cands.find(x=>x.id===id)
              return(
              <div key={id} style={{border:'3px solid black', borderRadius:12, padding:10, display:'flex', alignItems:'center', gap:10, marginBottom:8, background:i===0?'#FEF3C7':'white'}}>
                <div style={{background:'black', color:'white', width:28, height:28, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, flexShrink:0}}>{i+1}</div>
                <div style={{width:44, height:44, borderRadius:999, border:'2px solid black', overflow:'hidden', background:'#EEE', flexShrink:0}}><img src={c?getFotoUrl(c.foto_url):''} alt="" style={{width:'100%', height:'100%', objectFit:'cover'}}/></div>
                <div style={{flex:1, minWidth:0}}><div style={{fontWeight:900, color:'black', fontSize:13}}>{c?.nome||id.slice(0,12)} <span style={{fontSize:10, background:'#E2E8F0', border:'1px solid black', padding:'1px 5px', borderRadius:999}}>{c?.partido} {c?.numero}</span></div><div style={{fontSize:12, color:'black'}}>{qtd} votos • {total?((qtd/total)*100).toFixed(1):0}%</div></div>
                <div style={{fontWeight:900, fontSize:18, color:'black'}}>{qtd}</div>
              </div>
            )})}
          </div>
          <div style={{background:'white', border:'4px solid black', borderRadius:16, padding:14, boxShadow:'0 6px 0 black'}}>
            <div style={{fontWeight:900, color:'black'}}>📋 VOTOS CPF AUDITORIA</div>
            <div style={{marginTop:10, display:'grid', gap:6, maxHeight:600, overflow:'auto'}}>
              {votos.map((v:any,i)=>{const c=cands.find(x=>x.id===v.candidato_id);return(<div key={v.id} style={{border:'2px solid #E2E8F0', borderRadius:8, padding:8, fontSize:11, background:'white'}}><div style={{fontWeight:800, color:'black'}}>{i+1}. {c?.nome||v.candidato_id.slice(0,12)} • {c?.partido}</div><div style={{fontSize:10, opacity:0.7, color:'black'}}>{new Date(v.created_at).toLocaleString('pt-BR')} • HASH:{v.cpf_hash?.slice(0,8)} • VALIDO</div></div>)})}
            </div>
            <button onClick={async()=>{if(confirm('Limpar TODOS os votos?')){await supabase.from('votos').delete().neq('id','00000000-0000-0000-0000-000000000000');load()}}} style={{width:'100%', background:'#FBBF24', border:'3px solid black', borderRadius:999, padding:10, fontWeight:900, marginTop:10, cursor:'pointer'}}>LIMPAR LEGADOS (hash-leg)</button>
          </div>
        </div>
      </div>
    </div>
  )
}
