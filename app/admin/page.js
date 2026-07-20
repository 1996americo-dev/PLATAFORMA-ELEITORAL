"use client"
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Admin(){
  const [logado,setLogado]=useState(false)
  const [senha,setSenha]=useState('')
  const [form,setForm]=useState({nome:'',partido:'',numero:'',cargo:'Vereadora',cidade:'Trindade',propostas:''})
  const [foto,setFoto]=useState(null)
  const [lista,setLista]=useState([])

  useEffect(()=>{ if(logado) carregar() },[logado])
  async function carregar(){
    const {data}=await supabase.from('candidatos').select('*').order('created_at',{ascending:false})
    setLista(data||[])
  }
  async function salvar(){
    if(!form.nome ||!form.numero) return alert('Coloca nome e número!')
    try{
      let foto_url=""
      if(foto){
        const nome = Date.now()+".jpg"
        const {error} = await supabase.storage.from('fotos-candidatos').upload(nome, foto)
        if(error) throw error
        const {data} = supabase.storage.from('fotos-candidatos').getPublicUrl(nome)
        foto_url = data.publicUrl
      }
      const {error} = await supabase.from('candidatos').insert([{...form, foto_url}])
      if(error) throw error
      alert('Candidato salvo!')
      setForm({nome:'',partido:'',numero:'',cargo:'Vereadora',cidade:'Trindade',propostas:''})
      carregar()
    }catch(e){ alert(e.message) }
  }

  if(!logado) return <div style={{padding:60,textAlign:'center'}}><h2>Painel Admin</h2><input type="password" placeholder="Senha" value={senha} onChange={e=>setSenha(e.target.value)} /><br/><br/><button onClick={()=>senha==='123456'?setLogado(true):alert('senha é 123456')} style={{padding:10,background:'black',color:'white'}}>Entrar</button></div>

  return (
    <div style={{padding:20,maxWidth:600,margin:'0 auto'}}>
      <h1 style={{fontWeight:'bold',fontSize:22}}>Plataforma Limpa - Novo</h1>
      <input placeholder="Nome" value={form.nome} onChange={e=>setForm({...form,nome:e.target.value})} style={{width:'100%',padding:8,marginTop:10,border:'1px solid #ccc'}}/>
      <input placeholder="Número" value={form.numero} onChange={e=>setForm({...form,numero:e.target.value})} style={{width:'100%',padding:8,marginTop:8,border:'1px solid #ccc'}}/>
      <input placeholder="Partido" value={form.partido} onChange={e=>setForm({...form,partido:e.target.value})} style={{width:'100%',padding:8,marginTop:8,border:'1px solid #ccc'}}/>
      <input type="file" accept="image/*" onChange={e=>setFoto(e.target.files[0])} style={{marginTop:10}}/>
      <button onClick={salvar} style={{width:'100%',marginTop:15,padding:12,background:'#16a34a',color:'white',fontWeight:'bold'}}>Salvar Candidato</button>
      <hr style={{margin:'20px 0'}}/>
      {lista.map(c=><div key={c.id} style={{display:'flex',gap:10,marginBottom:10,alignItems:'center'}}>{c.foto_url && <img src={c.foto_url} width={50} height={50} style={{borderRadius:'50%',objectFit:'cover'}}/>}<div><b>{c.nome}</b> - {c.numero}</div></div>)}
    </div>
  )
}