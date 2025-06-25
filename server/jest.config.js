module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/routes', '<rootDir>/__tests__'],
  testMatch: [
    '**/__tests__/**/*.(ts|js)',
    '**/*.(test|spec).(ts|js)'
  ],
  transform: {
    '^.+\\.(ts)$': 'ts-jest'
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    'routes/**/*.{ts,js}',
    '!src/**/*.d.ts',
    '!**/*.config.js'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  testTimeout: 10000,
  collectCoverage: false,
  verbose: true
};
