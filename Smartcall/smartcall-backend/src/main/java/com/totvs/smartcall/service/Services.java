package com.totvs.smartcall.service;

import com.totvs.smartcall.model.*;
import com.totvs.smartcall.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

// ============================================================
// SERVICES - Camada de regras de negócio
// Fica entre o Controller (recebe requisição) e o Repository (acessa banco)
// ============================================================

// ------------------------------------------------------------
// ClienteService
// ------------------------------------------------------------
@Service
class ClienteService {

    @Autowired
    private ClienteRepository clienteRepository;

    /** Retorna todos os clientes ativos */
    public List<Cliente> listarAtivos() {
        return clienteRepository.findByAtivo(1);
    }

    /** Busca cliente por ID */
    public Optional<Cliente> buscarPorId(Long id) {
        return clienteRepository.findById(id);
    }

    /** Busca clientes pelo nome */
    public List<Cliente> buscarPorNome(String nome) {
        return clienteRepository.findByNomeContainingIgnoreCase(nome);
    }

    /** Top 5 clientes por valor de contrato (para dashboard) */
    public List<Cliente> top5Clientes() {
        return clienteRepository.findTop5ClientesPorValor();
    }

    /** Salva ou atualiza um cliente */
    public Cliente salvar(Cliente cliente) {
        return clienteRepository.save(cliente);
    }
}

// ------------------------------------------------------------
// AtendenteService
// ------------------------------------------------------------
@Service
class AtendenteService {

    @Autowired
    private AtendenteRepository atendenteRepository;

    public List<Atendente> listarAtivos() {
        return atendenteRepository.findByAtivo(1);
    }

    public Optional<Atendente> buscarPorId(Long id) {
        return atendenteRepository.findById(id);
    }
}

// ------------------------------------------------------------
// ProdutoService
// ------------------------------------------------------------
@Service
class ProdutoService {

    @Autowired
    private ProdutoRepository produtoRepository;

    public List<Produto> listarAtivos() {
        return produtoRepository.findByAtivo(1);
    }

    /** Top 5 produtos mais vendidos (para dashboard) */
    public List<Produto> top5Produtos() {
        return produtoRepository.findTop5ProdutosMaisVendidos();
    }
}

// ------------------------------------------------------------
// ChamadaService
// ------------------------------------------------------------
@Service
class ChamadaService {

    @Autowired
    private ChamadaRepository chamadaRepository;

    /** Retorna chamadas ativas para a faixa horizontal do dashboard */
    public List<Chamada> buscarChamadasAtivas() {
        return chamadaRepository.findByStatusInOrderByDataChamadaAsc(
                List.of("EM_ANDAMENTO", "AGENDADA")
        );
    }

    /** Retorna todas as chamadas de um cliente */
    public List<Chamada> buscarPorCliente(Long idCliente) {
        return chamadaRepository.findByClienteIdClienteOrderByDataChamadaDesc(idCliente);
    }

    /** Retorna chamadas por status */
    public List<Chamada> buscarPorStatus(String status) {
        return chamadaRepository.findByStatusOrderByDataChamadaDesc(status);
    }

    public Optional<Chamada> buscarPorId(Long id) {
        return chamadaRepository.findById(id);
    }

    public Chamada salvar(Chamada chamada) {
        return chamadaRepository.save(chamada);
    }

    /** Atualiza apenas o status de uma chamada */
    public Chamada atualizarStatus(Long id, String novoStatus) {
        Chamada chamada = chamadaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Chamada não encontrada: " + id));
        chamada.setStatus(novoStatus);
        return chamadaRepository.save(chamada);
    }
}

// ------------------------------------------------------------
// TranscricaoService
// ------------------------------------------------------------
@Service
class TranscricaoService {

    @Autowired
    private TranscricaoRepository transcricaoRepository;

    @Autowired
    private ChamadaRepository chamadaRepository;

    @Autowired
    private IaService iaService; // Serviço de IA injetado aqui

    /**
     * Processa uma transcrição:
     * 1. Busca a chamada correspondente
     * 2. Envia o texto para a IA processar
     * 3. Salva o resultado no banco
     * 4. Retorna a transcrição salva
     */
    public Transcricao processarESalvar(Long idChamada, String textoTranscricao) {
        // Busca a chamada no banco
        Chamada chamada = chamadaRepository.findById(idChamada)
                .orElseThrow(() -> new RuntimeException("Chamada não encontrada: " + idChamada));

        // Envia para a IA processar
        Map<String, String> resultadoIa = iaService.processarTranscricao(textoTranscricao);

        // Monta o objeto Transcricao com os dados da IA
        Transcricao transcricao = new Transcricao();
        transcricao.setChamada(chamada);
        transcricao.setTextoCompleto(textoTranscricao);
        transcricao.setResumoIa(resultadoIa.get("resumo"));
        transcricao.setPontosChave(resultadoIa.get("pontosChave"));
        transcricao.setSentimento(resultadoIa.get("sentimento"));
        transcricao.setProdutosCitados(resultadoIa.get("produtosCitados"));
        transcricao.setProximasAcoes(resultadoIa.get("proximasAcoes"));
        transcricao.setDataProcessamento(LocalDateTime.now());

        // Salva no banco e retorna
        return transcricaoRepository.save(transcricao);
    }

    /** Últimas 10 transcrições para o dashboard */
    public List<Transcricao> buscarUltimas() {
        return transcricaoRepository.findUltimasTranscricoes();
    }

    /** Transcrições de um cliente específico */
    public List<Transcricao> buscarPorCliente(Long idCliente) {
        return transcricaoRepository.findByClienteId(idCliente);
    }

    public Optional<Transcricao> buscarPorId(Long id) {
        return transcricaoRepository.findById(id);
    }
}

// ------------------------------------------------------------
// ProdutoClienteService
// ------------------------------------------------------------
@Service
class ProdutoClienteService {

    @Autowired
    private ProdutoClienteRepository produtoClienteRepository;

    /** Todos os produtos de um cliente (comprados + interesse) */
    public List<ProdutoCliente> buscarPorCliente(Long idCliente) {
        return produtoClienteRepository.findByClienteIdCliente(idCliente);
    }

    /** Apenas produtos comprados de um cliente */
    public List<ProdutoCliente> buscarCompradosPorCliente(Long idCliente) {
        return produtoClienteRepository.findByClienteIdClienteAndTipo(idCliente, "COMPRADO");
    }
}
