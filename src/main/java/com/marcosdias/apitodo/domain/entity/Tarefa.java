package com.marcosdias.apitodo.domain.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document(collection = "tarefas")
public class Tarefa {

    @Id
    private String id;
    private String nomeTarefa;
    private String descricaoTarefa;
    private String dataInicioTarefa;
    private String dataFimTarefa;
    private Boolean statusTarefa;
}
