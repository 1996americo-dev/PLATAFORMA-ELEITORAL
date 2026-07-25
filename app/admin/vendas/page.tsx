"use client"
import React from "react"

export default function AdminVendas(){
  const [vendas, setVendas] = React.useState<any[]>([])
  const [senhaMestra, setSenhaMestra] = React.useState("")
  const [liberado, setLiberado] = React.useState(false)
  const [novaVenda, setNovaVenda] = React.useState({nome:"", codigo:"", valor:"97"})

  React.useEffect(()=>{
    // Carrega vendas salvas
    const salvas = localStorage.getItem("vendas_plataforma")
    if(salvas) setVendas(JSON.parse(salvas))

    // Verifica se já está logado como dona
    const dona = localStorage.getItem("dona_grazi_logada")
    if(dona==="true") setLiberado(true)
  },[])

  function loginDona(){
    // Senha mestra só sua: 62981796690 ou GRAZI2026
    if(senhaMestra==="62981796690" || senhaMestra.toUpperCase()==="GRAZI2026" || senhaMestra==="grazi123"){
      setLiberado(true)
      localStorage.setItem("dona_grazi_logada", "true")
    } else {
      alert("Senha da dona incorreta! Use seu PIX 62981796690 ou GRAZI2026")
    }
  }

  function adicionarVendaManual(){
    if(!novaVenda.nome || !novaVenda.codigo){
      alert("Preencha nome e código!")
      return
    }
    const venda = {
      id: Date.now(),
      nome: novaVenda.nome,
      codigo: novaVenda.codigo.toUpperCase(),
      valor: novaVenda.valor,
      data: new Date().toLocaleString("pt-BR"),
      votos: 0,
      status: "PAGO"
    }
    const novas = [venda, ...vendas]
    setVendas(novas)
    localStorage.setItem("vendas_plataforma", JSON.stringify(novas))
    setNovaVenda({nome:"", codigo:"", valor:"97"})
    alert(`Venda registrada! Código ${venda.codigo} liberado para ${venda.nome}`)
  }

  function gerarCodigoAutomatico(){
    const cod = `ADM-${Math.floor(1000+Math.random()*9000)}`
    setNovaVenda({...novaVenda, codigo:cod})
  }

  function removerVenda(id:number){
    if(!confirm("Remover essa venda?")) return
    const novas = vendas.filter((v:any)=>v.id!==id)
    setVendas(novas)
    localStorage.setItem("vendas_plataforma", JSON.stringify(novas))
  }

  function copiarCodigo(codigo:string){
    navigator.clipboard.writeText(codigo)
    alert(`Código ${codigo} copiado! Agora manda no WhatsApp do cliente!`)
  }

  const totalVendas = vendas.length
  const totalReais = vendas.reduce((acc:any, v:any)=>acc + parseFloat(v.valor||0), 0)

  if(!liberado){
    return (
      <div style={{background:"black",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:20,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:16,padding:25,maxWidth:350,width:"100%",border:"4px solid #facc15",textAlign:"center"}}>
          <h2 style={{fontWeight:900}}>🔒 PAINEL DA DONA</h2>
          <p style={{fontSize:12,fontWeight:700}}>Apenas Grazi tem acesso</p>
          <input type="password" value={senhaMestra} onChange={e=>setSenhaMestra(e.target.value)} placeholder="Senha mestra" style={{width:"100%",padding:12,border:"3px solid black",borderRadius:10,marginTop:10,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={loginDona} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",padding:12,borderRadius:10,fontWeight:900,border:"none",cursor:"pointer"}}>ENTRAR</button>
          <div style={{fontSize:10,marginTop:10}}>Dica: use seu PIX 62981796690 ou GRAZI2026</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{background:"#f5f5f5",minHeight:"100vh",padding:20,fontFamily:"system-ui"}}>
      <div style={{background:"black",borderRadius:16,padding:18,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <h1 style={{color:"#facc15",fontWeight:900,margin:0,fontSize:22}}>💰 PAINEL DE VENDAS - GRAZI</h1>
          <p style={{color:"white",margin:"5px 0 0",fontSize:12,fontWeight:700}}>PIX: 62981796690 • {totalVendas} vendas • R$ {totalReais.toFixed(2)}</p>
        </div>
        <button onClick={()=>{localStorage.removeItem("dona_grazi_logada"); setLiberado(false)}} style={{background:"white",border:"none",borderRadius:8,padding:"8px 12px",fontWeight:900,fontSize:11,cursor:"pointer"}}>SAIR</button>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:20}}>
        <div style={{background:"white",border:"4px solid black",borderRadius:16,padding:16,height:"fit-content"}}>
          <h3 style={{fontWeight:900,margin:0}}>➕ REGISTRAR NOVA VENDA</h3>
          <p style={{fontSize:11,fontWeight:700,margin:"5px 0 10px"}}>Quando receber PIX, registra aqui e gera código</p>
          
          <label style={{fontWeight:900,fontSize:12}}>Nome do cliente:</label>
          <input value={novaVenda.nome} onChange={e=>setNovaVenda({...novaVenda, nome:e.target.value})} placeholder="Ex: João da Silva" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginTop:4,boxSizing:"border-box"}}/>
          
          <label style={{fontWeight:900,fontSize:12,marginTop:10,display:"block"}}>Código que vai enviar:</label>
          <div style={{display:"flex",gap:6,marginTop:4}}>
            <input value={novaVenda.codigo} onChange={e=>setNovaVenda({...novaVenda, codigo:e.target.value})} placeholder="ADM-1234" style={{flex:1,padding:10,border:"3px solid black",borderRadius:8,fontWeight:900,boxSizing:"border-box"}}/>
            <button onClick={gerarCodigoAutomatico} style={{background:"#facc15",border:"3px solid black",borderRadius:8,padding:"0 10px",fontWeight:900,fontSize:11,cursor:"pointer"}}>GERAR</button>
          </div>

          <label style={{fontWeight:900,fontSize:12,marginTop:10,display:"block"}}>Valor:</label>
          <input value={novaVenda.valor} onChange={e=>setNovaVenda({...novaVenda, valor:e.target.value})} placeholder="97" style={{width:"100%",padding:10,border:"3px solid black",borderRadius:8,marginTop:4,boxSizing:"border-box"}}/>

          <button onClick={adicionarVendaManual} style={{width:"100%",marginTop:15,background:"#22c55e",color:"white",padding:12,borderRadius:10,fontWeight:900,border:"3px solid black",cursor:"pointer"}}>💾 SALVAR VENDA + LIBERAR CÓDIGO</button>

          <div style={{marginTop:15,background:"#fef08a",border:"3px dashed black",borderRadius:10,padding:10,fontSize:11,fontWeight:700}}>
            <b>Como usar:</b><br/>
            1. Cliente paga PIX 62981796690<br/>
            2. Você gera código aqui<br/>
            3. Clica em COPIAR e manda no WhatsApp dele<br/>
            4. Ele digita no site e libera!
          </div>
        </div>

        <div style={{background:"white",border:"4px solid black",borderRadius:16,padding:16}}>
          <h3 style={{fontWeight:900,margin:0}}>📊 VENDAS REGISTRADAS - {totalVendas} vendas = R$ {totalReais.toFixed(2)}</h3>
          
          {vendas.length===0 ? (
            <div style={{textAlign:"center",padding:40,border:"3px dashed black",borderRadius:12,marginTop:15}}>
              <div style={{fontSize:40}}>💸</div>
              <p style={{fontWeight:900}}>Nenhuma venda ainda</p>
              <p style={{fontSize:12}}>Quando receber seu primeiro PIX, registra ao lado!</p>
            </div>
          ) : (
            <div style={{marginTop:15}}>
              {vendas.map((v:any)=>(
                <div key={v.id} style={{border:"3px solid black",borderRadius:12,padding:12,marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center",background:v.status==="PAGO"?"#dcfce7":"white"}}>
                  <div>
                    <b style={{fontSize:14}}>{v.nome}</b> - <span style={{background:"black",color:"white",padding:"2px 6px",borderRadius:4,fontSize:10,fontWeight:900}}>{v.codigo}</span><br/>
                    <span style={{fontSize:11,fontWeight:700}}>R$ {v.valor} • {v.data} • {v.status}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>copiarCodigo(v.codigo)} style={{background:"#facc15",border:"2px solid black",borderRadius:6,padding:"6px 10px",fontWeight:900,fontSize:11,cursor:"pointer"}}>COPIAR CÓDIGO</button>
                    <button onClick={()=>removerVenda(v.id)} style={{background:"#fecaca",border:"2px solid black",borderRadius:6,padding:"6px 8px",fontWeight:900,cursor:"pointer"}}>X</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div style={{marginTop:20,display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
            <div style={{background:"black",color:"#facc15",borderRadius:10,padding:15,textAlign:"center"}}>
              <div style={{fontSize:24,fontWeight:900}}>{totalVendas}</div>
              <div style={{fontSize:11,fontWeight:700}}>VENDAS</div>
            </div>
            <div style={{background:"#22c55e",color:"white",borderRadius:10,padding:15,textAlign:"center",border:"3px solid black"}}>
              <div style={{fontSize:24,fontWeight:900}}>R$ {totalReais.toFixed(0)}</div>
              <div style={{fontSize:11,fontWeight:700}}>FATURADO</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
