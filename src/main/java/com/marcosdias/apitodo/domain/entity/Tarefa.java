package com.marcosdias.apitodo.domain.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "tarefas")
public class Tarefa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nomeTarefa;
    private String descricaoTarefa;
    private String dataInicioTarefa;
    private String dataFimTarefa;
    private Boolean statusTarefa;
}
