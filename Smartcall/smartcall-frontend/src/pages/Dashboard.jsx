// ============================================================
// Dashboard.jsx - Página principal do SmartCall
//
// SEÇÕES (de cima para baixo):
// 1. Faixa horizontal de chamadas ativas/agendadas
// 2. Carrossel de notícias da TOTVS
// 3. Cards de dashboard (Top 5 Clientes, Top 5 Produtos, Transcrições recentes)
// 4. Grade de todos os clientes
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { dashboardAPI, clientesAPI } from '../services/api';
import ChamadaCard, { ChamadaModal } from '../components/ChamadaCard';
import { ClienteCard, ClienteModal } from '../components/ClienteCard';

// ============================================================
// SEÇÃO 1: Faixa horizontal de chamadas
// ============================================================
function FaixaChamadas({ chamadas, onChamadaClick }) {
  const scrollRef = useRef(null);

  // Scroll automático suave a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const novoScroll = scrollLeft + 240;
        if (novoScroll >= scrollWidth - clientWidth) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollTo({ left: novoScroll, behavior: 'smooth' });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={faixaStyles.container}>
      <div style={faixaStyles.headerRow}>
        <div>
          <p className="section-title" style={{ marginBottom: 0 }}>Chamadas Ativas & Agendadas</p>
        </div>
        <div style={faixaStyles.contador}>
          <span className="dot-live" />
          <span style={{ fontSize: 12, color: 'var(--verde)' }}>
            {chamadas.filter(c => c.status === 'EM_ANDAMENTO').length} ao vivo
          </span>
        </div>
      </div>

      {chamadas.length === 0 ? (
        <div style={faixaStyles.vazio}>Nenhuma chamada ativa no momento</div>
      ) : (
        <div ref={scrollRef} style={faixaStyles.scroll}>
          {chamadas.map(c => (
            <ChamadaCard
              key={c.idChamada}
              chamada={c}
              onClick={onChamadaClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const faixaStyles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '16px 20px',
    marginBottom: 24,
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  contador: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'var(--verde-bg)',
    padding: '4px 12px',
    borderRadius: 20,
    border: '1px solid rgba(0,229,160,0.2)',
  },
  scroll: {
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    paddingBottom: 4,
    scrollbarWidth: 'none', // Firefox
    msOverflowStyle: 'none', // IE
  },
  vazio: {
    textAlign: 'center',
    padding: '24px 0',
    color: 'var(--text-muted)',
    fontSize: 13,
  },
};

// ============================================================
// SEÇÃO 2: Carrossel de notícias da TOTVS
// ============================================================

// Notícias simuladas da TOTVS (em produção viria de uma API de RSS)
const noticias = [
  {
    id: 1,
    categoria: 'Produto',
    titulo: 'TOTVS lança nova versão do ERP Protheus com módulo de IA integrado',
    data: '22 Abr 2025',
    cor: 'var(--azul-totvs)',
  },
  {
    id: 2,
    categoria: 'Mercado',
    titulo: 'TOTVS atinge marca de 50 mil clientes ativos no Brasil',
    data: '18 Abr 2025',
    cor: 'var(--verde)',
  },
  {
    id: 3,
    categoria: 'SmartCall',
    titulo: 'Novo módulo SmartCall reduz tempo de análise de chamadas em 70%',
    data: '15 Abr 2025',
    cor: 'var(--amarelo)',
  },
  {
    id: 4,
    categoria: 'Parceria',
    titulo: 'TOTVS firma parceria com Google Cloud para expansão da plataforma de IA',
    data: '10 Abr 2025',
    cor: '#A855F7',
  },
  {
    id: 5,
    categoria: 'Resultado',
    titulo: 'TOTVS registra crescimento de 32% na receita recorrente no Q1 2025',
    data: '05 Abr 2025',
    cor: 'var(--verde)',
  },
];

function CarrosselNoticias() {
  const [atual, setAtual] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setAtual(a => (a + 1) % noticias.length), 4000);
    return () => clearInterval(t);
  }, []);

  const noticia = noticias[atual];

  return (
    <div style={carrosselStyles.container}>
      <p className="section-title">Últimas Notícias TOTVS</p>

      <div style={carrosselStyles.card} key={atual}>
        <span className="badge" style={{ background: `${noticia.cor}20`, color: noticia.cor, marginBottom: 10 }}>
          {noticia.categoria}
        </span>
        <p style={carrosselStyles.titulo}>{noticia.titulo}</p>
        <span style={carrosselStyles.data}>{noticia.data}</span>
      </div>

      {/* Indicadores */}
      <div style={carrosselStyles.dots}>
        {noticias.map((_, i) => (
          <button
            key={i}
            style={{
              ...carrosselStyles.dot,
              background: i === atual ? 'var(--azul-totvs)' : 'var(--border)',
              width: i === atual ? 20 : 6,
            }}
            onClick={() => setAtual(i)}
          />
        ))}
      </div>
    </div>
  );
}

const carrosselStyles = {
  container: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-lg)',
    padding: '20px',
    marginBottom: 24,
  },
  card: {
    animation: 'fadeInUp 0.3s ease',
    minHeight: 80,
  },
  titulo: {
    color: 'var(--text-primary)',
    fontSize: 14,
    fontWeight: 600,
    fontFamily: 'var(--font-display)',
    lineHeight: 1.4,
    marginBottom: 8,
  },
  data: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  dots: {
    display: 'flex',
    gap: 6,
    marginTop: 14,
    alignItems: 'center',
  },
  dot: {
    height: 6,
    borderRadius: 3,
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s',
    padding: 0,
  },
};

