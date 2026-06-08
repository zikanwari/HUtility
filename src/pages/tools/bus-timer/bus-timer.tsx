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
]
const destinations = [
    "西条駅方向",
    "寺家駅方向",
]

export default function BusTimer() {
    const navigate = useNavigate()

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
                        <select id="departure">
                            {busStops.map((stop) => (
                                <option key={stop} value={stop}>
                                    {stop}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="arrival">行き先方向 </label>
                        <select id="arrival">
                            {destinations.map((destination) => (
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
        </>
    )
}