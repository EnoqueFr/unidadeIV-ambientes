# ✦ TaskFlow — Gerenciador de Tarefas

> **Trabalho da Unidade IV** — Frontend + Backend + Testes Automatizados com Cypress + GitHub Actions

---

## 📁 Estrutura do Projeto

```text
unidadeIV-ambientes/
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

---
```

## 🚀 Como rodar localmente

### Pré-requisitos
- Node.js >= 18
- npm

### 1. Instalar dependências

Execute os comandos abaixo a partir da **raiz** do projeto:

```bash
# 1. Instalar dependências globais/Cypress
npm install

# 2. Instalar dependências do Backend
cd backend
npm install
cd ..

# 3. Instalar dependências do Frontend
cd frontend
npm install
cd ..
```

### 2. Iniciar o backend

> Abra um **Terminal 1** e deixe rodando:

```bash
cd backend
npm run start
# Servidor rodando em http://localhost:3001
```

### 3. Iniciar o frontend

> Abra um **Terminal 2** e deixe rodando:

```bash
cd frontend
npm run start
# Frontend disponível em http://localhost:5500
```

### 4. Abrir a aplicação

Acesse **http://localhost:5500** no seu navegador.

---

## 🧪 Executar os Testes

> ⚠️ **Antes de rodar os testes:**
> - O **backend** deve estar rodando no Terminal 1
> - O **frontend** deve estar rodando no Terminal 2
> - Abra um **Terminal 3** (na raiz do projeto) para executar os comandos abaixo:

### Testes do backend (API)

```bash
npx cypress run --spec "cypress/e2e/backend.cy.js"
```
### Testes do frontend (interface)

```bash
npx cypress run --spec "cypress/e2e/frontend.cy.js"
```

### Todos os testes juntos

```bash
npx cypress run
```

### Interface gráfica do Cypress

```bash
npx cypress open
```

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

- **Disciplina**: Ambientes e Desenv. de Software
- **Unidade**: IV
- **Pontuação Máxima**: 4,0 pontos
- **Professor**: Regis Simão (regis.simao@unifor.br)
