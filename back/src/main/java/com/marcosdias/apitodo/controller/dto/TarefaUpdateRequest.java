package com.marcosdias.apitodo.controller.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TarefaUpdateRequest(
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        @Schema(example = "Estudar Spring Boot - atualizado")
        String nomeTarefa,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        @Schema(example = "Revisar anotações e fazer exercícios")
        String descricaoTarefa,

        @Schema(example = "2026-05-11")
        LocalDate dataInicioTarefa,

        @Schema(example = "2026-06-01")
        LocalDate dataFimTarefa,

        @Schema(example = "true")
        Boolean statusTarefa
) {
    public boolean isEmpty() {
        return nomeTarefa == null && descricaoTarefa == null &&
               dataInicioTarefa == null && dataFimTarefa == null && statusTarefa == null;
    }
}
