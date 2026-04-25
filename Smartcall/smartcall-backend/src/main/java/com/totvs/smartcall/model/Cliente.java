package com.totvs.smartcall.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

/**
 * MODEL: Cliente
 * Representa a tabela CLIENTES do banco Oracle.
 * @Data do Lombok gera automaticamente getters, setters, toString, equals e hashCode.
 */
@Data
@Entity
@Table(name = "CLIENTES")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_clientes")
    @SequenceGenerator(name = "seq_clientes", sequenceName = "SEQ_CLIENTES", allocationSize = 1)
    @Column(name = "ID_CLIENTE")
    private Long idCliente;

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(name = "EMAIL", unique = true, nullable = false)
    private String email;

    @Column(name = "TELEFONE")
    private String telefone;

    @Column(name = "EMPRESA")
    private String empresa;

    @Column(name = "SEGMENTO")
    private String segmento;

    @Column(name = "FOTO_URL")
    private String fotoUrl;

    @Column(name = "DATA_CADASTRO")
    private LocalDate dataCadastro;

    @Column(name = "ATIVO")
    private Integer ativo;
}
