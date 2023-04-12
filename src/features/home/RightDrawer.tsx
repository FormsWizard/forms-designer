import * as React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'

import Toolbar from '@mui/material/Toolbar'

import DragBox from './DragBox'
import {DraggableComponent} from "../counter/jsonFormsEditSlice";

const drawerWidth = 240

export const basicDraggableComponents: DraggableComponent[] = [
  {
    name: 'Textfeld',
    jsonSchemaElement: {
      type: 'string'
    }
  }, {
    name: 'Datumsfeld',
    jsonSchemaElement: {
      type: 'string',
      format: 'date'
    }
  }, {
    name: 'Checkbox',
    jsonSchemaElement: {
      type: 'boolean'
    }
  }, {
    name: 'Mehrzeiliges Textfeld',
    jsonSchemaElement: {
      type: 'string'
    },
    uiSchema: {
      'type': 'Control',
      'options': {
        'multi': true
      }
    }
  }
]

export default function RightDrawer() {
    return (
        <Drawer
            variant="permanent"
            anchor="left"
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
        </Drawer>
    )
}



