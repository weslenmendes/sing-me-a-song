import supertest from "supertest";

// import { app } from "../../src/app.js";
import app from "./../../src/app.js";
import prisma from "../../src/database.js";

import recommendationFactory from "../factories/recommendationsFactory.js";
import {
  createPath,
  searchByName,
  removeAllData,
} from "../utils/recommendationUtils.js";
import {
  createScenarioWithARecommendation,
  createScenarioWithARecommendationSpecificVote,
  createScenarioWithManyRecomendations,
  createScenarioWithManyAmountsAndDistribuitedScore,
} from "../utils/scenariosUtils.js";

const agent = supertest(app);

beforeEach(async () => {
  await removeAllData();
});

describe("Recommendations tests suite", () => {
  describe("POST /recommendations - create a recommendation", () => {
    it("should be able create a new recommendation", async () => {
      const recommendationData = recommendationFactory.createARecommendation();
      const url = createPath().recommendations;

      const response = await agent.post(url).send(recommendationData);
      expect(response.statusCode).toBe(201);

      const recommendationCreated = await searchByName(recommendationData.name);
      expect(recommendationCreated).toBeDefined();
    });

    it("should not be able create a new recommendation, if it already exists", async () => {
      const existentRecommendation = await createScenarioWithARecommendation();
      const url = createPath().recommendations;

      delete existentRecommendation.id;
      delete existentRecommendation.score;

      const response = await agent.post(url).send(existentRecommendation);
      expect(response.statusCode).toBe(409);

      const recommendationCreated = await searchByName(
        existentRecommendation.name
      );
      expect(recommendationCreated).toBeTruthy();
    });

    it("should not be able create a new recommendation with empty name", async () => {
      const recommendationData =
        recommendationFactory.createARecommendationWithoutName();
      const url = createPath().recommendations;

      const response = await agent.post(url).send(recommendationData);
      expect(response.statusCode).toBe(422);
    });

    it("should not be able create a new recommendation with empty link", async () => {
      const recommendationData =
        recommendationFactory.createARecommendationWithoutLink();
      const url = createPath().recommendations;

      const response = await agent.post(url).send(recommendationData);
      expect(response.statusCode).toBe(422);
    });

    it("should not be able create a new recommendation with invalid link", async () => {
      const recommendationData =
        recommendationFactory.createARecommendationWithInvalidLink();
      const url = createPath().recommendations;

      const response = await agent.post(url).send(recommendationData);
      expect(response.statusCode).toBe(422);
    });
  });

  describe("POST /recommendations/:id/upvote - add a upvote", () => {
    it("should be able add upvote a existent recommendation", async () => {
      const existentRecommendation = await createScenarioWithARecommendation();
      const url = createPath(existentRecommendation.id).upvote;

      const result = await agent.post(url);

      const votedRecommendation = await searchByName(
        existentRecommendation.name
      );

      expect(result.statusCode).toBe(200);
      expect(votedRecommendation.score).toBe(1);
    });

    it("should not be able add upvote, if there is no recommendation", async () => {
      const arbitraryId = 5;
      const url = createPath(arbitraryId).upvote;

      const result = await agent.post(url);
      expect(result.statusCode).toBe(404);
    });
  });

  describe("POST /recommendations/:id/downvote - add a downvote", () => {
    it("should be able add a downvote a existent recommendation", async () => {
      const existentRecommendation = await createScenarioWithARecommendation();
      const url = createPath(existentRecommendation.id).downvote;

      const result = await agent.post(url);

      const votedRecommendation = await searchByName(
        existentRecommendation.name
      );

      expect(result.statusCode).toBe(200);
      expect(votedRecommendation.score).toBe(-1);
    });

    it("should be able add a downvote, and remove a recommendation, if it has less than -5 in the score", async () => {
      const existentRecommendation =
        await createScenarioWithARecommendationSpecificVote(-5);
      const url = createPath(existentRecommendation.id).downvote;

      const result = await agent.post(url);

      const votedRecommendation = await searchByName(
        existentRecommendation.name
      );

      expect(result.statusCode).toBe(200);
      expect(votedRecommendation).toBeNull();
    });

    it("should not be able add a downvote, if there is no recommendation", async () => {
      const arbitraryId = 5;
      const url = createPath(arbitraryId).downvote;

      const result = await agent.post(url);
      expect(result.statusCode).toBe(404);
    });
  });

  describe("GET /recommendations - get recommendations", () => {
    it("should be able returns the last 10 recommendations", async () => {
      await createScenarioWithManyRecomendations(20);
      const url = createPath().recommendations;

      const result = await agent.get(url);

      expect(result.body.length).toBe(10);
      expect(result.statusCode).toBe(200);
      expect(result.body[0]).toHaveProperty("id");
      expect(result.body[0]).toHaveProperty("name");
      expect(result.body[0]).toHaveProperty("youtubeLink");
      expect(result.body[0]).toHaveProperty("score");
    });
  });

  describe("GET /recommendations/:id - get specific recommendation", () => {
    it("should be able get a specific recommendation by id", async () => {
      const recommendation = await createScenarioWithARecommendation();
      const url = createPath(recommendation.id).specificRecommendation;

      const result = await agent.get(url);

      expect(result.statusCode).toBe(200);
      expect(result.body).toHaveProperty("id");
      expect(result.body).toHaveProperty("name");
      expect(result.body).toHaveProperty("youtubeLink");
      expect(result.body).toHaveProperty("score");
    });

    it("should not be able get a specific recommendation by id, if the given id does not exist", async () => {
      const arbitraryId = 5;
      const url = createPath(arbitraryId).specificRecommendation;

      const result = await agent.get(url);
      expect(result.statusCode).toBe(404);
    });
  });

  describe("GET /recommendations/random - get random recommendations", () => {
    it("should be able get a random recommendation", async () => {
      await createScenarioWithManyAmountsAndDistribuitedScore(10);
      const url = createPath().randomRecommendation;

      const result = await agent.get(url);
      expect(result.body).toHaveProperty("score");
    });

    it("should be able get random recommendations with score greater than 10", async () => {
      await createScenarioWithManyAmountsAndDistribuitedScore(10, 100);
      const url = createPath().randomRecommendation;

      const result = await agent.get(url);
      expect(result.body.score).toBeGreaterThan(10);
    });

    it("should be able get random recommendations with score lower than 10", async () => {
      await createScenarioWithManyAmountsAndDistribuitedScore(10, 0);
      const url = createPath().randomRecommendation;

      const result = await agent.get(url);
      expect(result.body.score).toBeLessThanOrEqual(10);
    });

    it("should be able a status code 404, when there are no recommendations", async () => {
      const url = createPath().randomRecommendation;

      const result = await agent.get(url);
      expect(result.statusCode).toBe(404);
    });
  });

  describe("GET /recommendations/top/:amount - get recommendations by amount", () => {
    it("should be able get a recommendation with amount of 10", async () => {
      const amount = 10;
      const arbitraryId = 0;
      const url = createPath(arbitraryId, amount).topRecommendation;
      await createScenarioWithManyAmountsAndDistribuitedScore(40, 60);

      const result = await agent.get(url);

      expect(result.body.length).toBe(amount);
      expect(result.body[0].score).toBeGreaterThanOrEqual(
        result.body[amount - 1].score
      );
    });
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