// ============================================================
// SEÇÃO 3: Cards de dashboard
// ============================================================

function CardTop5Clientes({ clientes }) {
  return (
    <div className="card" style={{ height: '100%' }}>
      <p className="section-title">🏆 Top 5 Clientes</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {clientes.map((c, i) => (
          <div key={c.idCliente} style={rankStyles.item}>
            <span style={rankStyles.rank}>#{i + 1}</span>
            <img src={c.fotoUrl || 'https://randomuser.me/api/portraits/lego/5.jpg'}
              alt={c.nome} className="avatar" style={{ width: 32, height: 32 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={rankStyles.nome}>{c.nome}</div>
              <div style={rankStyles.empresa}>{c.empresa}</div>
            </div>
          </div>
        ))}
        {clientes.length === 0 && <SkeletonList n={5} />}
      </div>
    </div>
  );
}

function CardTop5Produtos({ produtos }) {
  return (
    <div className="card" style={{ height: '100%' }}>
      <p className="section-title">📦 Top 5 Produtos</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {produtos.map((p, i) => (
          <div key={p.idProduto} style={rankStyles.item}>
            <span style={rankStyles.rank}>#{i + 1}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={rankStyles.nome}>{p.nome}</div>
              <span className="badge badge-azul" style={{ fontSize: 10, marginTop: 2 }}>{p.categoria}</span>
            </div>
          </div>
        ))}
        {produtos.length === 0 && <SkeletonList n={5} />}
      </div>
    </div>
  );
}

function CardTranscricoes({ transcricoes }) {
  return (
    <div className="card" style={{ height: '100%' }}>
      <p className="section-title">🤖 Transcrições Recentes</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {transcricoes.slice(0, 5).map(t => (
          <div key={t.idTranscricao} style={rankStyles.transcricaoItem}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={rankStyles.nome}>{t.chamada?.cliente?.nome || 'Cliente'}</span>
              <span className={`badge sentimento-${t.sentimento?.toLowerCase()}`}
                style={{ fontSize: 9, padding: '1px 7px', borderRadius: 20 }}>
                {t.sentimento}
              </span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4 }}>
              {t.resumoIa?.substring(0, 80)}{t.resumoIa?.length > 80 ? '...' : ''}
            </p>
          </div>
        ))}
        {transcricoes.length === 0 && <SkeletonList n={4} />}
      </div>
    </div>
  );
}

const rankStyles = {
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '8px 10px',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
  },
  rank: {
    fontSize: 11,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: 'var(--azul-claro)',
    minWidth: 24,
  },
  nome: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  empresa: {
    fontSize: 10,
    color: 'var(--text-muted)',
  },
  transcricaoItem: {
    padding: '8px 10px',
    background: 'var(--bg-surface)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)',
  },
};

// Skeleton de loading para listas
function SkeletonList({ n }) {
  return Array.from({ length: n }).map((_, i) => (
    <div key={i} className="skeleton" style={{ height: 40, borderRadius: 8 }} />
  ));
}

