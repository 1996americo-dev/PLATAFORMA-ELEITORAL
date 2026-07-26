"use client"
import React from "react"

const CAND = [
  {name:"Bolsonaro",part:"PL",num:"22",foto:"https://i.pravatar.cc/150?img=1",cor:"#22c55e"},
  {name:"Ciro Gomes",part:"PDT",num:"12",foto:"https://i.pravatar.cc/150?img=2",cor:"#f59e0b"},
  {name:"Eduardo Leite",part:"PSDB",num:"45",foto:"https://i.pravatar.cc/150?img=3",cor:"#3b82f6"},
  {name:"Erika Hilton",part:"PSOL",num:"50",foto:"https://i.pravatar.cc/150?img=4",cor:"#ec4899"},
  {name:"Lula",part:"PT",num:"13",foto:"https://i.pravatar.cc/150?img=5",cor:"#ef4444"},
  {name:"Simone Tebet",part:"MDB",num:"15",foto:"https://i.pravatar.cc/150?img=6",cor:"#a855f7"},
  {name:"Marina Silva",part:"REDE",num:"18",foto:"https://i.pravatar.cc/150?img=7",cor:"#14b8a6"},
  {name:"Nikolas Ferreira",part:"PL",num:"22",foto:"https://i.pravatar.cc/150?img=8",cor:"#22c55e"},
  {name:"Tabata Amaral",part:"PSB",num:"40",foto:"https://i.pravatar.cc/150?img=9",cor:"#eab308"},
  {name:"Romeu Zema",part:"NOVO",num:"30",foto:"https://i.pravatar.cc/150?img=10",cor:"#f97316"},
  {name:"Ronaldo Caiado",part:"UNIAO",num:"44",foto:"https://i.pravatar.cc/150?img=11",cor:"#6366f1"},
]

