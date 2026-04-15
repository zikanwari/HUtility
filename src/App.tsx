import './App.css'

import Home from './pages/home/home.tsx'

function App() {
  return (
    <>
      <section className="app-shell">
        <Home />
      </section>
      <section className="app-menu">
        <div className='menu-item'>時間割</div>
        <div className='menu-item'>設定</div>
      </section>
    </>
  )
}

export default App
