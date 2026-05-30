const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {},
    // baseUrl is set per spec via env or overridden in CI
    specPattern: 'cypress/e2e/**/*.cy.js',
    screenshotOnRunFailure: true,
  },
});
