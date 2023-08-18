import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import Toolbar from '@mui/material/Toolbar'

import DragBox from './DragBox'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab, Button } from '@mui/material'
import { useCallback } from 'react'

import { basicDraggableComponents, advancedDraggableComponents } from '../tools/DragableJSONSchemaComponents'
import BuildingBlocks from '../buildingBlocks/buildingBlocks'
import { useSelector } from 'react-redux'
import { getpreviewModus, togglePreviewModus } from '../AppBar/AppBarSlice'
import { useAppDispatch } from '../../app/hooks/reduxHooks'

const drawerWidth = 240

export default function LeftDrawer() {
  const [activeTab, setActiveTab] = React.useState('1')
  const handleChange = useCallback(
    (event, newValue) => {
      setActiveTab(newValue)
    },
    [setActiveTab]
  )

  const dispatch = useAppDispatch()
  const previewModus = useSelector(getpreviewModus)
  const handleTogglePreview = (event: any) => {
    dispatch(togglePreviewModus())
  }

  return (
    <>
      {previewModus && (
        <Button color="warning" onClick={handleTogglePreview} size="large">
          <span style={{ writingMode: 'vertical-rl', textOrientation: 'upright' }}>disable preview mode</span>
        </Button>
      )}
      <Drawer
        variant="persistent"
        anchor="left"
        open={!previewModus}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Toolbar />
        <TabContext value={activeTab}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label="Tools" value="1" />
              <Tab label="blocks" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1" sx={{ p: 0 }}>
            <Box
              sx={{
                overflow: 'auto',
                '& > div': {
                  margin: 1,
                },
              }}
            >
              {basicDraggableComponents.map((component, index) => {
                return (
                  <DragBox
                    name={component.name}
                    ToolIcon={component.ToolIcon}
                    key={component.name}
                    componentMeta={component}
                  ></DragBox>
                )
              })}
            </Box>
          </TabPanel>
          <TabPanel value="2" sx={{ p: 0 }}>
            <BuildingBlocks></BuildingBlocks>
          </TabPanel>
        </TabContext>
      </Drawer>
    </>
  )
}
