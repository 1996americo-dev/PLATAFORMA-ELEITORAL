"use client"
import React from "react"

const CAND = [
  {name:"Bolsonaro",part:"PL - 22",foto:"https://i.pravatar.cc/100?img=1"},
  {name:"Ciro Gomes",part:"PDT - 12",foto:"https://i.pravatar.cc/100?img=2"},
  {name:"Eduardo Leite",part:"PSDB - 45",foto:"https://i.pravatar.cc/100?img=3"},
  {name:"Erika Hilton",part:"PSOL - 50",foto:"https://i.pravatar.cc/100?img=4"},
  {name:"Lula",part:"PT - 13",foto:"https://i.pravatar.cc/100?img=5"},
  {name:"Simone Tebet",part:"MDB - 15",foto:"https://i.pravatar.cc/100?img=6"},
  {name:"Marina Silva",part:"REDE - 18",foto:"https://i.pravatar.cc/100?img=7"},
  {name:"Nikolas Ferreira",part:"PL - 22",foto:"https://i.pravatar.cc/100?img=8"},
  {name:"Tabata Amaral",part:"PSB - 40",foto:"https://i.pravatar.cc/100?img=9"},
  {name:"Romeu Zema",part:"NOVO - 30",foto:"https://i.pravatar.cc/100?img=10"},
  {name:"Ronaldo Caiado",part:"UNIAO - 44",foto:"https://i.pravatar.cc/100?img=11"},
]

