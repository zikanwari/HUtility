import './settings.css'
import { useState } from 'react'

function Setting({ title, children }: { title: string, children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="setting">
            <h3 className={`setting-title${isOpen ? ' open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                {title}
            </h3>
            <div className={`setting-content${isOpen ? ' open' : ''}`}>
                <div className="setting-content-inner">
                    {children}
                </div>
            </div>
        </div>
    )
}

type DeviceType = 'android' | 'ios' | 'other'

function detectDevice(): DeviceType {
    const ua = navigator.userAgent
    const isAndroid = /Android/i.test(ua)
    const isIOS = /iPhone|iPad|iPod/i.test(ua)

    if (isAndroid) return 'android'
    if (isIOS) return 'ios'
    return 'other'
}

const guideByDevice = {
    android: {
        label: 'Android',
        url: '/guides/export/android.html',
    },
    ios: {
        label: 'iOS',
        url: '/guides/export/ios.html',
    },
    other: {
        label: 'その他端末',
        url: '/guides/export/index.html',
    },
}

export default function Settings() {
    const device = detectDevice()

    const currentGuide = guideByDevice[device]

    return (
        <div className="app-content">
            <div className="import">
                <Setting title="履修データのインポート">
                    <p>履修データから時間割を自動生成します。<br />
                    履修データのエクスポートの手順については、下のガイドを参照してください。
                    </p>
                    <span>
                        現在の端末: {currentGuide.label}
                    </span><br />
                    <a
                        className="guide-button"
                        href={currentGuide.url}
                        target="_blank"
                    >
                        インポートガイドを開く
                    </a><br />
                    <input type="file" />
                </Setting>
            </div>
        </div>
    )
}