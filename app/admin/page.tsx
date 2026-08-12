"use client"
import React from "react"

export default function AdminPage(){
  const [liberado,setLiberado]=React.useState(false)
  const [codInput,setCodInput]=React.useState("")
  const [codigoAtual,setCodigoAtual]=React.useState("")
  const [candidatos,setCandidatos]=React.useState<any[]>([])
  const [votos,setVotos]=React.useState<number[]>([])
  const [nome,setNome]=React.useState("")
  const [partido,setPartido]=React.useState("")
  const [numero,setNumero]=React.useState("")
  const [link,setLink]=React.useState("")
  const [propostas,setPropostas]=React.useState("")
  const [cargo,setCargo]=React.useState("Presidente")
  const [cargoCustom,setCargoCustom]=React.useState("")
  const [clientes, setClientes] = React.useState<any[]>([])
  const fileRef=React.useRef<HTMLInputElement>(null)

  const DONO_MESTRE = "06032025"

  function atualizarListaClientes(){
    const lista:any[] = []
    for(let i=0; i<localStorage.length; i++){
      const key = localStorage.key(i)
      if(key && key.startsWith("candidatos_")){
        try{
          const cands = JSON.parse(localStorage.getItem(key) || "[]")
          const votosKey = key.replace("candidatos_","votos_")
          const votos = JSON.parse(localStorage.getItem(votosKey) || "[]")
          const totalVotos = votos.reduce((a:number,b:number)=>a+b,0)
          lista.push({ codigo: key.replace("candidatos_",""), key: key, votosKey: votosKey, qtd: cands.length, totalVotos })
        }catch{}
      }
    }
    setClientes(lista)
  }

  React.useEffect(()=>{
    if (typeof window!== "undefined" && window.location.search.includes("dono=")) {
      window.history.replaceState({}, "", "/admin")
    }
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    if(codAtual) setCodigoAtual(codAtual)

    const cc=localStorage.getItem("candidatos_"+codAtual)
    const v=localStorage.getItem("votos_"+codAtual)

    if(cc!== null){
      try{ setCandidatos(JSON.parse(cc)) } catch { setCandidatos([]) }
    } else {
      const defaults = [
        {nome:"Bolsonaro",partido:"PL - 22",numero:"22",foto:"https://i.pravatar.cc/150?img=1",cargo:"Presidente",propostas:["Economia liberal","Segurança"]},
        {nome:"Ciro Gomes",partido:"PDT - 12",numero:"12",foto:"https://i.pravatar.cc/150?img=2",cargo:"Presidente",propostas:["Desenvolvimento","Educação"]},
        {nome:"Eduardo Leite",partido:"PSDB - 45",numero:"45",foto:"https://i.pravatar.cc/150?img=3",cargo:"Presidente",propostas:["Gestão moderna","Inclusão"]},
        {nome:"Erika Hilton",partido:"PSOL - 50",numero:"50",foto:"https://i.pravatar.cc/150?img=4",cargo:"Presidente",propostas:["Direitos LGBTQIA+","Igualdade"]},
        {nome:"Lula",partido:"PT - 13",numero:"13",foto:"https://i.pravatar.cc/150?img=5",cargo:"Presidente",propostas:["Bolsa Família","Emprego"]},
        {nome:"Simone Tebet",partido:"MDB - 15",numero:"15",foto:"https://i.pravatar.cc/150?img=6",cargo:"Presidente",propostas:["Justiça social","Educação"]},
        {nome:"Marina Silva",partido:"REDE - 18",numero:"18",foto:"https://i.pravatar.cc/150?img=7",cargo:"Presidente",propostas:["Sustentabilidade","Amazônia"]},
        {nome:"Nikolas Ferreira",partido:"PL - 22",numero:"22",foto:"https://i.pravatar.cc/150?img=8",cargo:"Presidente",propostas:["Família","Liberdade"]},
        {nome:"Tabata Amaral",partido:"PSB - 40",numero:"40",foto:"https://i.pravatar.cc/150?img=9",cargo:"Presidente",propostas:["Educação","Tecnologia"]},
        {nome:"Romeu Zema",partido:"NOVO - 30",numero:"30",foto:"https://i.pravatar.cc/150?img=10",cargo:"Presidente",propostas:["Menos impostos","Gestão"]},
        {nome:"Ronaldo Caiado",partido:"UNIAO - 44",numero:"44",foto:"https://i.pravatar.cc/150?img=11",cargo:"Presidente",propostas:["Saúde","Agro"]},
      ]
      setCandidatos(defaults)
      setVotos(Array(defaults.length).fill(0))
      localStorage.setItem("candidatos_"+codAtual,JSON.stringify(defaults))
      localStorage.setItem("votos_"+codAtual,JSON.stringify(Array(defaults.length).fill(0)))
    }

    if(v!== null){
      try{ setVotos(JSON.parse(v)) } catch { setVotos([]) }
    }
    atualizarListaClientes()
  },[])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(cod === "DONO"){
      alert(`⛔ Acesso DONO bloqueado! Use sua senha mestra: ${DONO_MESTRE}`)
      return
    }
    if(!cod.startsWith("LIBERADO-")&&cod!==DONO_MESTRE){
      alert(`⛔ Código inválido!`);return
    }
    const codigoParaSalvar = cod === DONO_MESTRE? "DONO" : cod
    localStorage.setItem("codigo_liberado",codigoParaSalvar)
    setCodigoAtual(codigoParaSalvar)
    setLiberado(true)
    setTimeout(()=>atualizarListaClientes(), 500)
  }

  function handleFoto(e:any){
    const file=e.target.files?.[0]
    if(!file) return
    if(file.size>2*1024*1024){alert("Foto muito grande! Max 2MB");return}
    const reader=new FileReader()
    reader.onload=(ev)=>{const base64=ev.target?.result as string;setLink(base64);alert("✅ Foto carregada!")}
    reader.readAsDataURL(file)
  }

  function salvar(){
    if(!nome){alert("Nome obrigatório");return}
    if(!numero){alert("Número obrigatório");return}
    const cargoFinal=cargo==="Outros"?cargoCustom:cargo
    if(cargo==="Outros" &&!cargoCustom){alert("Digite o cargo em Outros");return}
    const listaProps=propostas.split(";").filter(p=>p.trim()!=="").map(p=>p.trim())
    const novo={nome,partido:partido+" - "+numero,numero,foto:link||`https://i.pravatar.cc/150?img=${candidatos.length+20}`,cargo:cargoFinal,propostas:listaProps.length>0?listaProps:["Sem propostas"]}
    const lista=[...candidatos,novo]
    setCandidatos(lista)
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    localStorage.setItem("candidatos_"+codAtual,JSON.stringify(lista))
    const nv=[...votos,0]
    setVotos(nv)
    localStorage.setItem("votos_"+codAtual,JSON.stringify(nv))
    setNome("");setPartido("");setNumero("");setLink("");setPropostas("");setCargoCustom("")
    atualizarListaClientes()
  }

  function remover(i:number){
    if(!confirm("Remover "+candidatos[i].nome+"?")) return
    const lista=candidatos.filter((_,idx)=>idx!==i)
    const nv=votos.filter((_,idx)=>idx!==i)
    setCandidatos(lista)
    setVotos(nv)
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    localStorage.setItem("candidatos_"+codAtual,JSON.stringify(lista))
    localStorage.setItem("votos_"+codAtual,JSON.stringify(nv))
    atualizarListaClientes()
  }

  function zerarVotos(){
    if(!confirm("⚠ ZERAR VOTOS de "+codigoAtual+"?")) return
    const nv=Array(candidatos.length).fill(0)
    setVotos(nv)
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    localStorage.setItem("votos_"+codAtual,JSON.stringify(nv))
    atualizarListaClientes()
    alert("✅ Votos zerados de "+codAtual+"!")
  }

  function zerarCandidatosAtual(){
    if(!confirm(`⚠ ZERAR CANDIDATOS de ${codigoAtual}?`)) return
    if(!confirm(`Tem CERTEZA? Só vai apagar de ${codigoAtual}`)) return
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    localStorage.setItem("candidatos_"+codAtual, JSON.stringify([]))
    localStorage.setItem("votos_"+codAtual, JSON.stringify([]))
    setCandidatos([])
    setVotos([])
    atualizarListaClientes()
    alert(`✅ Zerado só de ${codAtual}!`)
  }

  function zerarClienteEspecifico(codigoCliente:string){
    if(!confirm(`⚠ DONO: ZERAR TUDO de ${codigoCliente}?`)) return
    if(!confirm(`Apagar todos os candidatos e votos de ${codigoCliente}?`)) return
    localStorage.setItem("candidatos_"+codigoCliente, JSON.stringify([]))
    localStorage.setItem("votos_"+codigoCliente, JSON.stringify([]))
    if(codigoCliente === codigoAtual){
      setCandidatos([])
      setVotos([])
    }
    atualizarListaClientes()
    alert(`✅ Cliente ${codigoCliente} zerado!`)
  }

  function baixarResultado(){
    if(total===0){alert("Nenhum voto ainda!");return}
    const data=new Date().toLocaleString("pt-BR")
    let txt=`PLATAFORMA ELEITORAL 2026 - RESULTADO FINAL\nCliente: ${codigoAtual}\nData: ${data}\nTotal de Votos: ${total}\n\nRANKING FINAL:\n----------------------------------------\n`
    ranking.forEach((r,i)=>{
      txt+=`${i+1}º LUGAR - ${r.nome} - ${r.partido} - Nº ${r.numero} - Cargo: ${r.cargo}\nVotos: ${r.v} - ${r.pct}%\nPropostas: ${(r.propostas||[]).join(" | ")}\n----------------------------------------\n`
    })
    const blob=new Blob([txt],{type:"text/plain"})
    const url=URL.createObjectURL(blob)
    const a=document.createElement("a")
    a.href=url
    a.download=`RESULTADO_FINAL_${codigoAtual}_${new Date().toISOString().slice(0,10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const total=votos.reduce((a,b)=>a+b,0)
  const ranking=candidatos.map((c,i)=>({nome:c.nome,partido:c.partido,numero:c.numero,foto:c.foto,cargo:c.cargo,propostas:c.propostas||[],v:votos[i]||0,pct:total>0?Math.round((votos[i]||0)/total*100):0})).sort((a,b)=>b.v-a.v)

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:16, fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:20,padding:28,width:400,border:"4px solid black", boxShadow:"8px 8px 0px #000"}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:70,height:70, background:"#fef9c3", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto", fontSize:32, border:"4px solid black"}}>🔒</div>
            <h1 style={{fontWeight:900, marginTop:12, fontSize:18}}>ADMIN BLOQUEADO</h1>
          </div>
          <input type="password" value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="SENHA DO ADMIN" style={{width:"100%",marginTop:14,padding:14,border:"4px solid black",borderRadius:12,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:10,background:"black",color:"#facc15",padding:14,borderRadius:12,fontWeight:900,border:"4px solid black", boxShadow:"4px 4px 0px #000"}}>ENTRAR →</button>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <div style={{background:"linear-gradient(90deg,#0f172a,#1e293b)",color:"white",padding:"16px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:"4px solid black"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{background:"#facc15",color:"black",width:40,height:40,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900,border:"3px solid black"}}>ADM</div>
          <div>
            <div style={{fontWeight:900,fontSize:15}}>PAINEL ADMIN • 2026</div>
            <div style={{fontSize:11,fontWeight:700, background:"white", color:"black", padding:"2px 8px", borderRadius:20, display:"inline-block", border:"2px solid black"}}>{candidatos.length} candidatos • {total} votos • {codigoAtual}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <a href="/" style={{background:"white",color:"black",padding:"8px 14px",borderRadius:10,fontSize:11,fontWeight:900,textDecoration:"none",border:"3px solid black"}}>Ver Site</a>
          <button onClick={()=>setLiberado(false)} style={{background:"#ef4444",color:"white",padding:"8px 14px",borderRadius:10,fontSize:11,fontWeight:900,border:"3px solid black"}}>SAIR</button>
        </div>
      </div>

      <div style={{maxWidth:1200,margin:"0 auto",padding:16,display:"flex",flexDirection:"column",gap:16}}>

        {codigoAtual==="DONO" && (
          <div style={{background:"#fef9c3",borderRadius:16,border:"4px solid black",padding:18, boxShadow:"6px 6px 0px #000"}}>
            <div style={{fontWeight:900,marginBottom:12, background:"black", color:"#facc15", padding:"8px 14px", borderRadius:10, display:"inline-block", border:"3px solid black"}}>👑 PAINEL DONO - GERENCIAR CLIENTES</div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {clientes.map((cli,i)=>(
                <div key={i} style={{background:"white",border:"3px solid black",borderRadius:10,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div>
                    <b style={{fontSize:13}}>{cli.codigo}</b> <span style={{fontSize:11, background:"#f1f5f9", padding:"2px 6px", borderRadius:6, border:"2px solid black"}}>{cli.qtd} cands • {cli.totalVotos} votos</span>
                  </div>
                  <button onClick={()=>zerarClienteEspecifico(cli.codigo)} style={{background:"#fee2e2",color:"#dc2626",border:"3px solid black",borderRadius:8,padding:"6px 10px",fontSize:11,fontWeight:900,cursor:"pointer"}}>ZERAR ESSE CLIENTE</button>
                </div>
              ))}
              {clientes.length===0 && <div style={{fontSize:12, fontWeight:700}}>Nenhum cliente ainda</div>}
            </div>
          </div>
        )}

        <div style={{background:"white",borderRadius:16,border:"4px solid black",padding:18, boxShadow:"6px 6px 0px #000"}}>
          <div style={{fontWeight:900,marginBottom:12,background:"black",color:"#facc15",padding:"8px 14px",borderRadius:10,display:"inline-block", border:"3px solid black"}}>➕ CADASTRAR CANDIDATO EM {codigoAtual}</div>
          <div style={{display:"grid",gridTemplateColumns:"1.5fr 0.8fr 0.3fr 140px 130px",gap:10,marginTop:10}}>
            <input value={nome} onChange={e=>setNome(e.target.value)} placeholder="Nome completo" style={{border:"3px solid black",borderRadius:10,padding:12,fontSize:13,fontWeight:800}}/>
            <input value={partido} onChange={e=>setPartido(e.target.value)} placeholder="Partido ex: PL" style={{border:"3px solid black",borderRadius:10,padding:12,fontSize:13,fontWeight:800}}/>
            <input value={numero} onChange={e=>setNumero(e.target.value)} placeholder="Nº" style={{border:"3px solid black",borderRadius:10,padding:12,fontSize:13,fontWeight:900,textAlign:"center"}}/>
            <select value={cargo} onChange={e=>setCargo(e.target.value)} style={{border:"3px solid black",borderRadius:10,padding:12,fontSize:13,fontWeight:800}}>
              <option>Presidente</option><option>Governador</option><option>Senador</option><option>Deputado Federal</option><option>Deputado Estadual</option><option>Prefeito</option><option>Vereador</option><option>Outros</option>
            </select>
            <div><input ref={fileRef} type="file" accept="image/*" onChange={handleFoto} style={{display:"none"}}/><button onClick={()=>fileRef.current?.click()} style={{width:"100%",background:"#3b82f6",color:"white",border:"3px solid black",borderRadius:10,padding:12,fontSize:11,fontWeight:900,cursor:"pointer"}}>📸 SUBIR FOTO</button></div>
          </div>
          {cargo==="Outros" && <input value={cargoCustom} onChange={e=>setCargoCustom(e.target.value)} placeholder="Digite o cargo..." style={{width:"100%",marginTop:10,border:"4px solid #eab308",borderRadius:10,padding:12,background:"#fef9c3",fontWeight:800}}/>}
          <input value={link} onChange={e=>setLink(e.target.value)} placeholder="Link da foto" style={{width:"100%",marginTop:10,border:"3px solid black",borderRadius:10,padding:12}}/>
          <textarea value={propostas} onChange={e=>setPropostas(e.target.value)} placeholder="Propostas separadas por ;" style={{width:"100%",marginTop:10,border:"3px solid black",borderRadius:10,padding:12,minHeight:70}}/>
          {link && <div style={{marginTop:10,display:"flex",alignItems:"center",gap:10, background:"#dcfce7", border:"3px solid black", padding:10, borderRadius:10}}><img src={link} style={{width:60,height:60,borderRadius:"50%",border:"3px solid black"}}/><span style={{fontWeight:900}}>✅ Foto pronta!</span></div>}
          <button onClick={salvar} style={{width:"100%",marginTop:14,background:"black",color:"#facc15",border:"4px solid black",borderRadius:12,padding:14,fontWeight:900,cursor:"pointer"}}>ADICIONAR EM {codigoAtual} +</button>
        </div>

        <div style={{background:"white",borderRadius:16,border:"4px solid black",padding:18, boxShadow:"6px 6px 0px #000"}}>
          <div style={{fontWeight:900,marginBottom:12}}>📋 LISTA - {candidatos.length} CANDIDATOS DE {codigoAtual}</div>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {candidatos.map((c,i)=>(
              <div key={i} style={{border:"3px solid black",background:"#f8fafc",borderRadius:12,padding:"12px 14px"}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                  <div style={{display:"flex",alignItems:"center",gap:12}}><img src={c.foto} style={{width:40,height:40,borderRadius:"50%",border:"3px solid black"}}/><span><b>{c.nome}</b> • {c.partido} • {c.numero}</span></div>
                  <button onClick={()=>remover(i)} style={{background:"#fee2e2",color:"#dc2626",border:"3px solid black",width:32,height:32,borderRadius:10,fontWeight:900}}>X</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{background:"white",borderRadius:16,border:"4px solid black",padding:18, boxShadow:"6px 6px 0px #000"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
            <button onClick={baixarResultado} style={{background:"#22c55e",color:"white",border:"4px solid black",borderRadius:12,padding:14,fontWeight:900,cursor:"pointer"}}>📥 BAIXAR RESULTADO {codigoAtual}</button>
            <button onClick={zerarVotos} style={{background:"#ef4444",color:"white",border:"4px solid black",borderRadius:12,padding:14,fontWeight:900,cursor:"pointer"}}>🗑 ZERAR VOTOS {codigoAtual}</button>
            <button onClick={zerarCandidatosAtual} style={{background:"black",color:"#facc15",border:"4px solid black",borderRadius:12,padding:14,fontWeight:900,cursor:"pointer"}}>💣 ZERAR CANDIDATOS {codigoAtual}</button>
          </div>
          <p style={{fontSize:11,marginTop:8, background:"#f1f5f9", padding:8, borderRadius:8, border:"2px solid black"}}>Zerar afeta SÓ o {codigoAtual}. DONO pode zerar clientes lá em cima, um por um.</p>
        </div>
      </div>
    </div>
  )
}
