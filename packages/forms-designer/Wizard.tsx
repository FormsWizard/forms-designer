'use client'

import React, {useCallback, useMemo, useState} from "react";
import {materialCells, materialRenderers} from "@jsonforms/material-renderers";
import {JsonForms} from "@jsonforms/react";
import {selectJsonSchema, selectUiSchema, useAppSelector} from "state";
import {extendUiSchemaWithPath} from "utils";
import {basicRenderer, verticalLayoutTester, VerticalLayoutWithDropZoneRenderer} from 'renderer';
import {useDrag} from "react-dnd";

const additionalRenderers = [{
  tester: verticalLayoutTester,
  renderer: VerticalLayoutWithDropZoneRenderer,
}]

export function Wizard() {
  const [data, setData] = useState({});

  const handleFormChange = useCallback(
      ({data}: { data: any }) => setData(data),
      [setData]
  )
  const jsonSchema = useAppSelector(selectJsonSchema)
  const uiSchema = useAppSelector(selectUiSchema)
  const uiSchemaWithPath = useMemo(() => extendUiSchemaWithPath(uiSchema), [uiSchema])

  const [{opacity}, dragRef] = useDrag(
      () => ({
        type: 'MOVEBOX',
        item: {name: 'test'},
        collect: (monitor) => ({
          opacity: monitor.isDragging() ? 0.5 : 1,
          isDragging: monitor.isDragging(),
        }),
        end: (item, monitor) => {
          const didDrop = monitor.didDrop()
          if (didDrop) {
          }
        },
      }))

  return <JsonForms
        data={data}
        renderers={[...materialRenderers, ...basicRenderer, ...additionalRenderers]}
        cells={materialCells}
        onChange={handleFormChange}
        schema={jsonSchema}
        uischema={uiSchemaWithPath}
  />
}
