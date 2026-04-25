// ============================================================
// Sobre.jsx - Página institucional do SmartCall
// ============================================================

import React from 'react';

const features = [
  { icon: '🎙️', titulo: 'Transcrição Automática',    desc: 'Captura e transcreve chamadas do Google Meet e Teams automaticamente, sem intervenção manual.' },
  { icon: '🤖', titulo: 'Análise por IA',             desc: 'Nossa IA extrai pontos-chave, identifica o sentimento da conversa e sugere as próximas ações.' },
  { icon: '🗄️', titulo: 'Integrado ao banco TOTVS',  desc: 'Conectado nativamente ao banco de dados da TOTVS, eliminando a necessidade de integrações externas.' },
  { icon: '📊', titulo: 'Dashboard Inteligente',      desc: 'Visualize Top 5 clientes, produtos mais vendidos e transcrições recentes em tempo real.' },
  { icon: '🔍', titulo: 'Busca Dinâmica de Clientes', desc: 'Encontre qualquer cliente com histórico completo de chamadas, produtos e transcrições em segundos.' },
  { icon: '📡', titulo: 'Monitoramento ao Vivo',      desc: 'Acompanhe chamadas em andamento e agendadas diretamente no dashboard, em tempo real.' },
];

const equipe = [
  { nome: 'Pompeu',              cargo: 'Tech Lead / Backend',    foto: 'https://randomuser.me/api/portraits/men/11.jpg' },
  { nome: 'Giovana Parreira',    cargo: 'UX & Pesquisa',          foto: 'https://randomuser.me/api/portraits/women/21.jpg' },
  { nome: 'Luiz Filipe Dalboni', cargo: 'IA & Data',              foto: 'https://randomuser.me/api/portraits/men/31.jpg' },
  { nome: 'Antonio Ferreira',    cargo: 'Frontend & Produto',     foto: 'https://randomuser.me/api/portraits/men/41.jpg' },
];

export default function Sobre() {
  return (
    <div className="page-content fade-in">

      {/* HERO */}
      <div style={styles.hero}>
        <div style={styles.heroBadge}>Challenge FIAP × TOTVS · 2025</div>
        <h1 style={styles.heroTitulo}>
          TOTVS <span style={{ color: 'var(--azul-totvs)' }}>SmartCall</span>
        </h1>
        <p style={styles.heroDesc}>
          Solução inteligente de transcrição e análise de chamadas comerciais,
          desenvolvida para eliminar a perda de dados e potencializar a inteligência
          comercial da TOTVS.
        </p>

        {/* Stack tecnológico */}
        <div style={styles.stackRow}>
          {['React', 'Java Spring Boot', 'Oracle SQL', 'OpenAI / Gemini'].map(tech => (
            <span key={tech} className="badge badge-azul" style={{ fontSize: 12, padding: '5px 14px' }}>
              {tech}
            </span>
          ))}
        </div>
      </div>

      <hr className="divider" style={{ margin: '32px 0' }} />

      {/* FUNCIONALIDADES */}
      <section style={{ marginBottom: 48 }}>
        <p className="section-title">O que o SmartCall resolve</p>
        <div style={styles.featGrid}>
          {features.map(f => (
            <div className="card" key={f.titulo} style={styles.featCard}>
              <div style={styles.featIcon}>{f.icon}</div>
              <h3 style={{ fontSize: 14, marginBottom: 6 }}>{f.titulo}</h3>
              <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROBLEMA & SOLUÇÃO */}
      <section style={{ marginBottom: 48 }}>
        <p className="section-title">Problema & Solução</p>
        <div style={styles.ps}>
          <div className="card" style={{ borderColor: 'rgba(255,77,106,0.3)' }}>
            <h3 style={{ color: 'var(--vermelho)', marginBottom: 12, fontSize: 14 }}>😟 Dores identificadas na TOTVS</h3>
            {[
              'Perda constante de dados transcritos de chamadas com clientes',
              'Tempo excessivo para localizar informações analíticas de chamadas',
              'Transcrições dispersas e sem vínculo com o histórico do cliente',
              'Falta de organização sobre perfil e produtos de cada cliente',
            ].map(d => (
              <div key={d} style={styles.dor}>
                <span style={{ color: 'var(--vermelho)' }}>✕</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{d}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ borderColor: 'rgba(0,229,160,0.3)' }}>
            <h3 style={{ color: 'var(--verde)', marginBottom: 12, fontSize: 14 }}>✅ O que o SmartCall entrega</h3>
            {[
              'Transcrições automáticas salvas e organizadas por cliente',
              'Busca instantânea de qualquer conversa ou dado de cliente',
              'Histórico completo vinculado ao perfil de cada cliente',
              'Dashboard inteligente com rankings e alertas em tempo real',
            ].map(s => (
              <div key={s} style={styles.dor}>
                <span style={{ color: 'var(--verde)' }}>✓</span>
                <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section>
        <p className="section-title">Equipe do projeto</p>
        <div style={styles.equipeGrid}>
          {equipe.map(m => (
            <div className="card" key={m.nome} style={styles.membroCard}>
              <img src={m.foto} alt={m.nome} className="avatar"
                style={{ width: 56, height: 56, marginBottom: 10, border: '2px solid var(--azul-totvs)' }} />
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14, marginBottom: 4 }}>
                {m.nome}
              </div>
              <span className="badge badge-azul" style={{ fontSize: 10 }}>{m.cargo}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

const styles = {
  hero: { textAlign: 'center', padding: '40px 0 8px', maxWidth: 640, margin: '0 auto' },
  heroBadge: {
    display: 'inline-block', marginBottom: 16,
    background: 'var(--azul-glow)', border: '1px solid var(--border-accent)',
    borderRadius: 20, padding: '5px 16px', fontSize: 12,
    color: 'var(--azul-claro)', fontFamily: 'var(--font-display)', fontWeight: 700,
  },
  heroTitulo: { fontSize: '2.5rem', fontFamily: 'var(--font-display)', marginBottom: 16 },
  heroDesc: { fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 },
  stackRow: { display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 },
  featCard: { display: 'flex', flexDirection: 'column' },
  featIcon: { fontSize: 28, marginBottom: 10 },
  ps: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 },
  dor: { display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 },
  equipeGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 14 },
  membroCard: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '20px 16px' },
};
