package com.marcosdias.apitodo.domain.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Data
@Document(collection = "tarefas")
public class Tarefa {

    @Id
    private String id;
    private String usuarioEmail;
    private String nomeTarefa;
    private String descricaoTarefa;
    private LocalDate dataInicioTarefa;
    private LocalDate dataFimTarefa;
    private Boolean statusTarefa;
}
