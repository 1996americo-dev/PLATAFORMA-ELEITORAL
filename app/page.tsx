"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function validaCPF(c:string){c=c.replace(/\D/g,'');if(c.length!==11||/^(\d)\1{10}$/.test(c))return false;let s=0;for(let i=0;i<9;i++)s+=parseInt(c[i])*(10-i);let r=s%11;let d1=r<2?0:11-r;if(parseInt(c[9])!==d1)return false;s=0;for(let i=0;i<10;i++)s+=parseInt(c[i])*(11-i);r=s%11;let d2=r<2?0:11-r;return parseInt(c[10])===d2}
async function hashCPF(c:string){const e=new TextEncoder().encode(c.replace(/\D/g,''));const b=await crypto.subtle.digest('SHA-256',e);return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}

const CANDS=[
  {id:'13-lula', nome:'CANDIDATO 13', partido:'PT', num:'13', cor:'#CC0000', foto:'https://i.imgur.com/8Km9tLL.png'},
  {id:'22-bolsonaro', nome:'CANDIDATO 22', partido:'PL', num:'22', cor:'#0B3D91', foto:'https://i.imgur.com/k2tG1aH.png'},
  {id:'PL-nikolas', nome:'CANDIDATO PL', partido:'PL', num:'22', cor:'#0B3D91', foto:'https://i.imgur.com/JqYeZ1n.png'},
  {id:'12-ciro', nome:'CANDIDATO 12', partido:'PDT', num:'12', cor:'#FFC500', foto:'https://i.imgur.com/Xy1aBfA.png'},
  {id:'15-mdb', nome:'CANDIDATA 15', partido:'MDB', num:'15', cor:'#009739', foto:''},
  {id:'30-novo', nome:'CANDIDATO 30', partido:'NOVO', num:'30', cor:'#FF6600', foto:''},
]

