package com.marcosdias.apitodo.business.service;

import com.marcosdias.apitodo.domain.entity.Tarefa;
import com.marcosdias.apitodo.infra.exception.UnprocessableEntityException;
import com.marcosdias.apitodo.repository.TarefaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class TarefaService {

    private final TarefaRepository tarefaRepository;

    public Tarefa adicionarTarefa(Tarefa tarefa) {
        try {
            log.info("Salvando tarefa: {}", tarefa.getNomeTarefa());
            return tarefaRepository.save(tarefa);
        } catch (Exception e) {
            log.error("Erro ao salvar tarefa: {}", e.getMessage());
            throw new UnprocessableEntityException("Não foi possível processar a tarefa: " + e.getMessage());
        }
    }
}
