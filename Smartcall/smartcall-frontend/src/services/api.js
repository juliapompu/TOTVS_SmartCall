// ============================================================
// api.js - Serviço central de comunicação com o backend Java
//
// Todas as chamadas HTTP ao Spring Boot passam por aqui.
// Se precisar trocar a URL base, mude só o BASE_URL abaixo.
// ============================================================

import axios from 'axios';

// URL base do backend Spring Boot
// Em desenvolvimento: http://localhost:8080
const BASE_URL = 'http://localhost:8080/api';

// Cria instância do axios com configurações padrão
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000, // 15 segundos de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: loga erros no console durante desenvolvimento
api.interceptors.response.use(
  (response) => response.data, // Retorna direto o { sucesso, dados, mensagem }
  (error) => {
    console.error('Erro na API:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// ============================================================
// DASHBOARD
// ============================================================
export const dashboardAPI = {
  // GET /api/dashboard — busca todos os dados da home de uma vez
  buscarDados: () => api.get('/dashboard'),
};

// ============================================================
// CLIENTES
// ============================================================
export const clientesAPI = {
  // GET /api/clientes — lista todos os clientes ativos
  listar: () => api.get('/clientes'),

  // GET /api/clientes/:id — perfil completo de um cliente
  buscarPorId: (id) => api.get(`/clientes/${id}`),

  // GET /api/clientes/buscar?nome=X — pesquisa por nome
  buscarPorNome: (nome) => api.get(`/clientes/buscar?nome=${nome}`),

  // GET /api/clientes/top5 — top 5 para o dashboard
  top5: () => api.get('/clientes/top5'),

  // POST /api/clientes — cria novo cliente
  criar: (cliente) => api.post('/clientes', cliente),

  // PUT /api/clientes/:id — atualiza cliente
  atualizar: (id, cliente) => api.put(`/clientes/${id}`, cliente),
};

// ============================================================
// CHAMADAS
// ============================================================
export const chamadasAPI = {
  // GET /api/chamadas/ativas — faixa horizontal do dashboard
  ativas: () => api.get('/chamadas/ativas'),

  // GET /api/chamadas/:id — detalhes de uma chamada
  buscarPorId: (id) => api.get(`/chamadas/${id}`),

  // GET /api/chamadas/cliente/:idCliente — histórico do cliente
  porCliente: (idCliente) => api.get(`/chamadas/cliente/${idCliente}`),

  // POST /api/chamadas — agenda nova chamada
  criar: (chamada) => api.post('/chamadas', chamada),

  // PATCH /api/chamadas/:id/status — atualiza status
  atualizarStatus: (id, status) => api.patch(`/chamadas/${id}/status`, { status }),
};

// ============================================================
// TRANSCRIÇÕES
// ============================================================
export const transcricoesAPI = {
  // GET /api/transcricoes/recentes — últimas 10 transcrições
  recentes: () => api.get('/transcricoes/recentes'),

  // GET /api/transcricoes/:id — detalhes com texto completo
  buscarPorId: (id) => api.get(`/transcricoes/${id}`),

  // GET /api/transcricoes/cliente/:id — transcrições de um cliente
  porCliente: (idCliente) => api.get(`/transcricoes/cliente/${idCliente}`),

  // POST /api/transcricoes/processar — envia para IA processar
  // Body: { idChamada, textoTranscricao }
  processar: (idChamada, textoTranscricao) =>
    api.post('/transcricoes/processar', { idChamada, textoTranscricao }),
};

// ============================================================
// PRODUTOS
// ============================================================
export const produtosAPI = {
  listar: () => api.get('/produtos'),
  top5: () => api.get('/produtos/top5'),
};

// ============================================================
// PRODUTOS DO CLIENTE
// ============================================================
export const produtosClienteAPI = {
  porCliente: (idCliente) => api.get(`/produtos-cliente/${idCliente}`),
  compradosPorCliente: (idCliente) => api.get(`/produtos-cliente/${idCliente}/comprados`),
};

export default api;
