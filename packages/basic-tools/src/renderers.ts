import type { JsonFormsRendererRegistryEntry } from '@jsonforms/core'
import { basicRenderer } from '@formswizard/designer-basic-renderer'
import { materialRenderers } from '@jsonforms/material-renderers'

export const renderers: JsonFormsRendererRegistryEntry[] = [
  ...materialRenderers,
  ...basicRenderer
]
