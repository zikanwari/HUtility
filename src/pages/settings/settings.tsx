import './settings.css'

function Setting({ title, children }: { title: string, children: React.ReactNode }) {
    return (
        <div className="setting">
            <h3>{title}</h3>
            <div className="setting-content">
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
                    <p>履修データをインポートします。時間割の自動生成に使用されます。</p>
                    <input type="file" accept=".json" />
                </Setting>
 
            </div>
        </div>
    )
}