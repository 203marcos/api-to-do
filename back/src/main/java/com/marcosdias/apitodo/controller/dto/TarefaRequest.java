package com.marcosdias.apitodo.controller.dto;

import com.marcosdias.apitodo.domain.entity.Tarefa;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record TarefaRequest(
        @NotBlank(message = "Nome da tarefa é obrigatório")
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String nomeTarefa,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        String descricaoTarefa,

        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Data de início deve estar no formato yyyy-MM-dd")
        String dataInicioTarefa,

        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Data de fim deve estar no formato yyyy-MM-dd")
        String dataFimTarefa,

        @NotNull(message = "Status da tarefa é obrigatório")
        Boolean statusTarefa
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
