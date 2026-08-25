import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // SNS自動投稿スクリプトはNode用のCommonJS(.cjs)。require() が正しい書き方なので
    // Next.js側のTypeScriptルールの対象から外す
    "scripts/**",
  ]),
]);

export default eslintConfig;
