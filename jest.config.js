module.exports = {
  transformIgnorePatterns: [
    'node_modules/(?!react-router-dom)/'
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testEnvironment: 'jsdom',
};
