---
to: packages/<%= name.split("/")[1] %>/src/renderers.ts
---
import { JsonFormsRendererRegistryEntry } from '@jsonforms/core'

export const renderers: JsonFormsRendererRegistryEntry[] = [
  // Add your renderers here
  // Example:
  // {
  //   tester: exampleRendererTester,
  //   renderer: ExampleRenderer,
  // },
]
