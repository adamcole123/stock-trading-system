/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['<rootDir>/**/__tests__/**/*.spec.ts'],
  testPathIgnorePatterns: ['/node_modules/'],
  collectCoverageFrom: ["src/**/*.{ts,js}"],
  coverageDirectory: './coverage',
  coveragePathIgnorePatterns: ["/node_modules/", "src/SocketController.ts", "src/index.ts", "src/application/repositories"],
  coverageReporters: ["clover", "json", "lcov", ["text", {"skipFull": true}]],
  globals: { 'ts-jest': { diagnostics: false } },
  // globalSetup: "<rootDir>/test/globalSetup.ts",
  // globalTeardown: "<rootDir>/test/globalTeardown.ts",
  // setupFilesAfterEnv: [
  //   "<rootDir>/test/setupFile.ts"
  // ],
  transform: {},
};