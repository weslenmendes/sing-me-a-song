import recommendationsFactory from "../factories/recommendationsFactory.js";
import { testRepository } from "./../../src/repositories/testRepository.js";

export const createScenarioWithARecommendation = async () => {
  const recommendation = recommendationsFactory.createARecommendation();

  const createRecommendation = await testRepository.create(recommendation);

  return createRecommendation;
};

export const createScenarioWithARecommendationSpecificVote = async (
  vote: number
) => {
  const recomendation = recommendationsFactory.createARecommendation();

  const createRecommendation = await testRepository.create({
    ...recomendation,
    score: vote,
  });

  return createRecommendation;
};

export const createScenarioWithManyRecomendations = async (total: number) => {
  const allRecommendations = [];

  for (let i = 0; i < total; i++) {
    const recommendation = recommendationsFactory.createARecommendation();
    recommendation.name += ` ${i}`;
    allRecommendations.push(recommendation);
  }

  await testRepository.createMany(allRecommendations);
};

function getScore(minScore: number, maxScore: number) {
  return Math.floor(Math.random() * (maxScore - minScore) + minScore);
}

function createMultipleData(
  amount: number,
  minScore: number,
  maxScore: number,
  array
) {
  for (let i = 0; i < amount; i++) {
    const score = getScore(minScore, maxScore);
    const recommendationData = recommendationsFactory.createARecommendation();
    recommendationData.name += ` ${i}`;

    array.push({ ...recommendationData, score });
  }
}

export async function createScenarioWithManyAmountsAndDistribuitedScore(
  amount: number,
  highScorePercentage = 70
) {
  const highScoreAmount = Math.round(amount * (highScorePercentage / 100));
  const lowScoreAmount = amount - highScoreAmount;

  const recommendationDataArray = [];

  createMultipleData(highScoreAmount, 11, 100, recommendationDataArray);
  createMultipleData(lowScoreAmount, -5, 10, recommendationDataArray);

  await testRepository.createMany(recommendationDataArray);
}
