import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: ["e2e/**", "node_modules/**", ".next/**", "coverage/**", "playwright-report/**", "test-results/**", "public/sw.js"]
  },
  ...nextVitals,
  ...nextTypescript
];

export default eslintConfig;
