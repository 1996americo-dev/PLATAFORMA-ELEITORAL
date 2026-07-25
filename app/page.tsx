"use client"
import React from "react"

const PIX = "62981796690"
const NOME_PIX = "AMERICO QUISPE QUISPE"
const VALOR = "R$ 97,00"
const WHATSAPP = "5562981796690"
const CODIGOS_VALIDOS = ["GRAZI2026", "ELEICAO2026", "PLATAFORMA", "LIBERADO"]

export default function Home(){
  const [cands, setCands] = React.useState<any[]>([])
  const [votos, setVotos] = React.useState<any[]>([])
  const [cpf, setCpf] = React.useState("")
  const [cpfLiberado, setCpfLiberado] = React.useState(false)
  const [acessoLiberado, setAcessoLiberado] = React.useState(false)
  const [codigoAcesso, setCodigoAcesso] = React.useState("")

  React.useEffect(()=>{
    const liberado = localStorage.getItem("acesso_liberado_2026")
    if(liberado==="true") setAcessoLiberado(true)
    const c = localStorage.getItem("cands")
    const v = localStorage.getItem("votos")
    if(c) setCands(JSON.parse(c))
    if(v) setVotos(JSON.parse(v))
    if(!c){
      const inicial = [
        {id:1, nome:"Bolsonaro", sigla:"PL - 22", foto_url:"https://i.pravatar.cc/150?img=1"},
        {id:2, nome:"Ciro Gomes", sigla:"PDT - 12", foto_url:"https://i.pravatar.cc/150?img=2"},
        {id:3, nome:"Eduardo Leite", sigla:"PSDB - 45", foto_url:"https://i.pravatar.cc/150?img=3"},
        {id:4, nome:"Erika Hilton", sigla:"PSOL - 50", foto_url:"https://i.pravatar.cc/150?img=4"},
        {id:5, nome:"Lula", sigla:"PT - 13", foto_url:"https://i.pravatar.cc/150?img=5"},
        {id:6, nome:"Simone Tebet", sigla:"MDB - 15", foto_url:"https://i.pravatar.cc/150?img=6"},
        {id:7, nome:"Marina Silva", sigla:"REDE - 18", foto_url:"https://i.pravatar.cc/150?img=7"},
        {id:8, nome:"Nikolas Ferreira", sigla:"PL - 2222", foto_url:"https://i.pravatar.cc/150?img=8"},
        {id:9, nome:"Tabata Amaral", sigla:"PSB - 40", foto_url:"https://i.pravatar.cc/150?img=9"},
        {id:10, nome:"João Doria", sigla:"PSDB - 45", foto_url:"https://i.pravatar.cc/150?img=10"},
        {id:11, nome:"João Amoêdo", sigla:"NOVO - 30", foto_url:"https://i.pravatar.cc/150?img=11"},
      ]
      setCands(inicial)
      localStorage.setItem("cands", JSON.stringify(inicial))
    }
  },[])

  function copiarPix(){
    navigator.clipboard.writeText(PIX)
    alert(`PIX COPIADO: ${PIX}\nNome: ${NOME_PIX}\n\nAgora abre seu banco e faz o PIX de ${VALOR}!`)
  }

  function abrirWhatsApp(){
    const msg = `Olá Grazi! Paguei o PIX da Plataforma Eleitoral 2026 - ${VALOR}. PIX: ${PIX} (${NOME_PIX}). Meu comprovante está aqui. Pode liberar meu acesso?`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank")
  }

  function liberarAcesso(){
    const codigo = codigoAcesso.trim().toUpperCase()
    const ehValido = CODIGOS_VALIDOS.includes(codigo) || /^ADM-\d{4}$/.test(codigo) || /^LIBERADO-\d{4}$/.test(codigo)
    if(ehValido){
      localStorage.setItem("acesso_liberado_2026", "true")
      localStorage.setItem("codigo_usado", codigo)
      const senhaAdmin = codigo.startsWith("ADM-") || codigo.startsWith("LIBERADO-") ? codigo : `ADM-${Math.floor(1000+Math.random()*9000)}`
      localStorage.setItem("senha_admin_gerada", senhaAdmin)
      setAcessoLiberado(true)
      alert(`✅ ACESSO LIBERADO!\n\nSua senha ADMIN é: ${senhaAdmin}\n\nBem-vinda!`)
    } else {
      alert("❌ CÓDIGO INVÁLIDO!\n\nFaça o PIX e envie comprovante no WhatsApp!")
    }
  }

  function getFoto(url:string){ return url || "https://i.pravatar.cc/150" }
  function validarCpf(){
    const limpo = cpf.replace(/\D/g,"")
    if(limpo.length!==11){ alert("CPF inválido!"); return }
    if(votos.some((v:any)=>v.cpf===limpo)){ alert("ESTE CPF JÁ VOTOU!"); return }
    setCpfLiberado(true)
    alert("CPF VALIDADO!")
  }
  function votar(candidato_id:number){
    if(!cpfLiberado) return alert("Valide o CPF!")
    const limpo = cpf.replace(/\D/g,"")
    const novo = {id:Date.now(), candidato_id, cpf:limpo, data:new Date().toISOString()}
    const novos = [...votos, novo]
    setVotos(novos)
    localStorage.setItem("votos", JSON.stringify(novos))
    setCpf(""); setCpfLiberado(false)
    alert("VOTO COMPUTADO!")
  }

  const rankingCalculado = cands.map((c:any)=>{
    const qtd = votos.filter((v:any)=>v.candidato_id===c.id).length
    return {...c, qtd}
  }).filter((c:any)=>c.qtd>0).sort((a:any,b:any)=>b.qtd-a.qtd)

  if(!acessoLiberado){
    return (
      <div style={{background:"black",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:20,padding:25,maxWidth:420,width:"100%",border:"5px solid #facc15",textAlign:"center"}}>
          <div style={{fontSize:50}}>🔒</div>
          <h1 style={{fontWeight:900,fontSize:24,margin:"10px 0"}}>PLATAFORMA BLOQUEADA</h1>
          <p style={{fontWeight:700,background:"#fef08a",padding:10,borderRadius:10,border:"2px solid black"}}>Acesso exclusivo para quem pagou o PIX. 11 candidatos, ranking em tempo real, urna com CPF!</p>
          <div style={{background:"#f5f5f5",border:"3px dashed black",borderRadius:12,padding:15,marginTop:15,textAlign:"left"}}>
            <b>💰 VALOR: {VALOR}</b><br/>
            <b>🔑 PIX (Celular):</b><br/>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input value={PIX} readOnly style={{flex:1,padding:10,border:"3px solid black",borderRadius:8,fontWeight:900,textAlign:"center"}}/>
              <button onClick={copiarPix} style={{background:"#facc15",border:"3px solid black",borderRadius:8,padding:"0 15px",fontWeight:900,cursor:"pointer"}}>COPIAR</button>
            </div>
            <div style={{marginTop:10,fontSize:12,fontWeight:700,lineHeight:1.4}}>Nome: {NOME_PIX}<br/>Banco: Qualquer banco aceita PIX por celular</div>
          </div>
          <button onClick={abrirWhatsApp} style={{width:"100%",marginTop:15,background:"#22c55e",color:"white",fontWeight:900,padding:14,borderRadius:12,border:"3px solid black",cursor:"pointer",fontSize:15}}>📲 JÁ PAGUEI! ENVIAR COMPROVANTE NO WHATSAPP</button>
          <div style={{fontSize:11,marginTop:6,fontWeight:700}}>Clique e envie o comprovante para 62 98179-6690</div>
          <div style={{marginTop:20,borderTop:"3px solid black",paddingTop:15}}>
            <b>🔑 JÁ RECEBEU O CÓDIGO DA GRAZI?</b>
            <p style={{fontSize:12,margin:"5px 0"}}>Digite o código que ela te enviou no WhatsApp (ex: ADM-4829 ou GRAZI2026)</p>
            <input value={codigoAcesso} onChange={e=>setCodigoAcesso(e.target.value)} placeholder="Digite seu código: ADM-XXXX" style={{width:"100%",padding:12,borderRadius:10,border:"3px solid black",textAlign:"center",fontWeight:900,boxSizing:"border-box",textTransform:"uppercase"}}/>
            <button onClick={liberarAcesso} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:10,border:"none",cursor:"pointer"}}>🚀 LIBERAR MEU ACESSO AGORA</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:"#FFFFFF",minHeight:"100vh",padding:20,fontFamily:"system-ui"}}>
      <div style={{background:"black",border:"4px solid black",borderRadius:16,padding:"18px",marginBottom:20,textAlign:"center"}}>
        <h1 style={{color:"#facc15",fontWeight:900,fontSize:28,letterSpacing:2,margin:0}}>PLATAFORMA ELEITORAL 2026</h1>
        <p style={{color:"white",fontWeight:800,fontSize:13,margin:"5px 0 0"}}>✅ ACESSO LIBERADO • {cands.length} CANDIDATOS • {votos.length} VOTOS</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"2fr 1fr",gap:20}}>
        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:16}}>
          <h2 style={{fontWeight:900,fontSize:20,margin:0}}>🏆 RANKING - {votos.length} VOTOS</h2>
          <div style={{border:"3px dashed black",borderRadius:12,padding:12,marginTop:10,minHeight:70}}>
            {votos.length===0 ? <div style={{textAlign:"center",padding:10,fontWeight:900}}>Nenhum voto ainda</div> : rankingCalculado.map((c:any,i:number)=><div key={c.id} style={{display:"flex",justifyContent:"space-between",background:i===0?"#facc15":"#e5e7eb",padding:"10px 12px",borderRadius:8,marginBottom:6,border:"3px solid black",fontWeight:900}}><span>{i+1}º {c.nome}</span><span>{c.qtd} - {((c.qtd/votos.length)*100).toFixed(1)}%</span></div>)}
          </div>
        </div>
        <div style={{background:"#FFFFFF",border:"5px solid black",borderRadius:16,padding:16,height:"fit-content"}}>
          <h3 style={{fontWeight:900,margin:0}}>🔒 VALIDACAO CPF</h3>
          <input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",padding:12,borderRadius:12,border:"3px solid black",marginTop:10,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={validarCpf} style={{width:"100%",marginTop:10,background:"black",color:"white",fontWeight:900,padding:12,borderRadius:12,border:"none",cursor:"pointer"}}>VALIDAR CPF</button>
        </div>
      </div>
    </div>
  )
}
