import React, { useMemo, useState } from 'react'

import TEMPLATES from './TEMPLATES.json'

const blankTemplate = {
  Name: 'blank Template',
  Description: 'start fresh',
  Category: '',
  Template: {
    jsonSchema: {
      type: 'object',
      properties: {},
    },
    uiSchema: { type: 'VerticalLayout', elements: [] },
  },
}

const COMBINED_TEMPLATES = [blankTemplate, ...TEMPLATES]
function useTemplates() {
  const [selectedIndex, setSelectedIndex] = useState(0)

  const handleSelectCategoryIndex = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => {
    setSelectedIndex(index)
  }
  const categories = useMemo(() => ['all Templates'].concat(TEMPLATES.map((t) => t.Category)), [])
  const templates = useMemo(() => {
    const combined = COMBINED_TEMPLATES

    return combined.filter((t) => {
      if (selectedIndex === 0) return true
      return t.Category === categories[selectedIndex]
    })
  }, [categories, selectedIndex])

  return {
    categories,
    templates,
    handleSelectCategoryIndex,
    selectedCategoryIndex: selectedIndex,
  }
}

export default useTemplates
