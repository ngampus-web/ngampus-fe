import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTs from "eslint-config-next/typescript"

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ["features/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/app/**"],
              message: "Feature modules must not import route modules.",
            },
          ],
        },
      ],
    },
  },
  {
    files: [
      "components/**/*.{ts,tsx}",
      "lib/**/*.{ts,tsx}",
      "config/**/*.{ts,tsx}",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/features/**", "@/app/**"],
              message: "Shared modules must not depend on features or routes.",
            },
          ],
        },
      ],
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "public/pdfjs/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
])

export default eslintConfig
