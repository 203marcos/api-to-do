package com.marcosdias.apitodo.controller.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TarefaRequest(
        @NotBlank(message = "Nome da tarefa é obrigatório")
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String nomeTarefa,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        String descricaoTarefa,

        LocalDate dataInicioTarefa,

        LocalDate dataFimTarefa,

        @NotNull(message = "Status da tarefa é obrigatório")
        Boolean statusTarefa
) {}
