package com.totvs.smartcall.controller;

import com.totvs.smartcall.dto.ApiResponseDTO;
import com.totvs.smartcall.model.*;
import com.totvs.smartcall.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

// ============================================================
// CONTROLLERS - Camada de entrada da API REST
// Recebe as requisições HTTP do React e devolve JSON
// Todas as rotas começam com /api/
// ============================================================

// ------------------------------------------------------------
// ClienteController
// BASE URL: /api/clientes
// ------------------------------------------------------------
@RestController
@RequestMapping("/api/clientes")
class ClienteController {

    @Autowired
    private ClienteService clienteService;

    /**
     * GET /api/clientes
     * Lista todos os clientes ativos.
     * Usado na grade de clientes na parte inferior do dashboard.
     */
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<Cliente>>> listar() {
        List<Cliente> clientes = clienteService.listarAtivos();
        return ResponseEntity.ok(ApiResponseDTO.ok(clientes));
    }

    /**
     * GET /api/clientes/{id}
     * Busca um cliente pelo ID.
     * Usado ao clicar em um card de cliente para abrir o perfil completo.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Cliente>> buscarPorId(@PathVariable Long id) {
        return clienteService.buscarPorId(id)
                .map(c -> ResponseEntity.ok(ApiResponseDTO.ok(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/clientes/buscar?nome=Magazine
     * Busca clientes pelo nome (pesquisa dinâmica).
     * Usado na barra de pesquisa do frontend.
     */
    @GetMapping("/buscar")
    public ResponseEntity<ApiResponseDTO<List<Cliente>>> buscarPorNome(@RequestParam String nome) {
        List<Cliente> clientes = clienteService.buscarPorNome(nome);
        return ResponseEntity.ok(ApiResponseDTO.ok(clientes));
    }

    /**
     * GET /api/clientes/top5
     * Retorna os 5 clientes com maior valor de contrato.
     * Usado no card "TOP 5 CLIENTES" do dashboard.
     */
    @GetMapping("/top5")
    public ResponseEntity<ApiResponseDTO<List<Cliente>>> top5() {
        List<Cliente> clientes = clienteService.top5Clientes();
        return ResponseEntity.ok(ApiResponseDTO.ok(clientes));
    }

    /**
     * POST /api/clientes
     * Cria um novo cliente.
     */
    @PostMapping
    public ResponseEntity<ApiResponseDTO<Cliente>> criar(@RequestBody Cliente cliente) {
        Cliente salvo = clienteService.salvar(cliente);
        return ResponseEntity.ok(ApiResponseDTO.ok(salvo));
    }

    /**
     * PUT /api/clientes/{id}
     * Atualiza dados de um cliente existente.
     */
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Cliente>> atualizar(
            @PathVariable Long id,
            @RequestBody Cliente clienteAtualizado) {
        return clienteService.buscarPorId(id).map(c -> {
            clienteAtualizado.setIdCliente(id);
            Cliente salvo = clienteService.salvar(clienteAtualizado);
            return ResponseEntity.ok(ApiResponseDTO.ok(salvo));
        }).orElse(ResponseEntity.notFound().build());
    }
}

// ------------------------------------------------------------
// AtendenteController
// BASE URL: /api/atendentes
// ------------------------------------------------------------
@RestController
@RequestMapping("/api/atendentes")
class AtendenteController {

    @Autowired
    private AtendenteService atendenteService;

    /**
     * GET /api/atendentes
     * Lista todos os atendentes ativos.
     */
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<Atendente>>> listar() {
        return ResponseEntity.ok(ApiResponseDTO.ok(atendenteService.listarAtivos()));
    }

