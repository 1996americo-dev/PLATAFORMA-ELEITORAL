"use client"
import React from "react"
const SENHA="62981796690"
export default function AdminCompletoFinal(){
const [ok,setOk]=React.useState(false)
const [s,setS]=React.useState("")
const [cands,setCands]=React.useState<any[]>([])
const [votos,setVotos]=React.useState<any[]>([])
const [nome,setNome]=React.useState("")
const [numero,setNumero]=React.useState("")
const [partido,setPartido]=React.useState("")
const [sigla,setSigla]=React.useState("")
const [cargo,setCargo]=React.useState("Presidente")
const [cargoOutro,setCargoOutro]=React.useState("")
const [foto,setFoto]=React.useState("")
React.useEffect(()=>{
const c=localStorage.getItem("cands")
const v=localStorage.getItem("votos")
if(c) setCands(JSON.parse(c))
if(v) setVotos(JSON.parse(v))
},[])
function entrar(){ if(s===SENHA||s==="GRAZI2026"||s==="AMERICO2026") setOk(true); else alert("Senha 62981796690") }
function handleFoto(e:any){const file=e.target.files?.[0]; if(!file) return; const r=new FileReader(); r.onload=(ev)=>setFoto(ev.target?.result as string); r.readAsDataURL(file)}
function add(){
if(!nome) return alert("Nome")
if(!numero) return alert("Numero")
const cargoFinal=cargo==="Outros"?cargoOutro:cargo
if(cargo==="Outros" &&!cargoOutro) return alert("Digite o cargo")
const novo={id:Date.now(),nome,numero,partido,sigla,cargo:cargoFinal,foto_url:foto||`https://i.pravatar.cc/150?img=${Math.floor(Math.random()*70)}`,foto:foto}
const nn=[...cands,novo]
setCands(nn)
localStorage.setItem("cands",JSON.stringify(nn))
setNome(""); setNumero(""); setPartido(""); setSigla(""); setFoto(""); setCargoOutro("")
alert("Candidato cadastrado!")
}
function del(id:number){ if(!confirm("Remover?")) return; const nn=cands.filter((c:any)=>c.id!==id); setCands(nn); localStorage.setItem("cands",JSON.stringify(nn))}
function baixarExcel(){
const ranking=cands.map((c:any)=>{const q=votos.filter((v:any)=>v.candidato_id===c.id).length; const perc=votos.length?((q/votos.length)*100).toFixed(2):"0"; return{...c,qtd:q,perc}}).sort((a:any,b:any)=>b.qtd-a.qtd)
let csv="Posicao;Nome;Numero;Partido;Sigla;Cargo;Votos;Porcentagem\n"
ranking.forEach((c:any,i:number)=>{ csv+=`${i+1};${c.nome};${c.numero};${c.partido};${c.sigla};${c.cargo};${c.qtd};${c.perc}%\n` })
csv+=`\nTotal de Votos;${votos.length}\n`
const blob=new Blob([csv],{type:"text/csv;charset=utf-8;"})
const url=URL.createObjectURL(blob)
const a=document.createElement("a")
a.href=url
a.download=`resultado-eleicao-${new Date().toISOString().slice(0,10)}.csv`
a.click()
alert("Excel baixado!")
}
const ranking=cands.map((c:any)=>{const q=votos.filter((v:any)=>v.candidato_id===c.id).length; const perc=votos.length?((q/votos.length)*100).toFixed(1):"0"; return{...c,qtd:q,perc}}).sort((a:any,b:any)=>b.qtd-a.qtd)
const totalPerc=votos.length>0?100:0
if(!ok){
return(<div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}><div style={{background:"white",padding:30,borderRadius:16,border:"4px solid #facc15",textAlign:"center",maxWidth:360,width:"100%"}}><h2 style={{fontWeight:900}}>ADMIN V21 FINAL</h2><input value={s} onChange={e=>setS(e.target.value)} type="password" placeholder="62981796690" style={{width:"100%",padding:12,border:"3px solid black",borderRadius:10,textAlign:"center",fontWeight:900}}/><button onClick={entrar} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:10,cursor:"pointer"}}>ENTRAR</button></div></div>)
}
return(
<div style={{padding:14,background:"#f1f5f9",minHeight:"100vh",fontFamily:"system-ui"}}>
<div style={{background:"black",color:"#facc15",fontWeight:900,padding:14,borderRadius:12,border:"3px solid black",display:"flex",justifyContent:"space-between"}}><span>ADMIN V21 COMPLETO - {cands.length} CANDIDATOS • {votos.length} VOTOS • {totalPerc}% TOTAL</span><button onClick={baixarExcel} style={{background:"#22c55e",color:"white",fontWeight:900,padding:"8px 14px",borderRadius:8,border:"2px solid black",cursor:"pointer"}}>📊 BAIXAR EXCEL</button></div>
<div style={{display:"grid",gridTemplateColumns:"360px 1fr",gap:14,marginTop:14}}>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14,height:"fit-content"}}>
<h3 style={{margin:"0 0 10px 0",fontWeight:900}}>➕ CADASTRAR CANDIDATO</h3>
<input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8,boxSizing:"border-box"}}/>
<input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Numero ex: 13" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8,boxSizing:"border-box"}}/>
<input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Partido ex: PT" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8,boxSizing:"border-box"}}/>
<input value={sigla} onChange={e=>setSigla(e.target.value)} placeholder="Sigla ex: PT - 13" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8,boxSizing:"border-box"}}/>
<select value={cargo} onChange={e=>setCargo(e.target.value)} style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginBottom:8,boxSizing:"border-box",fontWeight:700}}>
<option>Presidente</option><option>Governador</option><option>Senador</option><option>Deputado Federal</option><option>Deputado Estadual</option><option>Prefeito</option><option>Vereador</option><option>Outros</option>
</select>
{cargo==="Outros" && <input value={cargoOutro} onChange={e=>setCargoOutro(e.target.value)} placeholder="Digite o cargo ex: Conselheiro" style={{width:"100%",padding:10,border:"3px solid #f59e0b",borderRadius:8,marginBottom:8,boxSizing:"border-box",background:"#fef3c7"}}/>}
<input type="file" accept="image/*" onChange={handleFoto} style={{width:"100%",padding:8,border:"3px dashed black",borderRadius:8,marginBottom:8,boxSizing:"border-box"}}/>
{foto && <img src={foto} style={{width:70,height:70,borderRadius:"50%",border:"3px solid black",display:"block",margin:"0 auto 8px"}}/>}
<button onClick={add} style={{width:"100%",background:"#22c55e",color:"white",fontWeight:900,padding:12,borderRadius:10,border:"3px solid black",cursor:"pointer"}}>✅ CADASTRAR</button>
</div>
<div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14,marginBottom:12}}>
<div style={{display:"flex",justifyContent:"space-between"}}><h3 style={{margin:0,fontWeight:900}}>🏆 RANKING - {votos.length} VOTOS - {totalPerc}%</h3><button onClick={baixarExcel} style={{background:"#0f172a",color:"white",fontWeight:800,padding:"6px 12px",borderRadius:8,border:"2px solid black",fontSize:12,cursor:"pointer"}}>📥 EXCEL</button></div>
<div style={{marginTop:10}}>
{ranking.map((c:any,i:number)=><div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:i===0 && c.qtd>0?"#facc15":"#f8fafc",border:"2px solid black",borderRadius:8,padding:"10px 12px",marginBottom:6,fontWeight:800,fontSize:13}}><span>{i+1}º {c.nome} - {c.sigla} ({c.cargo})</span><span>{c.qtd} votos - {c.perc}%</span></div>)}
</div>
</div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14}}>
<h3 style={{margin:"0 0 10px 0",fontWeight:900}}>CANDIDATOS ({cands.length})</h3>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:10}}>
{cands.map((c:any)=><div key={c.id} style={{border:"3px solid black",borderRadius:12,padding:10,textAlign:"center"}}><img src={c.foto_url||c.foto} style={{width:50,height:50,borderRadius:"50%",border:"2px solid black"}}/><div style={{fontWeight:900,fontSize:13}}>{c.nome}</div><div style={{fontSize:11}}>{c.numero} - {c.cargo}</div><div style={{fontSize:11,background:"#facc15",padding:"2px 6px",borderRadius:6,display:"inline-block"}}>{c.sigla}</div><br/><button onClick={()=>del(c.id)} style={{background:"#ef4444",color:"white",padding:4,borderRadius:6,border:"2px solid black",marginTop:6,cursor:"pointer"}}>REMOVER</button></div>)}
</div>
</div>
</div>
</div>
<div style={{marginTop:14}}><a href="/" style={{background:"black",color:"white",padding:"10px 15px",borderRadius:8,fontWeight:900,textDecoration:"none"}}>← SITE</a><a href="/admin/vendas" style={{marginLeft:10,background:"#facc15",padding:"10px 15px",borderRadius:8,fontWeight:900,border:"3px solid black",textDecoration:"none"}}>💰 VENDAS</a></div>
</div>
)
}