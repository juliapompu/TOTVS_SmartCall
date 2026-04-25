// ============================================================
// Transcricoes.jsx - Página de transcrições
//
// Funcionalidades:
// - Lista todas as transcrições recentes
// - Formulário para enviar uma nova transcrição para a IA processar
// - Exibe resultado da IA: resumo, pontos-chave, sentimento, próximas ações
// ============================================================

import React, { useState, useEffect } from 'react';
import { transcricoesAPI, chamadasAPI } from '../services/api';

export default function Transcricoes() {
  const [transcricoes, setTranscricoes] = useState([]);
  const [chamadas, setChamadas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState('');

  // Formulário para nova transcrição
  const [form, setForm] = useState({
    idChamada: '',
    textoTranscricao: '',
  });

  useEffect(() => {
    Promise.all([
      transcricoesAPI.recentes(),
      chamadasAPI.ativas(),
    ]).then(([transRes, chamRes]) => {
      setTranscricoes(transRes.dados || []);
      // Mostra todas as chamadas concluídas também para poder vincular
      setChamadas(chamRes.dados || []);
    }).catch(err => console.error(err))
      .finally(() => setCarregando(false));
  }, []);

  // Envia transcrição para a IA processar via backend Java
  async function handleEnviar(e) {
    e.preventDefault();
    if (!form.idChamada || !form.textoTranscricao.trim()) {
      setErro('Preencha todos os campos antes de enviar.');
      return;
    }
    setErro('');
    setEnviando(true);
    setResultado(null);

    try {
      const res = await transcricoesAPI.processar(
        Number(form.idChamada),
        form.textoTranscricao
      );
      setResultado(res.dados);
      // Adiciona a nova transcrição no topo da lista
      setTranscricoes(prev => [res.dados, ...prev]);
      setForm({ idChamada: '', textoTranscricao: '' });
    } catch (err) {
      setErro('Erro ao processar transcrição. Verifique se o backend está rodando.');
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="page-content fade-in">

      {/* TÍTULO DA PÁGINA */}
      <div style={styles.pageHeader}>
        <div>
          <h2 style={{ marginBottom: 4 }}>Transcrições</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Envie transcrições para a IA analisar e visualize os resultados
          </p>
        </div>
      </div>

      <div style={styles.grid}>

        {/* COLUNA ESQUERDA: FORMULÁRIO */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <p className="section-title">Nova Transcrição</p>

            <form onSubmit={handleEnviar} style={styles.form}>
              {/* Seleção de chamada */}
              <div style={styles.field}>
                <label style={styles.label}>Chamada vinculada</label>
                <select
                  style={styles.select}
                  value={form.idChamada}
                  onChange={e => setForm(f => ({ ...f, idChamada: e.target.value }))}
                >
                  <option value="">Selecione uma chamada...</option>
                  {chamadas.map(c => (
                    <option key={c.idChamada} value={c.idChamada}>
                      #{c.idChamada} · {c.cliente?.nome} ({c.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* Texto da transcrição */}
              <div style={styles.field}>
                <label style={styles.label}>Texto da transcrição</label>
                <textarea
                  style={styles.textarea}
                  placeholder="Cole aqui o texto da transcrição do Google Meet, Teams, etc.&#10;&#10;Exemplo:&#10;Atendente: Olá, bom dia!&#10;Cliente: Bom dia, estava querendo saber sobre o ERP..."
                  value={form.textoTranscricao}
                  onChange={e => setForm(f => ({ ...f, textoTranscricao: e.target.value }))}
                  rows={10}
                />
                <div style={styles.charCount}>
                  {form.textoTranscricao.length} caracteres
                </div>
              </div>

              {/* Erro */}
              {erro && (
                <div style={styles.erroBox}>{erro}</div>
              )}

              {/* Botão */}
              <button
                type="submit"
                className="btn-primary"
                disabled={enviando}
                style={{ width: '100%', padding: '12px', fontSize: 14, opacity: enviando ? 0.7 : 1 }}
              >
                {enviando ? '⏳ Processando com IA...' : '🤖 Processar com IA'}
              </button>
            </form>
          </div>

          {/* RESULTADO DA IA */}
          {resultado && (
            <div className="card fade-in" style={styles.resultadoCard}>
              <p className="section-title">✅ Resultado da IA</p>

              <div style={styles.resultadoItem}>
                <span style={styles.resultadoLabel}>Resumo</span>
                <p style={styles.resultadoTexto}>{resultado.resumoIa}</p>
              </div>

              <div style={styles.resultadoItem}>
                <span style={styles.resultadoLabel}>Pontos-chave</span>
                <p style={styles.resultadoTexto}>{resultado.pontosChave}</p>
              </div>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <div style={styles.resultadoItem}>
                  <span style={styles.resultadoLabel}>Sentimento</span>
                  <span className={`badge sentimento-${resultado.sentimento?.toLowerCase()}`}
                    style={{ padding: '4px 12px', borderRadius: 20, fontSize: 12 }}>
                    {resultado.sentimento}
                  </span>
                </div>
                {resultado.produtosCitados && (
                  <div style={styles.resultadoItem}>
                    <span style={styles.resultadoLabel}>Produtos citados</span>
                    <span className="badge badge-azul">{resultado.produtosCitados}</span>
                  </div>
                )}
              </div>

              {resultado.proximasAcoes && (
                <div style={styles.acaoBox}>
                  <span style={{ fontSize: 11, color: 'var(--azul-claro)', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    Próxima ação
                  </span>
                  <p style={{ color: 'var(--text-primary)', fontSize: 13, marginTop: 6 }}>
                    {resultado.proximasAcoes}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: LISTA DE TRANSCRIÇÕES */}
        <div>
          <p className="section-title">Histórico de Transcrições</p>

          {carregando ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 90, marginBottom: 10, borderRadius: 10 }} />
            ))
          ) : transcricoes.length === 0 ? (
            <div style={styles.vazio}>Nenhuma transcrição encontrada</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {transcricoes.map(t => (
                <TranscricaoItem key={t.idTranscricao} t={t} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Item da lista de transcrições
function TranscricaoItem({ t }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div
      className="card"
      style={{ cursor: 'pointer', padding: '14px 16px' }}
      onClick={() => setExpandido(!expandido)}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>
            {t.chamada?.cliente?.nome || `Transcrição #${t.idTranscricao}`}
          </span>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {t.dataProcessamento
              ? new Date(t.dataProcessamento).toLocaleString('pt-BR')
              : '—'}
          </div>
        </div>
        <span className={`badge sentimento-${t.sentimento?.toLowerCase()}`}
          style={{ fontSize: 10, padding: '2px 8px', borderRadius: 20, flexShrink: 0 }}>
          {t.sentimento}
        </span>
      </div>

      {/* Resumo */}
      <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
        {t.resumoIa?.substring(0, expandido ? 9999 : 100)}
        {!expandido && t.resumoIa?.length > 100 ? '...' : ''}
      </p>

      {/* Conteúdo expandido */}
      {expandido && (
        <div style={{ marginTop: 10, borderTop: '1px solid var(--border)', paddingTop: 10 }}>
          {t.pontosChave && (
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 10, color: 'var(--azul-claro)', fontWeight: 700, fontFamily: 'var(--font-display)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Pontos-chave
              </span>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{t.pontosChave}</p>
            </div>
          )}
          {t.proximasAcoes && (
            <div style={{ padding: '6px 10px', background: 'var(--azul-glow)', borderRadius: 6 }}>
              <span style={{ fontSize: 10, color: 'var(--azul-claro)', fontWeight: 700 }}>PRÓXIMA AÇÃO: </span>
              <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{t.proximasAcoes}</span>
            </div>
          )}
        </div>
      )}

      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 8, textAlign: 'right' }}>
        {expandido ? '▲ recolher' : '▼ expandir'}
      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    alignItems: 'start',
  },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  field: { display: 'flex', flexDirection: 'column', gap: 6 },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: 'var(--font-display)',
  },
  select: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    padding: '10px 12px',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
  },
  textarea: {
    background: 'var(--bg-surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-primary)',
    padding: '12px 14px',
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.6,
    transition: 'border-color 0.2s',
  },
  charCount: {
    fontSize: 10,
    color: 'var(--text-muted)',
    textAlign: 'right',
    marginTop: 2,
  },
  erroBox: {
    background: 'var(--vermelho-bg)',
    border: '1px solid rgba(255,77,106,0.3)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 14px',
    color: 'var(--vermelho)',
    fontSize: 12,
  },
  resultadoCard: {
    border: '1px solid var(--border-accent)',
    background: 'rgba(0,87,255,0.03)',
  },
  resultadoItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    marginBottom: 12,
  },
  resultadoLabel: {
    fontSize: 10,
    fontWeight: 700,
    color: 'var(--azul-claro)',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontFamily: 'var(--font-display)',
  },
  resultadoTexto: {
    fontSize: 13,
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
  acaoBox: {
    background: 'var(--azul-glow)',
    border: '1px solid var(--border-accent)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 14px',
    marginTop: 8,
  },
  vazio: {
    textAlign: 'center',
    padding: '40px 0',
    color: 'var(--text-muted)',
    fontSize: 13,
  },
};
