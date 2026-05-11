package com.marcosdias.apitodo.controller.dto;

import java.time.LocalDate;

public record TarefaResponse(
        String id,
        String nomeTarefa,
        String descricaoTarefa,
        LocalDate dataInicioTarefa,
        LocalDate dataFimTarefa,
        Boolean statusTarefa
) {}
