import eslintPluginPrettier from "eslint-plugin-prettier";
import eslintConfigPrettier from "eslint-config-prettier";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

export default [
    {
        ignores: ["node_modules/", "dist/", "build/", "coverage/", "**/*.test.*", "*jest.config.*"
        ],
    },
    {
        files: ["**/*.ts"],
        languageOptions: {
            parser: tsParser,
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tseslint,
            prettier: eslintPluginPrettier,
        },
        rules: {
            ...tseslint.configs.recommended.rules,
            ...eslintConfigPrettier.rules,
            "prettier/prettier": "error",
            "no-console": "warn",
            "@typescript-eslint/no-unused-vars": ["error"],
            "@typescript-eslint/no-explicit-any": "error",
            "eqeqeq": ["error", "always"],
        },
    },
];
