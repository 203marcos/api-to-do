package com.marcosdias.apitodo.controller.dto;

import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TarefaUpdateRequest(
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String nomeTarefa,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        String descricaoTarefa,

        LocalDate dataInicioTarefa,

        LocalDate dataFimTarefa,

        Boolean statusTarefa
) {
    public boolean isEmpty() {
        return nomeTarefa == null && descricaoTarefa == null &&
               dataInicioTarefa == null && dataFimTarefa == null && statusTarefa == null;
    }
}
