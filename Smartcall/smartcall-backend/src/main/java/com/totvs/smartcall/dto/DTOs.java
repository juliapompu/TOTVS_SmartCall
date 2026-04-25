package com.totvs.smartcall.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.List;

// ============================================================
// DTOs (Data Transfer Objects)
// São objetos simples usados para transferir dados entre
// o backend e o frontend, evitando expor toda a entidade.
// ============================================================

// ------------------------------------------------------------
// DTO: Resposta padrão da API
// Todas as respostas seguem esse padrão { sucesso, mensagem, dados }
// ------------------------------------------------------------
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponseDTO<T> {
    private boolean sucesso;
    private String mensagem;
    private T dados;

    // Método estático para resposta de sucesso
    public static <T> ApiResponseDTO<T> ok(T dados) {
        return new ApiResponseDTO<>(true, "OK", dados);
    }

    // Método estático para resposta de erro
    public static <T> ApiResponseDTO<T> erro(String mensagem) {
        return new ApiResponseDTO<>(false, mensagem, null);
    }
}

// ------------------------------------------------------------
// DTO: Chamada resumida (para a faixa horizontal do dashboard)
// ------------------------------------------------------------
@Data
@AllArgsConstructor
@NoArgsConstructor
class ChamadaResumoDTO {
    private Long idChamada;
    private String nomeCliente;
    private String empresaCliente;
    private String fotoCliente;
    private String nomeAtendente;
    private String fotoAtendente;
    private String cargoAtendente;
    private LocalDateTime dataChamada;
    private String status;        // AGENDADA, EM_ANDAMENTO, CONCLUIDA
    private String plataforma;
    private String observacoes;
    private Integer duracaoMin;
}

// ------------------------------------------------------------
// DTO: Perfil completo do cliente (para o card de cliente)
// ------------------------------------------------------------
@Data
@AllArgsConstructor
@NoArgsConstructor
class ClientePerfilDTO {
    private Long idCliente;
    private String nome;
    private String email;
    private String telefone;
    private String empresa;
    private String segmento;
    private String fotoUrl;
    private LocalDate dataCadastro;
    private LocalDateTime ultimaChamada;
    private Integer totalChamadas;
    private List<ProdutoClienteDTO> produtos;        // Produtos comprados e de interesse
    private List<TranscricaoResumoDTO> transcricoes; // Últimas transcrições
}

// ------------------------------------------------------------
// DTO: Produto do cliente
// ------------------------------------------------------------
@Data
@AllArgsConstructor
@NoArgsConstructor
class ProdutoClienteDTO {
    private Long idProduto;
    private String nomeProduto;
    private String categoria;
    private String tipo;              // COMPRADO ou INTERESSE
    private BigDecimal valorContrato;
    private LocalDate dataInicio;
}

// ------------------------------------------------------------
// DTO: Transcrição resumida (para cards do dashboard)
// ------------------------------------------------------------
@Data
@AllArgsConstructor
@NoArgsConstructor
class TranscricaoResumoDTO {
    private Long idTranscricao;
    private String nomeCliente;
    private String resumoIa;
    private String pontosChave;
    private String sentimento;        // POSITIVO, NEUTRO, NEGATIVO
    private String produtosCitados;
    private String proximasAcoes;
    private LocalDateTime dataProcessamento;
    private String plataforma;
}

// ------------------------------------------------------------
// DTO: Top 5 cliente para o dashboard
// ------------------------------------------------------------
@Data
@AllArgsConstructor
@NoArgsConstructor
class TopClienteDTO {
    private Long idCliente;
    private String nome;
    private String empresa;
    private String segmento;
    private String fotoUrl;
    private Integer totalProdutos;
    private BigDecimal valorTotal;
}

// ------------------------------------------------------------
// DTO: Top 5 produto para o dashboard
// ------------------------------------------------------------
@Data
@AllArgsConstructor
@NoArgsConstructor
class TopProdutoDTO {
    private Long idProduto;
    private String nome;
    private String categoria;
    private Integer totalVendas;
    private BigDecimal receitaTotal;
}

// ------------------------------------------------------------
// DTO: Requisição de processamento de transcrição pela IA
// O frontend envia o texto e o ID da chamada
// ------------------------------------------------------------
@Data
@AllArgsConstructor
@NoArgsConstructor
class ProcessarTranscricaoRequestDTO {
    private Long idChamada;
    private String textoTranscricao; // Texto bruto vindo do Meet/Teams
}

// ------------------------------------------------------------
// DTO: Resposta da IA após processar a transcrição
// ------------------------------------------------------------
@Data
@AllArgsConstructor
@NoArgsConstructor
class IaResultadoDTO {
    private String resumo;
    private String pontosChave;
    private String sentimento;
    private String produtosCitados;
    private String proximasAcoes;
}
