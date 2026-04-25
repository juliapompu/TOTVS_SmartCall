// ============================================================
// App.jsx - Componente raiz da aplicação
//
// Define as rotas do React Router:
// / .................. Dashboard (página inicial)
// /clientes .......... Lista de clientes
// /chamadas .......... Gerenciamento de chamadas
// /transcricoes ...... Transcrições e processamento de IA
// /sobre ............. Página institucional
// ============================================================

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

import Header     from './components/Header';
import Dashboard  from './pages/Dashboard';
import Clientes   from './pages/Clientes';
import Chamadas   from './pages/Chamadas';
import Transcricoes from './pages/Transcricoes';
import Sobre      from './pages/Sobre';

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">

        {/* Cabeçalho fixo em todas as páginas */}
        <Header />

        {/* Conteúdo principal — troca conforme a rota */}
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/"             element={<Dashboard />} />
            <Route path="/clientes"     element={<Clientes />} />
            <Route path="/chamadas"     element={<Chamadas />} />
            <Route path="/transcricoes" element={<Transcricoes />} />
            <Route path="/sobre"        element={<Sobre />} />

            {/* Rota 404 - redireciona para dashboard */}
            <Route path="*" element={<Dashboard />} />
          </Routes>
        </main>

        {/* Rodapé simples */}
        <footer style={styles.footer}>
          <span>TOTVS SmartCall © 2025</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span>Challenge FIAP</span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ color: 'var(--text-muted)' }}>Desenvolvido pelo Grupo</span>
        </footer>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  footer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    padding: '20px 32px',
    borderTop: '1px solid var(--border)',
    fontSize: 12,
    color: 'var(--text-secondary)',
    fontFamily: 'var(--font-body)',
  },
};
