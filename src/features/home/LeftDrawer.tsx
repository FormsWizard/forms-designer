import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import Toolbar from '@mui/material/Toolbar'

import DragBox from './DragBox'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useCallback } from 'react'

import { basicDraggableComponents, advancedDraggableComponents } from '../tools/DragableJSONSchemaComponents'

const drawerWidth = 240

export default function LeftDrawer() {
  const [activeTab, setActiveTab] = React.useState('1')
  const handleChange = useCallback(
    (event, newValue) => {
      setActiveTab(newValue)
    },
    [setActiveTab]
  )
  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open
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
            <Tab label="Templates" value="2" />
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
              return <DragBox name={component.name} key={component.name} componentMeta={component}></DragBox>
            })}
          </Box>
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          {advancedDraggableComponents.map((component, index) => {
            return <DragBox name={component.name} key={component.name} componentMeta={component}></DragBox>
          })}
        </TabPanel>
      </TabContext>
    </Drawer>
  )
}
