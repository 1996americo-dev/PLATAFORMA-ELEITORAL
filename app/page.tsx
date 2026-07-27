"use client"
import React from "react"

const CAND_DEFAULT = [
  {nome:"Bolsonaro",part:"PL",num:"22",foto:"https://i.pravatar.cc/150?img=1",cor:"#22c55e",cargo:"Presidente",propostas:["Economia liberal e redução de impostos","Segurança pública e combate ao crime","Defesa da família e valores"]},
  {nome:"Ciro Gomes",part:"PDT",num:"12",foto:"https://i.pravatar.cc/150?img=2",cor:"#f59e0b",cargo:"Presidente",propostas:["Projeto Nacional de Desenvolvimento","Educação em tempo integral","Indústria brasileira forte"]},
  {nome:"Eduardo Leite",part:"PSDB",num:"45",foto:"https://i.pravatar.cc/150?img=3",cor:"#3b82f6",cargo:"Presidente",propostas:["Gestão moderna e eficiente","Inclusão e diversidade","Parcerias público-privadas"]},
  {nome:"Erika Hilton",part:"PSOL",num:"50",foto:"https://i.pravatar.cc/150?img=4",cor:"#ec4899",cargo:"Presidente",propostas:["Direitos LGBTQIA+ e humanos","Educação inclusiva","Combate à desigualdade"]},
  {nome:"Lula",part:"PT",num:"13",foto:"https://i.pravatar.cc/150?img=5",cor:"#ef4444",cargo:"Presidente",propostas:["Bolsa Família e programas sociais","Emprego, renda e salário forte","Educação e saúde para todos"]},
  {nome:"Simone Tebet",part:"MDB",num:"15",foto:"https://i.pravatar.cc/150?img=6",cor:"#a855f7",cargo:"Presidente",propostas:["Justiça social e equilíbrio","Educação como prioridade","Agronegócio sustentável"]},
  {nome:"Marina Silva",part:"REDE",num:"18",foto:"https://i.pravatar.cc/150?img=7",cor:"#14b8a6",cargo:"Presidente",propostas:["Sustentabilidade e Amazônia","Economia verde","Educação ambiental"]},
  {nome:"Nikolas Ferreira",part:"PL",num:"22",foto:"https://i.pravatar.cc/150?img=8",cor:"#22c55e",cargo:"Presidente",propostas:["Valores conservadores","Liberdade de expressão","Segurança e família"]},
  {nome:"Tabata Amaral",part:"PSB",num:"40",foto:"https://i.pravatar.cc/150?img=9",cor:"#eab308",cargo:"Presidente",propostas:["Educação pública de qualidade","Inovação e tecnologia","Política baseada em dados"]},
  {nome:"Romeu Zema",part:"NOVO",num:"30",foto:"https://i.pravatar.cc/150?img=10",cor:"#f97316",cargo:"Presidente",propostas:["Estado eficiente e menos impostos","Empreendedorismo","Gestão empresarial no governo"]},
  {nome:"Ronaldo Caiado",part:"UNIAO",num:"44",foto:"https://i.pravatar.cc/150?img=11",cor:"#6366f1",cargo:"Presidente",propostas:["Saúde de qualidade","Agronegócio e segurança no campo","Gestão fiscal responsável"]},
]

