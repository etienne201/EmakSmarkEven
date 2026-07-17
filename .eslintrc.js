module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  env: {
    node: true,
    browser: true,
    es2021: true,
    jest: true
  },
  ignorePatterns: [
    "dist",
    ".next",
    "out",
    "build",
    "node_modules",
    "qa",
    "playwright-report"
  ],
  rules: {
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/no-explicit-any": "off"
  }
};
