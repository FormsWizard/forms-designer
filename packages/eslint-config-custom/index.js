module.exports = {
  extends: ["next", "turbo", "prettier", "plugin:import/recommended", "plugin:import/typescript"],
  rules: {
    "@next/next/no-html-link-for-pages": "off",
  },
  settings: {
    "import/resolver": {
      typescript: true,
      node: true
    }
  },
  parserOptions: {
    babelOptions: {
      presets: [require.resolve("next/babel")],
    },
  },
};
