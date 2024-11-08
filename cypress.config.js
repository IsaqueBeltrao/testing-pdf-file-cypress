const { readPdf } = require('./cypress/support/helper')

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        readPdf
      })
    },
  },
};
