package com.marcosdias.apitodo.controller;

import com.marcosdias.apitodo.business.service.TarefaService;
import com.marcosdias.apitodo.controller.dto.TarefaRequest;
import com.marcosdias.apitodo.controller.dto.TarefaResponse;
import com.marcosdias.apitodo.controller.dto.TarefaUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/tarefas")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Tarefas", description = "Gerenciamento de tarefas")
public class TarefaController {

    private final TarefaService tarefaService;

    @PostMapping
    @Operation(summary = "Criar uma nova tarefa", description = "Cria uma nova tarefa para o usuário")
    public ResponseEntity<TarefaResponse> criarTarefa(@RequestBody @Valid TarefaRequest request) {
        log.info("POST /api/v1/tarefas - criando tarefa: {}", request.nomeTarefa());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(TarefaResponse.fromEntity(tarefaService.adicionarTarefa(request.toEntity())));
    }

    @GetMapping
    @Operation(summary = "Listar todas as tarefas", description = "Retorna todas as tarefas cadastradas")
    public ResponseEntity<List<TarefaResponse>> listarTarefas() {
        log.info("GET /api/v1/tarefas - listando tarefas");
        return ResponseEntity.ok(tarefaService.listarTarefas().stream()
                .map(TarefaResponse::fromEntity)
                .toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar tarefa por ID", description = "Retorna uma tarefa pelo seu ID")
    public ResponseEntity<TarefaResponse> buscarTarefaId(@PathVariable Long id) {
        log.info("GET /api/v1/tarefas/{} - buscando tarefa", id);
        return ResponseEntity.ok(TarefaResponse.fromEntity(tarefaService.buscarTarefaId(id)));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar tarefa parcialmente", description = "Atualiza apenas os campos enviados")
    public ResponseEntity<TarefaResponse> alterarTarefaId(@PathVariable Long id,
                                                           @RequestBody @Valid TarefaUpdateRequest request) {
        log.info("PATCH /api/v1/tarefas/{} - atualizando tarefa", id);
        return ResponseEntity.ok(TarefaResponse.fromEntity(tarefaService.alterarTarefa(id, request)));
    }
}
