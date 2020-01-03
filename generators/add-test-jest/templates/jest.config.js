/* eslint-disable max-len */
module.exports = {
  // The preset is a node environment that mimics the environment of a React Native  app. Because it doesn't load any DOM or browser APIs, it greatly improves Jest's startup time.
  verbose           : true,
  // preset            : 'react-native',
  // It helps you greatly improve the test speed.It does so by creating a cache of compiled modules so that it doesn't have to compile the node_modules every time we run tests.
  cacheDirectory    : './cache',
  // Defines the files which we want to skip while generating coverage reports.
  // coveragePathIgnorePatterns: ['./src'],
  // Defines the threshold limit for all the tests to pass.If the coverage is less than the defined limit, the tests would fail.This helped us in keeping code coverage high throughout development.
  "coverageThreshold": {
    "global": {
      "branches": 90,
      "functions": 90,
      "lines": 90,
      "statements": 95
    }
  },

  collectCoverageFrom: [
    './src/**/*.ts',
    './src/**/*.tsx',
    '!**/node_modules/**',
    '!**/vendor/**'
  ],

  // All the npm modules which need to be transpiled are added here.These modules are basically ES6/ 7 modules.
  transformIgnorePatterns: [],

  setupFilesAfterEnv   : ['<rootDir>/test-setup.js'],
  moduleFileExtensions : ["ts", "tsx", "js", "json", "jsx", "node"],

  notify     : true,
  notifyMode : 'always'
};
