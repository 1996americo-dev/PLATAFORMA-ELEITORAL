"use client"
import React from "react"

type Cliente = { codigo:string, cliente:string, status:"ativo"|"cancelado", data:string }

export default function VendasPage(){
  const [liberado,setLiberado]=React.useState(false)
  const [codInput,setCodInput]=React.useState("")
  const [nomeCliente,setNomeCliente]=React.useState("")
  const [clientes,setClientes]=React.useState<Cliente[]>([])

  React.useEffect(()=>{
    const c=localStorage.getItem("codigos_vendas_pro")
    if(c){ setClientes(JSON.parse(c)) }
    else{
      const antigo=localStorage.getItem("codigos_vendas")
      if(antigo){
        try{
          const lista:string[]=JSON.parse(antigo)
          const nova:Cliente[]=lista.map(cod=>({codigo:cod,cliente:"Cliente",status:"ativo" as const,data:new Date().toLocaleDateString()}))
          setClientes(nova)
          salvarLista(nova)
        }catch{}
      }
    }
  },[])

  function salvarLista(lista:Cliente[]){
    setClientes(lista)
    localStorage.setItem("codigos_vendas_pro",JSON.stringify(lista))
    localStorage.setItem("codigos_vendas",JSON.stringify(lista.map(x=>x.codigo)))
    localStorage.setItem("codigos_ativos",JSON.stringify(lista.filter(x=>x.status==="ativo").map(x=>x.codigo)))
    localStorage.setItem("codigos_cancelados",JSON.stringify(lista.filter(x=>x.status==="cancelado").map(x=>x.codigo)))
  }

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(cod!=="DONO"){ alert("Senha inválida! Use DONO");return }
    setLiberado(true)
  }

  function gerar(){
    if(!nomeCliente.trim()){alert("Digite o nome do cliente!");return}
    const novo="LIBERADO-"+Math.random().toString(36).substring(2,6).toUpperCase()
    const novoCliente:Cliente={codigo:novo,cliente:nomeCliente.trim(),status:"ativo",data:new Date().toLocaleDateString()}
    const lista=[novoCliente,...clientes]
    salvarLista(lista)
    setNomeCliente("")
  }

  function copiar(cod:string){
    navigator.clipboard.writeText(cod)
    alert("Copiado: "+cod)
  }

  function toggleStatus(i:number){
    const lista=[...clientes]
    const atual=lista[i]
    if(atual.status==="ativo"){
      if(!confirm(`Cancelar cliente ${atual.cliente} - ${atual.codigo}? Ele NÃO vai mais conseguir entrar no site nem no admin.`)) return
      lista[i]={...atual,status:"cancelado"}
    } else {
      if(!confirm(`Reativar cliente ${atual.cliente} - ${atual.codigo}?`)) return
      lista[i]={...atual,status:"ativo"}
    }
    salvarLista(lista)
  }

  function remover(i:number){
    if(!confirm("Remover definitivamente "+clientes[i].codigo+"?")) return
    const lista=clientes.filter((_,idx)=>idx!==i)
    salvarLista(lista)
  }

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:16, fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:20,padding:28,width:400,border:"4px solid black", boxShadow:"8px 8px 0px #000"}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:70,height:70, background:"#fef9c3", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto", fontSize:32, border:"4px solid black"}}>🔒</div>
            <h1 style={{fontWeight:900, marginTop:12, fontSize:18}}>VENDAS BLOQUEADO</h1>
            <p style={{fontSize:11,color:"#000", fontWeight:800, background:"#fee2e2", padding:"6px 10px", borderRadius:20, display:"inline-block", marginTop:6, border:"2px solid black"}}>🔐 Digite DONO para entrar</p>
          </div>
          <input type="password" value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="SENHA: DONO" style={{width:"100%",marginTop:14,padding:14,border:"4px solid black",borderRadius:12,textAlign:"center",fontWeight:900,boxSizing:"border-box", fontSize:14}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",padding:14,borderRadius:12,fontWeight:900,border:"4px solid black", boxShadow:"4px 4px 0px #000", fontSize:13}}>ENTRAR EM VENDAS →</button>
          <a href="/admin" style={{display:"block", marginTop:10, textAlign:"center", fontSize:11, fontWeight:800, color:"#000"}}>← Voltar ao Admin</a>
        </div>
      </div>
    )
  }

  const ativos=clientes.filter(c=>c.status==="ativo").length
  const cancelados=clientes.filter(c=>c.status==="cancelado").length

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <style>{`@media print{.no-print{display:none!important}}`}</style>
      <div style={{background:"linear-gradient(90deg,#0f172a,#1e293b)",color:"white",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"4px solid black"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{background:"#facc15",color:"black",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,fontSize:14,border:"3px solid black", boxShadow:"3px 3px 0px #000"}}>$</div>
          <div>
            <div style={{fontWeight:900,fontSize:15, letterSpacing:"0.5px"}}>VENDAS • 2026</div>
            <div style={{fontSize:11,opacity:0.9, fontWeight:700, background:"white", color:"black", padding:"2px 8px", borderRadius:20, display:"inline-block", marginTop:3, border:"2px solid black"}}>{clientes.length} códigos • {ativos} ativos • {cancelados} cancelados</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <a href="/admin" className="no-print" style={{background:"white",color:"black",padding:"8px 14px",borderRadius:10,fontSize:11,fontWeight:900,textDecoration:"none",border:"3px solid black", boxShadow:"3px 3px 0px #000"}}>Admin</a>
          <a href="/" className="no-print" style={{background:"white",color:"black",padding:"8px 14px",borderRadius:10,fontSize:11,fontWeight:900,textDecoration:"none",border:"3px solid black", boxShadow:"3px 3px 0px #000"}}>Ver Site</a>
          <button onClick={()=>setLiberado(false)} className="no-print" style={{background:"#ef4444",color:"white",padding:"8px 14px",borderRadius:10,fontSize:11,fontWeight:900,border:"3px solid black", boxShadow:"3px 3px 0px #000", cursor:"pointer"}}>SAIR</button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:16,display:"flex",flexDirection:"column",gap:16}}>
        <div style={{background:"white",borderRadius:16,border:"4px solid black",overflow:"hidden", boxShadow:"6px 6px 0px #000"}}>
          <div style={{padding:"16px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"4px solid black",background:"#f8fafc"}}>
            <div style={{fontWeight:900,fontSize:14, background:"black", color:"#facc15", padding:"8px 14px", borderRadius:10, border:"3px solid black"}}>💰 GERAR CÓDIGO CLIENTE</div>
            <div style={{fontSize:11,fontWeight:800,background:"#fef9c3",padding:"6px 10px",borderRadius:20,border:"2px solid black"}}>Cada código = 1 cliente liberado</div>
          </div>
          <div style={{padding:18}}>
            <div style={{display:"grid",gridTemplateColumns:"1.2fr 0.8fr",gap:10}}>
              <input value={nomeCliente} onChange={e=>setNomeCliente(e.target.value)} placeholder="Nome do cliente (ex: Campanha João)" style={{border:"3px solid black",borderRadius:10,padding:12,fontSize:13,fontWeight:800}}/>
              <button onClick={gerar} style={{background:"black",color:"#facc15",border:"4px solid black",borderRadius:12,padding:12,fontWeight:900,fontSize:13,cursor:"pointer", boxShadow:"4px 4px 0px #000"}}>GERAR NOVO CÓDIGO +</button>
            </div>
            <p style={{fontSize:11,fontWeight:700,background:"#f1f5f9",padding:"8px 12px",borderRadius:8,border:"2px solid black",marginTop:10}}>Cada código <b>LIBERADO-XXXX</b> libera 1 cliente no site principal E serve pra você entrar no admin dele. Se clicar em CANCELAR, bloqueia site + admin.</p>
          </div>
        </div>

        <div style={{background:"white",borderRadius:16,border:"4px solid black",overflow:"hidden", boxShadow:"6px 6px 0px #000"}}>
          <div style={{padding:"16px 18px",borderBottom:"4px solid black",background:"#f8fafc",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div style={{fontWeight:900,fontSize:14, background:"#f1f5f9", padding:"8px 14px", borderRadius:10, border:"3px solid black", display:"inline-block"}}>📋 CLIENTES - {clientes.length} • {ativos} ATIVOS</div>
            <div style={{fontSize:10,fontWeight:800,background:cancelados>0?"#fee2e2":"#dcfce7",padding:"6px 10px",borderRadius:20,border:"2px solid black"}}>{cancelados} cancelados</div>
          </div>
          <div style={{padding:18}}>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {clientes.length===0?<div style={{textAlign:"center",padding:24,fontWeight:900,fontSize:13,background:"#f8fafc",border:"3px dashed black",borderRadius:12}}>Nenhum cliente ainda - digite o nome e clique em GERAR</div>:
                clientes.map((c,i)=>(
                <div key={i} style={{border:"3px solid black",background:c.status==="cancelado"?"#fee2e2":"#f8fafc",borderRadius:12,padding:"12px 14px",display:"flex",justifyContent:"space-between",alignItems:"center", boxShadow:"3px 3px 0px #000", opacity:c.status==="cancelado"?0.7:1}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,flexWrap:"wrap"}}>
                    <span style={{background:c.status==="cancelado"?"#ef4444":"black",color:c.status==="cancelado"?"white":"#facc15",padding:"6px 12px",borderRadius:8,fontWeight:900,fontSize:13,border:"2px solid black"}}>{c.codigo}</span>
                    <span style={{fontSize:13,fontWeight:900}}>{c.cliente}</span>
                    <span style={{fontSize:10,fontWeight:800,background:"white",padding:"4px 8px",borderRadius:20,border:"2px solid black"}}>{c.data}</span>
                    <span style={{fontSize:10,fontWeight:900,background:c.status==="ativo"?"#22c55e":"#ef4444",color:c.status==="ativo"?"black":"white",padding:"4px 10px",borderRadius:20,border:"2px solid black"}}>{c.status==="ativo"?"ATIVO":"CANCELADO"}</span>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>copiar(c.codigo)} className="no-print" style={{background:"white",border:"3px solid black",borderRadius:8,padding:"6px 10px",fontWeight:900,fontSize:11,cursor:"pointer", boxShadow:"2px 2px 0px #000"}}>COPIAR</button>
                    <button onClick={()=>toggleStatus(i)} className="no-print" style={{background:c.status==="ativo"?"#fbbf24":"#22c55e",color:"black",border:"3px solid black",borderRadius:8,padding:"6px 10px",fontWeight:900,fontSize:11,cursor:"pointer", boxShadow:"2px 2px 0px #000"}}>{c.status==="ativo"?"CANCELAR":"REATIVAR"}</button>
                    <button onClick={()=>remover(i)} className="no-print" style={{background:"#fee2e2",color:"#dc2626",border:"3px solid black",width:32,height:32,borderRadius:8,fontWeight:900,cursor:"pointer", boxShadow:"2px 2px 0px #000"}}>X</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
