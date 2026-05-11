package com.marcosdias.apitodo.controller.dto;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record TarefaUpdateRequest(
        @Size(max = 100, message = "Nome deve ter no máximo 100 caracteres")
        String nomeTarefa,

        @Size(max = 500, message = "Descrição deve ter no máximo 500 caracteres")
        String descricaoTarefa,

        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Data de início deve estar no formato yyyy-MM-dd")
        String dataInicioTarefa,

        @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Data de fim deve estar no formato yyyy-MM-dd")
        String dataFimTarefa,

        Boolean statusTarefa
) {
    public boolean isEmpty() {
        return nomeTarefa == null && descricaoTarefa == null &&
               dataInicioTarefa == null && dataFimTarefa == null && statusTarefa == null;
    }
}
