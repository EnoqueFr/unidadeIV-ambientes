/**
 * Testes automatizados do BACKEND (API Express)
 * Utiliza cy.request() para testar os endpoints REST
 * Base URL: http://localhost:3001
 */

const API = 'http://localhost:3001/api';

describe('Backend API — TaskFlow', () => {

  // Reset tasks before each test for a clean state
  beforeEach(() => {
    cy.request('POST', `${API}/tasks/reset`);
  });

  // ─────────────────────────────────────────────────
  // HEALTH CHECK
  // ─────────────────────────────────────────────────
  describe('GET /api/health', () => {
    it('deve retornar status 200 e success true', () => {
      cy.request(`${API}/health`).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.message).to.include('funcionando');
      });
    });
  });

  // ─────────────────────────────────────────────────
  // LIST TASKS
  // ─────────────────────────────────────────────────
  describe('GET /api/tasks', () => {
    it('deve retornar lista de tarefas com sucesso', () => {
      cy.request(`${API}/tasks`).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data).to.be.an('array');
        expect(res.body.data.length).to.be.greaterThan(0);
      });
    });

    it('cada tarefa deve ter id, title e completed', () => {
      cy.request(`${API}/tasks`).then(res => {
        res.body.data.forEach(task => {
          expect(task).to.have.property('id');
          expect(task).to.have.property('title');
          expect(task).to.have.property('completed');
        });
      });
    });
  });

  // ─────────────────────────────────────────────────
  // GET SINGLE TASK
  // ─────────────────────────────────────────────────
  describe('GET /api/tasks/:id', () => {
    it('deve retornar uma tarefa existente', () => {
      cy.request(`${API}/tasks/1`).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.id).to.eq(1);
      });
    });

    it('deve retornar 404 para tarefa inexistente', () => {
      cy.request({ url: `${API}/tasks/9999`, failOnStatusCode: false }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body.success).to.be.false;
      });
    });
  });

  // ─────────────────────────────────────────────────
  // CREATE TASK
  // ─────────────────────────────────────────────────
  describe('POST /api/tasks', () => {
    it('deve criar uma nova tarefa com título válido', () => {
      cy.request('POST', `${API}/tasks`, { title: 'Nova tarefa de teste' }).then(res => {
        expect(res.status).to.eq(201);
        expect(res.body.success).to.be.true;
        expect(res.body.data.title).to.eq('Nova tarefa de teste');
        expect(res.body.data.completed).to.be.false;
        expect(res.body.data).to.have.property('id');
      });
    });

    it('deve retornar 400 quando o título estiver vazio', () => {
      cy.request({
        method: 'POST',
        url: `${API}/tasks`,
        body: { title: '' },
        failOnStatusCode: false,
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.success).to.be.false;
      });
    });

    it('deve retornar 400 quando o título for apenas espaços', () => {
      cy.request({
        method: 'POST',
        url: `${API}/tasks`,
        body: { title: '   ' },
        failOnStatusCode: false,
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.success).to.be.false;
      });
    });

    it('deve retornar 400 quando o título não for enviado', () => {
      cy.request({
        method: 'POST',
        url: `${API}/tasks`,
        body: {},
        failOnStatusCode: false,
      }).then(res => {
        expect(res.status).to.eq(400);
        expect(res.body.success).to.be.false;
      });
    });
  });

  // ─────────────────────────────────────────────────
  // UPDATE TASK
  // ─────────────────────────────────────────────────
  describe('PUT /api/tasks/:id', () => {
    it('deve atualizar o título de uma tarefa existente', () => {
      cy.request('PUT', `${API}/tasks/1`, { title: 'Título atualizado' }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
        expect(res.body.data.title).to.eq('Título atualizado');
      });
    });

    it('deve marcar uma tarefa como concluída', () => {
      cy.request('PUT', `${API}/tasks/1`, { completed: true }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.data.completed).to.be.true;
      });
    });

    it('deve desmarcar uma tarefa concluída', () => {
      cy.request('PUT', `${API}/tasks/3`, { completed: false }).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.data.completed).to.be.false;
      });
    });

    it('deve retornar 404 ao atualizar tarefa inexistente', () => {
      cy.request({
        method: 'PUT',
        url: `${API}/tasks/9999`,
        body: { title: 'teste' },
        failOnStatusCode: false,
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body.success).to.be.false;
      });
    });
  });

  // ─────────────────────────────────────────────────
  // DELETE TASK
  // ─────────────────────────────────────────────────
  describe('DELETE /api/tasks/:id', () => {
    it('deve excluir uma tarefa existente', () => {
      cy.request('DELETE', `${API}/tasks/1`).then(res => {
        expect(res.status).to.eq(200);
        expect(res.body.success).to.be.true;
      });
    });

    it('a tarefa excluída não deve aparecer na listagem', () => {
      cy.request('DELETE', `${API}/tasks/2`).then(() => {
        cy.request(`${API}/tasks`).then(res => {
          const ids = res.body.data.map(t => t.id);
          expect(ids).to.not.include(2);
        });
      });
    });

    it('deve retornar 404 ao excluir tarefa inexistente', () => {
      cy.request({
        method: 'DELETE',
        url: `${API}/tasks/9999`,
        failOnStatusCode: false,
      }).then(res => {
        expect(res.status).to.eq(404);
        expect(res.body.success).to.be.false;
      });
    });
  });

  // ─────────────────────────────────────────────────
  // INTEGRATION FLOW
  // ─────────────────────────────────────────────────
  describe('Fluxo integrado — CRUD completo', () => {
    it('deve criar, ler, atualizar e excluir uma tarefa', () => {
      let createdId;

      // Create
      cy.request('POST', `${API}/tasks`, { title: 'Tarefa integração' }).then(res => {
        expect(res.status).to.eq(201);
        createdId = res.body.data.id;

        // Read
        return cy.request(`${API}/tasks/${createdId}`);
      }).then(res => {
        expect(res.body.data.title).to.eq('Tarefa integração');

        // Update
        return cy.request('PUT', `${API}/tasks/${createdId}`, { completed: true });
      }).then(res => {
        expect(res.body.data.completed).to.be.true;

        // Delete
        return cy.request('DELETE', `${API}/tasks/${createdId}`);
      }).then(res => {
        expect(res.body.success).to.be.true;

        // Verify deleted
        return cy.request({ url: `${API}/tasks/${createdId}`, failOnStatusCode: false });
      }).then(res => {
        expect(res.status).to.eq(404);
      });
    });
  });
});
