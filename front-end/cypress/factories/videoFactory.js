import { faker } from "@faker-js/faker";

export const createVideo = () => {
  return {
    name: faker.music.songName(),
    url: "https://www.youtube.com/watch?v=" + faker.random.alpha(11),
  };
};

export const createAValidVideo = () => ({
  name: "Falamansa - Xote dos Milagres",
  url: "https://www.youtube.com/watch?v=chwyjJbcs1Y",
});
