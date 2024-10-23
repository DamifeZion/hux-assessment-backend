module.exports = {
   preset: 'ts-jest',
   testEnvironment: 'node',
   testMatch: ['**/__tests__/**/*.test.ts'], // This looks for test files in __tests__ folder
   globals: {
     'ts-jest': {
       tsconfig: 'tsconfig.json',
     },
   },
   moduleFileExtensions: ['ts', 'js'],
   coverageDirectory: './coverage',
   collectCoverageFrom: ['src/**/*.ts'],
 };
 