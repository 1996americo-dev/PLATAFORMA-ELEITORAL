"use client"
import React from "react"
import { supabase } from "@/lib/supabase"

export default function VendasPage(){
  const [liberado,setLiberado]=React.useState(false)
  const [nomeCliente,setNomeCliente]=React.useState("")
  const [vendas,setVendas]=React.useState<any[]>([])

  React.useEffect(()=>{
    const url=new URL(window.location.href)
    if(url.searchParams.get("dono")==="americo"){
      localStorage.setItem("dono_americo","true")
      setLiberado(true)
    }
    const cod=localStorage.getItem("codigo_liberado")
    if(cod==="DONO"){ setLiberado(true) }
    const v=localStorage.getItem("vendas_lista")
    if(v){ setVendas(JSON.parse(v)) }
  },[])

  function gerarCodigo(){
    if(!nomeCliente){ alert("Digite nome do cliente"); return }
    const rand = Math.random().toString(36).substring(2,6).toUpperCase() + "-" + Math.random().toString(36).substring(2,6).toUpperCase()
    const codigo = "LIBERADO-"+rand
    const novaVenda = { id: Date.now(), nome: nomeCliente, codigo: codigo, data: new Date().toLocaleDateString(), status: "ATIVO" }
    const lista = [...vendas, novaVenda]
    setVendas(lista)
    localStorage.setItem("vendas_lista", JSON.stringify(lista))
    setNomeCliente("")
    alert("Código gerado: "+codigo)
  }

  async function cancelarVenda(id:number, codigo:string){
    if(!confirm("Cancelar cliente "+codigo+"? Ele não vai mais entrar no site!")) return
    
    const lista = vendas.filter(v=>v.id!==id)
    setVendas(lista)
    localStorage.setItem("vendas_lista", JSON.stringify(lista))

    // BLOQUEIO REAL NO BANCO - FUNCIONA EM QUALQUER LUGAR
    const { error } = await supabase.from("bloqueados").insert({codigo})
    if(error){ console.log(error); alert("Erro ao bloquear: "+error.message) }
    else { alert("Cliente "+codigo+" CANCELADO! Agora em qualquer lugar do Brasil ele não entra mais!") }
  }

  async function reativarVenda(codigo:string){
    await supabase.from("bloqueados").delete().eq("codigo", codigo)
    alert(codigo+" reativado!")
  }

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"system-ui"}}>
        <div style={{background:"white",padding:24,borderRadius:12}}>
          <h1 style={{fontWeight:900}}>🔒 Só DONO</h1>
          <p>Acesse com ?dono=americo</p>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#0f172a",fontFamily:"system-ui",padding:20}}>
      <div style={{maxWidth:900,margin:"0 auto"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h1 style={{color:"#facc15",fontWeight:900,fontSize:22}}>💰 VENDAS - {vendas.length} CLIENTES</h1>
          <a href="/admin?dono=americo" style={{background:"white",color:"black",padding:"8px 14px",borderRadius:8,textDecoration:"none",fontWeight:800,fontSize:12}}>← Voltar Admin</a>
        </div>

        <div style={{background:"white",borderRadius:12,padding:16,border:"3px solid #facc15",marginBottom:20}}>
          <div style={{fontWeight:900,fontSize:12,marginBottom:8}}>GERAR NOVO ACESSO:</div>
          <div style={{display:"flex",gap:8}}>
            <input value={nomeCliente} onChange={e=>setNomeCliente(e.target.value)} placeholder="Nome do cliente ex: Prefeitura Trindade" style={{flex:1,padding:10,border:"3px solid black",borderRadius:8,fontWeight:700}}/>
            <button onClick={gerarCodigo} style={{background:"black",color:"#facc15",padding:"10px 16px",borderRadius:8,fontWeight:900,border:"2px solid black",cursor:"pointer"}}>GERAR CÓDIGO</button>
          </div>
        </div>

        <div style={{background:"white",borderRadius:12,padding:16,border:"2px dashed #facc15"}}>
          {vendas.length===0?(
            <div style={{textAlign:"center",padding:20,fontWeight:900,color:"#64748b"}}>Nenhuma venda ainda</div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {vendas.map((v:any)=>(
                <div key={v.id} style={{border:"2px solid black",borderRadius:10,padding:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <div style={{fontWeight:900,fontSize:13}}>{v.nome}</div>
                    <div style={{fontSize:11,fontWeight:800,background:"black",color:"#facc15",padding:"2px 6px",borderRadius:4,display:"inline-block",marginTop:4}}>{v.codigo}</div>
                    <div style={{fontSize:10,color:"#64748b",marginTop:2}}>{v.data} • {v.status}</div>
                  </div>
                  <div style={{display:"flex",gap:6}}>
                    <button onClick={()=>reativarVenda(v.codigo)} style={{background:"#22c55e",color:"white",border:"2px solid black",padding:"6px 10px",borderRadius:6,fontWeight:800,fontSize:10,cursor:"pointer"}}>REATIVAR</button>
                    <button onClick={()=>cancelarVenda(v.id, v.codigo)} style={{background:"#ef4444",color:"white",border:"2px solid black",padding:"6px 10px",borderRadius:6,fontWeight:800,fontSize:10,cursor:"pointer"}}>CANCELAR / BLOQUEAR</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}