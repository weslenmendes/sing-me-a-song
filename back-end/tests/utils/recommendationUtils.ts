import prisma from "../../src/database.js";

const searchByName = (name) => {
  return prisma.recommendation.findUnique({
    where: { name },
  });
};

const searchById = (id) => {
  return prisma.recommendation.findUnique({
    where: { id },
  });
};

const createPath = (id?: number, amount?: number) => {
  return {
    recommendations: "/recommendations",
    upvote: `/recommendations/${id}/upvote`,
    downvote: `/recommendations/${id}/downvote`,
    specificRecommendation: `/recommendations/${id}`,
    randomRecommendation: "/recommendations/random",
    topRecommendation: `/recommendations/top/${amount}`,
  };
};

const removeAllData = async () => {
  await prisma.$transaction([
    prisma.$executeRaw`TRUNCATE TABLE recommendations RESTART IDENTITY`,
  ]);
};

export { createPath, searchByName, searchById, removeAllData };
