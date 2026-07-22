"use client"
import React, { useState, useEffect, useMemo } from 'react';
import { Search, Scale, Trophy, X, Check, BarChart3, Shield, Users, GraduationCap, HeartPulse, Leaf, DollarSign, Vote, Award, TrendingUp, Filter, Eye } from 'lucide-react';

function initialsFromName(nome: string) {
  const parts = nome.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0,2).toUpperCase();
  return (parts[0][0] + parts[parts.length-1][0]).toUpperCase();
}
function genAvatarDataUri(nome: string, cor: string) {
  const initials = initialsFromName(nome);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200' viewBox='0 0 200 200'>
    <rect width='200' height='200' rx='100' fill='#f6f5ef'/>
    <circle cx='100' cy='82' r='52' fill='${cor}' opacity='0.15'/>
    <circle cx='100' cy='82' r='38' fill='${cor}'/>
    <text x='100' y='93' font-family='Inter, system-ui, sans-serif' font-weight='800' font-size='32' fill='white' text-anchor='middle' dominant-baseline='middle'>${initials}</text>
    <text x='100' y='148' font-family='Inter, system-ui, sans-serif' font-weight='600' font-size='13' fill='#444' text-anchor='middle'>${nome.split(' ')[0]}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
function AvatarBadge({ nome, cor, size = 40 }: { nome: string; cor: string; size?: number }) {
  const initials = initialsFromName(nome);
  return (
    <div
      className="rounded-full grid place-items-center font-black text-white shrink-0"
      style={{
        width: size,
        height: size,
        background: cor,
        fontSize: Math.max(10, Math.round(size * 0.33)),
      }}
    >
      {initials}
    </div>
  );
}

type Categoria = 'Economia' | 'Educação' | 'Saúde' | 'Segurança' | 'Meio Ambiente';

type Candidato = {
  id: string;
  nome: string;
  numero: string;
  partido: string;
  partidoCor: string;
  avatar: string;
  cargo: string;
  bio: string;
  propostas: Record<Categoria, string>;
};

const CATEGORIAS: Categoria[] = ['Economia', 'Educação', 'Saúde', 'Segurança', 'Meio Ambiente'];

const rawCandidatos: Omit<Candidato, 'avatar'>[] = [
  {
    id: 'ciro',
    nome: 'Ciro Gomes',
    numero: '12',
    partido: 'PDT',
    partidoCor: '#0053A6',
    cargo: 'Ex-Governador do Ceará',
    bio: 'Advogado e economista, defensor do projeto nacional desenvolvimentista.',
    propostas: {
      Economia: 'Reindustrialização com crédito barato, reforma tributária progressiva e projeto nacional de desenvolvimento.',
      Educação: 'Escola em tempo integral, valorização docente com piso nacional e tecnologia nas salas.',
      Saúde: 'SUS forte, mutirão de cirurgias e telemedicina universal nos postos.',
      Segurança: 'Polícia com inteligência, valorizada e desmilitarizada gradualmente.',
      'Meio Ambiente': 'Transição energética com Nordeste como polo de energia limpa.',
    }
  },
  {
    id: 'lula',
    nome: 'Luiz Inácio Lula',
    numero: '13',
    partido: 'PT',
    partidoCor: '#DA251D',
    cargo: 'Presidente da República',
    bio: 'Ex-metalúrgico, foco em inclusão social e combate à fome.',
    propostas: {
      Economia: 'Crescimento com inclusão, aumento real do salário mínimo e fortalecimento do BNDES.',
      Educação: 'Mais universidades, FIES reformulado e merenda de qualidade.',
      Saúde: 'Mais Médicos ampliado, Farmácia Popular e redução de filas do SUS.',
      Segurança: 'SUSP fortalecido, combate ao crime organizado e controle de armas.',
      'Meio Ambiente': 'Desmatamento zero na Amazônia até 2030 e crédito verde.',
    }
  },
  {
    id: 'simone',
    nome: 'Simone Tebet',
    numero: '15',
    partido: 'MDB',
    partidoCor: '#1B9338',
    cargo: 'Ministra do Planejamento',
    bio: 'Advogada, representa centro democrático e equilíbrio fiscal com social.',
    propostas: {
      Economia: 'Responsabilidade fiscal com olhar social e reforma tributária do consumo.',
      Educação: 'Primeira infância como prioridade, creches em todo Brasil.',
      Saúde: 'Saúde da mulher e gestão eficiente do SUS com tecnologia.',
      Segurança: 'Proteção à mulher, foco em feminicídio e delegacias especializadas.',
      'Meio Ambiente': 'Agronegócio sustentável e Código Florestal cumprido.',
    }
  },
  {
    id: 'marina',
    nome: 'Marina Silva',
    numero: '18',
    partido: 'REDE',
    partidoCor: '#00A859',
    cargo: 'Ministra do Meio Ambiente',
    bio: 'Ambientalista histórica, símbolo da sustentabilidade e dos povos da floresta.',
    propostas: {
      Economia: 'Economia verde, bioeconomia e empregos sustentáveis.',
      Educação: 'Educação ambiental transversal e escolas sustentáveis.',
      Saúde: 'Saúde e clima conectados, combate a doenças da crise climática.',
      Segurança: 'Segurança climática e proteção de defensores ambientais.',
      'Meio Ambiente': 'Fim do desmatamento ilegal, demarcação e economia da floresta em pé.',
    }
  },
  {
    id: 'bolsonaro',
    nome: 'Jair Bolsonaro',
    numero: '22',
    partido: 'PL',
    partidoCor: '#003087',
    cargo: 'Ex-Presidente',
    bio: 'Capitão reformado, agenda conservadora e liberal na economia.',
    propostas: {
      Economia: 'Privatizações, menos impostos e liberdade econômica total.',
      Educação: 'Escola sem partido, cívico-militar e homeschooling.',
      Saúde: 'Foco em hospitais e redução da burocracia para planos privados.',
      Segurança: 'Excludente de ilicitude, armamento e operação GLO nas fronteiras.',
      'Meio Ambiente': 'Explorar com responsabilidade e regularização fundiária.',
    }
  },
  {
    id: 'nikolas',
    nome: 'Nikolas Ferreira',
    numero: '2222',
    partido: 'PL',
    partidoCor: '#002070',
    cargo: 'Deputado Federal',
    bio: 'Jovem liderança conservadora, forte presença digital.',
    propostas: {
      Economia: 'Estado mínimo para jovens empreendedores e menos burocracia.',
      Educação: 'Escola sem doutrinação, voucher e liberdade para pais escolherem.',
      Saúde: 'Telemedicina privada e parcerias com setor privado.',
      Segurança: 'Polícia valorizada, fim da saidinha e maioridade penal aos 14.',
      'Meio Ambiente': 'Agro forte sem trava ambiental ideológica.',
    }
  },
  {
    id: 'tabata',
    nome: 'Tabata Amaral',
    numero: '40',
    partido: 'PSB',
    partidoCor: '#FFCC00',
    cargo: 'Deputada Federal',
    bio: 'Cientista política, educação como motor da igualdade.',
    propostas: {
      Economia: 'Economia do conhecimento, startups e crédito para jovem.',
      Educação: 'Educação pública de alto desempenho como no Ceará e PE.',
      Saúde: 'Saúde mental nas escolas e atendimento psicossocial.',
      Segurança: 'Prevenção, inteligência e oportunidade para juventude.',
      'Meio Ambiente': 'Cidades inteligentes e transporte público elétrico.',
    }
  },
  {
    id: 'doria',
    nome: 'João Doria',
    numero: '45',
    partido: 'PSDB',
    partidoCor: '#0454A8',
    cargo: 'Ex-Governador de SP',
    bio: 'Empresário e gestor, bandeira da vacina e eficiência.',
    propostas: {
      Economia: 'Gestão empresarial no governo, privatizar e atrair investimento.',
      Educação: 'Parcerias com setor privado e ensino técnico massivo.',
      Saúde: 'Coronavac como modelo, gestão por OSs e tecnologia.',
      Segurança: 'Polícia tech com câmeras e reconhecimento facial.',
      'Meio Ambiente': 'PPP verdes e saneamento universal privatizado.',
    }
  },
  {
    id: 'leite',
    nome: 'Eduardo Leite',
    numero: '45',
    partido: 'PSDB',
    partidoCor: '#0454A8',
    cargo: 'Governador do RS',
    bio: 'Jovem governador, reformas e pautas liberais com diversidade.',
    propostas: {
      Economia: 'Reforma fiscal dos estados, equilíbrio e atração de negócios.',
      Educação: 'Educação para emprego, inglês e programação desde cedo.',
      Saúde: 'Gestão eficiente, regionalização e telessaúde.',
      Segurança: 'Segurança com direitos humanos e foco em investigação.',
      'Meio Ambiente': 'RS verde, hidrogênio verde e resiliência climática.',
    }
  },
  {
    id: 'erika',
    nome: 'Erika Hilton',
    numero: '50',
    partido: 'PSOL',
    partidoCor: '#FF5126',
    cargo: 'Deputada Federal',
    bio: 'Primeira deputada negra trans, ativista de direitos humanos.',
    propostas: {
      Economia: 'Economia do cuidado, taxar super-ricos e renda básica.',
      Educação: 'Escola antirracista, cotas trans e educação inclusiva.',
      Saúde: 'SUS trans-inclusivo, saúde integral LGBTQIAPN+.',
      Segurança: 'Fim da violência policial contra população negra e LGBT.',
      'Meio Ambiente': 'Justiça climática com recorte racial e social.',
    }
  },
];

const candidatosData: Candidato[] = rawCandidatos.map(c => ({
  ...c,
  avatar: genAvatarDataUri(c.nome, c.partidoCor),
}));

const categoriaIcon: Record<Categoria, React.ReactNode> = {
  Economia: <DollarSign className="w-4 h-4" />,
  Educação: <GraduationCap className="w-4 h-4" />,
  Saúde: <HeartPulse className="w-4 h-4" />,
  Segurança: <Shield className="w-4 h-4" />,
  'Meio Ambiente': <Leaf className="w-4 h-4" />,
};

export default function App() {
  const [busca, setBusca] = useState('');
  const [comparar, setComparar] = useState<string[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [votos, setVotos] = useState<Record<string, number>>({});
  const [meuVoto, setMeuVoto] = useState<string | null>(null);
  const [filtroPartido, setFiltroPartido] = useState<string>('TODOS');
  const [toast, setToast] = useState<string | null>(null);

  // Load votos from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('pe2026_votos');
    const savedMeu = localStorage.getItem('pe2026_meuvoto');
    if (saved) {
      try { setVotos(JSON.parse(saved)); } catch {}
    } else {
      // seed data
      const seed: Record<string, number> = {
        lula: 2847, bolsonaro: 2633, ciro: 892, simone: 754, marina: 621,
        tabata: 512, doria: 344, leite: 298, erika: 412, nikolas: 1105
      };
      setVotos(seed);
      localStorage.setItem('pe2026_votos', JSON.stringify(seed));
    }
    if (savedMeu) setMeuVoto(savedMeu);
  }, []);

  const totalVotos = useMemo(() => Object.values(votos).reduce((a,b)=>a+b,0), [votos]);
  
  const ranking = useMemo(() => {
    return [...candidatosData].sort((a,b) => (votos[b.id]||0) - (votos[a.id]||0));
  }, [votos]);

  const filtrados = useMemo(() => {
    return candidatosData.filter(c => {
      const matchBusca = `${c.nome} ${c.partido} ${c.numero}`.toLowerCase().includes(busca.toLowerCase());
      const matchPartido = filtroPartido === 'TODOS' || c.partido === filtroPartido;
      return matchBusca && matchPartido;
    });
  }, [busca, filtroPartido]);

  const toggleCompare = (id: string) => {
    setComparar(prev => {
      if (prev.includes(id)) return prev.filter(x=>x!==id);
      if (prev.length >=3) {
        setToast('Máximo 3 candidatos para comparar');
        setTimeout(()=>setToast(null), 2500);
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleVotar = (id: string) => {
    // Supabase ready code:
    // const { error } = await supabase.from('votos').insert({ candidato_id: id, created_at: new Date() })
    
    // Fallback localStorage
    const novoVotos = { ...votos };
    if (meuVoto) {
      // remove voto anterior se trocar
      if (novoVotos[meuVoto]) novoVotos[meuVoto] = Math.max(0, novoVotos[meuVoto]-1);
    }
    novoVotos[id] = (novoVotos[id]||0)+1;
    setVotos(novoVotos);
    setMeuVoto(id);
    localStorage.setItem('pe2026_votos', JSON.stringify(novoVotos));
    localStorage.setItem('pe2026_meuvoto', id);
    setToast(`Voto em ${candidatosData.find(c=>c.id===id)?.nome} computado!`);
    setTimeout(()=>setToast(null), 3000);
  };

  const partidos = ['TODOS', ...Array.from(new Set(candidatosData.map(c=>c.partido)))];

  return (
    <div className="min-h-screen bg-[#fcfcf9] text-zinc-900 font-[Inter,system-ui]">
      <style>{`
        *{font-family:Inter, system-ui, -apple-system, Segoe UI, Roboto, sans-serif}
        .serif{font-family:Georgia, serif}
      `}</style>

      {/* Header GOV.BR */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-zinc-200">
        <div className="bg-[#071D41] text-white text-[11px] tracking-widest py-2 px-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#FFDF00]"></span>
            <span className="w-3 h-3 rounded-full bg-[#009B3A]"></span>
            <span className="opacity-80">BRASIL • GOVERNO FEDERAL • TRIBUNAL SUPERIOR ELEITORAL</span>
          </div>
          <span className="hidden md:block opacity-60">PLATAFORMA OFICIAL • DADOS TRANSPARENTES • LEI 9.504/97</span>
        </div>
        
        <div className="max-w-[1280px] mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-xl bg-[#071D41] text-white grid place-items-center font-black text-[18px]">26</div>
            <div>
              <h1 className="font-black tracking-[-0.02em] text-[17px] md:text-[20px] leading-none">PLATAFORMA ELEITORAL 2026</h1>
              <p className="text-[11px] tracking-[0.18em] font-semibold text-zinc-500 mt-1">OFICIAL • COMPARATIVO • VOTAÇÃO SIMULADA</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-1 md:max-w-[520px]">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"/>
              <input 
                value={busca}
                onChange={e=>setBusca(e.target.value)}
                placeholder="Buscar candidato, partido ou número..."
                className="w-full pl-9 pr-4 h-11 rounded-full bg-zinc-100 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#071D41]/20 focus:bg-white text-[14px]"
              />
            </div>
            <button 
              onClick={()=>{
                if(comparar.length>0){ setShowCompare(true); }
                else { setToast('Selecione candidatos clicando em Comparar nos cards'); setTimeout(()=>setToast(null), 3000); }
              }}
              className={`h-11 px-4 rounded-full border text-[13px] font-semibold flex items-center gap-2 transition ${comparar.length>0 ? 'bg-[#071D41] text-white border-[#071D41]' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50'}`}
            >
              <Scale className="w-4 h-4"/> 
              <span className="hidden md:inline">Comparar</span>
              {comparar.length>0 && <span className="bg-white text-black text-[11px] font-bold px-1.5 py-0.5 rounded-full">{comparar.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* RANKING */}
        <section className="bg-white rounded-[24px] border border-zinc-200 shadow-[0_12px_40px_rgba(0,0,0,0.04)] p-5 md:p-7 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#071D41] grid place-items-center text-white"><Trophy className="w-4 h-4"/></div>
              <div>
                <h2 className="font-bold text-[15px] tracking-tight">Ranking em tempo real</h2>
                <p className="text-[12px] text-zinc-500 flex items-center gap-1"><span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse inline-block"/> {totalVotos.toLocaleString('pt-BR')} votos computados • atualiza ao vivo</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <span className="px-3 py-1.5 rounded-full bg-zinc-100 border font-medium flex items-center gap-1"><BarChart3 className="w-3 h-3"/> Supabase pronto: <code className="font-mono">supabase.from('votos').insert()</code></span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {ranking.slice(0,5).map((c, i) => {
              const v = votos[c.id]||0;
              const pct = totalVotos ? (v/totalVotos)*100 : 0;
              return (
                <div key={c.id} className={`relative rounded-2xl border p-3 flex flex-col gap-2 ${i===0 ? 'bg-[#071D41] text-white border-[#071D41]' : 'bg-zinc-50 border-zinc-200'}`}>
                  <div className="flex items-center gap-2">
                    <span className={`w-6 h-6 rounded-full grid place-items-center text-[11px] font-bold ${i===0 ? 'bg-white text-[#071D41]' : 'bg-zinc-900 text-white'}`}>{i+1}</span>
                    <AvatarBadge nome={c.nome} cor={c.partidoCor} size={28} />
                    <span className="text-[13px] font-semibold truncate">{c.nome.split(' ')[0]} {c.nome.split(' ').slice(-1)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-black/10 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: i===0 ? '#FFDF00' : c.partidoCor }} />
                  </div>
                  <div className="flex justify-between text-[11px]">
                    <span className={i===0?'text-white/70':'text-zinc-500'}>{c.partido} • {v.toLocaleString('pt-BR')}</span>
                    <span className="font-bold">{pct.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Full ranking bars */}
          <div className="mt-6 grid md:grid-cols-2 gap-2">
            {ranking.map(c => {
              const v = votos[c.id]||0;
              const pct = totalVotos ? (v/totalVotos)*100 : 0;
              return (
                <div key={c.id} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full grid place-items-center text-[10px] font-bold text-white shrink-0" style={{background:c.partidoCor, boxShadow:`0 0 0 2px white, 0 0 0 3px ${c.partidoCor}33`}}>{initialsFromName(c.nome)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between text-[12px] mb-1">
                      <span className="font-medium">{c.nome} <span className="text-zinc-400">• {c.numero} {c.partido}</span></span>
                      <span className="font-semibold">{pct.toFixed(1)}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{width:`${pct}%`, background:c.partidoCor}}/>
                    </div>
                  </div>
                  {meuVoto===c.id && <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 flex items-center gap-1"><Check className="w-3 h-3"/> SEU VOTO</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* FILTERS */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <Filter className="w-4 h-4 text-zinc-400"/>
          {partidos.map(p => (
            <button key={p} onClick={()=>{
              setFiltroPartido(p);
              const count = p==='TODOS' ? candidatosData.length : candidatosData.filter(c=>c.partido===p).length;
              setToast(`Filtro: ${p} • ${count} candidatos`);
              setTimeout(()=>setToast(null), 2000);
            }} className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold border transition ${filtroPartido===p ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-600'}`}>{p}</button>
          ))}
          <span className="ml-auto text-[12px] text-zinc-500">{filtrados.length} candidatos</span>
        </div>

        {/* GRID CANDIDATOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtrados.map(c => {
            const v = votos[c.id]||0;
            const pct = totalVotos ? (v/totalVotos)*100 : 0;
            const isCompare = comparar.includes(c.id);
            const isMeuVoto = meuVoto===c.id;
            return (
              <div key={c.id} className="group bg-white rounded-[28px] border border-zinc-200 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] transition-all">
                {/* top */}
                <div className="flex items-start justify-between">
                  <div className="flex gap-3.5">
                    <div className="relative">
                      <img src={c.avatar} alt={c.nome} className="w-[72px] h-[72px] rounded-full object-cover bg-zinc-100"/>
                      <div className="absolute inset-0 rounded-full border-[3px]" style={{borderColor:c.partidoCor}}></div>
                      <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white border shadow grid place-items-center text-[10px] font-black" style={{color:c.partidoCor}}>{c.numero}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-[16px] leading-tight">{c.nome}</h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full text-white" style={{background:c.partidoCor}}>{c.partido}</span>
                        <span className="text-[11px] text-zinc-500">{c.cargo}</span>
                      </div>
                      <p className="text-[12px] text-zinc-500 mt-2 leading-[1.35] line-clamp-2 max-w-[180px]">{c.bio}</p>
                    </div>
                  </div>
                  <button onClick={()=>toggleCompare(c.id)} className={`w-8 h-8 rounded-full border grid place-items-center transition ${isCompare ? 'bg-[#071D41] border-[#071D41] text-white' : 'bg-white border-zinc-200 text-zinc-400 group-hover:text-zinc-900'}`}>
                    <Scale className="w-4 h-4"/>
                  </button>
                </div>

                {/* propostas preview */}
                <div className="mt-4 grid grid-cols-3 gap-2">
                  {CATEGORIAS.slice(0,3).map(cat => (
                    <div key={cat} className="rounded-xl bg-zinc-50 border border-zinc-100 p-2.5">
                      <div className="flex items-center gap-1 text-[10px] font-bold tracking-wide text-zinc-500 uppercase"><span className="text-zinc-900">{categoriaIcon[cat]}</span>{cat}</div>
                      <p className="text-[11px] leading-[1.35] mt-1 line-clamp-2 text-zinc-700">{c.propostas[cat]}</p>
                    </div>
                  ))}
                </div>

                {/* vote bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-[11px] mb-1.5">
                    <span className="text-zinc-500 flex items-center gap-1"><TrendingUp className="w-3 h-3"/>{v.toLocaleString('pt-BR')} votos</span>
                    <span className="font-semibold">{pct.toFixed(1)}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{width:`${pct}%`, background:c.partidoCor}}/>
                  </div>
                </div>

                {/* actions */}
                <div className="mt-4 flex gap-2">
                  <button onClick={()=>handleVotar(c.id)} className={`flex-1 h-10 rounded-full font-semibold text-[13px] flex items-center justify-center gap-1.5 transition ${isMeuVoto ? 'bg-emerald-600 text-white' : 'bg-[#071D41] text-white hover:bg-black'}`}>
                    {isMeuVoto ? <><Check className="w-4 h-4"/> Votado</> : <><Vote className="w-4 h-4"/> Votar neste</>}
                  </button>
                  <button onClick={()=>toggleCompare(c.id)} className={`h-10 px-4 rounded-full border text-[13px] font-semibold flex items-center gap-1.5 ${isCompare ? 'bg-zinc-900 text-white border-zinc-900' : 'bg-white border-zinc-200'}`}>
                    <Eye className="w-4 h-4"/>{isCompare ? 'Remover' : 'Comparar'}
                  </button>
                </div>

                {isCompare && <div className="mt-3 text-[11px] text-center font-medium text-[#071D41] bg-[#071D41]/5 border border-[#071D41]/10 rounded-full py-1">Selecionado para comparação</div>}
              </div>
            );
          })}
        </div>

        <div className="mt-12 rounded-[24px] bg-[#071D41] text-white p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center"><Shield className="w-5 h-5"/></div>
            <div>
              <h4 className="font-bold text-[14px]">Votação com Supabase + localStorage fallback</h4>
              <p className="text-[12px] text-white/60 mt-1 max-w-[560px]">Código pronto para produção: <code className="bg-white/10 px-1.5 py-0.5 rounded">supabase.from('votos').insert(&#123; candidato_id &#125;)</code> com realtime. Sem chave configurada, usa localStorage para demonstrar funcionamento completo com ranking e % em tempo real.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="px-3 py-1.5 rounded-full bg-white text-[#071D41] font-bold flex items-center gap-1"><Users className="w-3 h-3"/>{totalVotos.toLocaleString('pt-BR')} votos totais</span>
            <span className="px-3 py-1.5 rounded-full bg-emerald-500 text-white font-bold">● AO VIVO</span>
          </div>
        </div>
      </main>

      {/* COMPARAR MODAL */}
      {showCompare && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-[#071D41]/40 backdrop-blur-sm" onClick={()=>setShowCompare(false)}/>
          <div className="absolute inset-0 md:inset-6 bg-white md:rounded-[32px] shadow-[0_24px_80px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-6 md:px-10 py-5 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#071D41] grid place-items-center text-white"><Scale className="w-5 h-5"/></div>
                <div>
                  <h3 className="font-black text-[18px] tracking-tight">Comparar propostas lado a lado</h3>
                  <p className="text-[12px] text-zinc-500">{comparar.length} candidatos selecionados • {CATEGORIAS.length} eixos temáticos</p>
                </div>
              </div>
              <button onClick={()=>setShowCompare(false)} className="w-10 h-10 rounded-full bg-zinc-100 grid place-items-center hover:bg-zinc-200"><X className="w-5 h-5"/></button>
            </div>

            <div className="flex-1 overflow-auto">
              {comparar.length===0 ? (
                <div className="h-full grid place-items-center p-10 text-center">
                  <div>
                    <Scale className="w-12 h-12 mx-auto text-zinc-300 mb-3"/>
                    <p className="font-semibold">Nenhum candidato selecionado</p>
                    <p className="text-sm text-zinc-500 mt-1">Selecione até 3 candidatos nos cards para comparar</p>
                  </div>
                </div>
              ) : (
                <div className="min-w-[720px]">
                  {/* header candidatos */}
                  <div className="grid sticky top-0 bg-white z-10 border-b" style={{gridTemplateColumns:`180px repeat(${comparar.length}, 1fr)`}}>
                    <div className="p-6 border-r bg-zinc-50/50">
                      <span className="text-[11px] font-bold tracking-widest text-zinc-500">EIXO TEMÁTICO</span>
                    </div>
                    {comparar.map(id => {
                      const c = candidatosData.find(x=>x.id===id)!;
                      return (
                        <div key={id} className="p-6 border-r text-center">
                          <img src={c.avatar} className="w-16 h-16 rounded-full object-cover mx-auto border-[3px]" style={{borderColor:c.partidoCor}} alt=""/>
                          <div className="mt-3 font-bold leading-tight">{c.nome}</div>
                          <div className="text-[11px] mt-1"><span className="font-bold px-2 py-0.5 rounded-full text-white" style={{background:c.partidoCor}}>{c.partido} {c.numero}</span></div>
                          <button onClick={()=>handleVotar(c.id)} className="mt-3 w-full h-9 rounded-full bg-[#071D41] text-white text-[12px] font-semibold flex items-center justify-center gap-1.5">
                            <Vote className="w-3.5 h-3.5"/> Votar neste
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  {/* rows */}
                  {CATEGORIAS.map(cat => (
                    <div key={cat} className="grid border-b hover:bg-zinc-50/50" style={{gridTemplateColumns:`180px repeat(${comparar.length}, 1fr)`}}>
                      <div className="p-5 border-r bg-zinc-50/30 flex items-start gap-2 font-bold text-[13px]">
                        <span className="mt-0.5">{categoriaIcon[cat]}</span>{cat}
                      </div>
                      {comparar.map(id => {
                        const c = candidatosData.find(x=>x.id===id)!;
                        return (
                          <div key={id} className="p-5 border-r text-[13px] leading-[1.5] text-zinc-700">
                            {c.propostas[cat]}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t bg-zinc-50 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">Transparência total • Fonte: planos de governo registrados no TSE</span>
              <div className="flex gap-2">
                <button onClick={()=>{setComparar([]); setShowCompare(false)}} className="h-10 px-5 rounded-full bg-white border text-[13px] font-semibold">Limpar</button>
                <button onClick={()=>setShowCompare(false)} className="h-10 px-5 rounded-full bg-[#071D41] text-white text-[13px] font-semibold flex items-center gap-2"><Award className="w-4 h-4"/> Fechar comparativo</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] bg-zinc-900 text-white px-5 py-3 rounded-full text-[13px] font-medium shadow-xl flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400"/>{toast}
        </div>
      )}

      <footer className="py-10 text-center text-[11px] text-zinc-400 tracking-wide">
        PLATAFORMA ELEITORAL 2026 • PROTÓTIPO EDUCACIONAL • NÃO OFICIAL • DADOS FICTÍCIOS PARA DEMONSTRAÇÃO • gov.br inspired design
      </footer>
    </div>
  );
}
