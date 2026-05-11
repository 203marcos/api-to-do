package com.marcosdias.apitodo.controller;

import com.marcosdias.apitodo.business.service.TarefaService;
import com.marcosdias.apitodo.controller.dto.TarefaRequest;
import com.marcosdias.apitodo.domain.entity.Tarefa;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/tarefas")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Tarefas", description = "Gerenciamento de tarefas")
public class TarefaController {

    private final TarefaService tarefaService;

    @PostMapping
    @Operation(summary = "Criar uma nova tarefa", description = "Cria uma nova tarefa para o usuário")
    public ResponseEntity<Tarefa> criarTarefa(@RequestBody @Valid TarefaRequest request) {
        log.info("POST /api/v1/tarefas - criando tarefa: {}", request.nomeTarefa());
        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaService.adicionarTarefa(request.toEntity()));
    }
}