export default function Home(){
  const [liberado,setLiberado]=React.useState(false)
  const [ehDono,setEhDono]=React.useState(false)
  const [codInput,setCodInput]=React.useState("")
  const [cpf,setCpf]=React.useState("")
  const [cpfOk,setCpfOk]=React.useState(false)
  const [votos,setVotos]=React.useState<number[]>(Array(11).fill(0))
  const [votoSel,setVotoSel]=React.useState<number|null>(null)

  React.useEffect(()=>{
    const url=new URL(window.location.href)
    if(url.searchParams.get("dono")==="americo"){
      localStorage.setItem("dono_americo","true")
      localStorage.setItem("codigo_liberado","DONO")
      setEhDono(true); setLiberado(true)
    }
    const c=url.searchParams.get("codigo")
    if(c && c.toUpperCase().startsWith("LIBERADO-")){
      localStorage.setItem("codigo_liberado",c.toUpperCase())
      setLiberado(true)
    }
    const cod=localStorage.getItem("codigo_liberado")
    if(cod && (cod.startsWith("LIBERADO-")||cod==="DONO")){
      setLiberado(true)
      if(localStorage.getItem("dono_americo")==="true") setEhDono(true)
    }
    const v=localStorage.getItem("votos_v21")
    if(v) setVotos(JSON.parse(v))
    const cv=localStorage.getItem("cpf_validado")
    if(cv){ setCpf(cv); setCpfOk(true) }
  },[])

  function liberar(){
    const cod=codInput.toUpperCase().trim()
    if(!cod.startsWith("LIBERADO-")&&cod!=="DONO"){ alert("Use LIBERADO-XXXX"); return }
    localStorage.setItem("codigo_liberado",cod)
    setLiberado(true)
  }

  function validarCPF(){
    const limpo=cpf.replace(/\D/g,"")
    if(limpo.length!==11){ alert("CPF precisa 11 números"); return }
    const ja:string[]=JSON.parse(localStorage.getItem("cpfs_votaram")||"[]")
    if(ja.includes(limpo)){ alert("Este CPF já votou!"); return }
    localStorage.setItem("cpf_validado",limpo)
    setCpfOk(true)
  }

  function votar(i:number){
    if(!cpfOk){ alert("Valide o CPF primeiro na lateral!"); return }
    const limpo=cpf.replace(/\D/g,"")
    const ja:string[]=JSON.parse(localStorage.getItem("cpfs_votaram")||"[]")
    if(ja.includes(limpo)){ alert("Este CPF já votou"); return }
    const n=[...votos]; n[i]++; setVotos(n)
    localStorage.setItem("votos_v21",JSON.stringify(n))
    ja.push(limpo); localStorage.setItem("cpfs_votaram",JSON.stringify(ja))
    localStorage.removeItem("cpf_validado")
    setCpfOk(false); setCpf(""); setVotoSel(null)
    alert("✅ Voto computado em "+CAND[i].name)
  }

  const total=votos.reduce((a,b)=>a+b,0)
  const ranking=CAND.map((c,i)=>({...c, v:votos[i], pct:total>0?Math.round(votos[i]/total*100):0 })).sort((a,b)=>b.v-a.v)

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f172a",display:"flex",alignItems:"center",justifyContent:"center",padding:16,fontFamily:"system-ui"}}>
        <div style={{background:"white",borderRadius:16,padding:24,width:380,boxShadow:"0 20px 50px rgba(0,0,0,0.5)"}}>
          <div style={{textAlign:"center"}}>
            <div style={{width:60,height:60,background:"#fef9c3",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto",fontSize:28}}>🔒</div>
            <h1 style={{fontWeight:900,fontSize:20,marginTop:12}}>PLATAFORMA ELEITORAL 2026</h1>
            <p style={{fontSize:12,color:"#64748b"}}>Acesso restrito - Liberação via PIX</p>
          </div>
          <div style={{background:"#f8fafc",border:"1.5px solid #e2e8f0",borderRadius:12,padding:12,marginTop:16}}>
            <div style={{fontWeight:800,fontSize:12}}>💰 LIBERAÇÃO IMEDIATA</div>
            <div style={{fontSize:13,marginTop:6}}>PIX: <b style={{fontSize:15}}>62981796690</b></div>
            <div style={{fontSize:12}}>Valor: <b>R$ 97,90</b></div>
            <div style={{fontSize:10,color:"#64748b",marginTop:4}}>Envie comprovante no WhatsApp e receba código LIBERADO-XXXX na hora</div>
          </div>
          <input value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="Digite LIBERADO-XXXX" style={{width:"100%",marginTop:12,padding:12,border:"2px solid #0f172a",borderRadius:10,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:8,background:"#0f172a",color:"white",padding:12,borderRadius:10,fontWeight:900,cursor:"pointer"}}>LIBERAR ACESSO →</button>
          <a href="https://wa.me/5562981796690?text=PIX%2062981796690%20plataforma%20eleitoral" target="_blank" style={{display:"block",marginTop:8,background:"#22c55e",color:"white",padding:12,borderRadius:10,fontWeight:900,textDecoration:"none",textAlign:"center",fontSize:13}}>📲 WHATSAPP 62 9817-96690</a>
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
            <div style={{fontWeight:900,fontSize:13,letterSpacing:1}}>PLATAFORMA ELEITORAL 2026</div>
            <div style={{fontSize:10,opacity:0.7}}>SISTEMA OFICIAL DE VOTAÇÃO • {total} VOTOS COMPUTADOS</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <span style={{background:"#22c55e",padding:"4px 10px",borderRadius:20,fontSize:10,fontWeight:900}}>● AO VIVO</span>
          <a href="/admin?dono=americo" style={{background:"white",color:"black",padding:"6px 12px",borderRadius:8,fontSize:11,textDecoration:"none",fontWeight:800}}>ADMIN</a>
          {ehDono && <a href="/admin/vendas?dono=americo" style={{background:"#facc15",color:"black",padding:"6px 12px",borderRadius:8,fontSize:11,textDecoration:"none",fontWeight:800}}>VENDAS</a>}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"300px 1fr",gap:16,padding:16,maxWidth:1400,margin:"0 auto"}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{background:"white",borderRadius:12,padding:14,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
            <div style={{fontWeight:900,fontSize:12,display:"flex",justifyContent:"space-between"}}><span>🏆 RANKING ATUAL</span><span style={{background:"#0f172a",color:"white",padding:"2px 8px",borderRadius:10,fontSize:10}}>{total} VOTOS</span></div>
            <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:6}}>
              {total===0? <div style={{textAlign:"center",padding:20,color:"#94a3b8",fontSize:12}}>Nenhum voto ainda<br/>Seja o primeiro a votar!</div> :
                ranking.filter(r=>r.v>0).map((r,i)=>(
                  <div key={i} style={{border:i===0?"2px solid #facc15":"1px solid #e2e8f0",borderRadius:10,padding:8,background:i===0?"#fefce8":"white"}}>
                    <div style={{display:"flex",justifyContent:"space-between",fontSize:11,fontWeight:800}}><span>{i+1}º {r.name}</span><span>{r.pct}%</span></div>
                    <div style={{fontSize:10,color:"#64748b"}}>{r.part} - {r.num} • {r.v} votos</div>
                    <div style={{height:6,background:"#e2e8f0",borderRadius:10,marginTop:4,overflow:"hidden"}}><div style={{width:`${r.pct}%`,height:"100%",background:i===0?"#eab308":"#0f172a"}}></div></div>
                  </div>
                ))
              }
            </div>
          </div>

          <div style={{background:"white",borderRadius:12,padding:14,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
            <div style={{fontWeight:900,fontSize:12}}>🛡️ VALIDAÇÃO CPF</div>
            <div style={{fontSize:10,color:"#64748b",marginTop:2}}>1 CPF = 1 Voto • Sistema anti-fraude</div>
            <input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",marginTop:10,padding:10,border:cpfOk?"2px solid #22c55e":"2px solid #e2e8f0",borderRadius:8,boxSizing:"border-box",textAlign:"center",fontWeight:700}}/>
            <button onClick={validarCPF} style={{width:"100%",marginTop:8,background:cpfOk?"#22c55e":"#0f172a",color:"white",padding:10,borderRadius:8,fontWeight:900,fontSize:12,cursor:"pointer",border:"none"}}>{cpfOk?"✅ CPF VALIDADO - PODE VOTAR":"VALIDAR CPF"}</button>
            {cpfOk && <div style={{background:"#dcfce7",color:"#166534",padding:6,borderRadius:6,fontSize:10,marginTop:6,textAlign:"center",fontWeight:700}}>Liberado! Escolha um candidato →</div>}
          </div>

          
        </div>

        <div>
          <div style={{background:"white",borderRadius:12,padding:14,boxShadow:"0 2px 10px rgba(0,0,0,0.06)",border:"1px solid #e2e8f0"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontWeight:900,fontSize:14}}>CANDIDATOS À PRESIDÊNCIA 2026</div>
              <div style={{fontSize:10,background:"#f1f5f9",padding:"4px 10px",borderRadius:20}}>{CAND.length} candidatos oficiais</div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:12,marginTop:14}}>
              {CAND.map((c,i)=>(
                <div key={i} onClick={()=>setVotoSel(i)} style={{border:votoSel===i?"2px solid #0f172a":"1.5px solid #e2e8f0",borderRadius:14,padding:12,textAlign:"center",cursor:"pointer",background:votoSel===i?"#f8fafc":"white",transition:"0.2s",boxShadow:votoSel===i?"0 4px 20px rgba(0,0,0,0.1)":"none"}}>
                  <div style={{position:"relative",display:"inline-block"}}>
                    <img src={c.foto} alt="" style={{width:64,height:64,borderRadius:"50%",border:`3px solid ${c.cor}`,objectFit:"cover"}}/>
                    <div style={{position:"absolute",bottom:-4,right:-4,background:c.cor,color:"white",width:22,height:22,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",fontSize:10,fontWeight:900,border:"2px solid white"}}>{c.num}</div>
                  </div>
                  <div style={{fontWeight:900,fontSize:13,marginTop:8}}>{c.name}</div>
                  <div style={{fontSize:10,color:"#64748b"}}>{c.part} • Nº {c.num}</div>
                  <div style={{marginTop:8,display:"flex",justifyContent:"space-between",fontSize:10,background:"#f8fafc",padding:"4px 8px",borderRadius:6}}><span>{votos[i]} votos</span><b>{total>0?Math.round(votos[i]/total*100):0}%</b></div>
                  <button onClick={(e)=>{e.stopPropagation(); votar(i)}} style={{width:"100%",marginTop:8,background:votoSel===i?"#0f172a":"white",color:votoSel===i?"white":"#0f172a",border:"1.5px solid #0f172a",borderRadius:8,padding:"7px 0",fontSize:11,fontWeight:900,cursor:"pointer"}}>VOTAR {c.name.split(" ")[0].toUpperCase()}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}