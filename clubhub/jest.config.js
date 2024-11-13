/** @type {import('ts-jest').JestConfigWithTsJest} **/

import { pathsToModuleNameMapper } from "ts-jest";
import { compilerOptions } from "./tsconfig.json";
module.exports = {
  testEnvironment: "jsdom",
  preset: "ts-jest",

  transform: {
    "^.+.tsx?$": ["ts-jest", {}],
  },
  // Map TypeScript paths to Jest module names
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
};
