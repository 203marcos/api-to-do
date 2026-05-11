package com.marcosdias.apitodo.repository;

import com.marcosdias.apitodo.domain.entity.Tarefa;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarefaRepository extends MongoRepository<Tarefa, String> {
}
