package com.marcosdias.apitodo.repository;

import com.marcosdias.apitodo.domain.entity.Tarefa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TarefaRepository extends JpaRepository<Tarefa, Long> {
}
