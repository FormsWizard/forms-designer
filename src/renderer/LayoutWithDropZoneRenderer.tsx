import type {JsonFormsState, UISchemaElement} from '@jsonforms/core'
import {
  composeWithUi,
  ControlElement,
  getAjv, getData,
  getSchema,
  getTranslator, hasShowRule, isVisible,
  JsonFormsCellRendererRegistryEntry, JsonFormsRendererRegistryEntry,
  JsonSchema,
  OwnPropsOfRenderer, Resolve
} from '@jsonforms/core'
import {JsonFormsDispatch, useJsonForms} from '@jsonforms/react'
import {Box, Grid} from '@mui/material'
import Ajv from 'ajv'
import isEmpty from 'lodash/isEmpty'
import React, {ComponentType, useCallback, useEffect, useState} from 'react'
import {useDrop} from "react-dnd";
import {useAppDispatch} from "../app/hooks/reduxHooks";
import {DraggableComponent, insertControl} from "../features/counter/jsonFormsEditSlice";

type LayoutElementProps = {
  index: number,
  state: JsonFormsState,
  schema: JsonSchema,
  visible: boolean,
  path: string,
  enabled: boolean,
  element: UISchemaElement,
  renderers?: JsonFormsRendererRegistryEntry[],
  cells?: JsonFormsCellRendererRegistryEntry[],
}
const LayoutElement = ({
                         index,
                         state,
                         schema,
                         path,
                         enabled,
                         element: child,
                         cells,
                         renderers
                       }: LayoutElementProps) => {
  const translator = getTranslator()(state)
  const rootSchema = getSchema(state)
  const rootData = getData(state)
  const dispatch = useAppDispatch();
  const [childPath, setChildPath] = useState<string| undefined>();
  const [resolvedSchema, setResolvedSchema] = useState<JsonSchema | undefined>();

  useEffect(() => {
   if (child.type === 'Control') {
     const controlElement = child as ControlElement
     setResolvedSchema( Resolve.schema(
         schema || rootSchema,
         controlElement.scope,
         rootSchema
     ))
     setChildPath( composeWithUi(controlElement, path))
   }
 }, [child, path, schema, rootData, rootSchema, state])

  const handleDrop = useCallback((componentMeta: DraggableComponent) => {
    // @ts-ignore
    dispatch(insertControl({draggableMeta: componentMeta, child, path: childPath, index, schema}))
  }, [dispatch, index, path, schema, child, childPath, resolvedSchema])

  //@ts-ignore
  const [{isOver}, dropRef] = useDrop(() => ({
    accept: ['DRAGBOX'],
    //@ts-ignore
    drop: ({componentMeta}, b, c) => {
      handleDrop(componentMeta)
    },
    collect: (monitor) => ({isOver: !!monitor.isOver()}),
  }), [handleDrop])
  return (
      <>

        <Grid item key={`${path}-${index}`} xs
        >
          <Grid container direction={'column'}>
            <Grid item xs>
              <JsonFormsDispatch
                  uischema={child}
                  schema={schema}
                  path={path}
                  enabled={enabled}
                  renderers={renderers}
                  cells={cells}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item
              ref={dropRef}
              sx={{display: 'flex', justifyContent: 'center'}}>
          <Box
              sx={{
                flexGrow: 1,
                border: '1px dashed grey',
                opacity: isOver ? '1.0' : '0.1',
                bgcolor: (theme) =>
                    isOver ? theme.palette.info.light : 'none',
              }}
          >
            <span>Drop here</span>
          </Box>
        </Grid>
      </>
  )
}

export interface MaterialLayoutRendererProps extends OwnPropsOfRenderer {
  elements: UISchemaElement[];
  direction: 'row' | 'column';
}

const MaterialLayoutRendererComponent =
    (props: MaterialLayoutRendererProps) => {
      const {
        visible,
        elements,
        schema,
        path,
        enabled,
        direction,
        renderers,
        cells
      } = props
      const ctx = useJsonForms()
      const state = {jsonforms: ctx}
      if (isEmpty(elements)) {
        return null
      } else {
        return (
            <Box sx={{display: visible ? 'block' : 'none'}}>
              <Grid
                  container
                  direction={direction}
                  spacing={direction === 'row' ? 2 : 0}
              >{
                elements.map((element, index) =>
                    <LayoutElement
                        key={(path || '') + index}
                        index={index}
                        state={state}
                        // @ts-ignore
                        schema={schema}
                        // @ts-ignore
                        visible={visible}
                        // @ts-ignore
                        path={path}
                        // @ts-ignore
                        enabled={enabled}
                        element={element}
                        cells={cells}
                        renderers={renderers}/>)}

              </Grid>
            </Box>
        )
      }
    }
export const LayoutWithDropZoneRenderer = React.memo(MaterialLayoutRendererComponent)

export interface AjvProps {
  ajv: Ajv;
}

export const withAjvProps = <P extends {}>(Component: ComponentType<AjvProps & P>) =>
    (props: P) => {
      const ctx = useJsonForms()
      const ajv = getAjv({jsonforms: {...ctx}})

      // @ts-ignore
      return (<Component {...props} ajv={ajv}/>)
    }
