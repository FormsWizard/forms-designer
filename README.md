# Forms Designer

[![Test build pipeline](https://github.com/FormsWizard/forms-designer/actions/workflows/staging.yml/badge.svg)](https://github.com/FormsWizard/forms-designer/actions/workflows/staging.yml)
[![Deploy Next.js site to Pages](https://github.com/FormsWizard/forms-designer/actions/workflows/pages.yml/badge.svg)](https://github.com/FormsWizard/forms-designer/actions/workflows/pages.yml)

## Overview

FormsDesigner is a WYSIWYG editor developed in TypeScript for creating diverse forms using the JSONForms framework. It enables the creation of a JSON-Schema and an UI-schema for streamlined form creation and management.

## Open a Demo

A live [Storybook](https://formswizard.github.io/forms-designer/storybook/) demo is available online.

To view a demo on your local machine, launch a dev build — see [Develop](#develop) for more details.

##  Details

FormsDesigner allows for the easy and efficient creation of forms, producing JSON-Schema and UI-schema which can be used independently with JSONForms, enhancing its compatibility across various frameworks like VueJS, Angular, and Vanilla JS. It employs a modular approach for extending by providing new renderers for both the final form and the editing process.

The FormsDesigner is a part of the broader FormsWizard project, which delivers a complete No-Code solution to form creation and management, with synchronization and serverless operations brought by the FormsWizard project as a whole.


## Apps and Packages

This Turborepo includes various packages and apps:

### Apps
- `./apps/storybook`: A Storybook for visualizing components.
- `./apps/vite`: An example using ViteJS.

### Packages
- `./packages/advanced-tools`: A collection of tools, like location and map pickers.
- `./packages/basic-renderer`: Contains basic renderers for the project.
- `./packages/basic-tools`: A collection of form components and renderers like TextFields, Number and Date Inputs.
- `./packages/eslint-config-custom`: Provides custom ESLint configurations.
- `./packages/experimental-renderers`: Experimental renderers (e.g. location picker with leaflet).
- `./packages/fieldSettings`: Field Settings logic and settings typically seen within the right drawer.
- `./packages/forms-designer`: The main FormsDesigner package.
- `./packages/i18n`: Internationalization support.
- `./packages/jest-presets`: Contains Jest presets for turbo repos.
- `./packages/react-hooks`: Includes React hooks used in the project.
- `./packages/renderer`: Houses special drag-and-drop renderers needed for the editor view.
- `./packages/state`: Manages state within the project.
- `./packages/theme`: Contains theming details and configurations.
- `./packages/tool-context`: Shared context for tool components.
- `./packages/toolbox`: A toolbox seen within the left drawer, where one can pick tools and blocks.
- `./packages/tsconfig`: Holds TypeScript configuration details.
- `./packages/tsup-config`: Shared tsup bundler configuration.
- `./packages/types`: Type definitions used across the project.
- `./packages/utils`: General utilities for various tasks.

Each package/app is fully developed in TypeScript and provides type definitions.

## Build

To build all apps and packages, execute:

```sh
bun run build
```

## Develop

To develop all apps and packages, execute:

```sh
bun run dev
```

If you only want to run a task for part of the projects, use turbo's filtering:

```sh
bun run dev --filter @formswizard/forms-designer-renderer
```
or exclude certain apps:
```sh
bun run dev --filter '!@formswizard/storybook'
```
## Test

To run all tests, execute:

```sh
bun run test
```


## Update dependencies

To update all dependencies, execute:

```sh
bun update --latest
```

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting


### Useful Links

Learn more about the power of Turborepo:

- [Tasks](https://turbo.build/repo/docs/core-concepts/monorepos/running-tasks)
- [Caching](https://turbo.build/repo/docs/core-concepts/caching)
- [Remote Caching](https://turbo.build/repo/docs/core-concepts/remote-caching)
- [Filtering](https://turbo.build/repo/docs/core-concepts/monorepos/filtering)
- [Configuration Options](https://turbo.build/repo/docs/reference/configuration)
- [CLI Usage](https://turbo.build/repo/docs/reference/command-line-reference)
