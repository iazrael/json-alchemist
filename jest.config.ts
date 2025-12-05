module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  testMatch: ['**/*.spec.ts'],
  collectCoverageFrom: [
    'services/**/*.ts',
    '!services/**/*.d.ts'
  ]
};