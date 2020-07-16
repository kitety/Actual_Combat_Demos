// .eslintrc.js
module.exports = {
  extends: [
    "alloy",
    "alloy/react", //react项目需要
    "alloy/typescript", //ts项目需要
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // 禁止使用 var
    "no-var": "error",
    // 优先使用 interface 而不是 type
    "@typescript-eslint/consistent-type-definitions": ["error", "interface"],
  },
};
