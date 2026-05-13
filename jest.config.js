/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  transform: {
    '^.+\\.[jt]sx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        module: 'commonjs',
        esModuleInterop: true,
        strict: true,
        skipLibCheck: true,
        allowJs: true,
      },
    }],
  },
  moduleNameMapper: {
    '^@xterm/xterm/css/xterm.css$': '<rootDir>/tests/__mocks__/xterm-css.ts',
  },
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
};
