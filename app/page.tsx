"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

function validaCPF(c:string){c=c.replace(/\D/g,'');if(c.length!==11||/^(\d)\1{10}$/.test(c))return false;let s=0;for(let i=0;i<9;i++)s+=parseInt(c[i])*(10-i);let r=s%11;let d1=r<2?0:11-r;if(parseInt(c[9])!==d1)return false;s=0;for(let i=0;i<10;i++)s+=parseInt(c[i])*(11-i);r=s%11;let d2=r<2?0:11-r;return parseInt(c[10])===d2}
async function hashCPF(c:string){const e=new TextEncoder().encode(c.replace(/\D/g,''));const b=await crypto.subtle.digest('SHA-256',e);return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('')}

export default function Page(){
  const [cpf,setCpf]=useState("");const[ok,setOk]=useState(false);const[hash,setHash]=useState("");const[votos,setVotos]=useState<any[]>([]);const[stats,setStats]=useState<Record<string,number>>({});const[sel,setSel]=useState("")
  const load=async()=>{const {data}=await supabase.from('votos').select('*');if(data){setVotos(data);const m:Record<string,number>={};data.forEach((r:any)=>{m[r.candidato_id]=(m[r.candidato_id]||0)+1});setStats(m)}}
  useEffect(()=>{load()},[])
  const validar=async()=>{const l=cpf.replace(/\D/g,'');if(!validaCPF(l)){alert("CPF inválido! Teste: 52998224725");return}const h=await hashCPF(l);const {data}=await supabase.from('votos').select('id').eq('cpf_hash',h).maybeSingle();if(data){alert("ESTE CPF JÁ VOTOU!");return}setHash(h);setOk(true)}
  const votar=async()=>{if(!sel){alert("Escolha candidato");return}const {error}=await supabase.from('votos').insert({candidato_id:sel,cpf_hash:hash});if(error){alert(error.message);return}alert("VOTO COMPUTADO!");setCpf("");setOk(false);setSel("");load()}
  const total=votos.length;const rank=Object.entries(stats).sort((a:any,b:any)=>b[1]-a[1])
  return(
    <div style={{minHeight:'100vh', background:'#0B1220', padding:16, color:'white'}}>
      <div style={{maxWidth:1200, margin:'0 auto'}}>
        <div style={{background:'#FFFFFF', border:'4px solid black', borderRadius:16, padding:12, display:'flex', justifyContent:'space-between'}}>
          <div style={{color:'black', fontWeight:900, fontSize:13}}>PLATAFORMA 2026 • SIMULADOR EDUCATIVO • 1 CPF = 1 VOTO • HASH SEGURO</div>
          <a href="/admin" style={{background:'black', color:'white', padding:'6px 14px', borderRadius:999, fontWeight:900, fontSize:12, textDecoration:'none'}}>ADMIN</a>
        </div>
        <div style={{background:'#FBBF24', border:'3px solid black', color:'black', borderRadius:12, padding:8, textAlign:'center', fontWeight:900, fontSize:12, marginTop:10}}>⚠️ SIMULADOR EDUCATIVO - NÃO É VOTAÇÃO OFICIAL DO TSE - DADOS COM HASH SHA-256 - LGPD</div>
        
        <div style={{display:'grid', gridTemplateColumns:'1fr 360px', gap:12, marginTop:12}}>
          <div style={{background:'#FFFFFF', border:'4px solid black', borderRadius:20, padding:16}}>
            <div style={{color:'black', fontWeight:900, fontSize:16, borderBottom:'4px solid black', paddingBottom:8}}>🏆 RANKING - {total} VOTOS CPF VALIDADOS</div>
            <div style={{marginTop:12, display:'grid', gap:8}}>
              {rank.map(([id,qtd]:any,i)=><div key={id} style={{background:i===0?'#0B1220':'#F8FAFC', color:i===0?'white':'black', border:'3px solid black', borderRadius:14, padding:12, display:'flex', alignItems:'center', gap:10}}>
                <div style={{background:i===0?'#FBBF24':'black', color:i===0?'black':'white', width:32, height:32, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>{i+1}</div>
                <div style={{flex:1, fontWeight:900, fontSize:13}}>{id.toUpperCase()} <span style={{fontWeight:700, fontSize:11}}>• {qtd} votos</span></div>
                <div style={{fontWeight:900}}>{total?((qtd/total)*100).toFixed(1):0}%</div>
              </div>)}
            </div>

            <div style={{marginTop:18, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8}}>
              {['13-lula','22-bolsonaro','PL-nikolas','12-ciro','15-mdb','30-novo'].map(id=><button key={id} onClick={()=>ok&&setSel(id)} style={{border:`${sel===id?'4px':'3px'} solid ${sel===id?'#FBBF24':'black'}`, borderRadius:14, padding:12, background:sel===id?'#0B1220':'white', color:sel===id?'white':'black', fontWeight:900, textAlign:'left', cursor:ok?'pointer':'not-allowed', opacity:ok?1:0.5}}>{id.toUpperCase()}</button>)}
            </div>
          </div>

          <div style={{background:'white', border:'4px solid black', borderRadius:20, padding:14, height:'fit-content'}}>
            <div style={{color:'black', fontWeight:900, fontSize:13}}>🔒 VALIDAÇÃO CPF</div>
            <div style={{color:'#475569', fontWeight:600, fontSize:11, marginTop:6}}>1 CPF = 1 voto. Seu CPF vira HASH secreto, não salvamos número.</div>
            <input value={cpf} onChange={e=>{let v=e.target.value.replace(/\D/g,'');if(v.length<=11){v=v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2');setCpf(v)}}} placeholder="000.000.000-00" style={{width:'100%', border:'4px solid black', borderRadius:999, padding:14, textAlign:'center', fontWeight:900, fontSize:20, marginTop:12, color:'black', background:'#F1F5F9'}}/>
            {!ok?<button onClick={validar} style={{width:'100%', background:'black', color:'white', border:'3px solid black', borderRadius:999, padding:12, fontWeight:900, marginTop:10}}>VALIDAR CPF → LIBERAR URNA</button>:<button onClick={votar} style={{width:'100%', background:'#16A34A', color:'white', border:'3px solid black', borderRadius:999, padding:14, fontWeight:900, marginTop:10}}>CONFIRMAR VOTO: {sel||'ESCOLHA'}</button>}
            {ok&&<div style={{background:'#DCFCE7', border:'2px solid black', borderRadius:10, padding:8, marginTop:10, color:'black', fontWeight:800, fontSize:11, textAlign:'center'}}>✅ CPF VALIDADO HASH:{hash.slice(0,8)}...</div>}
          </div>
        </div>
      </div>
    </div>
  )
}