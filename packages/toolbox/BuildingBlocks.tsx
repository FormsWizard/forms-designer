import { Card } from '@mui/material'
import { Box, Stack } from '@mui/system'
import { useAppDispatch, useAppSelector, addBuildingBlock } from '@formswizard/state'
import { DragBox } from './DragBox'
import { useDNDHooksContext } from '@formswizard/react-hooks'
import { useDraggableElementsByComponentType, useRegisteredCollections } from '@formswizard/tool-context'
import { useJsonFormsI18n } from '@formswizard/i18n'

function BuildingBlocks() {
  const buildingBlocks = useAppSelector((state) => state.buildingBlocks.blocks)
  const draggableComponents = useDraggableElementsByComponentType('block')
  const registeredCollections = useRegisteredCollections()
  const { translate } = useJsonFormsI18n(registeredCollections)
  const jsonSchema = useAppSelector((state) => state.jsonFormsEdit.jsonSchema)
  const dispatch = useAppDispatch()
  const { useDrop } = useDNDHooksContext()

  const [{ isActive }, drop] = useDrop(
    () => ({
      accept: 'MOVEBOX',
      drop: (item, monitor) => {
        //@ts-ignore
        if (item.componentMeta.uiSchema.type !== 'Group') {
          return
        }
        dispatch(addBuildingBlock({ item, jsonSchema, ToolIconName: 'ViewQuilt' }))
      },

      collect: (monitor) => ({
        isActive: monitor.canDrop() && monitor.isOver(),
      }),
    }),
    [dispatch, jsonSchema]
  )
  return (
    <>
      {[...buildingBlocks, ...draggableComponents].map((component) => {
        const displayName = translate?.(`tools.${component.name}`, component.name) ?? component.name
        return (
          <DragBox
            ToolIconName={component.ToolIconName}
            name={displayName}
            key={component.name}
            componentMeta={component}
          ></DragBox>
        )
      })}
      <Card
        ref={drop}
        sx={{
          height: 200,
          width: '100%',
          display: 'flex',
          color: isActive ? 'green' : 'inherit',
        }}
      >
        <Box
          sx={{
            border: '2px dashed  green',
            padding: 2,
            margin: 2,
            display: 'flex',
            flex: 1,
          }}
        >
          <Stack sx={{ margin: 'auto' }}>{isActive ? 'D R O P' : 'Drop Group to create new Building Block'}</Stack>
        </Box>
      </Card>
    </>
  )
}

export default BuildingBlocks
