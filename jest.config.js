// const { pathsToModuleNameMapper } = require('ts-jest/utils');
// const { compilerOptions } = require('./tsconfig');

// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node',
//   testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
//   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
//   globals: {
//     'ts-jest': {
//       diagnostics: false
//     }
//   }
// };

const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig');

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ["**/__tests__/**/*.+(ts|tsx)", "**/?(*.)+(spec|test).+(ts|tsx)"],
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/utils/app/importExports.test.ts"
  ],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  globals: {
    'ts-jest': {
      diagnostics: false
    }
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest"
  }
};
