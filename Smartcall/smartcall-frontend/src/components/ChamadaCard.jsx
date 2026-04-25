// ============================================================
// ChamadaCard.jsx - Card da faixa horizontal de chamadas
//
// Exibe: nome do cliente, foto do atendente, status ao vivo
// Ao clicar abre um modal com detalhes da chamada
// ============================================================

import React, { useState } from 'react';

// Retorna a configuração visual do badge de acordo com o status
function getStatusConfig(status) {
  switch (status) {
    case 'EM_ANDAMENTO':
      return { label: 'Ao Vivo', className: 'badge badge-verde', dot: true };
    case 'AGENDADA':
      return { label: 'Agendada', className: 'badge badge-amarelo', dot: false };
    case 'CONCLUIDA':
      return { label: 'Concluída', className: 'badge badge-azul', dot: false };
    default:
      return { label: status, className: 'badge', dot: false };
  }
}

// Formata data para exibição
function formatarData(dataStr) {
  if (!dataStr) return '—';
  const data = new Date(dataStr);
  const hoje = new Date();
  const diff = data - hoje;

  if (Math.abs(diff) < 60000) return 'Agora';
  if (diff > 0) {
    // Agendada no futuro
    const dias = Math.ceil(diff / 86400000);
    if (dias === 1) return 'Amanhã';
    return `Em ${dias} dias`;
  }
  // No passado
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
}

// Ícone da plataforma
function IconePlataforma({ plataforma }) {
  const icons = {
    'Google Meet': '🎥',
    'Teams': '💻',
    'Telefone': '📞',
  };
  return <span title={plataforma}>{icons[plataforma] || '📞'}</span>;
}

export default function ChamadaCard({ chamada, onClick }) {
  const statusConfig = getStatusConfig(chamada.status);

  return (
    <div style={styles.card} onClick={() => onClick && onClick(chamada)}>
      {/* Linha de cor no topo conforme status */}
      <div style={{
        ...styles.topBar,
        background: chamada.status === 'EM_ANDAMENTO' ? 'var(--verde)' :
                    chamada.status === 'AGENDADA'     ? 'var(--amarelo)' : 'var(--azul-totvs)'
      }} />

      {/* Linha 1: Avatar do atendente + Info */}
      <div style={styles.header}>
        <img
          src={chamada.atendente?.fotoUrl || 'https://randomuser.me/api/portraits/lego/1.jpg'}
          alt={chamada.atendente?.nome}
          className="avatar"
          style={{ width: 36, height: 36 }}
        />
        <div style={styles.headerInfo}>
          <div style={styles.atendente}>{chamada.atendente?.nome || '—'}</div>
          <div style={styles.cargo}>{chamada.atendente?.cargo || '—'}</div>
        </div>
        <IconePlataforma plataforma={chamada.plataforma} />
      </div>

      {/* Linha 2: Nome do cliente */}
      <div style={styles.cliente}>
        {chamada.cliente?.nome || '—'}
      </div>
      <div style={styles.empresa}>
        {chamada.cliente?.empresa || ''}
      </div>

      {/* Linha 3: Status + Data */}
      <div style={styles.footer}>
        <span className={statusConfig.className}>
          {statusConfig.dot && <span className="dot-live" />}
          {statusConfig.label}
        </span>
        <span style={styles.data}>{formatarData(chamada.dataChamada)}</span>
      </div>
    </div>
  );
}

// ============================================================
// Modal de detalhes da chamada (ao clicar no card)
// ============================================================
export function ChamadaModal({ chamada, onFechar }) {
  if (!chamada) return null;

  return (
    <div style={styles.overlay} onClick={onFechar}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header do modal */}
        <div style={styles.modalHeader}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16 }}>
            Detalhes da Chamada
          </h3>
          <button style={styles.closeBtn} onClick={onFechar}>✕</button>
        </div>

        {/* Conteúdo */}
        <div style={styles.modalBody}>
          {/* Cliente */}
          <div style={styles.modalRow}>
            <img
              src={chamada.cliente?.fotoUrl || 'https://randomuser.me/api/portraits/lego/2.jpg'}
              alt={chamada.cliente?.nome}
              className="avatar"
              style={{ width: 52, height: 52 }}
            />
            <div>
              <div style={{ fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>
                {chamada.cliente?.nome}
              </div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
                {chamada.cliente?.empresa} · {chamada.cliente?.segmento}
              </div>
            </div>
          </div>

          <hr className="divider" />

          {/* Detalhes */}
          <div style={styles.modalDetails}>
            <InfoItem label="Atendente"  value={chamada.atendente?.nome} />
            <InfoItem label="Cargo"      value={chamada.atendente?.cargo} />
            <InfoItem label="Plataforma" value={chamada.plataforma} />
            <InfoItem label="Data"       value={new Date(chamada.dataChamada).toLocaleString('pt-BR')} />
            {chamada.duracaoMin > 0 &&
              <InfoItem label="Duração" value={`${chamada.duracaoMin} minutos`} />
            }
            {chamada.observacoes &&
              <InfoItem label="Observações" value={chamada.observacoes} />
            }
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)', fontWeight: 700 }}>
        {label}
      </span>
      <span style={{ color: 'var(--text-primary)', fontSize: 13 }}>{value || '—'}</span>
    </div>
  );
}

const styles = {
  card: {
    background: 'var(--bg-card)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    padding: '14px 16px',
    minWidth: 220,
    maxWidth: 260,
    flexShrink: 0,
    cursor: 'pointer',
    transition: 'transform 0.2s, border-color 0.2s, box-shadow 0.2s',
    position: 'relative',
    overflow: 'hidden',
  },
  topBar: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 3,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
    marginTop: 4,
  },
  headerInfo: { flex: 1, minWidth: 0 },
  atendente: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--text-primary)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cargo: {
    fontSize: 10,
    color: 'var(--text-muted)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  cliente: {
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'var(--font-display)',
    color: 'var(--text-primary)',
    marginBottom: 2,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  empresa: {
    fontSize: 11,
    color: 'var(--text-secondary)',
    marginBottom: 12,
  },
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  data: {
    fontSize: 11,
    color: 'var(--text-muted)',
  },
  // Modal
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    backdropFilter: 'blur(4px)',
    zIndex: 200,
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
    maxWidth: 460,
    boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
    animation: 'fadeInUp 0.25s ease',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px 24px 16px',
    borderBottom: '1px solid var(--border)',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--text-muted)',
    fontSize: 16,
    cursor: 'pointer',
    padding: 4,
    borderRadius: 4,
  },
  modalBody: { padding: '20px 24px 24px' },
  modalRow: { display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 },
  modalDetails: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px' },
};
