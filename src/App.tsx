import { useEffect, useState } from 'react';

import './App.css'
import { TimeIcon, SettingsIcon } from './assets/images.tsx';

import Home from './pages/home/home.tsx'
import Settings from './pages/settings/settings.tsx'

type ThemeMode = 'system' | 'light' | 'dark'

const THEME_STORAGE_KEY = 'theme-mode'

function getInitialThemeMode(): ThemeMode {
  const saved = localStorage.getItem(THEME_STORAGE_KEY)
  if (saved === 'light' || saved === 'dark' || saved === 'system') {
    return saved
  }
  return 'light'
}

function App() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [Tab, setTab] = useState('home');

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, themeMode)

    const root = document.documentElement
    if (themeMode === 'system') {
      root.removeAttribute('data-theme')
      root.style.colorScheme = 'light dark'
      return
    }

    root.setAttribute('data-theme', themeMode)
    root.style.colorScheme = themeMode
  }, [themeMode])

  function renderPage() {
    switch (Tab) {
      case 'home':
        return <Home />
      case 'settings':
        return <Settings themeMode={themeMode} onThemeModeChange={setThemeMode} />
      default:
        return <Home />
    }
  }

  return (
    <>
      <section className="app-shell">
        {renderPage()}
      </section>
      <section className="app-menu">
        <div className='menu-item' onClick={() => setTab('home')}>
          <TimeIcon /><br />
          時間割
        </div>
        <div className='menu-item' onClick={() => setTab('settings')}>
          <SettingsIcon /><br />
          設定
        </div>
      </section>
    </>
  )
}

export default App