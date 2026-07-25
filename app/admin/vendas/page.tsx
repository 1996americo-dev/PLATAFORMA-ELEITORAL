"use client"
import React from "react"
const SENHA="62981796690"
const PIX="62981796690"
const NOME="AMERICO QUISPE QUISPE"
export default function VendasCompleto(){
const [ok,setOk]=React.useState(false)
const [s,setS]=React.useState("")
const [vendas,setVendas]=React.useState<any[]>([])
const [nomeCli,setNomeCli]=React.useState("")
const [zapCli,setZapCli]=React.useState("")
React.useEffect(()=>{
const v=localStorage.getItem("vendas_lista")
if(v) setVendas(JSON.parse(v))
const senhaSalva=localStorage.getItem("admin_logado")
if(senhaSalva==="true") setOk(true)
},[])
function entrar(){if(s===SENHA||s==="GRAZI2026"){localStorage.setItem("admin_logado","true"); setOk(true)} else alert("Senha: 62981796690")}
function gerarCodigo(){
if(!nomeCli) return alert("Nome do cliente")
const codigo="LIBERADO-"+Math.floor(1000+Math.random()*9000)
const nova={id:Date.now(),nome:nomeCli,zap:zapCli,codigo,valor:97,data:new Date().toLocaleDateString(),pix:PIX}
const lista=[...vendas,nova]
setVendas(lista)
localStorage.setItem("vendas_lista",JSON.stringify(lista))
setNomeCli(""); setZapCli("")
alert(`CODIGO GERADO: ${codigo} para ${nova.nome}`)
}
function copiarCod(cod:string){navigator.clipboard.writeText(cod); alert(`CODIGO COPIADO: ${cod}`)}
function total(){return vendas.length*97}
if(!ok) return(<div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{background:"white",padding:30,borderRadius:16,border:"4px solid #facc15",textAlign:"center",maxWidth:360,width:"100%"}}><h2 style={{fontWeight:900}}>VENDAS - {NOME}</h2><div style={{fontWeight:700,fontSize:12}}>PIX: {PIX}</div><input value={s} onChange={e=>setS(e.target.value)} type="password" placeholder="Senha 62981796690" style={{width:"100%",padding:12,border:"3px solid black",borderRadius:10,textAlign:"center",fontWeight:900,marginTop:10,boxSizing:"border-box"}}/><button onClick={entrar} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:10,cursor:"pointer"}}>ENTRAR</button><a href="/" style={{display:"block",marginTop:10,color:"black",fontWeight:700}}>Voltar</a></div></div>)
return(
<div style={{padding:16,background:"#f1f5f9",minHeight:"100vh",fontFamily:"system-ui"}}>
<div style={{background:"black",color:"#facc15",fontWeight:900,padding:16,borderRadius:12,border:"3px solid black",display:"flex",justifyContent:"space-between",flexWrap:"wrap",gap:10}}>
<span>VENDAS R$97 - {NOME} - PIX: {PIX}</span>
<a href="/" style={{background:"white",color:"black",padding:"6px 12px",borderRadius:8,textDecoration:"none",fontSize:12,fontWeight:900,border:"2px solid black"}}>Voltar</a>
</div>
<div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginTop:16}}>
<div style={{background:"white",border:"4px solid black",borderRadius:12,padding:16,textAlign:"center"}}><div style={{fontWeight:800,fontSize:12}}>TOTAL VENDIDO</div><div style={{fontWeight:900,fontSize:28,color:"#16a34a"}}>R$ {total()},00</div></div>
<div style={{background:"white",border:"4px solid black",borderRadius:12,padding:16,textAlign:"center"}}><div style={{fontWeight:800,fontSize:12}}>VENDAS</div><div style={{fontWeight:900,fontSize:28}}>{vendas.length}</div></div>
<div style={{background:"white",border:"4px solid black",borderRadius:12,padding:16,textAlign:"center"}}><div style={{fontWeight:800,fontSize:12}}>PIX</div><div style={{fontWeight:900,fontSize:16}}>{PIX}</div><div style={{fontSize:10}}>{NOME}</div></div>
</div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:16,marginTop:16}}>
<h3 style={{margin:0,fontWeight:900}}>➕ GERAR CODIGO PARA CLIENTE</h3>
<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 120px",gap:8,marginTop:10}}>
<input value={nomeCli} onChange={e=>setNomeCli(e.target.value)} placeholder="Nome cliente" style={{padding:12,border:"3px solid black",borderRadius:8,fontWeight:700}}/>
<input value={zapCli} onChange={e=>setZapCli(e.target.value)} placeholder="WhatsApp cliente" style={{padding:12,border:"3px solid black",borderRadius:8,fontWeight:700}}/>
<button onClick={gerarCodigo} style={{background:"#22c55e",color:"white",fontWeight:900,borderRadius:8,border:"3px solid black",cursor:"pointer"}}>GERAR</button>
</div>
</div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:16,marginTop:16}}>
<h3 style={{margin:0,fontWeight:900}}>📋 LISTA DE VENDAS ({vendas.length})</h3>
{vendas.length===0?<div style={{padding:20,textAlign:"center",fontWeight:700,color:"#64748b"}}>Nenhuma venda ainda</div>:
<div style={{marginTop:10}}>
{vendas.map((v:any)=><div key={v.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",border:"2px solid black",borderRadius:8,padding:10,marginBottom:6,flexWrap:"wrap",gap:6}}>
<div><b>{v.nome}</b> - {v.zap}<br/><span style={{background:"#facc15",padding:"2px 8px",borderRadius:6,fontWeight:800,fontSize:12,border:"2px solid black"}}>{v.codigo}</span> - {v.data} - R$97</div>
<div style={{display:"flex",gap:6}}>
<button onClick={()=>copiarCod(v.codigo)} style={{background:"black",color:"white",fontWeight:800,padding:"6px 10px",borderRadius:6,border:"2px solid black",fontSize:11,cursor:"pointer"}}>COPIAR COD</button>
<a href={`https://wa.me/55${v.zap}?text=Seu codigo de acesso: ${v.codigo} - Plataforma: ${window.location.origin}`} target="_blank" style={{background:"#22c55e",color:"white",fontWeight:800,padding:"6px 10px",borderRadius:6,border:"2px solid black",fontSize:11,textDecoration:"none"}}>ENVIAR ZAP</a>
</div>
</div>)}
</div>
</div>
</div>
)
}