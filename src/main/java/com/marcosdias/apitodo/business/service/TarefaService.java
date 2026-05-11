package com.marcosdias.apitodo.business.service;

import com.marcosdias.apitodo.business.mapper.TarefaMapper;
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

    public Tarefa adicionarTarefa(Tarefa tarefa) {
        log.info("Salvando tarefa: {}", tarefa.getNomeTarefa());
        return tarefaRepository.save(tarefa);
    }

    public List<Tarefa> listarTarefas() {
        List<Tarefa> tarefas = tarefaRepository.findAll();
        if (tarefas.isEmpty()) {
            throw new NotFoundException("Nenhuma tarefa encontrada");
        }
        return tarefas;
    }

    public Tarefa buscarTarefaId(Long id) {
        return tarefaRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Tarefa não encontrada com id: " + id));
    }

    public Tarefa alterarTarefa(Long id, TarefaUpdateRequest request) {
        if (request.isEmpty()) {
            throw new UnprocessableEntityException("Nenhum campo fornecido para atualização");
        }
        Tarefa tarefa = buscarTarefaId(id);
        tarefaMapper.updateFromRequest(request, tarefa);
        log.info("Atualizando tarefa id: {}", id);
        return tarefaRepository.save(tarefa);
    }
}
