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
import TEMPLATES from './TEMPLATES.json'
import { template } from 'lodash'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import { Button, Paper, Typography } from '@mui/material'
import { useHover } from '@uidotdev/usehooks'
import { useAppDispatch } from '../../app/hooks/reduxHooks'
import { loadTemplate } from '../wizard/WizardSlice'
import { useModal } from '@ebay/nice-modal-react'
import './templates.css'
export default function TemplateGrid({ templates }) {
  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', margin: 4, padding: 2 }}>
      <Grid2 container spacing={6}>
        {templates.map((template) => (
          <TemplateGridItem key={template.Name} template={template}></TemplateGridItem>
        ))}
      </Grid2>
    </Box>
  )
}

function TemplateGridItem({ template }) {
  const [ref, isHovered] = useHover()
  const modal = useModal()
  const dispatch = useAppDispatch()

  const handleClicked = () => {
    dispatch(loadTemplate(template))
    modal.hide()
  }

  return (
    <Grid2 xs={12} md={6} ref={ref}>
      <Paper sx={{ padding: 4 }} className="template-grid-item">
        <Typography variant="h5" component="h5" gutterBottom>
          {template.Name}
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
          {template.Description}
        </Typography>
        {isHovered && (
          <Button variant="contained" color="secondary" className="fade-in" onClick={handleClicked}>
            Let's Go!
          </Button>
        )}
      </Paper>
    </Grid2>
  )
}
