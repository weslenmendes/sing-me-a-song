Cypress.Commands.add("resetAllRecommendations", () => {
  cy.request("POST", "http://localhost:5000/recommendations/reset", {});
});
