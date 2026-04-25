package com.totvs.smartcall.repository;

import com.totvs.smartcall.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

// ============================================================
// REPOSITORIES - Camada de acesso ao banco de dados
// O Spring gera automaticamente o SQL básico (findAll, findById, save, delete)
// Para consultas personalizadas usamos @Query com JPQL ou SQL nativo
// ============================================================

// ------------------------------------------------------------
// ClienteRepository
// ------------------------------------------------------------
@Repository
interface ClienteRepository extends JpaRepository<Cliente, Long> {

    // Busca clientes pelo nome (ignora maiúsculas/minúsculas)
    List<Cliente> findByNomeContainingIgnoreCase(String nome);

    // Busca clientes ativos
    List<Cliente> findByAtivo(Integer ativo);

    // Top 5 clientes com maior valor de contrato (para o dashboard)
    @Query(value = """
        SELECT c.* FROM CLIENTES c
        JOIN PRODUTOS_CLIENTE pc ON c.ID_CLIENTE = pc.ID_CLIENTE
        WHERE pc.TIPO = 'COMPRADO' AND c.ATIVO = 1
        GROUP BY c.ID_CLIENTE, c.NOME, c.EMAIL, c.TELEFONE,
                 c.EMPRESA, c.SEGMENTO, c.FOTO_URL, c.DATA_CADASTRO, c.ATIVO
        ORDER BY SUM(NVL(pc.VALOR_CONTRATO, 0)) DESC
        FETCH FIRST 5 ROWS ONLY
        """, nativeQuery = true)
    List<Cliente> findTop5ClientesPorValor();
}

// ------------------------------------------------------------
// AtendenteRepository
// ------------------------------------------------------------
@Repository
interface AtendenteRepository extends JpaRepository<Atendente, Long> {
    List<Atendente> findByAtivo(Integer ativo);
}

// ------------------------------------------------------------
// ProdutoRepository
// ------------------------------------------------------------
@Repository
interface ProdutoRepository extends JpaRepository<Produto, Long> {

    List<Produto> findByAtivo(Integer ativo);

    // Top 5 produtos mais vendidos
    @Query(value = """
        SELECT p.* FROM PRODUTOS p
        JOIN PRODUTOS_CLIENTE pc ON p.ID_PRODUTO = pc.ID_PRODUTO
        WHERE pc.TIPO = 'COMPRADO' AND p.ATIVO = 1
        GROUP BY p.ID_PRODUTO, p.NOME, p.DESCRICAO,
                 p.CATEGORIA, p.PRECO_MENSAL, p.ATIVO
        ORDER BY COUNT(pc.ID_PROD_CLI) DESC
        FETCH FIRST 5 ROWS ONLY
        """, nativeQuery = true)
    List<Produto> findTop5ProdutosMaisVendidos();
}

// ------------------------------------------------------------
// ChamadaRepository
// ------------------------------------------------------------
@Repository
interface ChamadaRepository extends JpaRepository<Chamada, Long> {

    // Busca chamadas em andamento e agendadas (para a faixa do dashboard)
    List<Chamada> findByStatusInOrderByDataChamadaAsc(List<String> statuses);

    // Busca todas as chamadas de um cliente específico
    List<Chamada> findByClienteIdClienteOrderByDataChamadaDesc(Long idCliente);

    // Busca chamadas por status
    List<Chamada> findByStatusOrderByDataChamadaDesc(String status);
}

// ------------------------------------------------------------
// TranscricaoRepository
// ------------------------------------------------------------
@Repository
interface TranscricaoRepository extends JpaRepository<Transcricao, Long> {

    // Busca transcrições de uma chamada específica
    List<Transcricao> findByChamadaIdChamada(Long idChamada);

    // Últimas 10 transcrições (para o card do dashboard)
    @Query(value = """
        SELECT t.* FROM TRANSCRICOES t
        ORDER BY t.DATA_PROCESSAMENTO DESC
        FETCH FIRST 10 ROWS ONLY
        """, nativeQuery = true)
    List<Transcricao> findUltimasTranscricoes();

    // Transcrições de um cliente específico (via chamada)
    @Query(value = """
        SELECT t.* FROM TRANSCRICOES t
        JOIN CHAMADAS ch ON t.ID_CHAMADA = ch.ID_CHAMADA
        WHERE ch.ID_CLIENTE = :idCliente
        ORDER BY t.DATA_PROCESSAMENTO DESC
        """, nativeQuery = true)
    List<Transcricao> findByClienteId(@Param("idCliente") Long idCliente);
}

// ------------------------------------------------------------
// ProdutoClienteRepository
// ------------------------------------------------------------
@Repository
interface ProdutoClienteRepository extends JpaRepository<ProdutoCliente, Long> {

    // Produtos de um cliente (comprados e com interesse)
    List<ProdutoCliente> findByClienteIdCliente(Long idCliente);

    // Apenas os comprados
    List<ProdutoCliente> findByClienteIdClienteAndTipo(Long idCliente, String tipo);
}
