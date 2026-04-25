// ============================================================
// ClienteCard.jsx - Card do cliente na grade inferior
// ClienteModal.jsx - Modal com perfil completo do cliente
// ============================================================

import React, { useState, useEffect } from 'react';
import { clientesAPI, chamadasAPI, transcricoesAPI, produtosClienteAPI } from '../services/api';

// ============================================================
// ClienteCard — card resumido na grade de clientes
// ============================================================
export function ClienteCard({ cliente, onClick }) {
  return (
    <div
      className="card"
      style={styles.card}
      onClick={() => onClick && onClick(cliente)}
    >
      {/* Avatar + Nome */}
      <div style={styles.cardHeader}>
        <img
          src={cliente.fotoUrl || 'https://randomuser.me/api/portraits/lego/3.jpg'}
          alt={cliente.nome}
          className="avatar"
          style={{ width: 44, height: 44 }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={styles.clienteNome}>{cliente.nome}</div>
          <div style={styles.clienteEmpresa}>{cliente.empresa}</div>
        </div>
      </div>

      {/* Segmento */}
      <span className="badge badge-azul" style={{ marginTop: 10 }}>
        {cliente.segmento || 'Geral'}
      </span>

      {/* Rodapé */}
      <div style={styles.cardFooter}>
        <span style={styles.footerLabel}>Ver perfil →</span>
      </div>
    </div>
  );
}

// ============================================================
// ClienteModal — perfil completo ao clicar no card
// ============================================================
export function ClienteModal({ clienteId, onFechar }) {
  const [cliente, setCliente] = useState(null);
  const [chamadas, setChamadas] = useState([]);
  const [transcricoes, setTranscricoes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState('chamadas');

  useEffect(() => {
    if (!clienteId) return;

    // Busca todos os dados do cliente em paralelo
    Promise.all([
      clientesAPI.buscarPorId(clienteId),
      chamadasAPI.porCliente(clienteId),
      transcricoesAPI.porCliente(clienteId),
      produtosClienteAPI.porCliente(clienteId),
    ]).then(([clienteRes, chamadasRes, transcRes, prodRes]) => {
      setCliente(clienteRes.dados);
      setChamadas(chamadasRes.dados || []);
      setTranscricoes(transcRes.dados || []);
      setProdutos(prodRes.dados || []);
    }).catch(err => {
      console.error('Erro ao carregar dados do cliente:', err);
    }).finally(() => setCarregando(false));
  }, [clienteId]);

  if (!clienteId) return null;

  return (
    <div style={styles.overlay} onClick={onFechar}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>

        {/* HEADER DO MODAL */}
        <div style={styles.modalHeader}>
          {carregando ? (
            <div className="skeleton" style={{ width: 200, height: 20 }} />
          ) : (
            <div style={styles.clienteHeader}>
              <img
                src={cliente?.fotoUrl || 'https://randomuser.me/api/portraits/lego/4.jpg'}
                alt={cliente?.nome}
                className="avatar"
                style={{ width: 56, height: 56, border: '2px solid var(--azul-totvs)' }}
              />
              <div>
                <h2 style={{ fontSize: 18, marginBottom: 2 }}>{cliente?.nome}</h2>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                  {cliente?.empresa} · {cliente?.segmento}
                </div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>
                  {cliente?.email} · {cliente?.telefone}
                </div>
              </div>
            </div>
          )}
          <button style={styles.closeBtn} onClick={onFechar}>✕</button>
        </div>

        {/* ABAS */}
        <div style={styles.tabs}>
          {[
            { key: 'chamadas',     label: `Chamadas (${chamadas.length})` },
            { key: 'transcricoes', label: `Transcrições (${transcricoes.length})` },
            { key: 'produtos',     label: `Produtos (${produtos.length})` },
          ].map(aba => (
            <button
              key={aba.key}
              style={{ ...styles.tab, ...(abaAtiva === aba.key ? styles.tabAtiva : {}) }}
              onClick={() => setAbaAtiva(aba.key)}
            >
              {aba.label}
            </button>
          ))}
        </div>

        {/* CONTEÚDO DAS ABAS */}
        <div style={styles.modalBody}>

          {/* ABA: CHAMADAS */}
          {abaAtiva === 'chamadas' && (
            <div style={styles.lista}>
              {chamadas.length === 0
                ? <Vazio mensagem="Nenhuma chamada registrada" />
                : chamadas.map(c => (
                  <div key={c.idChamada} style={styles.listaItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={styles.listaItemTitle}>
                        {c.plataforma} · {c.atendente?.nome}
                      </span>
                      <StatusBadge status={c.status} />
                    </div>
                    <div style={styles.listaItemSub}>
                      {new Date(c.dataChamada).toLocaleString('pt-BR')}
                      {c.duracaoMin > 0 && ` · ${c.duracaoMin} min`}
                    </div>
                    {c.observacoes && (
                      <div style={styles.listaItemObs}>{c.observacoes}</div>
                    )}
                  </div>
                ))
              }
            </div>
          )}

          {/* ABA: TRANSCRIÇÕES */}
          {abaAtiva === 'transcricoes' && (
            <div style={styles.lista}>
              {transcricoes.length === 0
                ? <Vazio mensagem="Nenhuma transcrição disponível" />
                : transcricoes.map(t => (
                  <div key={t.idTranscricao} style={styles.listaItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={styles.listaItemTitle}>Transcrição #{t.idTranscricao}</span>
                      <span className={`badge sentimento-${t.sentimento?.toLowerCase()}`} style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20 }}>
                        {t.sentimento}
                      </span>
                    </div>
                    {t.resumoIa && (
                      <div style={styles.resumoIA}>
                        <span style={styles.iaLabel}>Resumo IA</span>
                        <p style={{ color: 'var(--text-secondary)', fontSize: 12, marginTop: 4 }}>{t.resumoIa}</p>
                      </div>
                    )}
                    {t.pontosChave && (
                      <div style={{ marginTop: 8 }}>
                        <span style={styles.iaLabel}>Pontos-chave</span>
                        <p style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>{t.pontosChave}</p>
                      </div>
                    )}
                    {t.proximasAcoes && (
                      <div style={{ marginTop: 8, padding: '6px 10px', background: 'var(--azul-glow)', borderRadius: 6 }}>
                        <span style={{ fontSize: 10, color: 'var(--azul-claro)', fontWeight: 600 }}>PRÓXIMA AÇÃO: </span>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.proximasAcoes}</span>
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          )}

          {/* ABA: PRODUTOS */}
          {abaAtiva === 'produtos' && (
            <div style={styles.lista}>
              {produtos.length === 0
                ? <Vazio mensagem="Nenhum produto vinculado" />
                : produtos.map(p => (
                  <div key={p.idProdCli} style={styles.listaItem}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={styles.listaItemTitle}>{p.produto?.nome}</span>
                      <span className={p.tipo === 'COMPRADO' ? 'badge badge-verde' : 'badge badge-amarelo'}>
                        {p.tipo === 'COMPRADO' ? '✓ Comprado' : '◎ Interesse'}
                      </span>
                    </div>
                    <div style={styles.listaItemSub}>{p.produto?.categoria}</div>
                    {p.valorContrato && (
                      <div style={{ color: 'var(--verde)', fontSize: 12, fontWeight: 600, marginTop: 4 }}>
                        R$ {Number(p.valorContrato).toLocaleString('pt-BR')}/ano
                      </div>
                    )}
                  </div>
                ))
              }
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Componente auxiliar: mensagem de lista vazia
function Vazio({ mensagem }) {
  return (
    <div style={{ textAlign: 'center', padding: '32px 0', color: 'var(--text-muted)', fontSize: 13 }}>
      {mensagem}
    </div>
  );
}

// Componente auxiliar: badge de status
function StatusBadge({ status }) {
  const map = {
    CONCLUIDA:    { label: 'Concluída', cls: 'badge badge-azul' },
    EM_ANDAMENTO: { label: 'Ao Vivo',   cls: 'badge badge-verde' },
    AGENDADA:     { label: 'Agendada',  cls: 'badge badge-amarelo' },
  };
  const cfg = map[status] || { label: status, cls: 'badge' };
  return <span className={cfg.cls}>{cfg.label}</span>;
}

const styles = {
  // Card
  card: {
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  clienteNome: {
    fontFamily: 'var(--font-display)',
    fontWeight: 700,
    fontSize: 13,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  clienteEmpresa: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  cardFooter: {
    marginTop: 12,
    paddingTop: 10,
    borderTop: '1px solid var(--border)',
  },
  footerLabel: {
    fontSize: 11,
    color: 'var(--azul-claro)',
    fontWeight: 600,
  },
  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)',
    zIndex: 300,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modal: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-accent)',
    borderRadius: 'var(--radius-xl)',
    width: '100%',
    maxWidth: 620,
    maxHeight: '85vh',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '0 32px 80px rgba(0,0,0,0.7), var(--shadow-glow)',
    animation: 'fadeInUp 0.25s ease',
    overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: '24px 24px 16px',
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
  },
  clienteHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 18,
    cursor: 'pointer',
    flexShrink: 0,
    marginTop: 4,
  },
  tabs: {
    display: 'flex',
    gap: 0,
    borderBottom: '1px solid var(--border)',
    flexShrink: 0,
    padding: '0 24px',
  },
  tab: {
    background: 'none',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    fontWeight: 500,
    padding: '12px 16px',
    cursor: 'pointer',
    transition: 'color 0.2s, border-color 0.2s',
  },
  tabAtiva: {
    color: 'var(--text-primary)',
    borderBottomColor: 'var(--azul-totvs)',
  },
  modalBody: {
    overflowY: 'auto',
    padding: '16px 24px 24px',
    flex: 1,
  },
  lista: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  listaItem: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '12px 14px',
  },
  listaItemTitle: {
    fontSize: 13,
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  listaItemSub: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: 3,
  },
  listaItemObs: {
    fontSize: 12,
    color: 'var(--text-secondary)',
    marginTop: 6,
    fontStyle: 'italic',
  },
  resumoIA: {
    background: 'rgba(0,87,255,0.06)',
    border: '1px solid var(--border-accent)',
    borderRadius: 6,
    padding: '8px 10px',
    marginTop: 8,
  },
  iaLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--azul-claro)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: 'var(--font-display)',
  },
};
