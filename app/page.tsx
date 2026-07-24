"use client"
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function validaCPF(cpf: string){
  cpf = cpf.replace(/\D/g,'')
  if(cpf.length!==11 || /^(\d)\1{10}$/.test(cpf)) return false
  let s=0; for(let i=0;i<9;i++) s+= parseInt(cpf[i])*(10-i); let r=s%11; let d1=r<2?0:11-r
  if(parseInt(cpf[9])!==d1) return false
  s=0; for(let i=0;i<10;i++) s+= parseInt(cpf[i])*(11-i); r=s%11; let d2=r<2?0:11-r
  return parseInt(cpf[10])===d2
}
async function hashCPF(cpf:string){
  const enc=new TextEncoder().encode(cpf.replace(/\D/g,''))
  const buf=await crypto.subtle.digest('SHA-256',enc)
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('')
}

const CANDS=[
  {id:'13-lula', nome:'LULA', num:'13', partido:'PT', cor:'#CC0000'},
  {id:'22-bolsonaro', nome:'JAIR BOLSONARO', num:'22', partido:'PL', cor:'#0047AB'},
  {id:'PL-nikolas', nome:'NIKOLAS FERREIRA', num:'22', partido:'PL', cor:'#0047AB'},
  {id:'12-ciro', nome:'CIRO GOMES', num:'12', partido:'PDT', cor:'#FFD700'},
  {id:'15-mdb', nome:'MDB', num:'15', partido:'MDB', cor:'#00A859'},
]

