import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './bus-timer.css'

const busStops = [
    "広大中央口",
    "広大北口",
    "広大二神口",
    "二神山",
    "広大西口",
    "大学会館前",
    "ががら口",
    "広大東口",
    "山中池",
    "---",
    "西条駅",
    "八本松駅",
    "東広島駅",
]

// 行き先のパターンを定義
const D_ALL = ["西条駅方向", "八本松駅方向", "東広島駅方向"]
const D_HACHI = ["西条駅方向", "八本松駅方向"]
const D_HIGASHI = ["西条駅方向", "東広島駅方向"]
const D_SAIJO = ["西条駅方向"]
const D_UNIV = ["広島大学方向"]

const stopDestinations: Record<string, string[]> = {
    "広大中央口": D_ALL,
    "広大北口":   D_ALL,
    "大学会館前": D_ALL,
    "広大二神口": D_HACHI,
    "山中池":     D_HACHI,
    "広大西口":   D_HIGASHI,
    "ががら口":   D_HIGASHI,
    "二神山":     D_SAIJO,
    "広大東口":   D_SAIJO,
    "西条駅":     D_UNIV,
    "八本松駅":   D_UNIV,
    "東広島駅":   D_UNIV,
}

const rapid :React.CSSProperties = {
  backgroundColor: 'rgb(255, 44, 44)',
}
const jr :React.CSSProperties = {
  backgroundColor: 'rgb(0, 103, 182)',
}
const geiyo :React.CSSProperties = {
  backgroundColor: 'rgb(110, 60, 213)',
}

export default function BusTimer() {
    const navigate = useNavigate()
    const [departure, setDeparture] = useState(busStops[0])

    const currentDestinations = stopDestinations[departure] || []

    return (
        <>
            <div className="back" onClick={() => navigate(-1)}>
                <h3>
                    &lt; 戻る
                </h3>
            </div>
            <div className="conditions">
                <div className="stops">
                    <div>
                        <label htmlFor="departure">乗車バス停 </label>
                        <select
                            id="departure"
                            value={departure}
                            onChange={(e) => setDeparture(e.target.value)}
                        >
                            {busStops.map((stop) => (
                                <option
                                    key={stop}
                                    value={stop}
                                    disabled={stop === "---"}
                                >
                                    {stop}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="arrival">行き先方向 </label>
                        <select id="arrival">
                            {currentDestinations.map((destination) => (
                                <option key={destination} value={destination}>
                                    {destination}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <input type="checkbox" id="jr" checked />
                    <label htmlFor="jr">JRバス</label>

                    <input type="checkbox" id="geiyo" checked />
                    <label htmlFor="geiyo">芸陽バス</label>
                </div>
            </div>
            <div className="timer">
                <p><span style={rapid} className='plate'>JR(急)</span>　12:34発　江熊止まり</p>
                <h1>1<span>分</span>32<span>秒後</span></h1>
            </div>
            <div className="timer">
                <p style={{ color: 'rgb(250, 154, 90)' }}>☆☆☆本日の運行は終了しました☆☆☆</p>
            </div>
            <div className="next">
                <div>
                    <span style={geiyo} className='plate'>芸陽</span>13:56発 西条駅行き
                    <span>12<span className='unit'>分</span>34<span className='unit'>秒後</span></span>
                </div>
                <div>
                    <span style={jr} className='plate'>JR</span>13:56発 西条駅行き
                    <span>12<span className='unit'>分</span>34<span className='unit'>秒後</span></span>
                </div>
                <div>
                    <span style={jr} className='plate'>JR</span>13:56発 西条駅行き
                    <span>12<span className='unit'>分</span>34<span className='unit'>秒後</span></span>
                </div>
                <div>
                    <span style={rapid} className='plate'>芸陽(急)</span>13:56発 西条駅行き
                    <span>12<span className='unit'>分</span>34<span className='unit'>秒後</span></span>
                </div>
                <div>
                    <span style={jr} className='plate'>JR</span>13:56発 西条駅行き
                    <span>12<span className='unit'>分</span>34<span className='unit'>秒後</span></span>
                </div>
            </div>
        </>
    )
}