    /**
     * GET /api/atendentes/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Atendente>> buscarPorId(@PathVariable Long id) {
        return atendenteService.buscarPorId(id)
                .map(a -> ResponseEntity.ok(ApiResponseDTO.ok(a)))
                .orElse(ResponseEntity.notFound().build());
    }
}

// ------------------------------------------------------------
// ProdutoController
// BASE URL: /api/produtos
// ------------------------------------------------------------
@RestController
@RequestMapping("/api/produtos")
class ProdutoController {

    @Autowired
    private ProdutoService produtoService;

    /**
     * GET /api/produtos
     * Lista todos os produtos ativos.
     */
    @GetMapping
    public ResponseEntity<ApiResponseDTO<List<Produto>>> listar() {
        return ResponseEntity.ok(ApiResponseDTO.ok(produtoService.listarAtivos()));
    }

    /**
     * GET /api/produtos/top5
     * Top 5 produtos mais vendidos para o dashboard.
     */
    @GetMapping("/top5")
    public ResponseEntity<ApiResponseDTO<List<Produto>>> top5() {
        return ResponseEntity.ok(ApiResponseDTO.ok(produtoService.top5Produtos()));
    }
}

// ------------------------------------------------------------
// ChamadaController
// BASE URL: /api/chamadas
// ------------------------------------------------------------
@RestController
@RequestMapping("/api/chamadas")
class ChamadaController {

    @Autowired
    private ChamadaService chamadaService;

    /**
     * GET /api/chamadas/ativas
     * Retorna chamadas AGENDADAS e EM_ANDAMENTO.
     * Usado na faixa horizontal do dashboard (ao vivo).
     */
    @GetMapping("/ativas")
    public ResponseEntity<ApiResponseDTO<List<Chamada>>> ativas() {
        return ResponseEntity.ok(ApiResponseDTO.ok(chamadaService.buscarChamadasAtivas()));
    }

    /**
     * GET /api/chamadas/cliente/{idCliente}
     * Histórico de chamadas de um cliente.
     * Usado no card de perfil do cliente.
     */
    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<ApiResponseDTO<List<Chamada>>> porCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(ApiResponseDTO.ok(chamadaService.buscarPorCliente(idCliente)));
    }

    /**
     * GET /api/chamadas/{id}
     * Detalhes de uma chamada específica.
     * Usado ao clicar em um card na faixa horizontal.
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Chamada>> buscarPorId(@PathVariable Long id) {
        return chamadaService.buscarPorId(id)
                .map(c -> ResponseEntity.ok(ApiResponseDTO.ok(c)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/chamadas
     * Cria/agenda uma nova chamada.
     */
    @PostMapping
    public ResponseEntity<ApiResponseDTO<Chamada>> criar(@RequestBody Chamada chamada) {
        return ResponseEntity.ok(ApiResponseDTO.ok(chamadaService.salvar(chamada)));
    }

    /**
     * PATCH /api/chamadas/{id}/status
     * Atualiza apenas o status de uma chamada.
     * Exemplo body: { "status": "EM_ANDAMENTO" }
     * Usado para marcar uma chamada como iniciada ou concluída.
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<ApiResponseDTO<Chamada>> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        String novoStatus = body.get("status");
        Chamada atualizada = chamadaService.atualizarStatus(id, novoStatus);
        return ResponseEntity.ok(ApiResponseDTO.ok(atualizada));
    }
}

// ------------------------------------------------------------
// TranscricaoController
// BASE URL: /api/transcricoes
// ------------------------------------------------------------
@RestController
@RequestMapping("/api/transcricoes")
class TranscricaoController {

    @Autowired
    private TranscricaoService transcricaoService;

    /**
     * GET /api/transcricoes/recentes
     * Últimas 10 transcrições processadas.
     * Usado no card "TRANSCRIÇÕES MAIS RECENTES" do dashboard.
     */
    @GetMapping("/recentes")
    public ResponseEntity<ApiResponseDTO<List<Transcricao>>> recentes() {
        return ResponseEntity.ok(ApiResponseDTO.ok(transcricaoService.buscarUltimas()));
    }

    /**
     * GET /api/transcricoes/cliente/{idCliente}
     * Todas as transcrições de um cliente.
     * Usado no card de perfil do cliente.
     */
    @GetMapping("/cliente/{idCliente}")
    public ResponseEntity<ApiResponseDTO<List<Transcricao>>> porCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(ApiResponseDTO.ok(transcricaoService.buscarPorCliente(idCliente)));
    }

    /**
     * GET /api/transcricoes/{id}
     * Detalhes de uma transcrição (inclui texto completo).
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponseDTO<Transcricao>> buscarPorId(@PathVariable Long id) {
        return transcricaoService.buscarPorId(id)
                .map(t -> ResponseEntity.ok(ApiResponseDTO.ok(t)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/transcricoes/processar
     * Envia uma transcrição para a IA processar e salva no banco.
     *
     * Body esperado:
     * {
     *   "idChamada": 1,
     *   "textoTranscricao": "Atendente: Olá... Cliente: Bom dia..."
     * }
     *
     * Este é o endpoint principal que conecta tudo:
     * React → Java → IA → Banco Oracle
     */
    @PostMapping("/processar")
    public ResponseEntity<ApiResponseDTO<Transcricao>> processar(@RequestBody Map<String, Object> body) {
        Long idChamada = Long.valueOf(body.get("idChamada").toString());
        String texto = (String) body.get("textoTranscricao");

        Transcricao resultado = transcricaoService.processarESalvar(idChamada, texto);
        return ResponseEntity.ok(ApiResponseDTO.ok(resultado));
    }
}

