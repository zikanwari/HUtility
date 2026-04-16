import { useState } from 'react';

import './App.css'
import { TimeIcon, SettingsIcon } from './assets/images.tsx';

import Home from './pages/home/home.tsx'
import Settings from './pages/settings/settings.tsx'

function App() {
  const [Tab, setTab] = useState('home');
  function renderPage() {
    switch (Tab) {
      case 'home':
        return <Home />
      case 'settings':
        return <Settings />
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