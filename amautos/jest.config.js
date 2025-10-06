/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest", // Transform TS/TSX
  testEnvironment: "jest-environment-jsdom", // For React testing
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Setup jest-dom
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // Your @ alias
    "\\.(css|scss|sass)$": "identity-obj-proxy", // Mock CSS
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock images
  },
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
};
