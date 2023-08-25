import * as React from 'react'

import { DragBox } from './DragBox'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab, Box } from '@mui/material'
import { useCallback } from 'react'
import {basicDraggableComponents} from "./basicDraggableComponents";
import {advancedDraggableComponents} from "./advancedDraggableComponents";


export function Toolbox() {
  const [activeTab, setActiveTab] = React.useState('1')
  const handleChange = useCallback(
    (event: React.SyntheticEvent, newValue: string) => {
      setActiveTab(newValue)
    },
    [setActiveTab]
  )
  return (
      <TabContext value={activeTab}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="switch between tools and templates">
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
              return <DragBox
    name={component.name}
    ToolIcon={component.ToolIcon}
    key={component.name}
    componentMeta={component}
    />
            })}
          </Box>
        </TabPanel>
        <TabPanel value="2" sx={{ p: 0 }}>
          {advancedDraggableComponents.map((component, index) => {
            return <DragBox
    ToolIcon={component.ToolIcon}
    name={component.name}
    key={component.name}
    componentMeta={component}
    />
          })}
        </TabPanel>
      </TabContext>
  )
}
