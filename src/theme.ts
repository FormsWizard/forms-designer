import { createTheme } from '@mui/material'
import { orange } from '@mui/material/colors'

// declare module '@mui/material/styles' {
//   interface Theme {
//     status: {
//       danger: string
//     }
//   }
//   // allow configuration using `createTheme`
//   interface ThemeOptions {
//     status?: {
//       danger?: string
//     }
//   }
// }

import { ThemeOptions } from '@mui/material/styles'

export const lightThemeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#1C175C',
      light: '#c0a7e2',
      dark: '#3542ad',
    },
    secondary: {
      main: '#e0b60a',
      light: '#f9d739',
      dark: '#eea125',
    },
    background: {
      default: '#E9EAF9',
      paper: '#ffffff',
    },
    error: {
      main: '#b30a0a',
      light: '#D33C3C',
      dark: '#8C0808',
    },
    warning: {
      main: '#ed7346',
      light: '#ff9f73',
      dark: '#de491d',
    },
    info: {
      main: '#5c7aff',
      light: '#7e95fb',
      dark: '#435BC6',
    },
    success: {
      main: '#3f8e71',
      light: '#5ccba0',
      dark: '#0e664b',
    },
  },
}

export const darkThemeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#b0b2f9',
      light: '#795DB9',
      dark: '#736edc',
    },
    secondary: {
      main: '#efc249',
      light: '#ecd069',
      dark: '#d2a516',
    },
    background: {
      default: '#202460',
      paper: '#151233',
    },
    error: {
      main: '#e64747',
      light: '#D33C3C',
      dark: '#8C0808',
    },
    warning: {
      main: '#ed7346',
      light: '#ff9f73',
      dark: '#de491d',
    },
    info: {
      main: '#5c7aff',
      light: '#7e95fb',
      dark: '#435BC6',
    },
    success: {
      main: '#3f8e71',
      light: '#5ccba0',
      dark: '#0e664b',
    },
  },
}

const lightTheme = createTheme(lightThemeOptions)
const darkTheme = createTheme(darkThemeOptions)

export { lightTheme, darkTheme }
