const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    baseUrl: "http://localhost:3000",
    env: {
      URL_API: "http://localhost:5000/recomentations",
    },
  },
});
