import { DraggableComponent } from '@formswizard/types'
import { JsonForms } from '@jsonforms/react'
import { UISchemaElement, JsonSchema as JsonFormsJsonSchema } from '@jsonforms/core'
import { selectJsonSchemaDefinitions, useAppSelector } from '@formswizard/state'
import { usePreparedJsonFormsState } from '@formswizard/tool-context'

export const DropTargetFormsPreview: React.FC<{ metadata: DraggableComponent }> = ({ metadata }) => {
  const name = metadata.name
  const definitions = useAppSelector(selectJsonSchemaDefinitions)
  const { renderers, cells, ajv, i18n } = usePreparedJsonFormsState({ 
    isPreview: true, 
  })
  return !name ? null : (
    <>
      {metadata.jsonSchemaElement && (
        <JsonForms
          data={{}}
          uischema={
            {
              type: 'VerticalLayout',
              elements: [
                {
                  type: 'Control',
                  scope: `#/properties/${name}`,
                  ...(metadata.uiSchema || {}),
                },
              ],
            } as UISchemaElement
          }
          schema={
            {
              definitions: definitions,
              type: 'object',
              properties: {
                [name]: metadata.jsonSchemaElement,
              },
            } as JsonFormsJsonSchema
          }
          {...{ renderers, cells, ajv, i18n }}
        />
      )}
    </>
  )
}
