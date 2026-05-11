package com.marcosdias.apitodo.repository;

import com.marcosdias.apitodo.domain.entity.Tarefa;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TarefaRepository extends MongoRepository<Tarefa, String> {

    Page<Tarefa> findByUsuarioEmail(String usuarioEmail, Pageable pageable);

    Page<Tarefa> findByStatusTarefaAndUsuarioEmail(Boolean statusTarefa, String usuarioEmail, Pageable pageable);

    Optional<Tarefa> findByIdAndUsuarioEmail(String id, String usuarioEmail);
}
