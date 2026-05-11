package com.marcosdias.apitodo.controller;

import com.marcosdias.apitodo.business.service.TarefaService;
import com.marcosdias.apitodo.controller.dto.TarefaRequest;
import com.marcosdias.apitodo.controller.dto.TarefaResponse;
import com.marcosdias.apitodo.controller.dto.TarefaUpdateRequest;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
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
@SecurityRequirement(name = "bearerAuth")
public class TarefaController {

    private final TarefaService tarefaService;

    @PostMapping
    @Operation(summary = "Criar uma nova tarefa")
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Tarefa criada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    public ResponseEntity<TarefaResponse> criarTarefa(@RequestBody @Valid TarefaRequest request) {
        log.info("POST /api/v1/tarefas - criando tarefa: {}", request.nomeTarefa());
        return ResponseEntity.status(HttpStatus.CREATED).body(tarefaService.adicionarTarefa(request));
    }

    @GetMapping
    @Operation(summary = "Listar tarefas", description = "Retorna tarefas do usuário. Use ?status=true para concluídas ou ?status=false para pendentes")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Lista retornada com sucesso"),
        @ApiResponse(responseCode = "401", description = "Não autenticado")
    })
    public ResponseEntity<List<TarefaResponse>> listarTarefas(
            @RequestParam(required = false) Boolean status) {
        log.info("GET /api/v1/tarefas - listando tarefas (status={})", status);
        return ResponseEntity.ok(tarefaService.listarTarefas(status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Buscar tarefa por ID")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tarefa encontrada"),
        @ApiResponse(responseCode = "401", description = "Não autenticado"),
        @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    public ResponseEntity<TarefaResponse> buscarTarefaId(@PathVariable String id) {
        log.info("GET /api/v1/tarefas/{} - buscando tarefa", id);
        return ResponseEntity.ok(tarefaService.buscarTarefaId(id));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Atualizar tarefa parcialmente", description = "Atualiza apenas os campos enviados")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "Tarefa atualizada"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "401", description = "Não autenticado"),
        @ApiResponse(responseCode = "404", description = "Tarefa não encontrada"),
        @ApiResponse(responseCode = "422", description = "Nenhum campo fornecido")
    })
    public ResponseEntity<TarefaResponse> alterarTarefaId(@PathVariable String id,
                                                           @RequestBody @Valid TarefaUpdateRequest request) {
        log.info("PATCH /api/v1/tarefas/{} - atualizando tarefa", id);
        return ResponseEntity.ok(tarefaService.alterarTarefa(id, request));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Deletar tarefa")
    @ApiResponses({
        @ApiResponse(responseCode = "204", description = "Tarefa deletada"),
        @ApiResponse(responseCode = "401", description = "Não autenticado"),
        @ApiResponse(responseCode = "404", description = "Tarefa não encontrada")
    })
    public ResponseEntity<Void> deletarTarefaId(@PathVariable String id) {
        log.info("DELETE /api/v1/tarefas/{} - deletando tarefa", id);
        tarefaService.deletarTarefa(id);
        return ResponseEntity.noContent().build();
    }
}
