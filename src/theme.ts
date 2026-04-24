import themes from './assets/themes.json'

export type ThemeMode = 'system' | 'light' | 'dark'

type ThemeVariables = Record<string, string>
type ThemeConfig = Record<'light' | 'dark', ThemeVariables>
const themeConfig = themes as ThemeConfig

export const THEME_MODE_STORAGE_KEY = 'theme-mode'
const THEME_COLOR_META_SELECTOR = 'meta[name="theme-color"]'

export function getInitialThemeMode(): ThemeMode {
  const saved = localStorage.getItem(THEME_MODE_STORAGE_KEY)
  if (saved === 'system' || saved === 'light' || saved === 'dark') {
    return saved
  }
  return 'light'
}

export function resolveThemeMode(mode: ThemeMode): 'light' | 'dark' {
  if (mode === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return mode
}

export function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement
  const resolvedMode = resolveThemeMode(mode)
  const variables = themeConfig[resolvedMode]
  const themeColor = variables['--bg']

  root.setAttribute('data-theme', resolvedMode)
  root.style.colorScheme = resolvedMode

  for (const [key, value] of Object.entries(variables)) {
    root.style.setProperty(key, value)
  }

  const themeColorMeta = document.head.querySelector<HTMLMetaElement>(THEME_COLOR_META_SELECTOR)
  if (themeColorMeta) {
    themeColorMeta.content = themeColor
  }
}

export function initializeTheme(): ThemeMode {
  const themeMode = getInitialThemeMode()

  applyTheme(themeMode)

  return themeMode
}
