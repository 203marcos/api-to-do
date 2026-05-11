package com.marcosdias.apitodo.business.service;

import com.marcosdias.apitodo.business.mapper.TarefaMapper;
import com.marcosdias.apitodo.controller.dto.TarefaRequest;
import com.marcosdias.apitodo.controller.dto.TarefaResponse;
import com.marcosdias.apitodo.controller.dto.TarefaUpdateRequest;
import com.marcosdias.apitodo.domain.entity.Tarefa;
import com.marcosdias.apitodo.infra.exception.NotFoundException;
import com.marcosdias.apitodo.infra.exception.UnprocessableEntityException;
import com.marcosdias.apitodo.repository.TarefaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TarefaServiceTest {

    @Mock
    private TarefaRepository tarefaRepository;

    @Mock
    private TarefaMapper tarefaMapper;

    @InjectMocks
    private TarefaService tarefaService;

    private Tarefa tarefa;
    private TarefaResponse tarefaResponse;
    private TarefaRequest tarefaRequest;

    @BeforeEach
    void setUp() {
        tarefa = new Tarefa();
        tarefa.setId("683f1a2b4c5d6e7f8a9b0c1d");
        tarefa.setNomeTarefa("Estudar Spring Boot");
        tarefa.setDescricaoTarefa("Aprender APIs REST");
        tarefa.setDataInicioTarefa(LocalDate.of(2026, 5, 11));
        tarefa.setDataFimTarefa(LocalDate.of(2026, 5, 31));
        tarefa.setStatusTarefa(false);

        tarefaResponse = new TarefaResponse(
                "683f1a2b4c5d6e7f8a9b0c1d",
                "Estudar Spring Boot",
                "Aprender APIs REST",
                LocalDate.of(2026, 5, 11),
                LocalDate.of(2026, 5, 31),
                false
        );

        tarefaRequest = new TarefaRequest(
                "Estudar Spring Boot",
                "Aprender APIs REST",
                LocalDate.of(2026, 5, 11),
                LocalDate.of(2026, 5, 31),
                false
        );
    }

    // ==================== adicionarTarefa ====================

    @Test
    @DisplayName("adicionarTarefa - deve salvar e retornar a resposta")
    void adicionarTarefa_sucesso() {
        when(tarefaMapper.toEntity(tarefaRequest)).thenReturn(tarefa);
        when(tarefaRepository.save(tarefa)).thenReturn(tarefa);
        when(tarefaMapper.toResponse(tarefa)).thenReturn(tarefaResponse);

        TarefaResponse resultado = tarefaService.adicionarTarefa(tarefaRequest);

        assertThat(resultado).isEqualTo(tarefaResponse);
        verify(tarefaMapper).toEntity(tarefaRequest);
        verify(tarefaRepository).save(tarefa);
        verify(tarefaMapper).toResponse(tarefa);
    }

    // ==================== listarTarefas ====================

    @Test
    @DisplayName("listarTarefas - deve retornar lista com tarefas")
    void listarTarefas_sucesso() {
        when(tarefaRepository.findAll()).thenReturn(List.of(tarefa));
        when(tarefaMapper.toResponse(tarefa)).thenReturn(tarefaResponse);

        List<TarefaResponse> resultado = tarefaService.listarTarefas();

        assertThat(resultado).hasSize(1).contains(tarefaResponse);
    }

    @Test
    @DisplayName("listarTarefas - deve retornar lista vazia quando não houver tarefas")
    void listarTarefas_listaVazia_retornaListaVazia() {
        when(tarefaRepository.findAll()).thenReturn(List.of());

        List<TarefaResponse> resultado = tarefaService.listarTarefas();

        assertThat(resultado).isEmpty();
    }

    // ==================== buscarTarefaId ====================

    @Test
    @DisplayName("buscarTarefaId - deve retornar resposta quando ID existir")
    void buscarTarefaId_sucesso() {
        when(tarefaRepository.findById(tarefa.getId())).thenReturn(Optional.of(tarefa));
        when(tarefaMapper.toResponse(tarefa)).thenReturn(tarefaResponse);

        TarefaResponse resultado = tarefaService.buscarTarefaId(tarefa.getId());

        assertThat(resultado).isEqualTo(tarefaResponse);
    }

    @Test
    @DisplayName("buscarTarefaId - deve lançar NotFoundException quando ID não existir")
    void buscarTarefaId_naoEncontrado_lancaNotFoundException() {
        when(tarefaRepository.findById("id-invalido")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tarefaService.buscarTarefaId("id-invalido"))
                .isInstanceOf(NotFoundException.class)
                .hasMessage("Tarefa não encontrada com id: id-invalido");
    }

    // ==================== deletarTarefa ====================

    @Test
    @DisplayName("deletarTarefa - deve deletar tarefa quando ID existir")
    void deletarTarefa_sucesso() {
        when(tarefaRepository.findById(tarefa.getId())).thenReturn(Optional.of(tarefa));

        tarefaService.deletarTarefa(tarefa.getId());

        verify(tarefaRepository).delete(tarefa);
    }

    @Test
    @DisplayName("deletarTarefa - deve lançar NotFoundException quando ID não existir")
    void deletarTarefa_naoEncontrado_lancaNotFoundException() {
        when(tarefaRepository.findById("id-invalido")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tarefaService.deletarTarefa("id-invalido"))
                .isInstanceOf(NotFoundException.class);

        verify(tarefaRepository, never()).delete(any());
    }

    // ==================== alterarTarefa ====================

    @Test
    @DisplayName("alterarTarefa - deve atualizar e retornar resposta")
    void alterarTarefa_sucesso() {
        TarefaUpdateRequest request = new TarefaUpdateRequest("Novo Nome", null, null, null, true);
        when(tarefaRepository.findById(tarefa.getId())).thenReturn(Optional.of(tarefa));
        when(tarefaRepository.save(tarefa)).thenReturn(tarefa);
        when(tarefaMapper.toResponse(tarefa)).thenReturn(tarefaResponse);

        TarefaResponse resultado = tarefaService.alterarTarefa(tarefa.getId(), request);

        assertThat(resultado).isEqualTo(tarefaResponse);
        verify(tarefaMapper).updateFromRequest(request, tarefa);
        verify(tarefaRepository).save(tarefa);
    }

    @Test
    @DisplayName("alterarTarefa - deve lançar UnprocessableEntityException quando body estiver vazio")
    void alterarTarefa_bodyVazio_lancaUnprocessableEntityException() {
        TarefaUpdateRequest requestVazio = new TarefaUpdateRequest(null, null, null, null, null);

        assertThatThrownBy(() -> tarefaService.alterarTarefa(tarefa.getId(), requestVazio))
                .isInstanceOf(UnprocessableEntityException.class)
                .hasMessage("Nenhum campo fornecido para atualização");

        verify(tarefaRepository, never()).save(any());
    }

    @Test
    @DisplayName("alterarTarefa - deve lançar NotFoundException quando ID não existir")
    void alterarTarefa_naoEncontrado_lancaNotFoundException() {
        TarefaUpdateRequest request = new TarefaUpdateRequest("Novo Nome", null, null, null, null);
        when(tarefaRepository.findById("id-invalido")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> tarefaService.alterarTarefa("id-invalido", request))
                .isInstanceOf(NotFoundException.class);
    }
}
