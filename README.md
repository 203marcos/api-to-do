# API To-Do

![CI](https://github.com/203marcos/api-to-do/actions/workflows/ci.yml/badge.svg)

Aplicação fullstack de lista de tarefas com Spring Boot e Next.js.

## Acesso

| Serviço | URL |
|---|---|
| Frontend | https://api-to-do-seven.vercel.app |
| Swagger UI | https://api-to-do-0jgz.onrender.com/swagger-ui.html |
| API Base | https://api-to-do-0jgz.onrender.com/api/v1 |

## Tecnologias

**Backend** — Java 21, Spring Boot 3.4.5, Spring Security + JWT, MongoDB Atlas, MapStruct, Lombok, Springdoc OpenAPI

**Frontend** — Next.js 15, React 19, TypeScript, Tailwind CSS

**Infra** — Docker, Docker Compose, GitHub Actions CI, Render (backend), Vercel (frontend)

## Endpoints

### Auth (público)

| Método | Rota | Descrição |
|---|---|---|
| POST | /auth/registro | Criar conta |
| POST | /auth/login | Fazer login, retorna JWT |

### Tarefas (requer Bearer token)

| Método | Rota | Descrição |
|---|---|---|
| GET | /api/v1/tarefas | Listar tarefas (`?status=true/false` filtra) |
| GET | /api/v1/tarefas/{id} | Buscar por ID |
| POST | /api/v1/tarefas | Criar tarefa |
| PATCH | /api/v1/tarefas/{id} | Atualizar parcialmente |
| DELETE | /api/v1/tarefas/{id} | Deletar |

## Testando com curl

**1. Criar conta**
```bash
curl -X POST https://api-to-do-0jgz.onrender.com/auth/registro \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","senha":"123456"}'
```

**2. Login (guarde o token retornado)**
```bash
curl -X POST https://api-to-do-0jgz.onrender.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","senha":"123456"}'
```

**3. Criar tarefa**
```bash
curl -X POST https://api-to-do-0jgz.onrender.com/api/v1/tarefas \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"nomeTarefa":"Estudar Spring Boot","statusTarefa":false}'
```

**4. Listar tarefas**
```bash
curl https://api-to-do-0jgz.onrender.com/api/v1/tarefas \
  -H "Authorization: Bearer SEU_TOKEN"
```

**5. Listar só pendentes**
```bash
curl "https://api-to-do-0jgz.onrender.com/api/v1/tarefas?status=false" \
  -H "Authorization: Bearer SEU_TOKEN"
```

**6. Marcar como concluída**
```bash
curl -X PATCH https://api-to-do-0jgz.onrender.com/api/v1/tarefas/ID_DA_TAREFA \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"statusTarefa":true}'
```

**7. Deletar**
```bash
curl -X DELETE https://api-to-do-0jgz.onrender.com/api/v1/tarefas/ID_DA_TAREFA \
  -H "Authorization: Bearer SEU_TOKEN"
```

## Rodar localmente com Docker

Pré-requisito: Docker instalado.

```bash
git clone https://github.com/203marcos/api-to-do.git
cd api-to-do
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080
- Swagger: http://localhost:8080/swagger-ui.html

> O MongoDB já sobe automaticamente via Docker Compose, sem precisar de conta no Atlas.

## Variáveis de ambiente (Render/produção)

Copie `back/.env.example` para `back/.env` e preencha:

```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=<base64 de 256 bits>
```

## Testes

```bash
cd back
./gradlew test
```

O CI executa automaticamente a cada push e pull request no `main`.
