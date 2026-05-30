/**
 * Testes automatizados do FRONTEND (HTML/CSS/JS)
 * Utiliza cy.visit() para testar a interface do usuário
 * Base URL: http://localhost:5500 (Live Server) ou http://localhost:3000
 */

const FRONTEND_URL = Cypress.env('FRONTEND_URL') || 'http://localhost:5500';

describe('Frontend — TaskFlow', () => {

  beforeEach(() => {
    cy.request('POST', 'http://localhost:3001/api/tasks/reset');
    cy.visit(FRONTEND_URL);
    cy.get('[data-testid="loading"]', { timeout: 8000 }).should('not.be.visible');
    cy.get('[data-testid="task-list"]').children().should('have.length.greaterThan', 0);
  });

  describe('Layout e carregamento inicial', () => {
    it('deve exibir o título da aplicação', () => {
      cy.contains('TaskFlow').should('be.visible');
    });

    it('deve exibir o formulário de adicionar tarefa', () => {
      cy.get('[data-testid="task-form"]').should('be.visible');
      cy.get('[data-testid="task-input"]').should('be.visible');
      cy.get('[data-testid="task-submit"]').should('be.visible');
    });

    it('deve exibir os botões de filtro', () => {
      cy.get('[data-testid="filter-all"]').should('be.visible');
      cy.get('[data-testid="filter-pending"]').should('be.visible');
      cy.get('[data-testid="filter-done"]').should('be.visible');
    });

    it('deve exibir as estatísticas', () => {
      cy.get('[data-testid="stats-bar"]').should('be.visible');
      cy.get('[data-testid="stat-total"]').should('not.have.text', '');
    });

    it('deve mostrar o status da API como Online', () => {
      cy.get('[data-testid="api-status"]', { timeout: 5000 })
        .should('have.class', 'online')
        .should('contain', 'Online');
    });
  });

  describe('Listagem de tarefas', () => {
    it('deve listar as tarefas vindas do backend', () => {
      cy.get('[data-testid="task-list"]').children().should('have.length.greaterThan', 0);
    });

    it('deve exibir o título das tarefas', () => {
      cy.get('[data-testid="task-list"]').within(() => {
        cy.contains('Estudar para a prova').should('be.visible');
      });
    });

    it('deve exibir tarefa concluída com estilo diferenciado', () => {
      cy.get('.task-item.completed').should('exist');
    });

    it('deve exibir o total correto de tarefas nas estatísticas', () => {
      cy.get('[data-testid="stat-total"]').then($el => {
        const total = parseInt($el.text());
        cy.get('[data-testid="task-list"]').children().should('have.length', total);
      });
    });
  });

  describe('Adicionar tarefa', () => {
    it('deve adicionar uma nova tarefa ao digitar e clicar em Adicionar', () => {
      cy.get('[data-testid="task-input"]').type('Tarefa criada pelo Cypress');
      cy.get('[data-testid="task-submit"]').click();
      cy.get('[data-testid="task-list"]').should('contain', 'Tarefa criada pelo Cypress');
    });

    it('deve adicionar uma nova tarefa ao pressionar Enter', () => {
      cy.get('[data-testid="task-input"]').type('Tarefa via Enter{enter}');
      cy.get('[data-testid="task-list"]').should('contain', 'Tarefa via Enter');
    });

    it('deve limpar o campo após adicionar a tarefa', () => {
      cy.get('[data-testid="task-input"]').type('Tarefa limpar campo{enter}');
      cy.get('[data-testid="task-input"]').should('have.value', '');
    });

    it('deve incrementar o total nas estatísticas após adicionar', () => {
      cy.get('[data-testid="stat-total"]').invoke('text').then(before => {
        cy.get('[data-testid="task-input"]').type('Nova tarefa stats{enter}');
        cy.get('[data-testid="stat-total"]').should('have.text', String(parseInt(before) + 1));
      });
    });

    it('deve exibir mensagem de erro ao enviar título vazio', () => {
      cy.get('[data-testid="task-submit"]').click();
      cy.get('[data-testid="form-error"]').should('not.be.empty');
    });

    it('não deve exibir erro ao enviar tarefa válida', () => {
      cy.get('[data-testid="task-input"]').type('Tarefa válida{enter}');
      cy.get('[data-testid="form-error"]').should('be.empty');
    });
  });

  describe('Excluir tarefa', () => {
    it('deve remover a tarefa ao clicar em excluir', () => {
      cy.get('[data-testid="task-list"]').children().first()
        .find('.task-title').invoke('text').then(title => {
          cy.get('[data-testid="task-list"]').children().first()
            .find('.btn-delete').click({ force: true });
          cy.get('[data-testid="task-list"]').should('not.contain', title.trim());
        });
    });

    it('deve decrementar o total nas estatísticas após excluir', () => {
      cy.get('[data-testid="stat-total"]').invoke('text').then(before => {
        cy.get('.btn-delete').first().click({ force: true });
        cy.get('[data-testid="stat-total"]').should('have.text', String(parseInt(before) - 1));
      });
    });
  });

  describe('Concluir / desmarcar tarefa', () => {
    it('deve marcar uma tarefa pendente como concluída', () => {
      cy.get('.task-item:not(.completed)').first().invoke('attr', 'data-id').then(id => {
        cy.get('.task-item:not(.completed)').first().find('.task-check').click();
        cy.get(`[data-testid="task-item-${id}"]`).should('have.class', 'completed');
      });
    });

    it('deve incrementar o contador de concluídas', () => {
      cy.get('[data-testid="stat-done"]').invoke('text').then(before => {
        cy.get('.task-item:not(.completed)').first().find('.task-check').click();
        cy.get('[data-testid="stat-done"]').should('have.text', String(parseInt(before) + 1));
      });
    });
  });

  describe('Editar tarefa', () => {
    it('deve abrir campo de edição ao clicar em editar', () => {
      cy.get('.btn-edit').first().click({ force: true });
      cy.get('.task-edit-input').should('be.visible');
    });

    it('deve salvar o novo título ao confirmar edição', () => {
      cy.get('.btn-edit').first().click({ force: true });
      cy.get('.task-edit-input').first().clear().type('Título editado pelo Cypress');
      cy.get('[class*="btn-edit"]').first().click({ force: true });
      cy.get('[data-testid="task-list"]').should('contain', 'Título editado pelo Cypress');
    });
  });

  describe('Filtros de tarefas', () => {
    it('deve mostrar apenas tarefas pendentes ao clicar em Pendentes', () => {
      cy.get('[data-testid="filter-pending"]').click();
      cy.get('.task-item').each($el => {
        cy.wrap($el).should('not.have.class', 'completed');
      });
    });

    it('deve mostrar apenas tarefas concluídas ao clicar em Concluídas', () => {
      cy.get('[data-testid="filter-done"]').click();
      cy.get('.task-item').each($el => {
        cy.wrap($el).should('have.class', 'completed');
      });
    });

    it('deve mostrar todas as tarefas ao clicar em Todas', () => {
      cy.get('[data-testid="filter-pending"]').click();
      cy.get('[data-testid="filter-all"]').click();
      cy.get('[data-testid="stat-total"]').invoke('text').then(total => {
        cy.get('.task-item').should('have.length', parseInt(total));
      });
    });

    it('o filtro ativo deve ter a classe active', () => {
      cy.get('[data-testid="filter-pending"]').click();
      cy.get('[data-testid="filter-pending"]').should('have.class', 'active');
      cy.get('[data-testid="filter-all"]').should('not.have.class', 'active');
    });
  });

  describe('Estado vazio', () => {
    it('deve exibir estado vazio quando não há tarefas no filtro', () => {
      cy.request('POST', 'http://localhost:3001/api/tasks/reset').then(() => {
        return cy.request('PUT', 'http://localhost:3001/api/tasks/3', { completed: false });
      }).then(() => {
        cy.visit(FRONTEND_URL);
        cy.get('[data-testid="loading"]').should('not.be.visible');
        cy.get('[data-testid="task-list"]').children().should('have.length.greaterThan', 0);
        cy.get('[data-testid="filter-done"]').click();
        cy.get('[data-testid="empty-state"]').should('be.visible');
      });
    });
  });
});