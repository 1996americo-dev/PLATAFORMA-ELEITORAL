"use client"
export default function Bloqueado(){
const PIX="62981796690"
const NOME="AMERICO QUISPE QUISPE"
return(
<div style={{minHeight:"100vh",background:"black",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
<div style={{background:"white",borderRadius:20,border:"6px solid #facc15",padding:30,maxWidth:420,width:"100%",textAlign:"center"}}>
<div style={{fontSize:50}}>🔒</div>
<h1 style={{fontWeight:900,fontSize:28,margin:"10px 0"}}>SITE BLOQUEADO</h1>
<p style={{fontWeight:700}}>Sua plataforma eleitoral foi bloqueada por falta de pagamento.</p>
<div style={{background:"#fef9c3",border:"3px solid black",borderRadius:12,padding:16,marginTop:16}}>
<div style={{fontWeight:900}}>LIBERE POR APENAS R$97</div>
<div style={{marginTop:8,fontWeight:800}}>PIX: {PIX}</div>
<div style={{fontSize:12,fontWeight:700}}>{NOME}</div>
<button onClick={()=>navigator.clipboard.writeText(PIX)} style={{marginTop:12,width:"100%",background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:10,border:"3px solid black",cursor:"pointer"}}>COPIAR PIX</button>
<a href={`https://wa.me/5562981796690?text=Quero liberar minha plataforma, paguei o PIX ${PIX}`} target="_blank" style={{display:"block",marginTop:10,background:"#22c55e",color:"white",fontWeight:900,padding:12,borderRadius:10,textDecoration:"none",border:"3px solid black"}}>JÁ PAGUEI - ENVIAR COMPROVANTE NO ZAP</a>
</div>
<a href="/" style={{display:"block",marginTop:16,fontWeight:700,color:"black"}}>Voltar para plataforma</a>
</div>
</div>
)
}