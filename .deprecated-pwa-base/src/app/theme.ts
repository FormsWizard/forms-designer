import { createTheme } from '@mui/material'
import { orange } from '@mui/material/colors'

const colors = {
  primary: '#00adb5',
  secondary: '#95defb',
  success: '#4caf50',
  info: '#00a2ff',
  danger: '#ff5722',
  warning: '#ffc107',
  dark: '#0e1b20',
  light: '#aaa',
  muted: '#abafb3',
  border: '#dddfe1',
  inverse: '#2f3d4a',
  shaft: '#333',
  dove_grey: '#d5d5d5',
  body_bg: '#f3f6f9',
  white: '#fff',
  black: '#000',
}

export default createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    success: {
      main: colors.success,
    },
    error: {
      main: colors.danger,
    },
  },
})