export default function PageV61(){
  const [cpf,setCpf]=useState("");const[ok,setOk]=useState(false);const[hash,setHash]=useState("");const[votos,setVotos]=useState<any[]>([]);const[stats,setStats]=useState<Record<string,number>>({});const[sel,setSel]=useState("")
  const load=async()=>{const {data}=await supabase.from('votos').select('*').order('created_at',{ascending:false});if(data){setVotos(data);const m:Record<string,number>={};data.forEach((r:any)=>{m[r.candidato_id]=(m[r.candidato_id]||0)+1});setStats(m)}}
  useEffect(()=>{load()},[])
  const validar=async()=>{
    const l=cpf.replace(/\D/g,'');if(!validaCPF(l)){alert("CPF invalido! Teste: 529.982.247-25");return}
    const h=await hashCPF(l)
    const {data}=await supabase.from('votos').select('id').eq('cpf_hash',h).maybeSingle()
    if(data){alert("ESTE CPF JA VOTOU!");return}
    setHash(h);setOk(true)
  }
  const votar=async()=>{
    if(!sel){alert("Escolha candidato");return}
    const {error}=await supabase.from('votos').insert({candidato_id:sel,cpf_hash:hash})
    if(error){alert(error.message);return}
    alert("VOTO COMPUTADO!");setCpf("");setOk(false);setSel("");setHash("");load()
  }
  const total=votos.length
  const rank=Object.entries(stats).sort((a:any,b:any)=>b[1]-a[1])
  return(
    <div style={{minHeight:'100vh', background:'#020617', color:'white', padding:12}}>
      <div style={{maxWidth:1220, margin:'0 auto'}}>
        <div style={{background:'#FFFFFF', border:'4px solid black', borderRadius:16, padding:'10px 14px', display:'flex', justifyContent:'space-between', boxShadow:'0 6px 0 black'}}>
          <div style={{color:'black', fontWeight:900, fontSize:12}}>PLATAFORMA 2026 V6.1 COM FOTOS • SIMULADOR EDUCATIVO • HASH SEGURO</div>
          <a href="/admin" style={{background:'black', color:'white', padding:'7px 16px', borderRadius:999, fontWeight:900, fontSize:12, textDecoration:'none'}}>ADMIN</a>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 360px', gap:14, marginTop:14}}>
          <div style={{background:'#FFFFFF', border:'4px solid black', borderRadius:20, padding:16, boxShadow:'0 8px 0 black'}}>
            <div style={{color:'black', fontWeight:900, fontSize:16, borderBottom:'4px solid black', paddingBottom:8}}>RANKING - {total} VOTOS VALIDADOS</div>
            <div style={{marginTop:12, display:'grid', gap:10}}>
              {rank.map(([id,qtd]:any,i)=>
                <div key={id} style={{background:i===0?'#020617':'#FFFFFF', color:i===0?'white':'black', border:'3px solid black', borderRadius:14, padding:12, display:'flex', alignItems:'center', gap:12, boxShadow:'0 4px 0 black'}}>
                  <div style={{background:i===0?'#FBBF24':'black', color:i===0?'black':'white', minWidth:36, height:36, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>{i+1}</div>
                  <div style={{width:44, height:44, borderRadius:999, background:'#E2E8F0', border:'2px solid black', overflow:'hidden'}}>{CANDS.find(c=>c.id===id)?.foto ? <img src={CANDS.find(c=>c.id===id)?.foto} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <div style={{display:'flex', alignItems:'center', justifyContent:'center', height:'100%', fontWeight:900}}>{id[0]}</div>}</div>
                  <div style={{flex:1, fontWeight:900, fontSize:13}}>{(CANDS.find(c=>c.id===id)?.nome || id).toUpperCase()} - {qtd} votos</div>
                  <div style={{fontWeight:900}}>{total?((qtd/total)*100).toFixed(1):0}%</div>
                </div>
              )}
            </div>
            <div style={{marginTop:20, color:'black', fontWeight:900, fontSize:14, borderTop:'4px solid black', paddingTop:10}}>CANDIDATOS COM FOTO</div>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginTop:10}}>
              {CANDS.map(c=>
                <button key={c.id} onClick={()=>ok&&setSel(c.id)} disabled={!ok} style={{border:`${sel===c.id?'5px':'4px'} solid black`, borderRadius:16, padding:10, background:sel===c.id?'#020617':'#FFFFFF', color:sel===c.id?'white':'black', fontWeight:900, textAlign:'left', cursor:ok?'pointer':'not-allowed', opacity:ok?1:0.55, boxShadow:'0 5px 0 black'}}>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}>
                    <div style={{width:48, height:48, borderRadius:12, background:'#E2E8F0', border:'2px solid black', overflow:'hidden', display:'flex', alignItems:'center', justifyContent:'center'}}>{c.foto ? <img src={c.foto} style={{width:'100%', height:'100%', objectFit:'cover'}}/> : <span style={{fontSize:10}}>{c.num}</span>}</div>
                    <div><div style={{fontSize:12}}>{c.nome}</div><div style={{fontSize:10, opacity:0.7}}>{c.partido} {c.num}</div></div>
                  </div>
                </button>
              )}
            </div>
          </div>
          <div style={{background:'#FFFFFF', border:'4px solid black', borderRadius:20, padding:16, boxShadow:'0 8px 0 black', height:'fit-content'}}>
            <div style={{color:'black', fontWeight:900, fontSize:13}}>VALIDACAO CPF</div>
            <input value={cpf} onChange={e=>{let v=e.target.value.replace(/\D/g,'');if(v.length<=11){v=v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');setCpf(v)}}} placeholder="000.000.000-00" style={{width:'100%', border:'4px solid black', borderRadius:999, padding:14, textAlign:'center', fontWeight:900, fontSize:22, marginTop:12, color:'black', background:'#F1F5F9'}}/>
            {!ok?<button onClick={validar} style={{width:'100%', background:'black', color:'white', border:'3px solid black', borderRadius:999, padding:12, fontWeight:900, marginTop:10}}>VALIDAR CPF</button>:<><div style={{background:'#DCFCE7', border:'3px solid black', borderRadius:12, padding:10, marginTop:10, color:'black', fontWeight:900, fontSize:11, textAlign:'center'}}>VALIDADO {hash.slice(0,8)}</div><button onClick={votar} style={{width:'100%', background:'#16A34A', color:'white', border:'4px solid black', borderRadius:999, padding:14, fontWeight:900, marginTop:10}}>CONFIRMAR {sel}</button></>}
          </div>
        </div>
      </div>
    </div>
  )
}
