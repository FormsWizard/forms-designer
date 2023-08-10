import { DraggableComponent } from "@formswizard/types"
import { JsonForms } from '@jsonforms/react'
import { materialCells, materialRenderers } from '@jsonforms/material-renderers'
import { JsonSchema7, UISchemaElement } from '@jsonforms/core'
import { basicRenderer } from '../basic'

export const DropTargetFormsPreview: React.FC<{ metadata: DraggableComponent }> = ({ metadata }) => {
  const name = metadata.name;
  return !name ? null : (
      <>
        {metadata.jsonSchemaElement && (
            <JsonForms
                data={{}}
                renderers={[...materialRenderers, ...basicRenderer]}
                cells={materialCells}
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
                    type: 'object',
                    properties: {
                      [name]: metadata.jsonSchemaElement,
                    },
                  } as JsonSchema7
                }
            />
        )}
      </>
  );
}

