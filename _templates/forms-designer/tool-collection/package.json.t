---
to: packages/<%= name.split("/")[1] %>/package.json
---
{
  "name": "<%= name %>",
  "version": "0.0.0",
  "description": "<%= description %>",
  "license": "MIT",
  "homepage": "https://github.com/FormsWizard",
  "repository": {
    "type": "git",
    "url": "https://github.com/FormsWizard/forms-designer.git"
  },
  "contributors": [
  ],
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs",
      "default": "./dist/index.js"
    }
  },
  "files": [
    "dist",
    "CHANGELOG.md",
    "README.md"
  ],
  "scripts": {
    "depcheck": "depcheck",
    "build": "tsup",
    "dev": "tsup --watch",
    "lint": "eslint src/**/*.{ts,tsx}",
    "lint-fix": "eslint --fix src/**/*.{ts,tsx}",
    "pack-clean": "bun run clean-package && (bun pm pack || true) ; bun run clean-package restore",
    "publish-clean": "bun run clean-package && npm publish --access public && bun run clean-package restore"
  },
  "peerDependencies": {
    "@jsonforms/core": "^3",
    "@jsonforms/material-renderers": "^3",
    "@jsonforms/react": "^3",
    "@mui/icons-material": "^5",
    "@mui/material": "^5",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "react": "^16.9.0 || ^17.0.0 || ^18",
    "react-dnd": "^16.0.1"
  },
  "dependencies": {
    "@formswizard/types": "workspace:*",
    "@formswizard/utils": "workspace:*"
  },
  "devDependencies": {
    "@formswizard/designer-tsconfig": "workspace:*",
    "@formswizard/tsup-config": "workspace:*",
    "eslint-config-formsdesigner": "workspace:*",
    "tsup": "^8.0.0",
    "typescript": "^4.5.2"
  },
  "clean-package": {
    "extends": "../../../clean-package.config.cjs"
  },
  "eslintConfig": {
    "root": true,
    "extends": ["eslint-config-formsdesigner"]
  }
}