// ============================================================
// PÁGINA PRINCIPAL: Dashboard
// ============================================================
export default function Dashboard() {
  const [dashData, setDashData] = useState({
    chamadasAtivas: [],
    top5Clientes: [],
    top5Produtos: [],
    transcricoesRecentes: [],
  });
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [chamadaSelecionada, setChamadaSelecionada] = useState(null);
  const [clienteModalId, setClienteModalId] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Carrega dados do dashboard e lista de clientes
  useEffect(() => {
    Promise.all([
      dashboardAPI.buscarDados(),
      clientesAPI.listar(),
    ]).then(([dash, clientesRes]) => {
      setDashData(dash.dados || {});
      const lista = clientesRes.dados || [];
      setClientes(lista);
      setClientesFiltrados(lista);
    }).catch(err => {
      console.error('Erro ao carregar dashboard:', err);
      // Em desenvolvimento, mostra dados vazios sem quebrar
    }).finally(() => setCarregando(false));

    // Atualiza chamadas ativas a cada 30 segundos
    const interval = setInterval(() => {
      dashboardAPI.buscarDados().then(res => {
        if (res?.dados) setDashData(res.dados);
      }).catch(() => {});
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Filtra clientes ao digitar na busca
  useEffect(() => {
    if (!busca.trim()) {
      setClientesFiltrados(clientes);
    } else {
      const lower = busca.toLowerCase();
      setClientesFiltrados(
        clientes.filter(c =>
          c.nome?.toLowerCase().includes(lower) ||
          c.empresa?.toLowerCase().includes(lower) ||
          c.segmento?.toLowerCase().includes(lower)
        )
      );
    }
  }, [busca, clientes]);

  return (
    <div className="page-content fade-in">

      {/* SEÇÃO 1: FAIXA DE CHAMADAS */}
      <FaixaChamadas
        chamadas={dashData.chamadasAtivas || []}
        onChamadaClick={setChamadaSelecionada}
      />

      {/* SEÇÃO 2: CARROSSEL DE NOTÍCIAS */}
      <CarrosselNoticias />

      {/* SEÇÃO 3: CARDS DO DASHBOARD */}
      <div style={{ marginBottom: 6 }}>
        <p className="section-title">Visão Geral</p>
      </div>
      <div className="dashboard-grid" style={{ marginBottom: 32 }}>
        <CardTop5Clientes clientes={dashData.top5Clientes || []} />
        <CardTop5Produtos produtos={dashData.top5Produtos || []} />
        <CardTranscricoes transcricoes={dashData.transcricoesRecentes || []} />
      </div>

      {/* SEÇÃO 4: GRADE DE CLIENTES */}
      <div style={clientesStyles.header}>
        <div>
          <p className="section-title" style={{ marginBottom: 2 }}>Base de Clientes</p>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {clientesFiltrados.length} cliente{clientesFiltrados.length !== 1 ? 's' : ''}
            {busca && ` para "${busca}"`}
          </span>
        </div>

        {/* Campo de busca */}
        <div style={clientesStyles.searchWrapper}>
          <span style={clientesStyles.searchIcon}>🔍</span>
          <input
            className="search-input"
            placeholder="Buscar por nome, empresa ou segmento..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
      </div>

      <div className="clientes-grid">
        {carregando
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 130, borderRadius: 12 }} />
            ))
          : clientesFiltrados.map(c => (
              <ClienteCard
                key={c.idCliente}
                cliente={c}
                onClick={c => setClienteModalId(c.idCliente)}
              />
            ))
        }
      </div>

      {/* MODAIS */}
      {chamadaSelecionada && (
        <ChamadaModal
          chamada={chamadaSelecionada}
          onFechar={() => setChamadaSelecionada(null)}
        />
      )}
      {clienteModalId && (
        <ClienteModal
          clienteId={clienteModalId}
          onFechar={() => setClienteModalId(null)}
        />
      )}
    </div>
  );
}

const clientesStyles = {
  header: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 16,
    flexWrap: 'wrap',
  },
  searchWrapper: {
    position: 'relative',
    width: 320,
    flexShrink: 0,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: 14,
    pointerEvents: 'none',
  },
};
