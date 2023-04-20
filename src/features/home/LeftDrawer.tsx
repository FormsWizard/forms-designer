import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import Toolbar from '@mui/material/Toolbar'

import DragBox from './DragBox'
import { DraggableComponent } from '../wizard/WizardSlice'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Tab } from '@mui/material'
import { useCallback } from 'react'
import {updateScopeOfUISchemaElement} from "../../utils/uiSchemaHelpers";

const drawerWidth = 240

export const basicDraggableComponents: DraggableComponent[] = [
  {
    name: 'Textfeld',
    jsonSchemaElement: {
      type: 'string',
    },
  },
  {
    name: 'Datumsfeld',
    jsonSchemaElement: {
      type: 'string',
      format: 'date',
    },
  },
  {
    name: 'Checkbox',
    jsonSchemaElement: {
      type: 'boolean',
    },
  },
  {
    name: 'Mehrzeiliges Textfeld',
    jsonSchemaElement: {
      type: 'string',
    },
    uiSchema: {
      type: 'Control',
      options: {
        multi: true,
      },
    },
  },
]

export const advancedDraggableComponents: DraggableComponent[] = [
  {
    name: 'person',
    jsonSchemaElement: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          enum: ['Mr', 'Mrs', 'Ms', 'Dr', 'Prof'],
        },
        givenName: {
          type: 'string',
        },
        familyName: {
          type: 'string',
        },
        birthDate: {
          type: 'string',
          format: 'date',
        },
        nationality: {
          type: 'string',
          enum: ['DE', 'IT', 'JP', 'US', 'RU', 'Other'],
        },
      },
    },
    uiSchema: updateScopeOfUISchemaElement('#', '#/properties/person', {
      type: 'Group',
      //@ts-ignore
      label: 'Person',
      elements: [
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/title',
            },
            {
              type: 'Control',
              scope: '#/properties/givenName',
            },
            {
              type: 'Control',
              scope: '#/properties/familyName',
            },
          ],
        },
        {
          type: 'HorizontalLayout',
          elements: [
            {
              type: 'Control',
              scope: '#/properties/birthDate',
            },
            {
              type: 'Control',
              scope: '#/properties/nationality',
            },
          ],
        },
      ],
    }),
  },
]

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
