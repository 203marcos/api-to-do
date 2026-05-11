package com.marcosdias.apitodo.business.service;

import com.marcosdias.apitodo.business.mapper.TarefaMapper;
import com.marcosdias.apitodo.controller.dto.TarefaRequest;
import com.marcosdias.apitodo.controller.dto.TarefaResponse;
import com.marcosdias.apitodo.controller.dto.TarefaUpdateRequest;
import com.marcosdias.apitodo.domain.entity.Tarefa;
import com.marcosdias.apitodo.infra.exception.NotFoundException;
import com.marcosdias.apitodo.infra.exception.UnprocessableEntityException;
import com.marcosdias.apitodo.repository.TarefaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final TarefaMapper tarefaMapper;

    public TarefaResponse adicionarTarefa(TarefaRequest request) {
        log.info("Salvando tarefa: {}", request.nomeTarefa());
        Tarefa tarefa = tarefaMapper.toEntity(request);
        return tarefaMapper.toResponse(tarefaRepository.save(tarefa));
    }

    public List<TarefaResponse> listarTarefas() {
        return tarefaRepository.findAll().stream()
                .map(tarefaMapper::toResponse)
                .toList();
    }

    public TarefaResponse buscarTarefaId(String id) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tarefa não encontrada com id: " + id));
        return tarefaMapper.toResponse(tarefa);
    }

    public void deletarTarefa(String id) {
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tarefa não encontrada com id: " + id));
        tarefaRepository.delete(tarefa);
        log.info("Tarefa id {} deletada", id);
    }

    public TarefaResponse alterarTarefa(String id, TarefaUpdateRequest request) {
        if (request.isEmpty()) {
            throw new UnprocessableEntityException("Nenhum campo fornecido para atualização");
        }
        Tarefa tarefa = tarefaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tarefa não encontrada com id: " + id));
        tarefaMapper.updateFromRequest(request, tarefa);
        log.info("Atualizando tarefa id: {}", id);
        return tarefaMapper.toResponse(tarefaRepository.save(tarefa));
    }
}
