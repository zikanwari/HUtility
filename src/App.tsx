import './App.css'
import { TimeIcon, SettingsIcon } from './assets/images.tsx';

import Home from './pages/home/home.tsx'

function App() {
  return (
    <>
      <section className="app-shell">
        <Home />
      </section>
      <section className="app-menu">
        <div className='menu-item'>
          <TimeIcon />
          時間割
        </div>
        <div className='menu-item'>
          <SettingsIcon />
          設定
        </div>
      </section>
    </>
  )
}

export default App
