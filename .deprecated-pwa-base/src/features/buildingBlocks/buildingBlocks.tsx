import { TabPanel } from '@mui/lab'
import React from 'react'
import { useDrop } from 'react-dnd'
import { useSelector } from 'react-redux'
import DragBox from '../home/DragBox'
import Card from '@mui/material/Card'
import { useAppDispatch, useAppSelector } from '../../app/hooks/reduxHooks'
import { addBuildingBlock } from './buildingBlocksSlice'
import { ArrowDropDown, DownhillSkiing, DragHandle, Folder, Handshake, PanTool, ViewQuilt } from '@mui/icons-material'
import { Grid } from '@mui/material'
import { Box, Stack } from '@mui/system'
function BuildingBlocks() {
  const buildingBlocks = useAppSelector((state) => state.buildingBlocks.blocks)
  const jsonSchema = useAppSelector((state) => state.jsonFormsEdit.jsonSchema)
  const dispatch = useAppDispatch()
  const [{ isActive }, drop] = useDrop(
    () => ({
      accept: 'MOVEBOX',
      drop: (item, monitor) => {
        console.log(item)
        //@ts-ignore
        if (item.componentMeta.uiSchema.type !== 'Group') {
          return
        }

        dispatch(addBuildingBlock({ item, jsonSchema, ToolIcon: ViewQuilt }))
      },

      collect: (monitor) => ({
        isActive: monitor.canDrop() && monitor.isOver(),
      }),
    }),
    [dispatch, jsonSchema]
  )
  return (
    <>
      {buildingBlocks.map((component, index) => {
        return (
          <DragBox
            ToolIcon={component.ToolIcon}
            name={component.name}
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
