/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-babel", // Usar Babel para JSX
  testEnvironment: "jest-environment-jsdom", // Para tests de React
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Setup jest-dom
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1", // Tu alias @
    "\\.(css|scss|sass)$": "identity-obj-proxy", // Mock CSS
    "\\.(png|jpg|jpeg|gif|svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock imágenes
  },
  transform: {
    "^.+\\.[tj]sx?$": "babel-jest", // Transformar TSX/JSX con Babel
  },
  transformIgnorePatterns: [
    "/node_modules/", // Ignorar node_modules
  ],
};
