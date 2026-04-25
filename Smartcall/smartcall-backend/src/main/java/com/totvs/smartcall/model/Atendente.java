package com.totvs.smartcall.model;

import jakarta.persistence.*;
import lombok.Data;

/**
 * MODEL: Atendente
 * Representa a tabela ATENDENTES do banco Oracle.
 */
@Data
@Entity
@Table(name = "ATENDENTES")
public class Atendente {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_atendentes")
    @SequenceGenerator(name = "seq_atendentes", sequenceName = "SEQ_ATENDENTES", allocationSize = 1)
    @Column(name = "ID_ATENDENTE")
    private Long idAtendente;

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(name = "EMAIL", unique = true, nullable = false)
    private String email;

    @Column(name = "CARGO")
    private String cargo;

    @Column(name = "FOTO_URL")
    private String fotoUrl;

    @Column(name = "ATIVO")
    private Integer ativo;
}
