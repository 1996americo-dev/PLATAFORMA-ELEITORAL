"use client"
import React from "react"

export default function Vendas(){
const [nome,setNome]=React.useState("")
const [lista,setLista]=React.useState<any[]>([])

React.useEffect(()=>{
  const s=localStorage.getItem("vendas_lista")
  if(s) setLista(JSON.parse(s))
},[])

function salvarLista(nova:any[]){
  setLista(nova)
  localStorage.setItem("vendas_lista",JSON.stringify(nova))
}

function gerar(){
  if(!nome) return alert("Digite o nome do cliente")
  const codigo = "LIBERADO-"+Math.floor(1000+Math.random()*9000)
  const novaVenda = {id:Date.now(),nome,codigo,data:new Date().toLocaleString(),link:`${window.location.origin}/?codigo=${codigo}`}
  const nova=[novaVenda,...lista]
  salvarLista(nova)
  setNome("")
  alert(`Código gerado: ${codigo}\nLink: ${novaVenda.link}`)
}

function cancelar(id:number,codigo:string){
  if(!confirm("Cancelar esse usuário? O código dele vai parar de funcionar!")) return
  const nova=lista.filter(v=>v.id!==id)
  salvarLista(nova)
  // adiciona na lista de bloqueados
  const bloqueados = JSON.parse(localStorage.getItem("codigos_bloqueados")||"[]")
  bloqueados.push(codigo)
  localStorage.setItem("codigos_bloqueados",JSON.stringify(bloqueados))
  alert("Usuário cancelado! O código "+codigo+" não funciona mais.")
}

function copiar(texto:string){
  navigator.clipboard.writeText(texto)
  alert("Copiado: "+texto)
}

return(
<div style={{fontFamily:"system-ui",minHeight:"100vh",background:"black",padding:20}}>
<div style={{maxWidth:700,margin:"0 auto"}}>
<h1 style={{color:"#facc15",fontWeight:900}}>💰 VENDAS - {lista.length} CLIENTES</h1>
<a href="/admin" style={{color:"white",fontSize:12}}>← Voltar Admin</a>

<div style={{background:"white",border:"4px solid #facc15",borderRadius:12,padding:14,marginTop:14}}>
<div style={{fontWeight:900,fontSize:12}}>GERAR NOVO ACESSO:</div>
<div style={{display:"flex",gap:6,marginTop:8}}>
<input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome do cliente que pagou" style={{flex:1,padding:10,border:"3px solid black",borderRadius:8,fontWeight:700}}/>
<button onClick={gerar} style={{background:"black",color:"#facc15",fontWeight:900,padding:"10px 16px",borderRadius:8,border:"3px solid black",cursor:"pointer"}}>GERAR CÓDIGO</button>
</div>
</div>

<div style={{marginTop:14}}>
{lista.length===0 && <div style={{color:"white",textAlign:"center",padding:20,border:"2px dashed #facc15",borderRadius:10}}>Nenhuma venda ainda</div>}
{lista.map(v=>(
<div key={v.id} style={{background:"white",border:"3px solid black",borderRadius:10,padding:12,marginBottom:8}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
<div>
<div style={{fontWeight:900}}>{v.nome}</div>
<div style={{fontSize:11,fontWeight:700}}>Código: {v.codigo}</div>
<div style={{fontSize:10,color:"#64748b"}}>{v.data}</div>
</div>
<button onClick={()=>cancelar(v.id,v.codigo)} style={{background:"#ef4444",color:"white",fontWeight:900,padding:"8px 12px",borderRadius:8,border:"2px solid black",cursor:"pointer",fontSize:11}}>CANCELAR</button>
</div>
<div style={{display:"flex",gap:6,marginTop:8}}>
<button onClick={()=>copiar(v.codigo)} style={{flex:1,background:"#f1f5f9",border:"2px solid black",borderRadius:6,padding:6,fontSize:11,fontWeight:900,cursor:"pointer"}}>COPIAR CÓDIGO</button>
<button onClick={()=>copiar(v.link)} style={{flex:1,background:"#22c55e",color:"white",border:"2px solid black",borderRadius:6,padding:6,fontSize:11,fontWeight:900,cursor:"pointer"}}>COPIAR LINK LIBERADO</button>
</div>
</div>
))}
</div>
</div>
</div>
)
}