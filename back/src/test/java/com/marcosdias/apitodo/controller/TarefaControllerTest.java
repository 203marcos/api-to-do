package com.marcosdias.apitodo.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.marcosdias.apitodo.business.service.TarefaService;
import com.marcosdias.apitodo.controller.dto.TarefaRequest;
import com.marcosdias.apitodo.controller.dto.TarefaResponse;
import com.marcosdias.apitodo.controller.dto.TarefaUpdateRequest;
import com.marcosdias.apitodo.infra.exception.GlobalExceptionHandler;
import com.marcosdias.apitodo.infra.exception.NotFoundException;
import com.marcosdias.apitodo.infra.exception.UnprocessableEntityException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TarefaController.class)
@Import(GlobalExceptionHandler.class)
class TarefaControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private TarefaService tarefaService;

    private TarefaResponse tarefaResponse;
    private TarefaRequest request;
    private static final String BASE_URL = "/api/v1/tarefas";
    private static final String ID = "683f1a2b4c5d6e7f8a9b0c1d";

    @BeforeEach
    void setUp() {
        tarefaResponse = new TarefaResponse(
                ID,
                "Estudar Spring Boot",
                "Aprender APIs REST",
                LocalDate.of(2026, 5, 11),
                LocalDate.of(2026, 5, 31),
                false
        );

        request = new TarefaRequest(
                "Estudar Spring Boot",
                "Aprender APIs REST",
                LocalDate.of(2026, 5, 11),
                LocalDate.of(2026, 5, 31),
                false
        );
    }

    // ==================== POST ====================

    @Test
    @DisplayName("POST /tarefas - deve retornar 201 e a tarefa criada")
    void criarTarefa_sucesso() throws Exception {
        when(tarefaService.adicionarTarefa(any())).thenReturn(tarefaResponse);

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nomeTarefa").value("Estudar Spring Boot"))
                .andExpect(jsonPath("$.statusTarefa").value(false));
    }

    @Test
    @DisplayName("POST /tarefas - deve retornar 400 quando nomeTarefa estiver vazio")
    void criarTarefa_semNome_retorna400() throws Exception {
        TarefaRequest requestInvalido = new TarefaRequest("", "desc", null, null, false);

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestInvalido)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @DisplayName("POST /tarefas - deve retornar 400 quando statusTarefa estiver ausente")
    void criarTarefa_semStatus_retorna400() throws Exception {
        TarefaRequest requestInvalido = new TarefaRequest("Tarefa", "desc", null, null, null);

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestInvalido)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @DisplayName("POST /tarefas - deve retornar 400 quando data estiver em formato inválido")
    void criarTarefa_dataInvalida_retorna400() throws Exception {
        String jsonInvalido = """
                {
                    "nomeTarefa": "Tarefa",
                    "descricaoTarefa": "desc",
                    "dataInicioTarefa": "11/05/2026",
                    "statusTarefa": false
                }
                """;

        mockMvc.perform(post(BASE_URL)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(jsonInvalido))
                .andExpect(status().isBadRequest());
    }

    // ==================== GET all ====================

    @Test
    @DisplayName("GET /tarefas - deve retornar 200 e lista de tarefas sem filtro")
    void listarTarefas_sucesso() throws Exception {
        when(tarefaService.listarTarefas(null)).thenReturn(List.of(tarefaResponse));

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(ID))
                .andExpect(jsonPath("$[0].nomeTarefa").value("Estudar Spring Boot"));
    }

    @Test
    @DisplayName("GET /tarefas?status=false - deve retornar apenas tarefas pendentes")
    void listarTarefas_filtroStatusFalse_retornaPendentes() throws Exception {
        when(tarefaService.listarTarefas(false)).thenReturn(List.of(tarefaResponse));

        mockMvc.perform(get(BASE_URL).param("status", "false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].statusTarefa").value(false));
    }

    @Test
    @DisplayName("GET /tarefas - deve retornar 200 e lista vazia quando não houver tarefas")
    void listarTarefas_vazio_retorna200ComListaVazia() throws Exception {
        when(tarefaService.listarTarefas(null)).thenReturn(List.of());

        mockMvc.perform(get(BASE_URL))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    // ==================== GET by ID ====================

    @Test
    @DisplayName("GET /tarefas/{id} - deve retornar 200 e a tarefa")
    void buscarTarefaId_sucesso() throws Exception {
        when(tarefaService.buscarTarefaId(ID)).thenReturn(tarefaResponse);

        mockMvc.perform(get(BASE_URL + "/" + ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID))
                .andExpect(jsonPath("$.nomeTarefa").value("Estudar Spring Boot"));
    }

    @Test
    @DisplayName("GET /tarefas/{id} - deve retornar 404 quando ID não existir")
    void buscarTarefaId_naoEncontrado_retorna404() throws Exception {
        when(tarefaService.buscarTarefaId("id-invalido"))
                .thenThrow(new NotFoundException("Tarefa não encontrada com id: id-invalido"));

        mockMvc.perform(get(BASE_URL + "/id-invalido"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    // ==================== PATCH ====================

    @Test
    @DisplayName("PATCH /tarefas/{id} - deve retornar 200 e tarefa atualizada")
    void alterarTarefaId_sucesso() throws Exception {
        TarefaUpdateRequest updateRequest = new TarefaUpdateRequest("Novo Nome", null, null, null, true);
        TarefaResponse atualizada = new TarefaResponse(ID, "Novo Nome", "Aprender APIs REST",
                LocalDate.of(2026, 5, 11), LocalDate.of(2026, 5, 31), true);
        when(tarefaService.alterarTarefa(eq(ID), any())).thenReturn(atualizada);

        mockMvc.perform(patch(BASE_URL + "/" + ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nomeTarefa").value("Novo Nome"))
                .andExpect(jsonPath("$.statusTarefa").value(true));
    }

    @Test
    @DisplayName("PATCH /tarefas/{id} - deve retornar 422 quando body estiver vazio")
    void alterarTarefaId_bodyVazio_retorna422() throws Exception {
        TarefaUpdateRequest requestVazio = new TarefaUpdateRequest(null, null, null, null, null);
        when(tarefaService.alterarTarefa(eq(ID), any()))
                .thenThrow(new UnprocessableEntityException("Nenhum campo fornecido para atualização"));

        mockMvc.perform(patch(BASE_URL + "/" + ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(requestVazio)))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status").value(422));
    }

    @Test
    @DisplayName("PATCH /tarefas/{id} - deve retornar 404 quando ID não existir")
    void alterarTarefaId_naoEncontrado_retorna404() throws Exception {
        TarefaUpdateRequest updateRequest = new TarefaUpdateRequest("Novo Nome", null, null, null, null);
        when(tarefaService.alterarTarefa(eq("id-invalido"), any()))
                .thenThrow(new NotFoundException("Tarefa não encontrada com id: id-invalido"));

        mockMvc.perform(patch(BASE_URL + "/id-invalido")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isNotFound());
    }

    // ==================== DELETE ====================

    @Test
    @DisplayName("DELETE /tarefas/{id} - deve retornar 204 quando deletar com sucesso")
    void deletarTarefaId_sucesso() throws Exception {
        doNothing().when(tarefaService).deletarTarefa(ID);

        mockMvc.perform(delete(BASE_URL + "/" + ID))
                .andExpect(status().isNoContent());

        verify(tarefaService).deletarTarefa(ID);
    }

    @Test
    @DisplayName("DELETE /tarefas/{id} - deve retornar 404 quando ID não existir")
    void deletarTarefaId_naoEncontrado_retorna404() throws Exception {
        doThrow(new NotFoundException("Tarefa não encontrada com id: id-invalido"))
                .when(tarefaService).deletarTarefa("id-invalido");

        mockMvc.perform(delete(BASE_URL + "/id-invalido"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }
}
