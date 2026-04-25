// ============================================================
// Chamadas.jsx - Página de gerenciamento de chamadas
//
// Funcionalidades:
// - Lista todas as chamadas separadas por status
// - Formulário para agendar nova chamada
// - Atualização de status ao vivo
// ============================================================

import React, { useState, useEffect } from 'react';
import { chamadasAPI, clientesAPI, atendentesAPI } from '../services/api';

// Configuração visual por status
function getStatusConfig(status) {
  const map = {
    EM_ANDAMENTO: { label: 'Ao Vivo',   cor: 'var(--verde)',    bg: 'var(--verde-bg)',    badge: 'badge badge-verde' },
    AGENDADA:     { label: 'Agendada',  cor: 'var(--amarelo)',  bg: 'var(--amarelo-bg)', badge: 'badge badge-amarelo' },
    CONCLUIDA:    { label: 'Concluída', cor: 'var(--azul-claro)', bg: 'var(--azul-glow)', badge: 'badge badge-azul' },
  };
  return map[status] || { label: status, cor: 'var(--text-muted)', bg: 'var(--border)', badge: 'badge' };
}

export default function Chamadas() {
  const [chamadas, setChamadas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [atendentes, setAtendentes] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');
  const [modalNova, setModalNova] = useState(false);
  const [salvando, setSalvando] = useState(false);
  const [erro, setErro] = useState('');

  const [form, setForm] = useState({
    idCliente: '', idAtendente: '', dataChamada: '',
    plataforma: 'Google Meet', observacoes: '',
  });

  useEffect(() => {
    Promise.all([
      chamadasAPI.porStatus('TODOS'),
      clientesAPI.listar(),
      atendentesAPI ? atendentesAPI.listar() : Promise.resolve({ dados: [] }),
    ]).then(([chamRes, cliRes, atenRes]) => {
      setChamadas(chamRes.dados || []);
      setClientes(cliRes.dados || []);
      setAtendentes(atenRes.dados || []);
    }).catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  // Filtra chamadas por status selecionado
  const chamadasFiltradas = filtroStatus === 'TODOS'
    ? chamadas
    : chamadas.filter(c => c.status === filtroStatus);

  // Atualiza status de uma chamada
  async function handleAtualizarStatus(id, novoStatus) {
    try {
      const res = await chamadasAPI.atualizarStatus(id, novoStatus);
      setChamadas(prev =>
        prev.map(c => c.idChamada === id ? { ...c, status: novoStatus } : c)
      );
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
    }
  }

  // Agenda nova chamada
  async function handleAgendar(e) {
    e.preventDefault();
    if (!form.idCliente || !form.idAtendente || !form.dataChamada) {
      setErro('Preencha todos os campos obrigatórios.');
      return;
    }
    setSalvando(true);
    setErro('');
    try {
      const nova = {
        cliente: { idCliente: Number(form.idCliente) },
        atendente: { idAtendente: Number(form.idAtendente) },
        dataChamada: form.dataChamada,
        plataforma: form.plataforma,
        observacoes: form.observacoes,
        status: 'AGENDADA',
      };
      const res = await chamadasAPI.criar(nova);
      setChamadas(prev => [res.dados, ...prev]);
      setModalNova(false);
      setForm({ idCliente: '', idAtendente: '', dataChamada: '', plataforma: 'Google Meet', observacoes: '' });
    } catch (err) {
      setErro('Erro ao agendar chamada. Verifique o backend.');
    } finally {
      setSalvando(false);
    }
  }

  const contadores = {
    TODOS:        chamadas.length,
    EM_ANDAMENTO: chamadas.filter(c => c.status === 'EM_ANDAMENTO').length,
    AGENDADA:     chamadas.filter(c => c.status === 'AGENDADA').length,
    CONCLUIDA:    chamadas.filter(c => c.status === 'CONCLUIDA').length,
  };

  return (
    <div className="page-content fade-in">

      {/* HEADER */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Chamadas</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Gerencie e acompanhe todas as chamadas em tempo real
          </p>
        </div>
        <button className="btn-primary" onClick={() => setModalNova(true)}>
          + Agendar Chamada
        </button>
      </div>

      {/* FILTROS POR STATUS */}
      <div style={styles.filtros}>
        {[
          { key: 'TODOS', label: 'Todas' },
          { key: 'EM_ANDAMENTO', label: 'Ao Vivo' },
          { key: 'AGENDADA', label: 'Agendadas' },
          { key: 'CONCLUIDA', label: 'Concluídas' },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFiltroStatus(f.key)}
            style={{
              ...styles.filtroBtn,
              ...(filtroStatus === f.key ? styles.filtroBtnAtivo : {}),
            }}
          >
            {f.label}
            <span style={styles.filtroCount}>{contadores[f.key]}</span>
          </button>
        ))}
      </div>

      {/* LISTA DE CHAMADAS */}
      {carregando ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 80, borderRadius: 12 }} />
          ))}
        </div>
      ) : chamadasFiltradas.length === 0 ? (
        <div style={styles.vazio}>Nenhuma chamada encontrada</div>
      ) : (
        <div style={styles.lista}>
          {chamadasFiltradas.map(c => (
            <ChamadaListItem
              key={c.idChamada}
              chamada={c}
              onAtualizarStatus={handleAtualizarStatus}
            />
          ))}
        </div>
      )}

      {/* MODAL: AGENDAR NOVA CHAMADA */}
      {modalNova && (
        <div style={styles.overlay} onClick={() => setModalNova(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={{ fontFamily: 'var(--font-display)' }}>Agendar Chamada</h3>
              <button style={styles.closeBtn} onClick={() => setModalNova(false)}>✕</button>
            </div>
            <form onSubmit={handleAgendar} style={styles.form}>
              <Field label="Cliente *">
                <select style={styles.select} value={form.idCliente}
                  onChange={e => setForm(f => ({ ...f, idCliente: e.target.value }))}>
                  <option value="">Selecione o cliente...</option>
                  {clientes.map(c => (
                    <option key={c.idCliente} value={c.idCliente}>{c.nome} — {c.empresa}</option>
                  ))}
                </select>
              </Field>
              <Field label="Atendente *">
                <select style={styles.select} value={form.idAtendente}
                  onChange={e => setForm(f => ({ ...f, idAtendente: e.target.value }))}>
                  <option value="">Selecione o atendente...</option>
                  {atendentes.map(a => (
                    <option key={a.idAtendente} value={a.idAtendente}>{a.nome} — {a.cargo}</option>
                  ))}
                </select>
              </Field>
              <Field label="Data e Hora *">
                <input type="datetime-local" style={styles.input}
                  value={form.dataChamada}
                  onChange={e => setForm(f => ({ ...f, dataChamada: e.target.value }))} />
              </Field>
              <Field label="Plataforma">
                <select style={styles.select} value={form.plataforma}
                  onChange={e => setForm(f => ({ ...f, plataforma: e.target.value }))}>
                  <option>Google Meet</option>
                  <option>Teams</option>
                  <option>Telefone</option>
                </select>
              </Field>
              <Field label="Observações">
                <textarea style={{ ...styles.input, resize: 'vertical' }} rows={3}
                  placeholder="Objetivo da chamada..."
                  value={form.observacoes}
                  onChange={e => setForm(f => ({ ...f, observacoes: e.target.value }))} />
              </Field>
              {erro && <div style={styles.erroBox}>{erro}</div>}
              <button type="submit" className="btn-primary"
                style={{ width: '100%', padding: 12 }} disabled={salvando}>
                {salvando ? '⏳ Agendando...' : '✓ Agendar Chamada'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Item individual na lista de chamadas
function ChamadaListItem({ chamada, onAtualizarStatus }) {
  const cfg = getStatusConfig(chamada.status);

  return (
    <div className="card" style={{ ...styles.listItem, borderLeft: `3px solid ${cfg.cor}` }}>
      <div style={styles.listItemMain}>
        {/* Info do cliente */}
        <div style={styles.listItemCliente}>
          <img src={chamada.cliente?.fotoUrl || 'https://randomuser.me/api/portraits/lego/6.jpg'}
            alt="" className="avatar" style={{ width: 40, height: 40 }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {chamada.cliente?.nome}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {chamada.cliente?.empresa}
            </div>
          </div>
        </div>

        {/* Atendente */}
        <div style={styles.listItemAtendente}>
          <img src={chamada.atendente?.fotoUrl || 'https://randomuser.me/api/portraits/lego/7.jpg'}
            alt="" className="avatar" style={{ width: 28, height: 28 }} />
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-primary)', fontWeight: 500 }}>{chamada.atendente?.nome}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{chamada.atendente?.cargo}</div>
          </div>
        </div>

        {/* Data e plataforma */}
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
          <div>{new Date(chamada.dataChamada).toLocaleString('pt-BR', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{chamada.plataforma}</div>
        </div>

        {/* Status */}
        <span className={cfg.badge}>
          {chamada.status === 'EM_ANDAMENTO' && <span className="dot-live" />}
          {cfg.label}
        </span>

        {/* Ações de status */}
        <div style={styles.acoes}>
          {chamada.status === 'AGENDADA' && (
            <button className="btn-ghost" style={{ fontSize: 11 }}
              onClick={() => onAtualizarStatus(chamada.idChamada, 'EM_ANDAMENTO')}>
              ▶ Iniciar
            </button>
          )}
          {chamada.status === 'EM_ANDAMENTO' && (
            <button className="btn-ghost" style={{ fontSize: 11, borderColor: 'var(--verde)', color: 'var(--verde)' }}
              onClick={() => onAtualizarStatus(chamada.idChamada, 'CONCLUIDA')}>
              ✓ Concluir
            </button>
          )}
        </div>
      </div>

      {chamada.observacoes && (
        <div style={styles.obs}>{chamada.observacoes}</div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>
        {label}
      </label>
      {children}
    </div>
  );
}

const styles = {
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 24 },
  filtros: { display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' },
  filtroBtn: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '8px 16px',
    color: 'var(--text-secondary)', fontSize: 13,
    fontFamily: 'var(--font-body)', cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filtroBtnAtivo: {
    background: 'var(--azul-glow)', borderColor: 'var(--azul-totvs)',
    color: 'var(--text-primary)',
  },
  filtroCount: {
    background: 'var(--bg-surface)', borderRadius: 10,
    padding: '1px 7px', fontSize: 11, color: 'var(--text-muted)',
  },
  lista: { display: 'flex', flexDirection: 'column', gap: 10 },
  listItem: { padding: '14px 18px' },
  listItemMain: {
    display: 'flex', alignItems: 'center',
    gap: 20, flexWrap: 'wrap',
  },
  listItemCliente: { display: 'flex', alignItems: 'center', gap: 12, flex: '1 1 180px' },
  listItemAtendente: { display: 'flex', alignItems: 'center', gap: 8, flex: '0 1 160px' },
  acoes: { display: 'flex', gap: 8, marginLeft: 'auto' },
  obs: {
    marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)',
    fontSize: 12, color: 'var(--text-muted)', fontStyle: 'italic',
  },
  vazio: { textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 14 },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    backdropFilter: 'blur(6px)', zIndex: 300,
    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
  },
  modal: {
    background: 'var(--bg-card)', border: '1px solid var(--border-accent)',
    borderRadius: 'var(--radius-xl)', width: '100%', maxWidth: 500,
    boxShadow: '0 32px 80px rgba(0,0,0,0.6)', animation: 'fadeInUp 0.25s ease',
    maxHeight: '90vh', overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 24px 16px', borderBottom: '1px solid var(--border)',
  },
  closeBtn: { background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 18, cursor: 'pointer' },
  form: { display: 'flex', flexDirection: 'column', gap: 14, padding: '20px 24px 24px' },
  select: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: 13, outline: 'none',
  },
  input: {
    background: 'var(--bg-surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
    padding: '10px 12px', fontFamily: 'var(--font-body)', fontSize: 13,
    outline: 'none', width: '100%',
  },
  erroBox: {
    background: 'var(--vermelho-bg)', border: '1px solid rgba(255,77,106,0.3)',
    borderRadius: 'var(--radius-sm)', padding: '10px 14px',
    color: 'var(--vermelho)', fontSize: 12,
  },
};
