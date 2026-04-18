import './settings.css'
import { useState } from 'react'

function Setting({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)
    
    return (
        <div className="setting">
            <h3 onClick={() => setIsOpen(!isOpen)}>{title}</h3>
            <div className={`setting-content${isOpen ? ' open' : ''}`}>
                {children}
            </div>
        </div>
    )
}


export default function Settings() {
    return (
        <div className="app-content">
            <div className="import">
                <Setting title="履修データのインポート">
                    <p>履修データから時間割を自動生成します。</p>
                    <input type="file" accept=".json" />
                </Setting>
 
            </div>
        </div>
    )
}