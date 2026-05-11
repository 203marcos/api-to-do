package com.marcosdias.apitodo.business.mapper;

import com.marcosdias.apitodo.controller.dto.TarefaUpdateRequest;
import com.marcosdias.apitodo.domain.entity.Tarefa;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface TarefaMapper {

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateFromRequest(TarefaUpdateRequest request, @MappingTarget Tarefa tarefa);
}
