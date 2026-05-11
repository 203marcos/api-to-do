package com.marcosdias.apitodo.repository;

import com.marcosdias.apitodo.domain.entity.Tarefa;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TarefaRepository extends MongoRepository<Tarefa, String> {

    List<Tarefa> findByUsuarioEmail(String usuarioEmail);

    List<Tarefa> findByStatusTarefaAndUsuarioEmail(Boolean statusTarefa, String usuarioEmail);

    Optional<Tarefa> findByIdAndUsuarioEmail(String id, String usuarioEmail);
}
