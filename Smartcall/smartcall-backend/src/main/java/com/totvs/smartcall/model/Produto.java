package com.totvs.smartcall.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

/**
 * MODEL: Produto
 * Representa a tabela PRODUTOS do banco Oracle.
 */
@Data
@Entity
@Table(name = "PRODUTOS")
public class Produto {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_produtos")
    @SequenceGenerator(name = "seq_produtos", sequenceName = "SEQ_PRODUTOS", allocationSize = 1)
    @Column(name = "ID_PRODUTO")
    private Long idProduto;

    @Column(name = "NOME", nullable = false)
    private String nome;

    @Column(name = "DESCRICAO")
    private String descricao;

    @Column(name = "CATEGORIA")
    private String categoria;

    @Column(name = "PRECO_MENSAL")
    private BigDecimal precoMensal;

    @Column(name = "ATIVO")
    private Integer ativo;
}
