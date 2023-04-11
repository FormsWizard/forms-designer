import React, {useCallback, useState} from 'react'
import {JsonFormsCore} from "@jsonforms/core";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import {useAppSelector} from "../../app/hooks/reduxHooks";
import {selectCount} from "../counter/counterSlice";
import {selectJsonSchema} from "../counter/jsonFormsEditSlice";
import {JsonForms} from "@jsonforms/react";


const renderers = materialRenderers
function Wizard() {
  const [data, setData] = useState<any>({})
  const handleFormChange = useCallback(
      (state: Pick<JsonFormsCore, 'data' | 'errors'>) => {
        setData(state.data )
      }, [setData])
  const jsonSchema = useAppSelector(selectJsonSchema);
  return (
    <div>
      <JsonForms
          data={data}
          renderers={renderers}
          cells={materialCells}
          onChange={handleFormChange}
          schema={jsonSchema}
          />
    </div>
  )
}

export default Wizard
