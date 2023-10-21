const nxPreset = require('@nx/jest/preset').default;
const path = require('path');


module.exports = {
  ...nxPreset,
  setupFilesAfterEnv: [path.resolve(__dirname, './test-setup.ts')]
};
