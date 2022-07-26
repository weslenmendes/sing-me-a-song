/// <reference types="cypress" />

import * as videoFactory from "./../../factories/videoFactory.js";

describe("Add Recommendations", () => {
  beforeEach(() => {
    cy.resetAllRecommendations();
  });

  it("should be able to add recommendation", () => {
    const video = videoFactory.createAValidVideo();

    cy.visit("/");

    cy.get('input[placeholder="Name"]').type(video.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(video.url);

    cy.intercept("POST", "/recommendations").as("addRecommendation");
    cy.get("button").click();
    cy.wait("@addRecommendation");

    cy.contains(video.name).should("be.visible");
  });

  it("should not be able to add recommendation without link", () => {
    const video = videoFactory.createVideo();

    cy.visit("/");

    cy.get('input[placeholder="Name"]').type(video.name);

    cy.intercept("POST", "/recommendations").as("addRecommendation");
    cy.get("button").click();
    cy.wait("@addRecommendation").its("response.statusCode").should("eq", 422);

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Error creating recommendation!");
    });
  });
});
