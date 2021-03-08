// Turn on cypress intellisense
/// <reference types="Cypress" />

beforeEach(() => {
  // create a fixture and give the simulated HTTP response a name
  cy.fixture('courses.json').as('coursesJSON');

  // start the mock cypress back end
  cy.server();

  // define the route to mock
  cy.route('/api/courses', '@coursesJSON').as('courses');
  cy.visit('/');
});

describe('Home Page', () => {
  it('should display a list of courses', () => {
    // Act
    cy.wait('@courses'); // wait for courses event to finish

    // Assert
    cy.contains('All Courses');
    cy.get('mat-card').should('have.length', 9);
  });

  it('should display advanced courses on click', () => {
    cy.get('.mat-tab-label').should('have.length', 2);
    cy.get('.mat-tab-label').last().click();

    // Cypress will handle the asyncronous nature of the click/change tab animation for us.

    cy.get('.mat-tab-body-active .mat-card-title')
      .its('length')
      .should('be.gt', 1);

    cy.get('.mat-tab-body-active .mat-card-title')
      .first()
      .should('contain', 'Angular Security Course');
  });
});
