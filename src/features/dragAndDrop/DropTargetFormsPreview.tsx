import {DraggableComponent} from "../wizard/WizardSlice";
import {JsonForms} from "@jsonforms/react";
import {useState} from "react";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import {JsonSchema7, UISchemaElement} from "@jsonforms/core";

const DropTargetFormsPreview: React.FC<{ metadata: DraggableComponent }> = ({metadata}) => {
  const [previewDummy, setPreviewDummy] = useState<any>({});
  return <>
        {metadata.jsonSchemaElement && <JsonForms
            data={previewDummy}
            renderers={materialRenderers}
            cells={materialCells}
            uischema={{
              type: "VerticalLayout",
              elements: [
                {
                  type: "Control",
                  scope: `#/properties/${metadata.name}`,
                  ...(metadata.uiSchema || {})
                }
              ]
            } as UISchemaElement}
            schema={{
              type: "object",
              properties: {
                [metadata?.name]: metadata.jsonSchemaElement
              }
        } as JsonSchema7} />}
  </>
}

export default DropTargetFormsPreview
