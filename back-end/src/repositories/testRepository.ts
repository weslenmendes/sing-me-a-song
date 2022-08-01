import prisma from "../database.js";

interface IRecommendation {
  name: string;
  youtubeLink: string;
  score?: number;
}

async function create(data: IRecommendation) {
  return prisma.recommendation.create({
    data: data,
    select: {
      id: true,
      name: true,
      youtubeLink: true,
      score: true,
    },
  });
}

async function createMany(data: IRecommendation[]) {
  return prisma.recommendation.createMany({
    data: data,
  });
}

async function removeAll() {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`,
  ]);
}

export const testRepository = {
  create,
  createMany,
  removeAll,
};
