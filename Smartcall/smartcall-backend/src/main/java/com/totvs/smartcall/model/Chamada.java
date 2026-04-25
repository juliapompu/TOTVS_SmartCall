package com.totvs.smartcall.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * MODEL: Chamada
 * Representa a tabela CHAMADAS do banco Oracle.
 * Uma chamada pertence a um cliente e a um atendente.
 */
@Data
@Entity
@Table(name = "CHAMADAS")
public class Chamada {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_chamadas")
    @SequenceGenerator(name = "seq_chamadas", sequenceName = "SEQ_CHAMADAS", allocationSize = 1)
    @Column(name = "ID_CHAMADA")
    private Long idChamada;

    // Relacionamento com Cliente - carrega os dados do cliente junto
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_CLIENTE", nullable = false)
    private Cliente cliente;

    // Relacionamento com Atendente - carrega os dados do atendente junto
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_ATENDENTE", nullable = false)
    private Atendente atendente;

    @Column(name = "DATA_CHAMADA", nullable = false)
    private LocalDateTime dataChamada;

    @Column(name = "DURACAO_MIN")
    private Integer duracaoMin;

    // Status: "AGENDADA", "EM_ANDAMENTO", "CONCLUIDA"
    @Column(name = "STATUS", nullable = false)
    private String status;

    // Plataforma: "Google Meet", "Teams", "Telefone"
    @Column(name = "PLATAFORMA")
    private String plataforma;

    @Column(name = "OBSERVACOES")
    private String observacoes;
}