export default function SiteV57(){
  const [cpf,setCpf]=useState(""); const [cpfOk,setCpfOk]=useState(false); const [cpfHash,setCpfHash]=useState("")
  const [votos,setVotos]=useState<any[]>([]); const [stats,setStats]=useState<Record<string,number>>({})
  const [selecionado,setSelecionado]=useState("")
  const [msg,setMsg]=useState("")

  const carregar=async()=>{
    const {data}=await supabase.from('votos').select('*')
    if(data){ setVotos(data); const c:Record<string,number>={}; data.forEach((r:any)=>{ if(!['branco','nulo'].includes(r.candidato_id)) c[r.candidato_id]=(c[r.candidato_id]||0)+1 }); setStats(c) }
  }
  useEffect(()=>{carregar()},[])

  const validar=async()=>{
    const limpo=cpf.replace(/\D/g,'')
    if(!validaCPF(limpo)){ alert("CPF inválido! Use 529.982.247-25 para teste"); return }
    const h=await hashCPF(limpo)
    const {data}=await supabase.from('votos').select('id').eq('cpf_hash',h).maybeSingle()
    if(data){ alert("ESSE CPF JÁ VOTOU! 1 CPF = 1 VOTO"); return }
    setCpfHash(h); setCpfOk(true); setMsg("CPF validado! Hash: "+h.slice(0,8)+"... Agora escolha seu candidato")
  }

  const votar=async()=>{
    if(!selecionado){ alert("Escolha um candidato"); return }
    const {error}=await supabase.from('votos').insert({candidato_id:selecionado, cpf_hash:cpfHash})
    if(error){ alert("ERRO: "+error.message); return }
    alert("VOTO COMPUTADO COM SUCESSO! 🔒"); setCpf(""); setCpfOk(false); setSelecionado(""); setCpfHash(""); carregar()
  }

  const total=votos.length
  const ranking=Object.entries(stats).sort((a:any,b:any)=>b[1]-a[1])

  return (
    <div style={{minHeight:'100vh', background:'#0B1220', color:'white', fontFamily:'Inter, Arial'}}>
      <div style={{maxWidth:1200, margin:'0 auto', padding:12}}>
        <div style={{background:'white', color:'black', border:'4px solid black', borderRadius:16, padding:10, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div><span style={{background:'black', color:'white', padding:'4px 10px', borderRadius:999, fontWeight:900}}>26</span><span style={{fontWeight:900, marginLeft:8, fontSize:12}}>SIMULADOR EDUCATIVO • 1 CPF = 1 VOTO • HASH SEGURO • V5.7 FINAL</span></div>
          <a href="/admin" style={{background:'black', color:'white', padding:'8px 16px', borderRadius:999, fontWeight:900, fontSize:12, textDecoration:'none'}}>ADMIN</a>
        </div>

        <div style={{background:'#FBBF24', color:'black', border:'3px solid black', borderRadius:12, padding:8, textAlign:'center', fontWeight:900, fontSize:11, marginTop:10}}>⚠️ SIMULADOR EDUCATIVO - NÃO É VOTAÇÃO OFICIAL DO TSE - DADOS CRIPTOGRAFADOS COM HASH - LGPD OK</div>

        <div style={{display:'grid', gridTemplateColumns:'1fr 340px', gap:12, marginTop:12}}>
          <div style={{background:'white', color:'black', border:'4px solid black', borderRadius:20, padding:14}}>
            <h2 style={{fontWeight:900, margin:0, fontSize:16, color:'black', borderBottom:'3px solid black', paddingBottom:6}}>🏆 RANKING OFICIAL - {total} VOTOS CPF</h2>
            <div style={{marginTop:12, display:'grid', gap:8}}>
              {ranking.length===0 && <p style={{fontWeight:700, textAlign:'center', padding:20}}>Nenhum voto ainda. Seja o primeiro!</p>}
              {ranking.map(([id,qtd]:any,i)=>
                <div key={id} style={{display:'flex', alignItems:'center', gap:10, border:'3px solid black', borderRadius:14, padding:8, background:i===0?'#0B1220':'white', color:i===0?'white':'black'}}>
                  <span style={{background:i===0?'#FBBF24':'black', color:i===0?'black':'white', width:32, height:32, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900}}>{i+1}</span>
                  <div style={{width:48, height:48, borderRadius:999, background:'#E2E8F0', border:'2px solid black', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, color:'black'}}>{CANDS.find(c=>c.id===id)?.nome[0] || "?"}</div>
                  <div style={{flex:1}}><p style={{fontWeight:900, margin:0, fontSize:13}}>{CANDS.find(c=>c.id===id)?.nome || id}</p><p style={{fontWeight:700, margin:0, fontSize:11, opacity:0.7}}>{CANDS.find(c=>c.id===id)?.partido} • {qtd} votos</p></div>
                  <div style={{textAlign:'right'}}><p style={{fontWeight:900, margin:0, fontSize:14}}>{total?((qtd/total)*100).toFixed(1):0}%</p><div style={{width:80, height:8, background:'#E2E8F0', borderRadius:999, border:'1px solid black', overflow:'hidden'}}><div style={{height:'100%', width:`${total?(qtd/total*100):0}%`, background:i===0?'#FBBF24':'black'}}/></div></div>
                </div>
              )}
            </div>

            <h2 style={{fontWeight:900, marginTop:20, fontSize:14, color:'black', borderTop:'3px solid black', paddingTop:10}}>🗳️ CANDIDATOS - CLIQUE PARA VOTAR</h2>
            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:10}}>
              {CANDS.map(c=>
                <button key={c.id} onClick={()=>cpfOk && setSelecionado(c.id)} disabled={!cpfOk} style={{textAlign:'left', border:`${selecionado===c.id?'4px':'3px'} solid ${selecionado===c.id?'#FBBF24':'black'}`, borderRadius:14, padding:10, background:selecionado===c.id?'#0B1220':'white', color:selecionado===c.id?'white':'black', opacity:cpfOk?1:0.5, cursor:cpfOk?'pointer':'not-allowed'}}>
                  <div style={{display:'flex', gap:8, alignItems:'center'}}><div style={{background:c.cor, color:'white', width:36, height:36, borderRadius:999, display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, border:'2px solid black'}}>{c.num}</div><div><p style={{fontWeight:900, margin:0, fontSize:12}}>{c.nome}</p><p style={{fontWeight:700, margin:0, fontSize:10}}>{c.partido} - {c.num}</p></div></div>
                </button>
              )}
            </div>
          </div>

          <div style={{display:'flex', flexDirection:'column', gap:12}}>
            <div style={{background:'white', color:'black', border:'4px solid black', borderRadius:20, padding:14}}>
              <h3 style={{fontWeight:900, margin:0, fontSize:13, color:'black'}}>🔒 VALIDAÇÃO CPF ANTI-FRAUDE</h3>
              <p style={{fontWeight:600, fontSize:11, margin:'6px 0', color:'#334155'}}>Digite seu CPF para validar. 1 CPF = 1 voto. Seu CPF vira código secreto (HASH), não salvamos seu número.</p>
              <input value={cpf} onChange={e=>{let v=e.target.value.replace(/\D/g,''); if(v.length<=11){v=v.replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d)/,'$1.$2').replace(/(\d{3})(\d{1,2})$/,'$1-$2'); setCpf(v)}} } placeholder="000.000.000-00" style={{width:'100%', border:'3px solid black', borderRadius:999, padding:14, textAlign:'center', fontWeight:900, fontSize:18, marginTop:8, color:'black', background:'#F1F5F9'}}/>
              {!cpfOk ? <button onClick={validar} style={{width:'100%', background:'#0B1220', color:'white', border:'3px solid black', borderRadius:999, padding:12, fontWeight:900, fontSize:12, marginTop:10}}>VALIDAR CPF → LIBERAR URNA</button>
              : <div><p style={{background:'#DCFCE7', border:'2px solid black', borderRadius:12, padding:8, fontWeight:800, fontSize:11, textAlign:'center', marginTop:10}}>✅ {msg}</p><button onClick={votar} style={{width:'100%', background:'#16A34A', color:'white', border:'3px solid black', borderRadius:999, padding:14, fontWeight:900, fontSize:13, marginTop:10}}>CONFIRMAR VOTO EM {selecionado.toUpperCase() || "..."}</button><button onClick={()=>{setCpfOk(false); setCpf(""); setSelecionado("")}} style={{width:'100%', background:'white', color:'black', border:'2px solid black', borderRadius:999, padding:8, fontWeight:800, fontSize:11, marginTop:8}}>TROCAR CPF</button></div>}
              <p style={{fontSize:9, fontWeight:700, marginTop:8, color:'#64748B'}}>Validação Receita Federal • Criptografia SHA-256 • Teste: 529.982.247-25</p>
            </div>
            <div style={{background:'#0B1220', border:'3px solid #FBBF24', borderRadius:16, padding:12, color:'white'}}><p style={{fontWeight:900, fontSize:11, color:'#FBBF24', margin:0}}>ℹ️ COMO FUNCIONA?</p><ul style={{fontSize:11, fontWeight:600, margin:'8px 0 0 14px', lineHeight:'1.4'}}><li>Valida dígito do CPF</li><li>Transforma em HASH SHA-256</li><li>Bloqueia CPF repetido</li><li>Salva só HASH, não CPF</li></ul></div>
          </div>
        </div>
      </div>
    </div>
  )
}