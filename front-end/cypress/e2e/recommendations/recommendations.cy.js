/// <reference types="cypress" />

import * as videoFactory from "../../factories/videoFactory.js";

beforeEach(() => {
  cy.resetAllRecommendations();
});

describe("Add Recommendations", () => {
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

  it("should not be able to add recommendation without name", () => {
    const video = videoFactory.createVideo();

    cy.visit("/");

    cy.get('input[placeholder="https://youtu.be/..."]').type(video.url);

    cy.intercept("POST", "/recommendations").as("addRecommendation");
    cy.get("button").click();
    cy.wait("@addRecommendation").its("response.statusCode").should("eq", 422);

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Error creating recommendation!");
    });
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

  it("should not be able to add recommendation with invalid link", () => {
    const video = videoFactory.createVideo();
    const invalidUrl = "https://www.driven.com.br/";

    cy.visit("/");

    cy.get('input[placeholder="Name"]').type(video.name);
    cy.get('input[placeholder="https://youtu.be/..."]').type(invalidUrl);

    cy.intercept("POST", "/recommendations").as("addRecommendation");
    cy.get("button").click();
    cy.wait("@addRecommendation").its("response.statusCode").should("eq", 422);

    cy.on("window:alert", (str) => {
      expect(str).to.equal("Error creating recommendation!");
    });
  });
});

describe("Add a vote on a recommendation", () => {
  it("should be able to add upvote on a recommendation", () => {
    cy.createRecommendation();

    const urlBase = "/recommendations";
    const id = 1;
    const urlUpvote = `${urlBase}/${id}/upvote`;
    let actualScore = null;

    cy.intercept("GET", urlBase).as("getRecommendations");
    cy.visit("/");
    cy.wait("@getRecommendations");

    cy.intercept("POST", urlUpvote).as("Upvote");
    cy.get('svg[data-identifier="btnUpvote"]').click();
    cy.wait("@Upvote").its("response.statusCode").should("eq", 200);

    cy.get("article>div:nth-child(3)").then((element) => {
      actualScore = parseInt(element.text());
    });

    cy.get("article div")
      .eq(4)
      .should("contain.text", actualScore + 1);
  });

  it("should be able to add downvote on a recommendation", () => {
    cy.createRecommendation();

    const urlBase = "/recommendations";
    const id = 1;
    const urlDownvote = `${urlBase}/${id}/downvote`;
    let actualScore = null;

    cy.intercept("GET", urlBase).as("getRecommendations");
    cy.visit("/");
    cy.wait("@getRecommendations");

    cy.intercept("POST", urlDownvote).as("Downvote");
    cy.get('svg[data-identifier="btnDownvote"]').click();
    cy.wait("@Downvote").its("response.statusCode").should("eq", 200);

    cy.get("article>div:nth-child(3)").then((element) => {
      actualScore = parseInt(element.text());
    });

    cy.get("article div")
      .eq(4)
      .should("contain.text", actualScore - 1);
  });

  it("should remove recommendation if score is less than -5", () => {
    cy.createScenario(1, -5);

    const urlBase = "http://localhost:5000/recommendations";
    const id = 1;

    cy.intercept("GET", urlBase).as("getRecommendations");
    cy.visit("/");
    cy.wait("@getRecommendations");

    cy.intercept("POST", `${urlBase}/${id}/downvote`).as("Downvote");
    cy.get('svg[data-identifier="btnDownvote"]').click();
    cy.wait("@Downvote").its("response.statusCode").should("eq", 200);

    cy.get("article>div:nth-child(3)").should("not.exist");
  });
});

describe("Get recommendations", () => {
  it("should be able to get only 10 recommendations", () => {
    cy.createScenario(15);

    cy.intercept("GET", "/recommendations").as("getRecommendations");
    cy.visit("/");
    cy.wait("@getRecommendations").then(({ response }) => {
      expect(response.statusCode).equal(200);
      expect(response.body.length).equal(10);
      cy.get('div[data-identifier="no-recommendations"]').should("not.exist");
    });
  });

  it("should not be able get any recommendations, if there are no recommendations", () => {
    const urlBase = "http://localhost:5000/recommendations";

    cy.intercept("GET", urlBase).as("getRecommendations");
    cy.visit("/");
    cy.wait("@getRecommendations").then(({ response }) => {
      expect(response.statusCode).equal(200);
      expect(response.body.length).equal(0);
      cy.get('div[data-identifier="no-recommendations"]').should("exist");
    });
  });
});

describe("Get random recommendation", () => {
  it("should be able to get a random recommendation", () => {
    cy.createScenario(5);

    cy.intercept("GET", "/recommendations/random").as(
      "getRandomRecommendation",
    );
    cy.visit("/random");
    cy.wait("@getRandomRecommendation").then(({ response }) => {
      expect(response.statusCode).equal(200);
      expect(response.body).not.equal(null);
      cy.get('div[data-identifier="no-recommendations"]').should("not.exist");
    });
  });
});

describe("Get top recommendations", () => {
  it("should be able get the top 10 recommendations", () => {
    cy.createScenario(5, 100);
    cy.createScenario(5, 200);
    cy.createScenario(5);

    cy.intercept("GET", "/recommendations/top/10").as("getTopRecommendations");
    cy.visit("/top");
    cy.wait("@getTopRecommendations").then(({ response }) => {
      expect(response.statusCode).equal(200);
      expect(response.body.length).equal(10);
      cy.get('div[data-identifier="no-recommendations"]').should("not.exist");
      cy.get("svg[data-identifier='btnUpvote']").its("length").should("eq", 10);
      cy.get("svg[data-identifier='btnDownvote']")
        .its("length")
        .should("eq", 10);
    });
  });
});
