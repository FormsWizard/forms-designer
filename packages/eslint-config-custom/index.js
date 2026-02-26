module.exports = {
  extends: ["turbo", "prettier", "plugin:import/recommended", "plugin:import/typescript"],
  settings: {
    "import/resolver": {
      typescript: true,
      node: true
    }
  },
};
