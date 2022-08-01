import { jest } from "@jest/globals";

import {
  recommendationService,
  CreateRecommendationData,
} from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import recommendationsFactory, {
  IOptions,
} from "../factories/recommendationsFactory.js";
import * as scenarioUtils from "./../utils/scenariosUtils.js";

jest.mock("../../src/repositories/recommendationRepository");

const specificAmount = 100;
const specificOptions = {
  id: {},
  score: { minScore: specificAmount + 1, maxScore: specificAmount * 3 },
};
const generatedRecommendations = {
  lowerRecommendation: recommendationsFactory.lowerRecommendation(),
  higherRecommendation: recommendationsFactory.higherRecommendation(),
  specificRecommendation: [
    recommendationsFactory.createARecommendationData(specificOptions),
    recommendationsFactory.createARecommendationData(specificOptions),
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  jest.resetAllMocks();
});

describe("Recommendation service test suite", () => {
  describe("create a recommendation", () => {
    it("should be able create a recommendation", async () => {
      const video: CreateRecommendationData =
        recommendationsFactory.createARecommendation();

      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValueOnce(null);
      jest
        .spyOn(recommendationRepository, "create")
        .mockResolvedValueOnce(null);

      const result = await recommendationService.insert(video);

      expect(result).toBeNull;
      expect(recommendationRepository.findByName).toBeCalledTimes(1);
      expect(recommendationRepository.create).toBeCalledTimes(1);
    });

    it("should not be able create already existing recommendation", async () => {
      const options: IOptions = {
        id: { choicedId: 1 },
        score: { minScore: 15 },
      };
      const foundedVideo =
        recommendationsFactory.createARecommendationData(options);

      jest
        .spyOn(recommendationRepository, "findByName")
        .mockResolvedValueOnce(foundedVideo);
      jest
        .spyOn(recommendationRepository, "create")
        .mockResolvedValueOnce(null);

      const promise = recommendationService.insert(foundedVideo);
      const expectedError = {
        type: "conflict",
        message: "Recommendations names must be unique",
      };

      expect(promise).rejects.toEqual(expectedError);
      expect(recommendationRepository.findByName).toBeCalledTimes(1);
      expect(recommendationRepository.create).toBeCalledTimes(0);
    });
  });

  describe("add a upvote on a specific recommendation", () => {
    it("should be able a add upvote in a existent recommendation", async () => {
      const options: IOptions = {
        id: { choicedId: 1 },
        score: { minScore: 15 },
      };
      const foundedVideo =
        recommendationsFactory.createARecommendationData(options);

      jest
        .spyOn(recommendationRepository, "find")
        .mockResolvedValueOnce(foundedVideo);
      jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValueOnce(null);

      const result = await recommendationService.upvote(foundedVideo.id);

      expect(result).toBeNull;
      expect(recommendationRepository.find).toBeCalledTimes(1);
      expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    });

    it("should not be able a add upvote in a not existent recommendation", async () => {
      const recommendationId = 1;

      jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
      jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValueOnce(null);

      const promise = recommendationService.upvote(recommendationId);
      const expectedError = { type: "not_found", message: "" };

      expect(promise).rejects.toEqual(expectedError);
      expect(recommendationRepository.find).toBeCalledTimes(1);
      expect(recommendationRepository.updateScore).toBeCalledTimes(0);
    });
  });

  describe("add a downvote on a specific recommendation", () => {
    it("should be able to add a downvote in an existing recommendation", async () => {
      const options: IOptions = {
        id: { choicedId: 1 },
        score: { minScore: 15 },
      };
      const foundedVideo =
        recommendationsFactory.createARecommendationData(options);
      const updatedVideo = {
        ...foundedVideo,
        score: foundedVideo.score + 1,
      };

      jest
        .spyOn(recommendationRepository, "find")
        .mockResolvedValueOnce(foundedVideo);
      jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValueOnce(updatedVideo);

      const result = await recommendationService.downvote(foundedVideo.id);

      expect(result).toBeNull;
      expect(recommendationRepository.find).toBeCalledTimes(1);
      expect(recommendationRepository.updateScore).toBeCalledTimes(1);
    });

    it("should not be able add a downvote in a not existing recommendation", async () => {
      const recommendationId = 1;

      jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);
      jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValueOnce(null);

      const promise = recommendationService.downvote(recommendationId);
      const expectedError = { type: "not_found", message: "" };

      expect(promise).rejects.toEqual(expectedError);
      expect(recommendationRepository.find).toBeCalledTimes(1);
      expect(recommendationRepository.updateScore).toBeCalledTimes(0);
    });

    it("should be able remove an existing recommendation with -5 votes", async () => {
      const options: IOptions = {
        id: {},
        score: { choicedScore: -5 },
      };
      const foundedVideo =
        recommendationsFactory.createARecommendationData(options);
      const updatedVideo = {
        ...foundedVideo,
        score: foundedVideo.score - 1,
      };

      jest
        .spyOn(recommendationRepository, "find")
        .mockResolvedValueOnce(foundedVideo);
      jest
        .spyOn(recommendationRepository, "updateScore")
        .mockResolvedValueOnce(updatedVideo);
      jest
        .spyOn(recommendationRepository, "remove")
        .mockResolvedValueOnce(null);

      const result = await recommendationService.downvote(foundedVideo.id);

      expect(result).toBeNull;
      expect(recommendationRepository.find).toBeCalledTimes(1);
      expect(recommendationRepository.updateScore).toBeCalledTimes(1);
      expect(recommendationRepository.remove).toBeCalledTimes(1);
    });
  });

  describe("get all recommendations", () => {
    it("should be able to get all the recommendations", async () => {
      const options: IOptions = {
        id: {},
        score: {},
      };
      const foundedRecommendations = [
        recommendationsFactory.createARecommendationData(options),
        recommendationsFactory.createARecommendationData(options),
      ];

      jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValueOnce(foundedRecommendations);

      const result = await recommendationService.get();

      expect(result).toEqual(foundedRecommendations);
      expect(recommendationRepository.findAll).toBeCalledTimes(1);
    });
  });

  describe("get a specific recommendation", () => {
    it("should be able to get a specific recommendation", async () => {
      const options: IOptions = {
        id: {},
        score: {},
      };
      const foundedRecommendation =
        recommendationsFactory.createARecommendationData(options);

      jest
        .spyOn(recommendationRepository, "find")
        .mockResolvedValueOnce(foundedRecommendation);

      const result = await recommendationService.getById(
        foundedRecommendation.id
      );

      expect(result).toEqual(foundedRecommendation);
      expect(recommendationRepository.find).toBeCalledTimes(1);
    });

    it("should not be able to get a not existent specific recommendation", async () => {
      const recommendationId = 1;

      jest.spyOn(recommendationRepository, "find").mockResolvedValueOnce(null);

      const promise = recommendationService.getById(recommendationId);
      const expectedError = { type: "not_found", message: "" };

      expect(promise).rejects.toEqual(expectedError);
      expect(recommendationRepository.find).toBeCalledTimes(1);
    });
  });

  describe("get a random recommendation", () => {
    it("should be able to get a random recommendation with score greater than 10", async () => {
      const recommendations = generatedRecommendations.higherRecommendation;
      const randomResult = 0.5;
      const randomIndex = 1;

      jest.spyOn(Math, "random").mockImplementationOnce(() => randomResult);
      jest.spyOn(Math, "floor").mockImplementationOnce(() => randomIndex);
      jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValueOnce(recommendations);

      const result = await recommendationService.getRandom();

      expect(result).toEqual(recommendations[randomIndex]);
      expect(recommendationRepository.findAll).toBeCalledTimes(1);
      expect(Math.random).toBeCalled();
      expect(Math.floor).toBeCalled();
    });

    it("should be able to get a random recommendation with score lower than 10", async () => {
      const recommendations = generatedRecommendations.lowerRecommendation;
      const randomResult = 0.7;
      const randomIndex = 1;

      jest.spyOn(Math, "random").mockImplementationOnce(() => randomResult);
      jest.spyOn(Math, "floor").mockImplementationOnce(() => randomIndex);
      jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValueOnce(recommendations);

      const result = await recommendationService.getRandom();

      expect(result).toEqual(recommendations[randomIndex]);
      expect(recommendationRepository.findAll).toBeCalledTimes(1);
      expect(Math.random).toBeCalled();
      expect(Math.floor).toBeCalled();
    });

    it("should not be able to get a random recommendation with no recommendations in database", async () => {
      const recommendations = [];
      const randomResult = 0.7;

      jest.spyOn(Math, "random").mockImplementation(() => randomResult);
      jest
        .spyOn(recommendationRepository, "findAll")
        .mockResolvedValue(recommendations);

      const promise = recommendationService.getRandom();
      const expectedError = { type: "not_found", message: "" };

      expect(promise).rejects.toEqual(expectedError);
      expect(recommendationRepository.findAll).toBeCalledTimes(1);
      expect(Math.random).toBeCalled();
    });
  });

  describe("get recommendations by amount", () => {
    it("should be able to get an recommendation by amount", async () => {
      const amount = specificAmount;
      const recommendationInTop =
        generatedRecommendations.specificRecommendation;

      jest
        .spyOn(recommendationRepository, "getAmountByScore")
        .mockResolvedValueOnce(recommendationInTop);

      const result = await recommendationService.getTop(amount);

      expect(result).toEqual(recommendationInTop);
      expect(recommendationRepository.getAmountByScore).toBeCalled();
    });
  });
});
