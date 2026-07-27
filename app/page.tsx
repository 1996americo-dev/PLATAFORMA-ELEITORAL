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
  const [bloqueado,setBloqueado]=React.useState(false)
  const [codigoBloq,setCodigoBloq]=React.useState("")

  const DONO_MESTRE = "06032025"
  const CANCELADOS_FIXOS = ["LIBERADO-GRAZI","LIBERADO-TESTE"]

  React.useEffect(()=>{
    (async ()=>{
      if (typeof window!== "undefined" && window.location.search.includes("dono=")) {
        window.history.replaceState({}, "", "/")
      }
      let codAtualFinal = localStorage.getItem("codigo_liberado") || "GERAL"
      const url=new URL(window.location.href)
      const c=url.searchParams.get("codigo")
      if(c && c.toUpperCase().startsWith("LIBERADO-")){
        if(CANCELADOS_FIXOS.includes(c.toUpperCase())){
          setCodigoBloq(c.toUpperCase())
          setBloqueado(true)
          return
        }
        localStorage.setItem("codigo_liberado",c.toUpperCase())
        codAtualFinal = c.toUpperCase()
        setCodigoAtual(c.toUpperCase())
        setLiberado(true)
      }
      const cod=localStorage.getItem("codigo_liberado")
      if(cod){
        if(CANCELADOS_FIXOS.includes(cod)){
          setCodigoBloq(cod)
          setBloqueado(true)
          localStorage.removeItem("codigo_liberado")
          setLiberado(false)
          return
        }
        if(cod.startsWith("LIBERADO-")||cod==="DONO"){
          codAtualFinal = cod
          setCodigoAtual(cod==="DONO"?"":cod)
          setLiberado(true)
        }
      }
      try{
        const mod = await import("@/lib/supabase")
        const { data } = await mod.supabase.from("bloqueados").select("codigo").eq("codigo", codAtualFinal).maybeSingle()
        if(data){
          setCodigoBloq(codAtualFinal)
          setBloqueado(true)
          localStorage.removeItem("codigo_liberado")
          localStorage.removeItem("cpf_validado_"+codAtualFinal)
          setLiberado(false)
          setCodigoAtual("")
          return
        }
      }catch(e){}
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
        }catch(e){}
      } else {
        const v=localStorage.getItem("votos_"+codAtualFinal)
        if(v){ setVotos(JSON.parse(v)) }
      }
      const cv=localStorage.getItem("cpf_validado_"+codAtualFinal)
      if(cv){ setCpf(cv); setCpfOk(true) }
    })()
  },[])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(cod==="DONO"){ alert(`⛔ Código inválido!`);return }
    if(CANCELADOS_FIXOS.includes(cod)){ setCodigoBloq(cod); setBloqueado(true); return }
    if(!cod.startsWith("LIBERADO-")&&cod!==DONO_MESTRE){ alert("⛔ Código inválido"); return }
    const codigoSalvar = cod===DONO_MESTRE? "DONO" : cod
    localStorage.setItem("codigo_liberado",codigoSalvar)
    setCodigoAtual(codigoSalvar==="DONO"?"":codigoSalvar)
    setLiberado(true)
    window.location.reload()
  }

  function validarCPFReal(cpfStr:string){
    const c=cpfStr.replace(/\D/g,"")
    if(c.length!==11) return false
    if(/^(\d)\1{10}$/.test(c)) return false
    let soma=0
    for(let i=0;i<9;i++) soma+=parseInt(c[i])* (10-i)
    let resto=(soma*10)%11
    if(resto===10) resto=0
    if(resto!==parseInt(c[9])) return false
    soma=0
    for(let i=0;i<10;i++) soma+=parseInt(c[i])*(11-i)
    resto=(soma*10)%11
    if(resto===10) resto=0
    if(resto!==parseInt(c[10])) return false
    return true
  }
  function validarCPF(){
    const limpo=cpf.replace(/\D/g,"")
    if(limpo.length!==11){ alert("CPF precisa ter 11 números"); return }
    if(!validarCPFReal(limpo)){ alert("❌ CPF inválido! Digite um CPF real."); return }
    const codAtual = localStorage.getItem("codigo_liberado") || "GERAL"
    const ja:string[]=JSON.parse(localStorage.getItem("cpfs_votaram_"+codAtual)||"[]")
    if(ja.includes(limpo)){ alert("Este CPF já votou neste cliente"); return }
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

  if(bloqueado){
    return(
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#7f1d1d 0%,#000 60%)",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:24,padding:32,width:440,textAlign:"center",border:"4px solid black", boxShadow:"12px 12px 0px #000"}}>
          <div style={{width:80,height:80,background:"#fee2e2",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:40, border:"4px solid black"}}>⛔</div>
          <h1 style={{fontWeight:900,fontSize:22,marginTop:16,color:"#dc2626"}}>ACESSO CANCELADO</h1>
          <p style={{fontSize:13,color:"#475569",marginTop:8}}>Este código <b>{codigoBloq}</b> foi bloqueado</p>
          <div style={{marginTop:16,background:"#f8fafc",border:"3px solid black",borderRadius:16,padding:16,textAlign:"left",boxShadow:"4px 4px 0px #000"}}>
            <div style={{fontSize:13,fontWeight:900,textAlign:"center",marginBottom:10}}>💰 REATIVAR ACESSO - R$ 97,00</div>
            <div style={{background:"white",border:"2px solid black",borderRadius:10,padding:12}}>
              <div style={{fontSize:11,fontWeight:900}}>PIX (Celular):</div>
              <div style={{fontSize:18,fontWeight:900,marginTop:4}}>62981796690</div>
              <button onClick={()=>{navigator.clipboard.writeText("62981796690");alert("PIX 62981796690 copiado!")}} style={{width:"100%",marginTop:8,background:"#22c55e",color:"black",border:"3px solid black",borderRadius:8,padding:8,fontWeight:900,fontSize:12,cursor:"pointer",boxShadow:"2px 2px 0px #000"}}>📋 COPIAR CHAVE PIX</button>
            </div>
            <a href={`https://wa.me/5562981796690?text=Olá! Meu código ${codigoBloq} foi cancelado. Fiz o PIX de R$ 97,00 - comprovante:`} target="_blank" style={{display:"block",marginTop:10,background:"#25D366",color:"black",textAlign:"center",padding:12,borderRadius:10,fontWeight:900,textDecoration:"none",border:"3px solid black",boxShadow:"3px 3px 0px #000",fontSize:13}}>💬 WHATSAPP 62 98179-6690<br/><span style={{fontSize:10}}>Enviar comprovante</span></a>
          </div>
          <button onClick={()=>{setBloqueado(false);setCodInput("")}} style={{width:"100%",marginTop:14,background:"white",border:"3px solid black",borderRadius:10,padding:10,fontWeight:900,fontSize:12,cursor:"pointer",boxShadow:"3px 3px 0px #000"}}>← Voltar</button>
        </div>
      </div>
    )
  }

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:16,padding:24,width:380, border:"4px solid black", boxShadow:"8px 8px 0px #000"}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:60,height:60,background:"#fef9c3",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:28, border:"3px solid black"}}>🔒</div>
            <h1 style={{fontWeight:900,fontSize:20,marginTop:12}}>PLATAFORMA ELEITORAL 2026</h1>
          </div>
          <div style={{background:"#f8fafc",border:"3px solid black",borderRadius:12,padding:12,marginTop:16,textAlign:"center"}}>
            <div style={{fontWeight:900,fontSize:12}}>🔒 ACESSO RESTRITO</div>
          </div>
          <div style={{background:"#fef9c3",border:"3px solid black",borderRadius:12,padding:12,marginTop:12,textAlign:"center",boxShadow:"3px 3px 0px #000"}}>
            <div style={{fontWeight:900,fontSize:13}}>PIX 62981796690</div>
            <div style={{fontSize:11,fontWeight:800,marginTop:2}}>AMERICO QUISPE QUISPE</div>
            <div style={{fontSize:14,fontWeight:900,marginTop:4,background:"black",color:"#facc15",display:"inline-block",padding:"3px 10px",borderRadius:8,border:"2px solid black"}}>R$ 97,90</div>
            <button onClick={()=>{navigator.clipboard.writeText("62981796690");alert("PIX copiado: 62981796690")}} style={{width:"100%",marginTop:8,background:"white",border:"2px solid black",borderRadius:8,padding:"6px",fontWeight:900,fontSize:11,cursor:"pointer"}}>📋 COPIAR CHAVE PIX</button>
          </div>
          <input value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="•••• •••• ••••" style={{width:"100%",marginTop:12,padding:12,border:"3px solid black",borderRadius:10,textAlign:"center",fontWeight:900,boxSizing:"border-box",letterSpacing:"2px"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:8,background:"black",color:"#facc15",padding:12,borderRadius:10,fontWeight:900, border:"3px solid black"}}>LIBERAR ACESSO →</button>
          <a href="https://wa.me/5562981796690?text=Olá! Fiz o PIX de R$ 97,90 para liberar a plataforma. Comprovante:" target="_blank" style={{display:"block",marginTop:8,background:"#22c55e",color:"white",padding:12,borderRadius:10,fontWeight:900,textDecoration:"none",textAlign:"center", border:"3px solid black",boxShadow:"3px 3px 0px #000",fontSize:12}}>ENVIAR COMPROVANTE NO WHATSAPP</a>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f1f5f9",fontFamily:"system-ui"}}>
      <div style={{background:"linear-gradient(90deg,#0f172a,#1e293b)",color:"white",padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center", borderBottom:"4px solid black"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <div style={{background:"#facc15",color:"black",width:36,height:36,borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",fontWeight:900, border:"3px solid black"}}>26</div>
          <div>
            <div style={{fontWeight:900,fontSize:14, letterSpacing:"0.5px"}}>PLATAFORMA ELEITORAL 2026</div>
            <div style={{fontSize:10,opacity:0.9, fontWeight:700}}>{total} VOTOS • {CAND.length} CANDIDATOS</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          <span style={{background:"#22c55e",padding:"5px 12px",borderRadius:20,fontSize:10,fontWeight:900, border:"3px solid black"}}>● AO VIVO</span>
          <a href="/admin" style={{background:"white",color:"black",padding:"6px 14px",borderRadius:8,fontSize:11,textDecoration:"none",fontWeight:900, border:"3px solid black"}}>ADMIN</a>
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"320px 1fr",gap:16,padding:16,maxWidth:1450,margin:"0 auto"}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:"white",borderRadius:14,padding:14,border:"4px solid black", boxShadow:"6px 6px 0px #000"}}>
            <div style={{fontWeight:900,fontSize:12,display:"flex",justifyContent:"space-between", alignItems:"center"}}>
              <span style={{background:"black", color:"#facc15", padding:"4px 10px", borderRadius:8}}>🏆 RANKING</span>
              <span style={{background:"black",color:"white",padding:"4px 10px",borderRadius:10,fontSize:10, fontWeight:900, border:"2px solid black"}}>{total} VOTOS</span>
            </div>
            <div style={{marginTop:12,display:"flex",flexDirection:"column",gap:8}}>
              {total===0?<div style={{textAlign:"center",padding:24,color:"#94a3b8",fontSize:12, fontWeight:700, border:"3px dashed black", borderRadius:10}}>Nenhum voto ainda</div>:ranking.filter(r=>r.v>0).map((r,i)=>(
                <div key={i} style={{border:i===0?"4px solid #eab308":"3px solid black",borderRadius:12,padding:10,background:i===0?"#fefce8":"white", boxShadow:"3px 3px 0px #000"}}>
                  <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:900}}><span>{i+1}º {r.nome}</span><span style={{background:"black", color:"white", padding:"2px 6px", borderRadius:6}}>{r.pct}%</span></div>
                  <div style={{fontSize:10,color:"#000", fontWeight:700, marginTop:2}}>{r.part} - {r.num} • {r.v} votos • {r.cargo}</div>
                  <div style={{height:8,background:"white",borderRadius:10,marginTop:6, border:"2px solid black"}}><div style={{width:`${r.pct}%`,height:"100%",background:i===0?"#eab308":"black", borderRadius:10}}></div></div>
                </div>
              ))}
            </div>
          </div>

          <div style={{background:"white",borderRadius:14,padding:14,border:"4px solid black", boxShadow:"6px 6px 0px #000"}}>
            <div style={{fontWeight:900,fontSize:12, background:"black", color:"white", display:"inline-block", padding:"4px 10px", borderRadius:8}}>🛡 VALIDAÇÃO CPF</div>
            <div style={{fontSize:10,color:"#000",marginTop:6, fontWeight:700}}>1 CPF = 1 Voto neste cliente</div>
            <input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",marginTop:10,padding:12,border:cpfOk?"4px solid #22c55e":"3px solid black",borderRadius:10,boxSizing:"border-box",textAlign:"center",fontWeight:900, fontSize:13}}/>
            <button onClick={validarCPF} style={{width:"100%",marginTop:10,background:cpfOk?"#22c55e":"black",color:cpfOk?"white":"#facc15",padding:12,borderRadius:10,fontWeight:900,fontSize:12,border:"3px solid black", boxShadow:"3px 3px 0px #000"}}>{cpfOk?"✅ VALIDADO - PODE VOTAR":"VALIDAR CPF"}</button>
          </div>
        </div>

        <div style={{background:"white",borderRadius:16,padding:16,border:"4px solid black", boxShadow:"6px 6px 0px #000"}}>
          <div style={{display:"flex",justifyContent:"space-between", alignItems:"center", borderBottom:"4px solid black", paddingBottom:10}}>
            <div style={{fontWeight:900,fontSize:15, background:"black", color:"#facc15", padding:"6px 12px", borderRadius:8}}>CANDIDATOS 2026</div>
            <div style={{fontSize:11,background:"#facc15",padding:"6px 12px",borderRadius:20, fontWeight:900, border:"3px solid black"}}>{CAND.length} candidatos</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14,marginTop:16}}>
            {CAND.map((c,i)=>(
              <div key={i} onClick={()=>setVotoSel(i)} style={{border:votoSel===i?"4px solid #facc15":"3px solid black",borderRadius:16,padding:14,textAlign:"center",cursor:"pointer",background:votoSel===i?"#fefce8":"white", boxShadow:votoSel===i?"6px 6px 0px #eab308":"4px 4px 0px #000", transform:votoSel===i?"translate(-2px,-2px)":"none", transition:"all 0.15s"}}>
                <div style={{position:"relative",display:"inline-block"}}>
                  <img src={c.foto} alt="" style={{width:72,height:72,borderRadius:"50%",border:`4px solid black`, boxShadow:"3px 3px 0px #000"}}/>
                  <div style={{position:"absolute",bottom:-6,right:-6,background:c.cor,color:"white",width:26,height:26,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:900,border:"3px solid black"}}>{c.num}</div>
                </div>
                <div style={{fontWeight:900,fontSize:14,marginTop:10}}>{c.nome}</div>
                <div style={{fontSize:10,color:"#000", fontWeight:700, background:"#f1f5f9", padding:"3px 8px", borderRadius:20, display:"inline-block", marginTop:4, border:"2px solid black"}}>{c.part} • Nº {c.num} • {c.cargo}</div>
                <div style={{marginTop:10,background:"#f8fafc",borderRadius:10,padding:10,textAlign:"left", border:"3px solid black"}}>
                  <div style={{fontSize:9,fontWeight:900,color:"white", background:"black", display:"inline-block", padding:"2px 6px", borderRadius:6}}>📋 PROPOSTAS:</div>
                  {c.propostas.map((p:any,j:number)=><div key={j} style={{fontSize:10,marginTop:4,lineHeight:"13px", fontWeight:600}}>• {p}</div>)}
                </div>
                <div style={{marginTop:10,display:"flex",justifyContent:"space-between",fontSize:11,background:"black", color:"white", padding:"6px 10px",borderRadius:8, fontWeight:800}}>
                  <span>{votos[i]||0} votos</span>
                  <b style={{background:"#facc15", color:"black", padding:"2px 6px", borderRadius:6}}>{total>0?Math.round((votos[i]||0)/total*100):0}%</b>
                </div>
                <button onClick={(e)=>{e.stopPropagation();votar(i)}} style={{width:"100%",marginTop:10,background:votoSel===i?"black":"#facc15",color:votoSel===i?"#facc15":"black",border:"3px solid black",borderRadius:10,padding:"10px 0",fontSize:12,fontWeight:900, boxShadow:"3px 3px 0px #000"}}>VOTAR {c.nome.split(" ")[0].toUpperCase()}</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}