// ------------------------------------------------------------
// ProdutoClienteController
// BASE URL: /api/produtos-cliente
// ------------------------------------------------------------
@RestController
@RequestMapping("/api/produtos-cliente")
class ProdutoClienteController {

    @Autowired
    private ProdutoClienteService produtoClienteService;

    /**
     * GET /api/produtos-cliente/{idCliente}
     * Todos os produtos de um cliente (comprados e com interesse).
     * Usado no card de perfil do cliente.
     */
    @GetMapping("/{idCliente}")
    public ResponseEntity<ApiResponseDTO<List<ProdutoCliente>>> porCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(ApiResponseDTO.ok(produtoClienteService.buscarPorCliente(idCliente)));
    }

    /**
     * GET /api/produtos-cliente/{idCliente}/comprados
     * Apenas produtos comprados de um cliente.
     */
    @GetMapping("/{idCliente}/comprados")
    public ResponseEntity<ApiResponseDTO<List<ProdutoCliente>>> compradosPorCliente(@PathVariable Long idCliente) {
        return ResponseEntity.ok(ApiResponseDTO.ok(produtoClienteService.buscarCompradosPorCliente(idCliente)));
    }
}

// ------------------------------------------------------------
// DashboardController
// BASE URL: /api/dashboard
// Um endpoint único que retorna todos os dados do dashboard de uma vez
// Isso evita que o React precise fazer 5 chamadas separadas ao carregar a página
// ------------------------------------------------------------
@RestController
@RequestMapping("/api/dashboard")
class DashboardController {

    @Autowired
    private ClienteService clienteService;

    @Autowired
    private ProdutoService produtoService;

    @Autowired
    private ChamadaService chamadaService;

    @Autowired
    private TranscricaoService transcricaoService;

    /**
     * GET /api/dashboard
     * Retorna todos os dados necessários para o dashboard em uma única chamada.
     * O React chama este endpoint ao carregar a página inicial.
     */
    @GetMapping
    public ResponseEntity<ApiResponseDTO<Map<String, Object>>> dashboard() {
        Map<String, Object> dados = Map.of(
                "chamadasAtivas",     chamadaService.buscarChamadasAtivas(),
                "top5Clientes",       clienteService.top5Clientes(),
                "top5Produtos",       produtoService.top5Produtos(),
                "transcricoesRecentes", transcricaoService.buscarUltimas()
        );
        return ResponseEntity.ok(ApiResponseDTO.ok(dados));
    }
}
