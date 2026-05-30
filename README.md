# ✦ TaskFlow — Gerenciador de Tarefas

> **Trabalho da Unidade IV** — Frontend + Backend + Testes Automatizados com Cypress + GitHub Actions

---

## 📁 Estrutura do Projeto

```
taskflow/
├── frontend/               # HTML, CSS e JavaScript puro
│   ├── index.html
│   ├── style.css
│   ├── app.js
│   └── package.json
├── backend/                # Node.js + Express
│   ├── server.js           # App Express (exportado para testes)
│   ├── index.js            # Entrypoint (start do servidor)
│   └── package.json
├── cypress/
│   └── e2e/
│       ├── backend.cy.js   # Testes da API REST
│       └── frontend.cy.js  # Testes da interface
├── .github/
│   └── workflows/
│       ├── backend-tests.yml   # CI para backend
│       └── frontend-tests.yml  # CI para frontend
├── cypress.config.js
├── package.json
└── README.md
```

---

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js >= 18
- npm

### 1. Instalar dependências

```bash
# Raiz (Cypress + serve)
npm install

# Backend
cd backend && npm install && cd ..
```

### 2. Iniciar o backend

```bash
npm run start:backend
# Servidor rodando em http://localhost:3001
```

### 3. Iniciar o frontend

```bash
npm run start:frontend
# Frontend disponível em http://localhost:5500
```

### 4. Abrir a aplicação

Acesse **http://localhost:5500** no seu navegador.

---

## 🧪 Executar os Testes

### Todos os testes (modo headless)

```bash
# Testes do backend
npm run test:backend

# Testes do frontend
npm run test:frontend

# Todos juntos
npm run test:all
```

### Interface gráfica do Cypress

```bash
npm run test:open
```

> ⚠️ **Para rodar os testes, o backend deve estar iniciado em `localhost:3001`**  
> Para os testes do frontend, o frontend também deve estar servido em `localhost:5500`

---

## 🌐 Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/tasks` | Listar todas as tarefas |
| `GET` | `/api/tasks/:id` | Buscar uma tarefa |
| `POST` | `/api/tasks` | Criar nova tarefa |
| `PUT` | `/api/tasks/:id` | Atualizar tarefa |
| `DELETE` | `/api/tasks/:id` | Excluir tarefa |
| `POST` | `/api/tasks/reset` | Resetar tarefas (para testes) |

---

## ⚙️ GitHub Actions

Dois workflows são disparados a cada **push** em qualquer branch:

| Workflow | Arquivo | O que faz |
|----------|---------|-----------|
| 🔧 Testes do Backend | `backend-tests.yml` | Sobe o Express e roda `backend.cy.js` |
| 🖥️ Testes do Frontend | `frontend-tests.yml` | Sobe backend + frontend estático e roda `frontend.cy.js` |

---

## 🛠️ Tecnologias

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js, CORS
- **Testes**: Cypress 13
- **CI/CD**: GitHub Actions
- **Fontes**: Google Fonts (Syne + DM Mono)

---

## 👨‍🎓 Informações Acadêmicas

- **Disciplina**: Engenharia de Software  
- **Unidade**: IV  
- **Valor**: 4,0 pontos  
- **Professor**: regis.simao@unifor.br
