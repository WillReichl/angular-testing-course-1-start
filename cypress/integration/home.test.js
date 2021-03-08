// Turn on cypress intellisense
/// <reference types="Cypress" />

describe('Home Page', () => {
  it('should display a list of courses', () => {
    // create a fixture and give the simulated HTTP response a name
    cy.fixture('courses.json').as('coursesJSON');

    // start the mock cypress back end
    cy.server();

    // define the route to mock
    cy.route('/api/courses', '@coursesJSON').as('courses');

    // Act
    cy.visit('/');
    cy.contains('All Courses');
    cy.wait('@courses'); // wait for courses event to finish

    // Assert
    cy.get('mat-card').should('have.length', 9);
  });
});
