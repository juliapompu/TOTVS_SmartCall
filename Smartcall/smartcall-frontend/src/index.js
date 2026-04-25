// ============================================================
// index.js - Ponto de entrada do React
// Monta o componente App dentro do div#root do index.html
// ============================================================

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
