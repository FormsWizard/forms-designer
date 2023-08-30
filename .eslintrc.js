module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-formsdesigner`
  extends: ["formsdesigner"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
