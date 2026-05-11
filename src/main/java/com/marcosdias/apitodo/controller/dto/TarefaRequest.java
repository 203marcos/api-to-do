package com.marcosdias.apitodo.controller.dto;

import com.marcosdias.apitodo.domain.entity.Tarefa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record TarefaRequest(
        @NotBlank String nomeTarefa,
        String descricaoTarefa,
        String dataInicioTarefa,
        String dataFimTarefa,
        @NotNull Boolean statusTarefa
) {
    public Tarefa toEntity() {
        Tarefa tarefa = new Tarefa();
        tarefa.setNomeTarefa(nomeTarefa);
        tarefa.setDescricaoTarefa(descricaoTarefa);
        tarefa.setDataInicioTarefa(dataInicioTarefa);
        tarefa.setDataFimTarefa(dataFimTarefa);
        tarefa.setStatusTarefa(statusTarefa);
        return tarefa;
    }
}
