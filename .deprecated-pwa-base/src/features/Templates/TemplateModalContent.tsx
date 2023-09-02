import React from 'react'

import { Box } from '@mui/system'
import { Paper } from '@mui/material'
import Grid2 from '@mui/material/Unstable_Grid2/Grid2'
import TemplateCategoryList from './TemplateCategoryList'
import TemplateGrid from './TemplateGrid'
import useTemplates from './useTemplates'
function TemplateModalContent() {
  const { categories, handleSelectCategoryIndex, selectedCategoryIndex, templates } = useTemplates()

  return (
    <Paper sx={{ height: '100%' }}>
      <Grid2 container sx={{ height: '100%' }}>
        <Grid2 xs={2} sx={{ display: 'flex' }}>
          <TemplateCategoryList
            {...{ categories, handleSelectCategoryIndex, selectedCategoryIndex }}
          ></TemplateCategoryList>
        </Grid2>
        <Grid2 xs={10} sx={{ display: 'flex' }}>
          <TemplateGrid {...{ templates }}> </TemplateGrid>
        </Grid2>
      </Grid2>
    </Paper>
  )
}

export default TemplateModalContent
