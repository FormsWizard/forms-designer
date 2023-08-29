module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `@formswizard/designer-eslint-config`
  extends: ["custom"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
