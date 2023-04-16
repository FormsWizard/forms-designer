import type { JsonFormsState, UISchemaElement } from '@jsonforms/core'
import {
    composeWithUi,
    ControlElement,
    getAjv,
    getData,
    getSchema,
    getTranslator,
    hasShowRule,
    isVisible,
    JsonFormsCellRendererRegistryEntry,
    JsonFormsRendererRegistryEntry,
    JsonSchema,
    OwnPropsOfRenderer,
    Resolve,
} from '@jsonforms/core'
import { JsonFormsDispatch, useJsonForms } from '@jsonforms/react'
import { Box, Grid, IconButton, Paper } from '@mui/material'
import Ajv from 'ajv'
import isEmpty from 'lodash/isEmpty'
import React, {
    ComponentType,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react'
import { useDrop } from 'react-dnd'
import { useAppDispatch } from '../app/hooks/reduxHooks'
import {
    DraggableComponent,
    insertControl,
    removeField,
    selectElement,
    selectSelectedElementKey,
} from '../features/counter/jsonFormsEditSlice'
import { useSelector } from 'react-redux'
import { Delete } from '@mui/icons-material'

type LayoutElementProps = {
    index: number
    state: JsonFormsState
    schema: JsonSchema
    visible: boolean
    path: string
    enabled: boolean
    element: UISchemaElement
    renderers?: JsonFormsRendererRegistryEntry[]
    cells?: JsonFormsCellRendererRegistryEntry[]
}
const LayoutElement = ({
    index,
    state,
    schema,
    path,
    enabled,
    element: child,
    cells,
    renderers,
}: LayoutElementProps) => {
    const translator = getTranslator()(state)
    const rootSchema = getSchema(state)
    const rootData = getData(state)
    const dispatch = useAppDispatch()
    const selectedKey = useSelector(selectSelectedElementKey)
    const [childPath, setChildPath] = useState<string | undefined>()
    const [resolvedSchema, setResolvedSchema] = useState<
        JsonSchema | undefined
    >()

    useEffect(() => {
        if (child.type === 'Control') {
            const controlElement = child as ControlElement
            setResolvedSchema(
                Resolve.schema(
                    schema || rootSchema,
                    controlElement.scope,
                    rootSchema
                )
            )
            setChildPath(composeWithUi(controlElement, path))
        }
    }, [child, path, schema, rootData, rootSchema, state])

    const handleDrop = useCallback(
        (componentMeta: DraggableComponent) => {
            // @ts-ignore
            dispatch(
                insertControl({
                    draggableMeta: componentMeta,
                    child,
                    path: childPath,
                    index,
                    schema,
                })
            )
        },
        [dispatch, index, path, schema, child, childPath, resolvedSchema]
    )
    const key = useMemo<string>(
        () => (!childPath ? `layout-${index}` : childPath),
        [childPath, index]
    )
    const isGroup = useMemo<boolean>(() => child.type === 'Group', [child])

    //@ts-ignore
    const [{ isOver }, dropRef] = useDrop(
        () => ({
            accept: ['DRAGBOX'],
            //@ts-ignore
            drop: ({ componentMeta }) => {
                handleDrop(componentMeta)
            },
            collect: (monitor) => ({ isOver: !!monitor.isOver() }),
        }),
        [handleDrop]
    )
    const handleSelect = useCallback(
        (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
            event.stopPropagation()
            // @ts-ignore
            dispatch(selectElement(key))
        },
        [dispatch, key]
    )

    const handleRemove = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            event.stopPropagation()
            dispatch(removeField({ path: key }))
        },
        [dispatch, key]
    )

    return (
        <>
            <Grid item key={key} xs onClick={handleSelect}>
                <Grid container direction={'column'}>
                    <Grid item>
                        <Paper
                            elevation={selectedKey === key ? 4 : 0}
                            sx={{
                                backgroundColor: (theme) =>
                                    selectedKey === key
                                        ? theme.palette.grey[200]
                                        : 'none',
                            }}
                        >
                            {!isGroup && (
                                <RemoveWrapper handleRemove={handleRemove}>
                                    <JsonFormsDispatch
                                        uischema={child}
                                        schema={schema}
                                        path={path}
                                        enabled={enabled}
                                        renderers={renderers}
                                        cells={cells}
                                    />
                                </RemoveWrapper>
                            )}
                            {isGroup && (
                                <JsonFormsDispatch
                                    uischema={child}
                                    schema={schema}
                                    path={path}
                                    enabled={enabled}
                                    renderers={renderers}
                                    cells={cells}
                                />
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Grid>
            <Grid
                item
                ref={dropRef}
                sx={{ display: 'flex', justifyContent: 'center' }}
            >
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
    elements: UISchemaElement[]
    direction: 'row' | 'column'
}

const MaterialLayoutRendererComponent = (
    props: MaterialLayoutRendererProps
) => {
    const {
        visible,
        elements,
        schema,
        path,
        enabled,
        direction,
        renderers,
        cells,
    } = props
    const ctx = useJsonForms()
    const state = { jsonforms: ctx }
    if (isEmpty(elements)) {
        return null
    } else {
        return (
            <Box sx={{ display: visible ? 'block' : 'none' }}>
                <Grid
                    container
                    direction={direction}
                    spacing={direction === 'row' ? 2 : 0}
                >
                    {elements.map((element, index) => (
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
                            renderers={renderers}
                        />
                    ))}
                </Grid>
            </Box>
        )
    }
}
export const LayoutWithDropZoneRenderer = React.memo(
    MaterialLayoutRendererComponent
)

export interface AjvProps {
    ajv: Ajv
}

export const withAjvProps =
    <P extends {}>(Component: ComponentType<AjvProps & P>) =>
    (props: P) => {
        const ctx = useJsonForms()
        const ajv = getAjv({ jsonforms: { ...ctx } })

        // @ts-ignore
        return <Component {...props} ajv={ajv} />
    }

function RemoveWrapper({ handleRemove, children }) {
    return (
        <Grid container>
            <Grid item xs={11}>
                {children}
            </Grid>
            <Grid item xs={1}>
                <IconButton onClick={handleRemove}>
                    <Delete></Delete>
                </IconButton>
            </Grid>
        </Grid>
    )
}
