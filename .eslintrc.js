module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  ignorePatterns: ["node_modules"],
  plugins: ["import", "eslint-comments", "functional"],
  extends: [
    "eslint:recommended",
    "plugin:eslint-comments/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/typescript",
    "plugin:functional/lite",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "eslint-comments/disable-enable-pair": ["error", { allowWholeFile: true }],
    "eslint-comments/no-unused-disable": "error",
    "import/order": ["error", { "newlines-between": "always", alphabetize: { order: "asc" } }],
    "sort-imports": ["error", { ignoreDeclarationSort: true, ignoreCase: true }],
  },
};
