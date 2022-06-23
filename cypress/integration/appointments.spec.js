describe('Appointments', () => {
  beforeEach(() => {
    cy.request('GET', '/api/debug/reset');
    cy.visit('/');
    cy.contains('[data-testid]', 'Monday');
  });

  it('should book an interview', () => {
    cy.get('[alt=Add]').first().click();
    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones', {
      delay: 100,
    });
    cy.get('[alt="Sylvia Palmer"]').click();
    cy.contains('Save').click();
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  });

  it('should edit an interview', () => {
    // cy.get('.appointment__card--show').first().trigger('mouseover');
    cy.get('[alt=Edit]').first().click({force: true});

    cy.get('[alt="Tori Malcolm"]').click();

    cy.get('[data-testid=student-name-input]').clear().type('new interviewer');
    cy.contains('Save').click();
    cy.contains('.appointment__card--show', 'Tori Malcolm');
  });

  it('should cancel an interview', () => {
    cy.get('[alt=Delete]').first().click({force: true});

    cy.contains('Confirm').click();

    cy.contains('Deleting').should('exist');
    cy.contains('Deleting').should('not.exist', 'Deleting');

    cy.get('.appointment__card--show').should('not.exist');
  });
});
