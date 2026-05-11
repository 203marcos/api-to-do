# API To-Do

Aplicação fullstack de lista de tarefas com Spring Boot e Next.js.

## Acesso

- **Frontend:** https://api-to-do-seven.vercel.app
- **API Docs (Swagger):** https://api-to-do-0jgz.onrender.com/swagger-ui.html

## Tecnologias

**Backend**
- Java 21 + Spring Boot 3.4.5
- MongoDB Atlas
- MapStruct, Lombok, Bean Validation
- Springdoc OpenAPI (Swagger)

**Frontend**
- Next.js 15 + React 19
- TypeScript + Tailwind CSS

**Infraestrutura**
- Docker + Docker Compose
- GitHub Actions (CI)
- Render (backend) + Vercel (frontend)

## Endpoints

| Método | Rota                  | Descrição              |
|--------|-----------------------|------------------------|
| GET    | /api/v1/tarefas       | Listar tarefas         |
| GET    | /api/v1/tarefas/{id}  | Buscar tarefa por ID   |
| POST   | /api/v1/tarefas       | Criar tarefa           |
| PATCH  | /api/v1/tarefas/{id}  | Atualizar tarefa       |
| DELETE | /api/v1/tarefas/{id}  | Deletar tarefa         |

## Rodar localmente

**Pré-requisitos:** Docker instalado.

1. Clone o repositório
2. Crie o arquivo `back/.env` com a variável `MONGODB_URI`
3. Execute:

```bash
docker compose up --build
```

- Frontend: http://localhost:3000
- Backend: http://localhost:8080

## Testes

```bash
cd back
./gradlew test
```