export default function Home(){
  const [CAND,setCAND]=React.useState(CAND_DEFAULT)
  const [liberado,setLiberado]=React.useState(false)
  const [codInput,setCodInput]=React.useState("")
  const [codigoAtual,setCodigoAtual]=React.useState("")
  const [cpf,setCpf]=React.useState("")
  const [cpfOk,setCpfOk]=React.useState(false)
  const [votos,setVotos]=React.useState<number[]>(Array(CAND_DEFAULT.length).fill(0))
  const [votoSel,setVotoSel]=React.useState<number|null>(null)

  React.useEffect(()=>{
    const url=new URL(window.location.href)
    let codAtualFinal = localStorage.getItem("codigo_liberado") || "GERAL"
    if(url.searchParams.get("dono")==="americo"){
      localStorage.setItem("dono_americo","true")
      localStorage.setItem("codigo_liberado","DONO")
      codAtualFinal = "DONO"
      setCodigoAtual("DONO")
      setLiberado(true)
    }
    const c=url.searchParams.get("codigo")
    if(c && c.toUpperCase().startsWith("LIBERADO-")){
      localStorage.setItem("codigo_liberado",c.toUpperCase())
      codAtualFinal = c.toUpperCase()
      setCodigoAtual(c.toUpperCase())
      setLiberado(true)
    }
    const cod=localStorage.getItem("codigo_liberado")
    if(cod && (cod.startsWith("LIBERADO-")||cod==="DONO")){
      codAtualFinal = cod
      setCodigoAtual(cod)
      setLiberado(true)
    }
      // BLOQUEIO REAL VIA SUPABASE - LUGAR CERTO
  (async () => {
    try{
      const { supabase } = await import("@/lib/supabase")
      const { data } = await supabase.from("bloqueados").select("codigo").eq("codigo", codAtualFinal).maybeSingle()
      if(data){
        alert("⛔ ACESSO CANCELADO - Este código foi bloqueado pelo administrador!")
        localStorage.removeItem("codigo_liberado")
        localStorage.removeItem("cpf_validado_"+codAtualFinal)
        setLiberado(false)
        setCodigoAtual("")
        return
      }
    }catch(e){}
  })()

  let cc = null
    let chaveUsada = ""
    const chavesParaTentar = ["candidatos_"+codAtualFinal,"candidatos_DONO","candidatos_v21","candidatos_GERAL"]
    for(const chave of chavesParaTentar){
      const tentativa = localStorage.getItem(chave)
      if(tentativa){
        try{
          const lista = JSON.parse(tentativa)
          if(lista && lista.length > 0){ cc = tentativa; chaveUsada = chave; break }
        }catch(e){}
      }
    }
    if(cc){
      try{
        const listaAdmin=JSON.parse(cc)
        const convertidos=listaAdmin.map((x:any,idx:number)=>({
          nome:x.nome, part:x.partido?.split(" - ")[0]||x.partido||"OUTROS", num:x.numero, foto:x.foto,
          cor:["#22c55e","#f59e0b","#3b82f6","#ec4899","#ef4444","#a855f7","#14b8a6","#eab308","#f97316","#6366f1"][idx%10],
          cargo:x.cargo||"Presidente", propostas:x.propostas||["Sem propostas"]
        }))
        if(convertidos.length>0){
          setCAND(convertidos)
          if(chaveUsada!== "candidatos_"+codAtualFinal){
            localStorage.setItem("candidatos_"+codAtualFinal, JSON.stringify(listaAdmin))
          }
          const v=localStorage.getItem("votos_"+codAtualFinal) || localStorage.getItem("votos_v21") || localStorage.getItem("votos_DONO")
          if(v){
            try{
              const votosSalvos = JSON.parse(v)
              if(votosSalvos.length === convertidos.length){ setVotos(votosSalvos) } else { setVotos(Array(convertidos.length).fill(0)) }
            }catch{ setVotos(Array(convertidos.length).fill(0)) }
          } else { setVotos(Array(convertidos.length).fill(0)) }
        }
      }catch(e){ console.log("erro ler admin",e) }
    } else {
      const v=localStorage.getItem("votos_"+codAtualFinal)
      if(v){ setVotos(JSON.parse(v)) }
    }
    const cv=localStorage.getItem("cpf_validado_"+codAtualFinal)
    if(cv){ setCpf(cv); setCpfOk(true) }
  },[])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(!cod.startsWith("LIBERADO-")&&cod!=="DONO"){ alert("Use LIBERADO-XXXX"); return }
    const bloqueados = JSON.parse(localStorage.getItem("codigos_bloqueados")||"[]")
    if(bloqueados.includes(cod)){ alert("⛔ Código cancelado/bloqueado!"); return }
    localStorage.setItem("codigo_liberado",cod)
    setCodigoAtual(cod)
    setLiberado(true)
    window.location.reload()
  }

  function validarCPF(){
    const limpo=cpf.replace(/\D/g,"")
    if(limpo.length!==11){ alert("11 numeros"); return }
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    const ja:string[]=JSON.parse(localStorage.getItem("cpfs_votaram_"+codAtual)||"[]")
    if(ja.includes(limpo)){ alert("Ja votou neste cliente"); return }
    localStorage.setItem("cpf_validado_"+codAtual,limpo)
    setCpfOk(true)
  }

  function votar(i:number){
    if(!cpfOk){ alert("Valide CPF lateral"); return }
    const limpo=cpf.replace(/\D/g,"")
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    const ja:string[]=JSON.parse(localStorage.getItem("cpfs_votaram_"+codAtual)||"[]")
    if(ja.includes(limpo)){ alert("Ja votou neste cliente"); return }
    const n=[...votos]; n[i]++
    setVotos(n)
    localStorage.setItem("votos_"+codAtual,JSON.stringify(n))
    ja.push(limpo)
    localStorage.setItem("cpfs_votaram_"+codAtual,JSON.stringify(ja))
    localStorage.removeItem("cpf_validado_"+codAtual)
    setCpfOk(false); setCpf(""); setVotoSel(null)
  }

  const total=votos.reduce((a,b)=>a+b,0)
  const ranking=CAND.map((c,i)=>({...c, v:votos[i]||0, pct:total>0?Math.round((votos[i]||0)/total*100):0})).sort((a,b)=>b.v-a.v)

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:16,padding:24,width:380}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:60,height:60,background:"#fef9c3",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:28}}>🔒</div>
            <h1 style={{fontWeight:900,fontSize:20,marginTop:12}}>PLATAFORMA ELEITORAL 2026</h1>
            <p style={{fontSize:12,color:"#64748b"}}>Acesso restrito - Liberação via PIX</p>
          </div>
          <div style={{background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:12,padding:12,marginTop:16}}>
            <div style={{fontWeight:800,fontSize:12}}>💰 LIBERAÇÃO IMEDIATA</div>
            <div style={{fontSize:13,marginTop:6}}>PIX: <b>6291796690</b></div>
            <div style={{fontSize:12}}>Valor: <b>R$ 49,90</b></div>
          </div>
          <input value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:12,padding:12,border:"2px solid #0f172a",borderRadius:10,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:8,background:"#0f172a",color:"white",padding:12,borderRadius:10,fontWeight:900}}>LIBERAR ACESSO →</button>
          <a href="https://wa.me/556291796690" target="_blank" style={{display:"block",marginTop:8,background:"#22c55e",color:"white",padding:12,borderRadius:10,fontWeight:900,textDecoration:"none",textAlign:"center"}}>WHATSAPP 62 9179-6690</a>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <div style={{background:"linear-gradient(90deg,#0f172a,#1e293b)",color:"white",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{background:"#facc15",color:"black",width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900}}>26</div>
          <div>
            <div style={{fontWeight:900,fontSize:13}}>PLATAFORMA ELEITORAL 2026 - {codigoAtual}</div>
            <div style={{fontSize:10,opacity:0.7}}>{total} VOTOS COMPUTADOS • {CAND.length} CANDIDATOS • Cliente: {codigoAtual}</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{background:"#22c55e",padding:"4px 10px",borderRadius:20,fontSize:10,fontWeight:900}}>● AO VIVO</span>
          <a href="/admin?dono=americo" style={{background:"white",color:"black",padding:"6px 12px",borderRadius:8,fontSize:11,textDecoration:"none",fontWeight:800}}>ADMIN</a>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,padding:16,maxWidth:1400,margin:"0 auto"}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
            <div style={{fontWeight:900,fontSize:12,display:"flex",justifyContent:"space-between"}}>
              <span>🏆 RANKING - {codigoAtual}</span>
              <span style={{background:"#0f172a",color:"white",padding:"2px 8px",borderRadius:10,fontSize:10}}>{total} VOTOS</span>
            </div>
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
              {total===0?<div style={{textAlign:"center",padding:20,color:"#94a3b8",fontSize:12}}>Nenhum voto ainda<br/>Cliente {codigoAtual}</div>:ranking.filter(r=>r.v>0).map((r,i)=><div key={i} style={{border:i===0?"2px solid #facc15":"1px solid #e2e8f0",borderRadius:10,padding:8,background:i===0?"#fefce8":"white"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:800}}><span>{i+1}º {r.nome}</span><span>{r.pct}%</span></div><div style={{fontSize:10,color:"#64748b"}}>{r.part} - {r.num} • {r.v} votos • {r.cargo}</div><div style={{height:6,background:"#e2e8f0",borderRadius:10,marginTop:4}}><div style={{width:`${r.pct}%`,height:"100%",background:i===0?"#eab308":"#0f172a"}}></div></div></div>)}
            </div>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
            <div style={{fontWeight:900,fontSize:12}}>🛡️ VALIDAÇÃO CPF - {codigoAtual}</div>
            <div style={{fontSize:10,color:"#64748b",marginTop:2}}>1 CPF = 1 Voto neste cliente</div>
            <input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",marginTop:10,padding:10,border:cpfOk?"2px solid #22c55e":"2px solid #e2e8f0",borderRadius:8,boxSizing:"border-box",textAlign:"center",fontWeight:700}}/>
            <button onClick={validarCPF} style={{width:"100%",marginTop:8,background:cpfOk?"#22c55e":"#0f172a",color:"white",padding:10,borderRadius:8,fontWeight:900,fontSize:12,border:"none"}}>{cpfOk?"✅ VALIDADO - PODE VOTAR":"VALIDAR CPF"}</button>
          </div>
        </div>
        <div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #e2e8f0"}}>
            <div style={{display:"flex",justifyContent:"space-between"}}>
              <div style={{fontWeight:900,fontSize:14}}>CANDIDATOS 2026 - {codigoAtual}</div>
              <div style={{fontSize:10,background:"#f1f5f9",padding:"4px 10px",borderRadius:20}}>{CAND.length} candidatos</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:12,marginTop:14}}>
              {CAND.map((c,i)=>(
                <div key={i} onClick={()=>setVotoSel(i)} style={{border:votoSel===i?"2px solid #0f172a":"1.5px solid #e2e8f0",borderRadius:14,padding:12,textAlign:"center",cursor:"pointer",background:votoSel===i?"#f8fafc":"white"}}>
                  <div style={{position:"relative",display:"inline-block"}}>
                    <img src={c.foto} alt="" style={{width:64,height:64,borderRadius:"50%",border:`3px solid ${c.cor}`}}/>
                    <div style={{position:"absolute",bottom:-4,right:-4,background:c.cor,color:"white",width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,border:"2px solid white"}}>{c.num}</div>
                  </div>
                  <div style={{fontWeight:900,fontSize:13,marginTop:8}}>{c.nome}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{c.part} • Nº {c.num} • {c.cargo}</div>
                  <div style={{marginTop:8,background:"#f8fafc",borderRadius:8,padding:8,textAlign:"left"}}>
                    <div style={{fontSize:9,fontWeight:900,color:"#0f172a"}}>📋 PROPOSTAS:</div>
                    {c.propostas.map((p:any,j:number)=><div key={j} style={{fontSize:9,marginTop:3,lineHeight:"13px"}}>• {p}</div>)}
                  </div>
                  <div style={{marginTop:8,display:"flex",justifyContent:"space-between",fontSize:10,background:"#f1f5f9",padding:"4px 8px",borderRadius:6}}>
                    <span>{votos[i]||0} votos</span>
                    <b>{total>0?Math.round((votos[i]||0)/total*100):0}%</b>
                  </div>
                  <button onClick={(e)=>{e.stopPropagation();votar(i)}} style={{width:"100%",marginTop:8,background:votoSel===i?"#0f172a":"white",color:votoSel===i?"white":"#0f172a",border:"1.5px solid #0f172a",borderRadius:8,padding:"7px 0",fontSize:11,fontWeight:900}}>VOTAR {c.nome.split(" ")[0].toUpperCase()}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}