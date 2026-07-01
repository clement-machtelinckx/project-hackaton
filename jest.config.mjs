import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

/** @type {import('jest').Config} */
const config = {
    testEnvironment: "node",
    testMatch: ["<rootDir>/tests/**/*.test.ts"],
    // next/jest réécrit les imports `@/...` via SWC, mais pas la chaîne passée à
    // jest.mock("@/...") : on mappe explicitement l'alias pour le resolver Jest.
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/$1",
    },
};

export default createJestConfig(config);
