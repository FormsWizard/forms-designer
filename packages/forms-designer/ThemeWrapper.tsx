import { selectThemeMode, useAppSelector } from "@formswizard/state"
import { getTheme } from "@formswizard/theme"
import { CssBaseline, PaletteMode, ThemeProvider } from "@mui/material"
import { useMemo } from "react"

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = useMemo(() => getTheme(themeMode as PaletteMode), [themeMode])
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}