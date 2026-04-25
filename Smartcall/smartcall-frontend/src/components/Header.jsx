// ============================================================
// Header.jsx - Cabeçalho fixo do site
//
// Contém: Logo SmartCall, links de navegação e avatar do usuário
// ============================================================

import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

// Logo da solução em SVG inline (baseado no "S" que você enviou)
const SmartCallLogo = () => (
  <svg width="32" height="32" viewBox="0 0 100 100" fill="none">
    <defs>
      <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#0057FF" />
        <stop offset="100%" stopColor="#00E5A0" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="48" fill="url(#logoGrad)" opacity="0.15" />
    <text x="50" y="67" textAnchor="middle" fontSize="56" fontWeight="800"
          fontFamily="Syne, sans-serif" fill="url(#logoGrad)">S</text>
  </svg>
);

// Links do menu de navegação
const navLinks = [
  { label: 'Dashboard',    path: '/' },
  { label: 'Clientes',     path: '/clientes' },
  { label: 'Chamadas',     path: '/chamadas' },
  { label: 'Transcrições', path: '/transcricoes' },
  { label: 'Sobre',        path: '/sobre' },
];

export default function Header() {
  const location = useLocation();
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <header style={styles.header}>
      {/* Linha de brilho no topo */}
      <div style={styles.topLine} />

      <div style={styles.inner}>
        {/* LOGO + NOME */}
        <Link to="/" style={styles.brand}>
          <SmartCallLogo />
          <div>
            <div style={styles.brandName}>SmartCall</div>
            <div style={styles.brandSub}>by TOTVS</div>
          </div>
        </Link>

        {/* NAVEGAÇÃO DESKTOP */}
        <nav style={styles.nav}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                ...styles.navLink,
                ...(location.pathname === link.path ? styles.navLinkActive : {}),
              }}
            >
              {link.label}
              {location.pathname === link.path && <span style={styles.navDot} />}
            </Link>
          ))}
        </nav>

        {/* AÇÕES DIREITA */}
        <div style={styles.actions}>
          {/* Indicador "ao vivo" */}
          <div style={styles.liveChip}>
            <span className="dot-live" />
            <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--verde)' }}>AO VIVO</span>
          </div>

          {/* Avatar do usuário logado */}
          <div style={styles.userAvatar}>
            <img
              src="https://randomuser.me/api/portraits/men/32.jpg"
              alt="Usuário"
              style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
            />
          </div>
        </div>

        {/* BOTÃO MENU MOBILE */}
        <button
          style={styles.menuBtn}
          onClick={() => setMenuAberto(!menuAberto)}
        >
          <div style={{ ...styles.menuLine, transform: menuAberto ? 'rotate(45deg) translateY(6px)' : 'none' }} />
          <div style={{ ...styles.menuLine, opacity: menuAberto ? 0 : 1 }} />
          <div style={{ ...styles.menuLine, transform: menuAberto ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
        </button>
      </div>

      {/* MENU MOBILE DROPDOWN */}
      {menuAberto && (
        <div style={styles.mobileMenu}>
          {navLinks.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={styles.mobileLink}
              onClick={() => setMenuAberto(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}

const styles = {
  header: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    background: 'rgba(10, 14, 26, 0.92)',
    backdropFilter: 'blur(16px)',
    borderBottom: '1px solid var(--border)',
  },
  topLine: {
    height: 2,
    background: 'linear-gradient(90deg, var(--azul-totvs), var(--verde), var(--azul-totvs))',
    backgroundSize: '200% 100%',
    animation: 'gradientShift 4s linear infinite',
  },
  inner: {
    maxWidth: 1440,
    margin: '0 auto',
    padding: '0 32px',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    gap: 32,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    textDecoration: 'none',
    flexShrink: 0,
  },
  brandName: {
    fontFamily: 'var(--font-display)',
    fontWeight: 800,
    fontSize: 16,
    color: 'var(--text-primary)',
    lineHeight: 1.1,
  },
  brandSub: {
    fontSize: 10,
    color: 'var(--text-muted)',
    fontFamily: 'var(--font-display)',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
  },
  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  navLink: {
    position: 'relative',
    padding: '6px 14px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
    fontFamily: 'var(--font-body)',
    fontWeight: 500,
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    transition: 'color 0.2s, background 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 2,
  },
  navLinkActive: {
    color: 'var(--text-primary)',
    background: 'var(--bg-surface)',
  },
  navDot: {
    position: 'absolute',
    bottom: 2,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 4,
    height: 4,
    borderRadius: '50%',
    background: 'var(--azul-totvs)',
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flexShrink: 0,
  },
  liveChip: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    padding: '4px 10px',
    background: 'var(--verde-bg)',
    border: '1px solid rgba(0,229,160,0.2)',
    borderRadius: 20,
  },
  userAvatar: {
    cursor: 'pointer',
    borderRadius: '50%',
    border: '2px solid var(--border-accent)',
  },
  menuBtn: {
    display: 'none',
    flexDirection: 'column',
    gap: 5,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
  },
  menuLine: {
    width: 22,
    height: 2,
    background: 'var(--text-primary)',
    borderRadius: 2,
    transition: 'all 0.2s',
  },
  mobileMenu: {
    display: 'flex',
    flexDirection: 'column',
    padding: '12px 24px 20px',
    gap: 4,
    borderTop: '1px solid var(--border)',
  },
  mobileLink: {
    padding: '10px 12px',
    color: 'var(--text-secondary)',
    textDecoration: 'none',
    borderRadius: 'var(--radius-sm)',
    fontSize: 14,
    fontFamily: 'var(--font-body)',
  },
};
