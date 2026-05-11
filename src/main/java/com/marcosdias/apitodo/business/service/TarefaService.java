package com.marcosdias.apitodo.business.service;

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

    public Tarefa adicionarTarefa(Tarefa tarefa) {
        try {
            log.info("Salvando tarefa: {}", tarefa.getNomeTarefa());
            return tarefaRepository.save(tarefa);
        } catch (Exception e) {
            log.error("Erro ao salvar tarefa: {}", e.getMessage());
            throw new UnprocessableEntityException("Não foi possível processar a tarefa: " + e.getMessage());
        }
    }

    public List<Tarefa> listarTarefas() {
        try {
            List<Tarefa> tarefas = tarefaRepository.findAll();
            if (tarefas.isEmpty()) {
                throw new NotFoundException("Nenhuma tarefa encontrada");
            }
            return tarefas;
        } catch (NotFoundException e) {
            throw e;
        } catch (Exception e) {
            log.error("Erro ao listar tarefas: {}", e.getMessage());
            throw new UnprocessableEntityException("Não foi possível listar as tarefas: " + e.getMessage());
        }
    }
}
