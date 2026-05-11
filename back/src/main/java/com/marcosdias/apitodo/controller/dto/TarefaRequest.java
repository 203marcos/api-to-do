package com.marcosdias.apitodo.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TarefaRequest(
        @NotBlank(message = "Nome da tarefa é obrigatório")
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        @Schema(example = "Estudar Spring Boot")
        String nomeTarefa,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        @Schema(example = "Revisar conceitos de REST e MongoDB")
        String descricaoTarefa,

        @Schema(example = "2026-05-11")
        LocalDate dataInicioTarefa,

        @Schema(example = "2026-05-31")
        LocalDate dataFimTarefa,

        @NotNull(message = "Status da tarefa é obrigatório")
        @Schema(example = "false")
        Boolean statusTarefa
) {}
