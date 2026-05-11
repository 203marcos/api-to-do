package com.marcosdias.apitodo.controller.dto;

import com.marcosdias.apitodo.domain.entity.Tarefa;

public record TarefaResponse(
        Long id,
        String nomeTarefa,
        String descricaoTarefa,
        String dataInicioTarefa,
        String dataFimTarefa,
        Boolean statusTarefa
) {
    public static TarefaResponse fromEntity(Tarefa tarefa) {
        return new TarefaResponse(
                tarefa.getId(),
                tarefa.getNomeTarefa(),
                tarefa.getDescricaoTarefa(),
                tarefa.getDataInicioTarefa(),
                tarefa.getDataFimTarefa(),
                tarefa.getStatusTarefa()
        );
    }
}
