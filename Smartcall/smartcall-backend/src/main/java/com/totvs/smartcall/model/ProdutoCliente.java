package com.totvs.smartcall.model;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * MODEL: ProdutoCliente
 * Tabela de relacionamento N:N entre Clientes e Produtos.
 * Indica se o cliente COMPROU ou tem INTERESSE no produto.
 */
@Data
@Entity
@Table(name = "PRODUTOS_CLIENTE")
public class ProdutoCliente {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_produtos_cliente")
    @SequenceGenerator(name = "seq_produtos_cliente", sequenceName = "SEQ_PRODUTOS_CLIENTE", allocationSize = 1)
    @Column(name = "ID_PROD_CLI")
    private Long idProdCli;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_CLIENTE", nullable = false)
    private Cliente cliente;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "ID_PRODUTO", nullable = false)
    private Produto produto;

    // "COMPRADO" ou "INTERESSE"
    @Column(name = "TIPO", nullable = false)
    private String tipo;

    @Column(name = "DATA_INICIO")
    private LocalDate dataInicio;

    @Column(name = "VALOR_CONTRATO")
    private BigDecimal valorContrato;
}
