import * as React from 'react'

import { DragBox } from './DragBox'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab, Box } from '@mui/material'
import { useCallback } from 'react'
import { basicDraggableComponents } from './basicDraggableComponents'
import { advancedDraggableComponents } from './advancedDraggableComponents'
import BuildingBlocks from './BuildingBlocks'

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
          <Tab label="Blocks" value="2" />
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
                ToolIconName={component.ToolIconName}
                key={component.name}
                componentMeta={component}
              />
            )
          })}
        </Box>
      </TabPanel>
      <TabPanel value="2" sx={{ p: 0 }}>
        <BuildingBlocks></BuildingBlocks>
{/*         
        {advancedDraggableComponents.map((component, index) => {
          return (
            <DragBox
              ToolIconName={component.ToolIconName}
              name={component.name}
              key={component.name}
              componentMeta={component}
            />
          )
        })} */}
      </TabPanel>
    </TabContext>
  )
}
