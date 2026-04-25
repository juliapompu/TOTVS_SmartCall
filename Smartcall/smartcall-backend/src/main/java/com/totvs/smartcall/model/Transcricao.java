package com.totvs.smartcall.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * MODEL: Transcricao
 * Representa a tabela TRANSCRICOES do banco Oracle.
 * Armazena o texto completo e o resultado do processamento da IA.
 */
@Data
@Entity
@Table(name = "TRANSCRICOES")
public class Transcricao {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_transcricoes")
    @SequenceGenerator(name = "seq_transcricoes", sequenceName = "SEQ_TRANSCRICOES", allocationSize = 1)
    @Column(name = "ID_TRANSCRICAO")
    private Long idTranscricao;

    // Relacionamento com Chamada
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_CHAMADA", nullable = false)
    private Chamada chamada;

    // Texto completo da transcrição (CLOB no Oracle = texto muito longo)
    @Lob
    @Column(name = "TEXTO_COMPLETO")
    private String textoCompleto;

    // Resumo gerado pela IA
    @Column(name = "RESUMO_IA", length = 1000)
    private String resumoIa;

    // Pontos-chave extraídos pela IA
    @Column(name = "PONTOS_CHAVE", length = 1000)
    private String pontosChave;

    // Sentimento detectado: "POSITIVO", "NEUTRO", "NEGATIVO"
    @Column(name = "SENTIMENTO")
    private String sentimento;

    @Column(name = "PRODUTOS_CITADOS", length = 500)
    private String produtosCitados;

    @Column(name = "PROXIMAS_ACOES", length = 500)
    private String proximasAcoes;

    @Column(name = "DATA_PROCESSAMENTO")
    private LocalDateTime dataProcessamento;
}
