Cypress.Commands.add("resetAllRecommendations", () => {
  cy.request("POST", "http://localhost:5000/recommendations/reset", {});
});

Cypress.Commands.add("createRecommendation", () => {
  const video = {
    name: "Falamansa - Xote dos Milagres",
    youtubeLink: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
  };

  cy.request("POST", "http://localhost:5000/recommendations", video);
});

Cypress.Commands.add("createScenario", (amount = 1, score = 0) => {
  cy.request(
    "POST",
    `http://localhost:5000/recommendations/create/${amount}?score=${score}`,
    {},
  );
});
