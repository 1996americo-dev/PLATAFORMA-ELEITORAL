"use client"
import React from "react"
const PIX="62981796690"
const NOME_PIX="AMERICO QUISPE QUISPE"
const VALOR="R$ 97,00"
const WHATSAPP="5562981796690"
const CODIGOS=["GRAZI2026","ELEICAO2026","PLATAFORMA","LIBERADO","AMERICO2026"]
export default function HomeV21(){
const [cands,setCands]=React.useState<any[]>([])
const [votos,setVotos]=React.useState<any[]>([])
const [cpf,setCpf]=React.useState("")
const [cpfOk,setCpfOk]=React.useState(false)
const [liberado,setLiberado]=React.useState(false)
const [codigo,setCodigo]=React.useState("")
React.useEffect(()=>{
if(localStorage.getItem("acesso_liberado_2026")==="true") setLiberado(true)
const c=localStorage.getItem("cands")
const v=localStorage.getItem("votos")
if(c) setCands(JSON.parse(c))
if(v) setVotos(JSON.parse(v))
if(!c){
const inicial=[
{id:1,nome:"Bolsonaro",sigla:"PL - 22",foto:"https://i.pravatar.cc/150?img=1",cor:"#0f4c75"},
{id:2,nome:"Ciro Gomes",sigla:"PDT - 12",foto:"https://i.pravatar.cc/150?img=2",cor:"#e63946"},
{id:3,nome:"Eduardo Leite",sigla:"PSDB - 45",foto:"https://i.pravatar.cc/150?img=3",cor:"#457b9d"},
{id:4,nome:"Erika Hilton",sigla:"PSOL - 50",foto:"https://i.pravatar.cc/150?img=4",cor:"#f4a261"},
{id:5,nome:"Lula",sigla:"PT - 13",foto:"https://i.pravatar.cc/150?img=5",cor:"#c1121f"},
{id:6,nome:"Simone Tebet",sigla:"MDB - 15",foto:"https://i.pravatar.cc/150?img=6",cor:"#2a9d8f"},
{id:7,nome:"Marina Silva",sigla:"REDE - 18",foto:"https://i.pravatar.cc/150?img=7",cor:"#606c38"},
{id:8,nome:"Nikolas Ferreira",sigla:"PL - 2222",foto:"https://i.pravatar.cc/150?img=8",cor:"#264653"},
{id:9,nome:"Tabata Amaral",sigla:"PSB - 40",foto:"https://i.pravatar.cc/150?img=9",cor:"#e76f51"},
{id:10,nome:"João Doria",sigla:"PSDB - 45",foto:"https://i.pravatar.cc/150?img=10",cor:"#6c757d"},
{id:11,nome:"João Amoêdo",sigla:"NOVO - 30",foto:"https://i.pravatar.cc/150?img=11",cor:"#ff9f1c"},
]
setCands(inicial)
localStorage.setItem("cands",JSON.stringify(inicial))
}
},[])
function copiar(){navigator.clipboard.writeText(PIX); alert(`PIX COPIADO: ${PIX} - ${NOME_PIX}`)}
function zap(){window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Paguei ${VALOR} PIX ${PIX} ${NOME_PIX} libera meu acesso`)}`,"_blank")}
function liberar(){const cd=codigo.toUpperCase().trim(); if(CODIGOS.includes(cd)||/^ADM-\d{4}$/.test(cd)||/^LIBERADO-\d{4}$/.test(cd)){localStorage.setItem("acesso_liberado_2026","true"); setLiberado(true)} else alert("Codigo invalido")}
function validaCpf(){const l=cpf.replace(/\D/g,""); if(l.length!==11) return alert("CPF 11 numeros"); if(votos.some((v:any)=>v.cpf===l)) return alert("CPF ja votou!"); setCpfOk(true)}
function votar(id:number){if(!cpfOk) return alert("Valide CPF!"); const l=cpf.replace(/\D/g,""); const n=[...votos,{id:Date.now(),candidato_id:id,cpf:l}]; setVotos(n); localStorage.setItem("votos",JSON.stringify(n)); setCpf(""); setCpfOk(false); alert("VOTO COMPUTADO!")}
const ranking=cands.map((c:any)=>({...c,qtd:votos.filter((v:any)=>v.candidato_id===c.id).length})).filter((c:any)=>c.qtd>0).sort((a:any,b:any)=>b.qtd-a.qtd)
if(!liberado) return(
<div style={{minHeight:"100vh",background:"linear-gradient(135deg,#000,#1a1a2e)",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
<div style={{background:"white",borderRadius:24,padding:30,maxWidth:440,width:"100%",border:"5px solid #facc15",boxShadow:"0 20px 40px rgba(0,0,0,0.4)",textAlign:"center"}}>
<div style={{fontSize:60}}>🗳️</div>
<h1 style={{fontWeight:900,fontSize:28,margin:"10px 0"}}>PLATAFORMA ELEITORAL 2026</h1>
<div style={{background:"#fef08a",border:"3px solid black",borderRadius:12,padding:12,fontWeight:800,fontSize:13}}>V21 - 11 Candidatos + Ranking + CPF</div>
<div style={{marginTop:20,background:"#f8fafc",border:"3px dashed black",borderRadius:14,padding:18,textAlign:"left"}}>
<div style={{fontWeight:900}}>LIBERAR ACESSO: {VALOR}</div>
<div style={{marginTop:10,fontSize:13,fontWeight:700}}>PIX Celular:</div>
<div style={{display:"flex",gap:8,marginTop:6}}><input value={PIX} readOnly style={{flex:1,padding:12,border:"3px solid black",borderRadius:10,fontWeight:900,textAlign:"center"}}/><button onClick={copiar} style={{background:"#facc15",border:"3px solid black",borderRadius:10,padding:"0 16px",fontWeight:900,cursor:"pointer"}}>COPIAR</button></div>
<div style={{marginTop:10,fontSize:12,fontWeight:700}}>Nome: <b>{NOME_PIX}</b><br/>Banco: Qualquer banco</div>
</div>
<button onClick={zap} style={{width:"100%",marginTop:14,background:"#22c55e",color:"white",fontWeight:900,padding:14,borderRadius:12,border:"3px solid black",cursor:"pointer"}}>JA PAGUEI - ENVIAR COMPROVANTE</button>
<div style={{marginTop:20,borderTop:"3px solid black",paddingTop:16}}><b>TEM CODIGO?</b><input value={codigo} onChange={e=>setCodigo(e.target.value)} placeholder="GRAZI2026" style={{width:"100%",marginTop:8,padding:12,border:"3px solid black",borderRadius:10,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/><button onClick={liberar} style={{width:"100%",marginTop:8,background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:10,cursor:"pointer"}}>LIBERAR ACESSO</button></div>
</div>
</div>
)
return(
<div style={{minHeight:"100vh",background:"#f1f5f9",padding:16,fontFamily:"system-ui"}}>
<div style={{background:"linear-gradient(90deg,#000,#1e293b)",color:"white",borderRadius:16,padding:"18px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",border:"4px solid black",flexWrap:"wrap",gap:10}}>
<div><div style={{color:"#facc15",fontWeight:900,fontSize:22}}>PLATAFORMA ELEITORAL 2026 • V21</div><div style={{fontSize:12,fontWeight:700,opacity:0.9}}>✅ {NOME_PIX} • {cands.length} CANDIDATOS • {votos.length} VOTOS</div></div>
<div style={{display:"flex",gap:6,alignItems:"center",flexWrap:"wrap"}}>
<div style={{background:"#facc15",color:"black",fontWeight:900,padding:"6px 12px",borderRadius:20,fontSize:12,border:"2px solid black"}}>AO VIVO</div>
<a href="/admin" style={{background:"white",color:"black",fontWeight:900,padding:"6px 12px",borderRadius:8,border:"2px solid black",textDecoration:"none",fontSize:12}}>👩‍💼 ADMIN</a>
<a href="/admin/vendas" style={{background:"#22c55e",color:"white",fontWeight:900,padding:"6px 12px",borderRadius:8,border:"2px solid black",textDecoration:"none",fontSize:12}}>💰 VENDAS</a>
</div>
</div>
<div style={{display:"grid",gridTemplateColumns:"340px 1fr",gap:16,marginTop:16}}>
<div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14}}>
<h3 style={{margin:0,fontWeight:900}}>🏆 RANKING - {votos.length} VOTOS</h3>
<div style={{marginTop:10,border:"3px dashed #000",borderRadius:10,padding:10,minHeight:80}}>
{ranking.length===0?<div style={{textAlign:"center",fontWeight:800,padding:20,color:"#64748b"}}>Nenhum voto ainda</div>:ranking.map((c:any,i:number)=>{const perc=votos.length?((c.qtd/votos.length)*100).toFixed(1):"0"; return <div key={c.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",background:i===0?"#facc15":"#f1f5f9",border:"2px solid black",padding:"10px 12px",borderRadius:8,marginBottom:6,fontWeight:900,fontSize:13}}><span>{i===0?"👑":""}{i+1}º {c.nome}</span><span>{c.qtd} votos • {perc}%</span></div>})}
</div>
</div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14,marginTop:12}}>
<h3 style={{margin:0,fontWeight:900}}>🔒 VALIDACAO CPF</h3>
<div style={{fontSize:11,fontWeight:700,margin:"6px 0",color:cpfOk?"#16a34a":"#64748b"}}>{cpfOk?"✅ CPF LIBERADO":"Digite CPF para votar"}</div>
<input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",padding:12,border:`3px solid ${cpfOk?"#22c55e":"black"}`,borderRadius:10,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
<button onClick={validaCpf} style={{width:"100%",marginTop:8,background:cpfOk?"#22c55e":"black",color:"white",fontWeight:900,padding:12,borderRadius:10,border:"none",cursor:"pointer"}}>{cpfOk?"VALIDADO ✅":"VALIDAR CPF"}</button>
</div>
</div>
<div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14}}>
<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><h2 style={{margin:0,fontWeight:900}}>🗳️ CANDIDATOS</h2><div style={{background:"black",color:"white",fontWeight:800,padding:"4px 10px",borderRadius:20,fontSize:11}}>{cands.length} CANDIDATOS</div></div>
<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))",gap:12,marginTop:12}}>
{cands.map((c:any)=>{
const q=votos.filter((v:any)=>v.candidato_id===c.id).length
const perc=votos.length?((q/votos.length)*100).toFixed(0):0
return(
<div key={c.id} style={{border:"3px solid black",borderRadius:14,padding:12,textAlign:"center",background:"white",position:"relative",overflow:"hidden"}}>
<div style={{position:"absolute",top:0,left:0,right:0,height:4,background:c.cor}}/>
<img src={c.foto_url||c.foto} style={{width:70,height:70,borderRadius:"50%",border:"3px solid black",objectFit:"cover",marginTop:6}}/>
<div style={{fontWeight:900,fontSize:15,marginTop:8}}>{c.nome}</div>
<div style={{background:"#facc15",border:"2px solid black",borderRadius:20,padding:"2px 8px",display:"inline-block",fontWeight:800,fontSize:11,marginTop:4}}>{c.sigla}</div>
<div style={{marginTop:8,fontSize:12,fontWeight:800}}>{q} votos • {perc}%</div>
<div style={{background:"#e2e8f0",height:6,borderRadius:10,marginTop:6,overflow:"hidden"}}><div style={{height:"100%",width:`${perc}%`,background:c.cor,transition:"0.5s"}}/></div>
<button onClick={()=>votar(c.id)} style={{width:"100%",marginTop:10,background:cpfOk?"#16a34a":"#94a3b8",color:"white",fontWeight:900,padding:10,borderRadius:10,border:"2px solid black",cursor:cpfOk?"pointer":"not-allowed",fontSize:13}}>{cpfOk?"VOTAR ✅":"VALIDE CPF"}</button>
</div>
)
})}
</div>
</div>
</div>
</div>
)
}