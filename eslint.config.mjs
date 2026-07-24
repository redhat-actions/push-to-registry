import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: [
            "node_modules/",
            "dist/",
            "out/",
            "lib/",
            "eslint.config.mjs",
        ],
    },
    js.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            ecmaVersion: 2024,
            sourceType: "module",
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // Style rules carried over from the project's existing config
            "brace-style": ["error", "stroustrup", { allowSingleLine: true }],
            "curly": "error",
            "eqeqeq": ["error", "smart"],
            "no-console": "error",
            "quotes": ["error", "double", { allowTemplateLiterals: true }],
            "indent": ["error", 4],

            // TypeScript rules
            "@typescript-eslint/explicit-function-return-type": ["error", { allowExpressions: true }],
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-inferrable-types": ["error", { ignoreParameters: true }],
            "@typescript-eslint/prefer-for-of": "error",

            // Disable rules that conflict with the existing code style
            "@typescript-eslint/no-base-to-string": "off",
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/no-unsafe-argument": "off",
            "@typescript-eslint/no-unsafe-assignment": "off",
            "@typescript-eslint/no-unsafe-member-access": "off",
            "@typescript-eslint/no-unsafe-call": "off",
            "@typescript-eslint/no-unsafe-return": "off",
        },
    },
);
