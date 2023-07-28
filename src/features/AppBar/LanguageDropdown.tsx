import React from 'react'
import { styled } from '@mui/material/styles'

import { MenuItem, Select } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'

import { Translate } from '@mui/icons-material'
import { changeSelectedLanguage, getSelectedLanguage } from './AppBarSlice'

const PREFIX = 'LanguageSelector'

const classes = {
  languageWrapper: `${PREFIX}-languageWrapper`,
  select: `${PREFIX}-select`,
}

const LANGUAGES_OPTIONS = {
  en: 'English',
  fr: 'French',
  de: 'German',
}

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.languageWrapper}`]: {
    marginLeft: theme.spacing(8),
    minWidth: 100,
  },

  [`& .${classes.select}`]: {
    padding: theme.spacing(0, 2),
  },
}))

function LanguageSelector() {
  const locale = useSelector(getSelectedLanguage)
  const dispatch = useDispatch()
  return (
    <Root sx={{ color: 'white', minWidth: 150 }}>
      <Select
        id="language-select"
        value={locale}
        renderValue={(value) => (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
            }}
          >
            <Translate></Translate>
            <span
              style={{
                paddingLeft: '0.5em',
              }}
            >
              {LANGUAGES_OPTIONS[value]}
            </span>
          </div>
        )}
        onChange={(e) => dispatch(changeSelectedLanguage(e.target.value))}
      >
        {Object.keys(LANGUAGES_OPTIONS).map((l) => (
          <MenuItem key={l} value={l}>
            {LANGUAGES_OPTIONS[l]}
          </MenuItem>
        ))}
      </Select>
    </Root>
  )
}

export default LanguageSelector