export default function Home(){
  const [liberado,setLiberado]=React.useState(false)
  const [ehDono,setEhDono]=React.useState(false)
  const [codInput,setCodInput]=React.useState("")
  const [cpf,setCpf]=React.useState("")
  const [cpfOk,setCpfOk]=React.useState(false)
  const [votos,setVotos]=React.useState<number[]>(Array(11).fill(0))

  React.useEffect(()=>{
    const url=new URL(window.location.href)
    if(url.searchParams.get("dono")==="americo"){
      localStorage.setItem("dono_americo","true")
      localStorage.setItem("codigo_liberado","DONO")
      setEhDono(true)
      setLiberado(true)
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
    if(!cod.startsWith("LIBERADO-")&&cod!=="DONO"){
      alert("Use LIBERADO-XXXX")
      return
    }
    localStorage.setItem("codigo_liberado",cod)
    setLiberado(true)
  }

  function validarCPF(){
    const limpo=cpf.replace(/\D/g,"")
    if(limpo.length!==11){
      alert("CPF tem que ter 11 numeros")
      return
    }
    const ja:string[]=JSON.parse(localStorage.getItem("cpfs_votaram")||"[]")
    if(ja.includes(limpo)){
      alert("Este CPF ja votou!")
      return
    }
    localStorage.setItem("cpf_validado",limpo)
    setCpfOk(true)
  }

  function votar(i:number){
    if(!cpfOk){
      alert("Valide o CPF na lateral primeiro!")
      return
    }
    const limpo=cpf.replace(/\D/g,"")
    const ja:string[]=JSON.parse(localStorage.getItem("cpfs_votaram")||"[]")
    if(ja.includes(limpo)){
      alert("Este CPF ja votou")
      return
    }
    const n=[...votos]
    n[i]++
    setVotos(n)
    localStorage.setItem("votos_v21",JSON.stringify(n))
    ja.push(limpo)
    localStorage.setItem("cpfs_votaram",JSON.stringify(ja))
    localStorage.removeItem("cpf_validado")
    setCpfOk(false)
    setCpf("")
    alert("Voto computado em "+CAND[i].name+" ✅")
  }

  const total=votos.reduce((a,b)=>a+b,0)

  if(!liberado){
    return(
      <div style={{minHeight:"100vh",background:"#0f0f0f",display:"flex",alignItems:"center",justifyContent:"center",padding:15}}>
        <div style={{background:"white",border:"4px solid #facc15",borderRadius:12,padding:18,width:"100%",maxWidth:360,textAlign:"center",fontFamily:"system-ui"}}>
          <div style={{fontWeight:900,fontSize:16,borderBottom:"3px solid black",paddingBottom:8}}>SITE BLOQUEADO 🔒</div>
          <div style={{background:"#fef9c3",border:"2px solid black",borderRadius:8,padding:8,marginTop:10,textAlign:"left",fontSize:11}}>
            <div style={{fontWeight:900}}>💰 LIBERE SEU ACESSO:</div>
            <div style={{marginTop:4}}>PIX: <b>62981796690</b></div>
            <div>Valor: <b>R$ 97,90</b></div>
            <div style={{fontSize:9,marginTop:4,color:"#555"}}>Envie comprovante no WhatsApp</div>
          </div>
          <input value={codInput} onChange={e=>setCodInput(e.target.value)} placeholder="LIBERADO-XXXX" style={{width:"100%",marginTop:10,padding:10,border:"3px solid black",borderRadius:8,textAlign:"center",fontWeight:900,boxSizing:"border-box"}}/>
          <button onClick={liberar} style={{width:"100%",marginTop:8,background:"black",color:"#facc15",padding:10,borderRadius:8,fontWeight:900,cursor:"pointer",border:"3px solid black"}}>LIBERAR ACESSO</button>
          <a href="https://wa.me/5562981796690?text=PIX%2062981796690" target="_blank" style={{display:"block",marginTop:8,background:"#22c55e",color:"white",padding:10,borderRadius:8,fontWeight:900,textDecoration:"none",border:"3px solid black",fontSize:12}}>📲 WHATSAPP 62981796690</a>
        </div>
      </div>
    )
  }

  return(
    <div style={{minHeight:"100vh",background:"#f0efe5",fontFamily:"system-ui"}}>
      <div style={{background:"#1c1c1c",color:"#facc15",padding:"8px 12px",display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:11,borderBottom:"4px solid #facc15"}}>
        <span>PLATAFORMA ELEITORAL 2026 - V21 • 11 CANDIDATOS • {total} VOTOS</span>
        <div style={{display:"flex",gap:6}}>
          <a href="/admin" style={{background:"white",color:"black",padding:"3px 8px",borderRadius:10,fontSize:9,textDecoration:"none",border:"2px solid black"}}>ADMIN</a>
          {ehDono && <a href="/admin/vendas" style={{background:"#22c55e",color:"white",padding:"3px 8px",borderRadius:10,fontSize:9,textDecoration:"none",border:"2px solid black"}}>VENDAS</a>}
        </div>
      </div>

      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:10,padding:10}}>
        <div>
          <div style={{background:"white",border:"3px solid black",borderRadius:8,padding:8}}>
            <div style={{fontWeight:900,fontSize:10}}>RANKING - {total} VOTOS</div>
            <div style={{border:"2px dashed #cbd5e1",borderRadius:6,padding:8,marginTop:6,fontSize:9,textAlign:"left",minHeight:60}}>
              {total===0? "Nenhum voto ainda" :
                CAND.map((c,i)=>({
                  nome:c.name,
                  v:votos[i],
                  pct:total>0?Math.round(votos[i]/total*100):0
                }))
               .filter(x=>x.v>0)
               .sort((a,b)=>b.v-a.v)
               .map((x,j)=>(
                  <div key={j} style={{display:"flex",justifyContent:"space-between",fontWeight:900,marginBottom:4,borderBottom:"1px solid #eee",paddingBottom:2}}>
                    <span>{j+1}º {x.nome}</span>
                    <span>{x.v} votos - {x.pct}%</span>
                  </div>
                ))
              }
            </div>
          </div>

          <div style={{background:"white",border:"3px solid black",borderRadius:8,padding:8,marginTop:8}}>
            <div style={{fontWeight:900,fontSize:10}}>VALIDAÇÃO CPF</div>
            <input value={cpf} onChange={e=>setCpf(e.target.value)} placeholder="000.000.000-00" style={{width:"100%",marginTop:6,padding:7,border:"2px solid black",borderRadius:6,boxSizing:"border-box",textAlign:"center",fontSize:12}}/>
            <button onClick={validarCPF} style={{width:"100%",marginTop:6,background:cpfOk?"#16a34a":"black",color:cpfOk?"white":"#facc15",padding:7,borderRadius:6,fontWeight:900,fontSize:10,cursor:"pointer",border:"2px solid black"}}>
              {cpfOk?"CPF VALIDADO ✅":"VALIDAR CPF"}
            </button>
          </div>
        </div>

        <div style={{background:"white",border:"3px solid black",borderRadius:8,padding:8}}>
          <div style={{display:"flex",justifyContent:"space-between",fontWeight:900,fontSize:10}}>
            <span>CANDIDATOS</span>
            <span style={{background:"black",color:"white",padding:"2px 6px",borderRadius:10}}>{CAND.length} CANDIDATOS</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:8}}>
            {CAND.map((c,i)=>(
              <div key={i} style={{background:"#fffef7",border:"2px solid black",borderRadius:8,padding:6,textAlign:"center"}}>
                <img src={c.foto} alt="" style={{width:48,height:48,borderRadius:"50%",border:"2px solid black"}}/>
                <div style={{fontWeight:900,fontSize:11,marginTop:2}}>{c.name}</div>
                <div style={{fontSize:8}}>{c.part}</div>
                <div style={{background:"#facc15",border:"1.5px solid black",borderRadius:4,marginTop:4,padding:"2px 0",fontSize:8,fontWeight:900}}>{c.part}</div>
                <div style={{fontSize:8,marginTop:2}}>{votos[i]} votos</div>
                <button onClick={()=>votar(i)} style={{width:"100%",marginTop:4,background:"#d9f3ff",border:"2px solid black",borderRadius:6,padding:3,fontSize:8,fontWeight:900,cursor:"pointer"}}>VOTAR CPF</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}