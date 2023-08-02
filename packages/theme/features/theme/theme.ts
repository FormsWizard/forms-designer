import { Components, createTheme, PaletteMode, PaletteOptions, Theme, ThemeOptions } from '@mui/material'

export const lightThemeColorOptions: PaletteOptions = {
  primary: {
    main: '#3542ad',
    light: '#c0a7e2',
    dark: '#1C175C',
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
}

export const darkThemeColorOptions: PaletteOptions = {
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
}

export const lgihtThemeOverwrites: Components<Omit<Theme, 'components'>> = {
  MuiSelect: {
    styleOverrides: {
      // Name of the slot

      select: {
        color: 'white',
      },
    },
  },
}
export const darkThemeOverwrites: Components<Omit<Theme, 'components'>> = {
  // MuiButton: {
  //   styleOverrides: {
  //     // Name of the slot
  //     root: {
  //       // Some CSS
  //       marginRight: 8,
  //     },
  //   },
  // },
}
export const agnosticThemeOverwrites: Components<Omit<Theme, 'components'>> = {
  MuiAppBar: {
    styleOverrides: {
      // Name of the slot

      root: {
        '& .MuiButton-root': {
          color: 'white',
        },
      },
    },
  },
}

export const getTheme = (themeMode: PaletteMode): Theme =>
  createTheme({
    ...getDesignTokens(themeMode),
  })

const getDesignTokens = (mode: PaletteMode): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'light' ? lightThemeColorOptions : darkThemeColorOptions),
  },
  components: {
    ...(mode === 'light' ? lgihtThemeOverwrites : darkThemeOverwrites),
    ...agnosticThemeOverwrites,
  },
})

export default getTheme
