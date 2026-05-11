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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TarefaService {

    private final TarefaRepository tarefaRepository;
    private final TarefaMapper tarefaMapper;

    public TarefaResponse adicionarTarefa(TarefaRequest request) {
        String email = getCurrentUserEmail();
        log.info("Salvando tarefa para: {}", email);
        Tarefa tarefa = tarefaMapper.toEntity(request);
        tarefa.setUsuarioEmail(email);
        return tarefaMapper.toResponse(tarefaRepository.save(tarefa));
    }

    public Page<TarefaResponse> listarTarefas(Boolean status, Pageable pageable) {
        String email = getCurrentUserEmail();
        Page<Tarefa> page = status != null
                ? tarefaRepository.findByStatusTarefaAndUsuarioEmail(status, email, pageable)
                : tarefaRepository.findByUsuarioEmail(email, pageable);
        return page.map(tarefaMapper::toResponse);
    }

    public TarefaResponse buscarTarefaId(String id) {
        String email = getCurrentUserEmail();
        Tarefa tarefa = tarefaRepository.findByIdAndUsuarioEmail(id, email)
                .orElseThrow(() -> new NotFoundException("Tarefa não encontrada com id: " + id));
        return tarefaMapper.toResponse(tarefa);
    }

    public void deletarTarefa(String id) {
        String email = getCurrentUserEmail();
        Tarefa tarefa = tarefaRepository.findByIdAndUsuarioEmail(id, email)
                .orElseThrow(() -> new NotFoundException("Tarefa não encontrada com id: " + id));
        tarefaRepository.delete(tarefa);
        log.info("Tarefa id {} deletada por {}", id, email);
    }

    public TarefaResponse alterarTarefa(String id, TarefaUpdateRequest request) {
        if (request.isEmpty()) {
            throw new UnprocessableEntityException("Nenhum campo fornecido para atualização");
        }
        String email = getCurrentUserEmail();
        Tarefa tarefa = tarefaRepository.findByIdAndUsuarioEmail(id, email)
                .orElseThrow(() -> new NotFoundException("Tarefa não encontrada com id: " + id));
        tarefaMapper.updateFromRequest(request, tarefa);
        log.info("Atualizando tarefa id: {} por {}", id, email);
        return tarefaMapper.toResponse(tarefaRepository.save(tarefa));
    }

    private String getCurrentUserEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }
}
