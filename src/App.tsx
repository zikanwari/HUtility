import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom'

import './App.css'
import { TimeIcon, OtherIcon } from './assets/images.tsx';

import Home from './pages/home/home.tsx'
import Settings from './pages/settings/settings.tsx'
import Other from './pages/other/other.tsx';
import BusTimer from './pages/tools/bus-timer/bus-timer.tsx'

import {
  applyTheme,
  getInitialThemeMode,
  THEME_MODE_STORAGE_KEY,
  type ThemeMode,
} from './theme'

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/bus-timer" element={<BusTimer />} />
    </Routes>
  )
}

function MainPage() {
  const [themeMode, setThemeMode] = useState<ThemeMode>(getInitialThemeMode);
  const [Tab, setTab] = useState('home');

  useEffect(() => {
    localStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode)
    applyTheme(themeMode)

    if (themeMode !== 'system') {
      return
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleChange = () => applyTheme('system')

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [themeMode])

  function renderPage() {
    switch (Tab) {
      case 'home':
        return <Home />
      case 'settings':
        return (
          <Settings
            setTab={setTab}
            themeMode={themeMode}
            onThemeModeChange={setThemeMode}
          />
        )
      case 'other':
        return <Other setTab={setTab} />
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
        <div className='menu-item' onClick={() => setTab('other')}>
          <OtherIcon /><br />
          その他
        </div>
      </section>
    </>
  )
}

export default App