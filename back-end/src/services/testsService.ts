import { testRepository } from "./../repositories/testRepository.js";
import {
  createScenarioWithARecommendationSpecificVote,
  createScenarioWithARecommendation,
  createScenarioWithManyAmountsAndDistribuitedScore,
} from "../../tests/utils/scenariosUtils.js";

async function create(amount: number, score: number) {
  if (amount === 1) {
    if (score > -Infinity) {
      await createScenarioWithARecommendationSpecificVote(score);
      return;
    }

    await createScenarioWithARecommendation();
    return;
  }

  await createScenarioWithManyAmountsAndDistribuitedScore(amount, score);
}

async function removeAll() {
  await testRepository.removeAll();
}

export const testsService = {
  create,
  removeAll,
};
