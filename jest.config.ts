import type { Config } from "jest";
import nextJest from "next/jest";

const createJestConfig = nextJest({ dir: "./" });

const customJestConfig: Config = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"], // Ensure setup file exists
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  transform: {
    "^.+\\.(ts|tsx)$": ["babel-jest", { presets: ["next/babel"] }], // Ensure Babel compatibility
  },
  moduleDirectories: ["node_modules", "<rootDir>/src"], // Ensure Jest finds modules
};

export default createJestConfig(customJestConfig);
