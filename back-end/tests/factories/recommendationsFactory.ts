import { faker } from "@faker-js/faker";
import { Recommendation } from "@prisma/client";

const URL_YOUTUBE = "https://www.youtube.com/watch?v=";
const ARBITRARY_MIN_ID = 1;
const ARBITRARY_MAX_ID = 100;
const ARBITRARY_MIN_SCORE = 1;
const ARBITRARY_MAX_SCORE = 100;

export interface IOptions {
  id: {
    choicedId?: number;
  };
  score: {
    choicedScore?: number;
    minScore?: number;
    maxScore?: number;
    lower?: true;
  };
}

interface IRecommendation {
  name: string;
  youtubeLink: string;
}

const generateId = (options) => {
  const id = faker.datatype.number({
    min: ARBITRARY_MIN_ID,
    max: ARBITRARY_MAX_ID,
    precision: 1,
  });

  return options?.choicedId || id;
};

const generateScore = (score) => {
  const minScore = score?.minScore || ARBITRARY_MIN_SCORE;
  const maxScore = score?.maxScore || ARBITRARY_MAX_SCORE;

  const scoreGenerated = faker.datatype.number({
    min: +minScore,
    max: +maxScore,
    precision: 1,
  });

  return score?.choicedScore || scoreGenerated;
};

const createARecommendation = (): IRecommendation => {
  const name = faker.music.songName();
  const youtubeLink = URL_YOUTUBE + faker.random.alphaNumeric(6);

  return {
    name,
    youtubeLink,
  };
};

const createARecommendationData = (options: IOptions): Recommendation => {
  const id = generateId(options.id);
  const recommendation = createARecommendation();
  const score = generateScore(options.score);

  return {
    id,
    ...recommendation,
    score,
  };
};

const lowerRecommendation = () => {
  const options: IOptions = {
    id: {},
    score: { minScore: 1, maxScore: 9 },
  };

  return [
    createARecommendationData(options),
    createARecommendationData(options),
  ];
};

const higherRecommendation = () => {
  const options: IOptions = {
    id: {},
    score: { minScore: 10, maxScore: 100 },
  };

  return [
    createARecommendationData(options),
    createARecommendationData(options),
  ];
};

export default {
  createARecommendation,
  createARecommendationData,
  lowerRecommendation,
  higherRecommendation,
};
