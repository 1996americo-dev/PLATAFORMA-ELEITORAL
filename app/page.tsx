"use client"
import React from "react"

const PIX = "62981796690"
const NOME_PIX = "AMERICO QUISPE QUISPE"
const VALOR = "R$ 97,00"
const WHATSAPP = "5562981796690"
const CODIGOS_VALIDOS = ["GRAZI2026", "ELEICAO2026", "PLATAFORMA", "LIBERADO", "AMERICO2026"]

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
        {id:1, nome:"Bolsonaro", sigla:"PL - 22", foto_url:"https://i.pravatar.cc/150?img=1", partido:"PL"},
        {id:2, nome:"Ciro Gomes", sigla:"PDT - 12", foto_url:"https://i.pravatar.cc/150?img=2", partido:"PDT"},
        {id:3, nome:"Eduardo Leite", sigla:"PSDB - 45", foto_url:"https://i.pravatar.cc/150?img=3", partido:"PSDB"},
        {id:4, nome:"Erika Hilton", sigla:"PSOL - 50", foto_url:"https://i.pravatar.cc/150?img=4", partido:"PSOL"},
        {id:5, nome:"Lula", sigla:"PT - 13", foto_url:"https://i.pravatar.cc/150?img=5", partido:"PT"},
        {id:6, nome:"Simone Tebet", sigla:"MDB - 15", foto_url:"https://i.pravatar.cc/150?img=6", partido:"MDB"},
        {id:7, nome:"Marina Silva", sigla:"REDE - 18", foto_url:"https://i.pravatar.cc/150?img=7", partido:"REDE"},
        {id:8, nome:"Nikolas Ferreira", sigla:"PL - 2222", foto_url:"https://i.pravatar.cc/150?img=8", partido:"PL"},
        {id:9, nome:"Tabata Amaral", sigla:"PSB - 40", foto_url:"https://i.pravatar.cc/150?img=9", partido:"PSB"},
        {id:10, nome:"João Doria", sigla:"PSDB - 45", foto_url:"https://i.pravatar.cc/150?img=10", partido:"PSDB"},
        {id:11, nome:"João Amoêdo", sigla:"NOVO - 30", foto_url:"https://i.pravatar.cc/150?img=11", partido:"NOVO"},
      ]
      setCands(inicial)
      localStorage.setItem("cands", JSON.stringify(inicial))
    }
  },[])

  function copiarPix(){
    navigator.clipboard.writeText(PIX)
    alert(`PIX COPIADO: ${PIX}\nNome: ${NOME_PIX}\nValor: ${VALOR}`)
  }
  function abrirWhatsApp(){
    const msg = `Olá! Paguei o PIX da Plataforma Eleitoral 2026 - ${VALOR}. PIX: ${PIX} (${NOME_PIX}). Meu comprovante está aqui. Pode liberar meu acesso?`
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`, "_blank")
  }
  function liberarAcesso(){
    const codigo = codigoAcesso.trim().toUpperCase()
    const ehValido = CODIGOS_VALIDOS.includes(codigo) || /^ADM-\d{4}$/.test(codigo) || /^LIBERADO-\d{4}$/.test(codigo)
    if(ehValido){
      localStorage.setItem("acesso_liberado_2026", "true")
      setAcessoLiberado(true)
      alert(`✅ ACESSO LIBERADO! Bem-vinda!`)
    } else {
      alert("❌ CÓDIGO INVÁLIDO! Faça o PIX e envie comprovante!")
    }
  }
  function validarCpf(){
    const limpo = cpf.replace(/\D/g,"")
    if(limpo.length!==11){ alert("CPF inválido! 11 números"); return }
    if(votos.some((v:any)=>v.cpf===limpo)){ alert("ESTE CPF JÁ VOTOU!"); return }
    setCpfLiberado(true)
    alert("CPF VALIDADO! Agora pode votar!")
  }
  function votar(candidato_id:number){
    if(!cpfLiberado) return alert("Valide o CPF primeiro!")
    const limpo = cpf.replace(/\D/g,"")
    const novo = {id:Date.now(), candidato_id, cpf:limpo, data:new Date().toISOString()}
    const novos = [...votos, novo]
    setVotos(novos)
    localStorage.setItem("votos", JSON.stringify(novos))
    setCpf(""); setCpfLiberado(false)
    alert("VOTO COMPUTADO COM SUCESSO! ✅")
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
          <p style={{fontWeight:700,background:"#fef08a",padding:10,borderRadius:10,border:"2px solid black",fontSize:13}}>Acesso exclusivo para quem pagou o PIX. 11 candidatos, ranking em tempo real, urna com CPF!</p>
          <div style={{background:"#f5f5f5",border:"3px dashed black",borderRadius:12,padding:15,marginTop:15,textAlign:"left"}}>
            <b>💰 VALOR: {VALOR}</b><br/><b>🔑 PIX (Celular):</b>
            <div style={{display:"flex",gap:8,marginTop:8}}>
              <input value={PIX} readOnly style={{flex:1,padding:10,border:"3px solid black",borderRadius:8,fontWeight:900,textAlign:"center"}}/>
              <button onClick={copiarPix} style={{background:"#facc15",border:"3px solid black",borderRadius:8,padding:"0 15px",fontWeight:900,cursor:"pointer"}}>COPIAR</button>
            </div>
            <div style={{marginTop:10,fontSize:12,fontWeight:700}}>Nome: {NOME_PIX}<br/>Banco: Qualquer banco aceita PIX por celular</div>
          </div>
          <button onClick={abrirWhatsApp} style={{width:"100%",marginTop:15,background:"#22c55e",color:"white",fontWeight:900,padding:14,borderRadius:12,border:"3px solid black",cursor:"pointer"}}>📲 JÁ PAGUEI! ENVIAR COMPROVANTE NO WHATSAPP</button>
          <div style={{marginTop:20,borderTop:"3px solid black",paddingTop:15}}>
            <b>🔑 JÁ RECEBEU O CÓDIGO?</b>
            <input value={codigoAcesso} onChange={e=>setCodigoAcesso(e.target.value)} placeholder="Ex: GRAZI2026 ou ADM-1234" style={{width:"100%",padding:12,borderRadius:10,border:"3px solid black",textAlign:"center",fontWeight:900,boxSizing:"border-box",marginTop:8,textTransform:"uppercase"}}/>
            <button onClick={liberarAcesso} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",fontWeight:900,padding:12,borderRadius:10,border:"none",cursor:"pointer"}}>🚀 LIBERAR MEU ACESSO AGORA</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:"#f1f5f9",minHeight:"100vh",padding:15,fontFamily:"system-ui"}}>
      <div style={{background:"black",border:"4px solid black",borderRadius:16,padding:"15px",marginBottom:15,textAlign:"center"}}>
        <h1 style={{color:"#facc15",fontWeight:900,fontSize:24,margin:0}}>PLATAFORMA ELEITORAL 2026</h1>
        <p style={{color:"white",fontWeight:800,fontSize:12,margin:"5px 0 0"}}>✅ ACESSO LIBERADO • {cands.length} CANDIDATOS • {votos.length} VOTOS</p>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:15,marginBottom:15}}>
        <div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14}}>
          <h3 style={{fontWeight:900,margin:0,fontSize:16}}>🏆 RANKING - {votos.length} VOTOS</h3>
          <div style={{border:"3px dashed black",borderRadius:10,padding:10,marginTop:10,minHeight:60}}>
            {votos.length===0 ? <div style={{textAlign:"center",fontWeight:900,padding:10}}>Nenhum voto ainda - seja o primeiro!</div> : rankingCalculado.map((c:any,i:number)=><div key={c.id} style={{display:"flex",justifyContent:"space-between",background:i===0?"#facc15":"#e5e7eb",padding:"8px 10px",borderRadius:6,marginBottom:5,border:"2px solid black",fontWeight:900,fontSize:13}}><span>{i+1}º {c.nome}</span><span>{c.qtd} votos ({((c.qtd/votos.length)*100).toFixed(1)}%)</span></div>)}
          </div>
        </div>
        <div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14,height:"fit-content"}}>
          <h3 style={{fontWeight:900,margin:0,fontSize:16}}>🔒 VALIDACAO CPF</h3>
          <p style={{fontSize:11,fontWeight:700,margin:"5px 0"}}>{cpfLiberado?"✅ CPF LIBERADO! Pode votar!":"Digite seu CPF para liberar o voto"}</p>
          <input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",padding:10,borderRadius:8,border:"3px solid black",textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={validarCpf} style={{width:"100%",marginTop:8,background:cpfLiberado?"#22c55e":"black",color:"white",fontWeight:900,padding:10,borderRadius:8,border:"none",cursor:"pointer"}}>{cpfLiberado?"VALIDADO ✅":"VALIDAR CPF"}</button>
        </div>
      </div>

      <div style={{background:"white",border:"4px solid black",borderRadius:14,padding:14}}>
        <h2 style={{fontWeight:900,margin:0}}>🗳️ CANDIDATOS - CLIQUE PARA VOTAR</h2>
        <p style={{fontSize:12,fontWeight:700,margin:"5px 0 10px"}}>Valide o CPF ao lado e depois clique em VOTAR no seu candidato</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(180px,1fr))",gap:12}}>
          {cands.map((c:any)=>{
            const votosCand = votos.filter((v:any)=>v.candidato_id===c.id).length
            return (
              <div key={c.id} style={{border:"3px solid black",borderRadius:12,padding:10,textAlign:"center",background:"white"}}>
                <img src={c.foto_url} style={{width:60,height:60,borderRadius:"50%",border:"3px solid black",objectFit:"cover"}}/>
                <div style={{fontWeight:900,marginTop:6,fontSize:14}}>{c.nome}</div>
                <div style={{fontWeight:700,fontSize:11,background:"#facc15",borderRadius:4,padding:"2px 6px",display:"inline-block",marginTop:4}}>{c.sigla}</div>
                <div style={{fontSize:11,fontWeight:700,marginTop:6}}>{votosCand} votos</div>
                <button onClick={()=>votar(c.id)} style={{width:"100%",marginTop:8,background:cpfLiberado?"#22c55e":"#9ca3af",color:"white",fontWeight:900,padding:8,borderRadius:8,border:"2px solid black",cursor:cpfLiberado?"pointer":"not-allowed",fontSize:12}}>{cpfLiberado?"VOTAR ✅":"VALIDE CPF"}</button>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
