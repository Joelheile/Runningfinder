/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  preset: "ts-jest/presets/default-esm",
  globals: {
    "ts-jest": {
      useESM: true,
    },
  },
  transform: {
    "^.+\\.ts$": "ts-jest",
  },
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/playwright-tests/"],
};
