import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Divider from '@mui/material/Divider'
import InboxIcon from '@mui/icons-material/Inbox'
import DraftsIcon from '@mui/icons-material/Drafts'

import { useState } from 'react'
import useTemplates from './useTemplates'
import { LayersOutlined } from '@mui/icons-material'

export default function TemplateCategoryList({ categories, handleSelectCategoryIndex, selectedCategoryIndex }) {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', margin: 4, padding: 2 }}>
      <List component="nav" aria-label="main mailbox folders">
        {categories.map((category, index) => (
          <ListItemButton
            key={category}
            selected={selectedCategoryIndex === index}
            onClick={(event) => handleSelectCategoryIndex(event, index)}
          >
            <ListItemIcon>
              <LayersOutlined />
            </ListItemIcon>
            <ListItemText primary={category} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  )
}
