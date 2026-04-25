// ============================================================
// Clientes.jsx - Página de lista e busca de clientes
// ============================================================

import React, { useState, useEffect } from 'react';
import { clientesAPI } from '../services/api';
import { ClienteCard, ClienteModal } from '../components/ClienteCard';

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [filtrados, setFiltrados] = useState([]);
  const [busca, setBusca] = useState('');
  const [segmentoFiltro, setSegmentoFiltro] = useState('TODOS');
  const [clienteModalId, setClienteModalId] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    clientesAPI.listar()
      .then(res => {
        const lista = res.dados || [];
        setClientes(lista);
        setFiltrados(lista);
      })
      .catch(console.error)
      .finally(() => setCarregando(false));
  }, []);

  // Segmentos únicos para o filtro
  const segmentos = ['TODOS', ...new Set(clientes.map(c => c.segmento).filter(Boolean))];

  // Filtra por busca + segmento
  useEffect(() => {
    let resultado = clientes;
    if (segmentoFiltro !== 'TODOS') {
      resultado = resultado.filter(c => c.segmento === segmentoFiltro);
    }
    if (busca.trim()) {
      const lower = busca.toLowerCase();
      resultado = resultado.filter(c =>
        c.nome?.toLowerCase().includes(lower) ||
        c.empresa?.toLowerCase().includes(lower)
      );
    }
    setFiltrados(resultado);
  }, [busca, segmentoFiltro, clientes]);

  return (
    <div className="page-content fade-in">

      {/* HEADER */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Clientes</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            {filtrados.length} de {clientes.length} clientes
          </p>
        </div>
      </div>

      {/* BARRA DE BUSCA + FILTROS */}
      <div style={styles.toolBar}>
        <div style={styles.searchWrapper}>
          <span style={styles.searchIcon}>🔍</span>
          <input
            className="search-input"
            placeholder="Buscar cliente ou empresa..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </div>
        <div style={styles.segmentos}>
          {segmentos.map(s => (
            <button
              key={s}
              onClick={() => setSegmentoFiltro(s)}
              style={{
                ...styles.segBtn,
                ...(segmentoFiltro === s ? styles.segBtnAtivo : {}),
              }}
            >
              {s === 'TODOS' ? 'Todos' : s}
            </button>
          ))}
        </div>
      </div>

      {/* GRADE DE CLIENTES */}
      {carregando ? (
        <div className="clientes-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton" style={{ height: 130, borderRadius: 12 }} />
          ))}
        </div>
      ) : filtrados.length === 0 ? (
        <div style={styles.vazio}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
          Nenhum cliente encontrado
        </div>
      ) : (
        <div className="clientes-grid">
          {filtrados.map(c => (
            <ClienteCard
              key={c.idCliente}
              cliente={c}
              onClick={c => setClienteModalId(c.idCliente)}
            />
          ))}
        </div>
      )}

      {/* MODAL */}
      {clienteModalId && (
        <ClienteModal
          clienteId={clienteModalId}
          onFechar={() => setClienteModalId(null)}
        />
      )}
    </div>
  );
}

const styles = {
  pageHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 20 },
  toolBar: { display: 'flex', gap: 12, marginBottom: 20, alignItems: 'center', flexWrap: 'wrap' },
  searchWrapper: { position: 'relative', width: 300, flexShrink: 0 },
  searchIcon: { position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', fontSize: 14, pointerEvents: 'none' },
  segmentos: { display: 'flex', gap: 6, flexWrap: 'wrap' },
  segBtn: {
    background: 'var(--bg-card)', border: '1px solid var(--border)',
    borderRadius: 20, padding: '5px 14px', fontSize: 12,
    color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: 'var(--font-body)',
  },
  segBtnAtivo: {
    background: 'var(--azul-glow)', borderColor: 'var(--azul-totvs)',
    color: 'var(--text-primary)',
  },
  vazio: { textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)', fontSize: 14 },
};
