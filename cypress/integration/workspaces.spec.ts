describe('Workspaces tests', () => {
  beforeEach(() => {
    cy.visit('/auth/login');

    cy.get('input[name=email]').type('admin@admin.com');
    cy.get('input[name=password]').type('admin123');

    cy.get('button[type=submit]').click();

    cy.url().should('not.include', 'login');
  });

  it('Should be able to create a new workspace', () => {
    cy.contains('New workspace').click();
    cy.get('input[name=name]').type('Test workspace');
    cy.get('button[type=submit]').dblclick();
    cy.contains('Test workspace');
  });

  it('Should not be able to create a new workspace without name', () => {
    cy.contains('New workspace').click();
    cy.get('button[type=submit]').click();
    cy.contains('is required');
  });

  it('Should be able to edit a workspace', () => {
    cy.contains('tr', 'Test workspace').find('.mat-menu-trigger').click();
    cy.contains('Edit').click();
    cy.get('input[name=name]').clear().type('Test workspace - renamed');
    cy.get('button[type=submit]').click();
    cy.contains('Test workspace - renamed');
  });

  it('Should be able to delete a workspace', () => {
    cy.contains('tr', 'Test workspace - renamed').find('.mat-menu-trigger').click();
    cy.contains('Delete').click();
    cy.get('.mat-dialog-container').contains('button', 'Delete').click();
    cy.contains('Test workspace - renamed').should('not.exist');
  });
});
