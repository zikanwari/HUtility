import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './bus-timer.css'
import busData from '../../../assets/bus.json'
import * as BusUtils from "./bus-utils";

const busStops = [
    "広大中央口",
    "広大北口",
    "広大二神口",
    "広大西口",
    "大学会館前",
    "ががら口",
    "山中池",
    "---",
    "西条駅",
    "八本松駅",
    "東広島駅",
]

// 行き先のパターンを定義
const D_ALL = ["西条駅方面", "八本松駅方面", "東広島駅方面"]
const D_S_HIGASHI = ["西条駅方面", "東広島駅方面"]
const D_HACHI_HIGASHI = ["八本松駅方面", "東広島駅方面"]
const D_HACHI = ["八本松駅方面"]
const D_HIGASHI = ["東広島駅方面"]
const D_UNIV = ["広島大学方面"]

const stopDestinations: Record<string, string[]> = {
    "広大中央口": D_ALL,
    "広大北口": D_HACHI_HIGASHI,
    "広大二神口": D_HACHI,
    "広大西口": D_S_HIGASHI,
    "大学会館前": D_ALL,
    "ががら口": D_HIGASHI,
    "山中池": D_ALL,
    "西条駅": D_UNIV,
    "八本松駅": D_UNIV,
    "東広島駅": D_UNIV,
}
const jr: React.CSSProperties = {
    backgroundColor: 'rgb(0, 103, 182)',
}
const geiyo: React.CSSProperties = {
    backgroundColor: 'rgb(110, 60, 213)',
}
const rapid: React.CSSProperties = {
    backgroundColor: 'rgb(255, 62, 62)',
    marginLeft: '4px',
    padding: '0.5px 2px',
}

function RemainingTime({
    time,
}: {
    time: string;
}) {
    const totalSeconds =
        BusUtils.getRemainingSeconds(
            time
        );

    const minutes =
        Math.floor(
            totalSeconds / 60
        );

    const seconds =
        totalSeconds % 60;

    return (
        <>
            {minutes}<span>分</span>
            {seconds
                .toString().padStart(2, "0")
            }
            <span>秒後</span>
        </>
    );
}

export default function BusTimer() {
    const navigate = useNavigate()

    const [departure, setDeparture] = useState(busStops[0])
    const [arrival, setArrival] = useState("");
    const [showJR, setShowJR] = useState(true);
    const [showGeiyo, setShowGeiyo] = useState(true);
    const [, setTick] = useState(0);
    const currentDestinations = stopDestinations[departure] || []

    const buses = (busData as Record<string, BusUtils.BusInfo[]>)[departure] ?? [];
    const destinations = BusUtils.getDestinations(buses);
    const filteredBuses = BusUtils.filterBuses(
        buses,
        arrival,
        showJR,
        showGeiyo
    );
    const upcomingBuses = BusUtils.getUpcomingBuses(filteredBuses);
    const nextBus = upcomingBuses[0];
    const laterBuses = upcomingBuses.slice(1, 6);

    useEffect(() => {
        const buses = (busData as Record<string, BusUtils.BusInfo[]>)[departure] ?? [];
        const destinations = BusUtils.getDestinations(buses);

        setArrival(destinations[0] ?? "");
    }, [departure]);

    useEffect(() => {
        const timer =
            setInterval(() => {
                setTick(
                    (prev) => prev + 1
                );
            }, 1000);

        return () =>
            clearInterval(timer);
    }, []);

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
                        <label htmlFor="arrival">行き先方面 </label>
                        <select
                            id="arrival"
                            value={arrival}
                            onChange={(e) => setArrival(e.target.value)}
                        >
                            {currentDestinations.map((destination) => (
                                <option key={destination} value={destination}>
                                    {destination}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <input
                        type="checkbox"
                        id="jr"
                        defaultChecked={showJR}
                        onChange={(e) => setShowJR(e.target.checked)}
                    />
                    <label htmlFor="jr">JRバス</label>

                    <input
                        type="checkbox"
                        id="geiyo"
                        defaultChecked={showGeiyo}
                        onChange={(e) => setShowGeiyo(e.target.checked)}
                    />
                    <label htmlFor="geiyo">芸陽バス</label>
                </div>
            </div>

            <div className="timer">
                {nextBus ? (
                    <>
                        <p>
                            <span
                                className="plate"
                                style={nextBus.company === "JR" ? jr : geiyo}
                            >
                                {nextBus.company}
                                {nextBus.rapid && (
                                    <span style={rapid}>(急)</span>
                                )}
                            </span>

                            {"　"}{nextBus.time}発{"　"}
                            {nextBus.destination}方面
                        </p>
                        <h1>
                            <RemainingTime time={nextBus.time} />
                        </h1>
                    </>
                ) : (
                    <p style={{ color: 'rgb(250, 154, 90)' }}>☆☆☆本日の運行は終了しました☆☆☆</p>
                )}
            </div>
            <div className="next">
                {laterBuses.map(
                    (bus) => (
                        <div
                            key={`${bus.time}-${bus.destination}`}
                        >
                            <span
                                className="plate"
                                style={
                                    bus.company ===
                                        "JR"
                                        ? jr
                                        : geiyo
                                }
                            >
                                {bus.company}
                                {bus.rapid
                                    ? " 急行"
                                    : ""}
                            </span>

                            {bus.time}発
                            {" "}
                            {
                                bus.destination
                            }
                            方面

                            <span>
                                {BusUtils.getRemainingMinutes(
                                    bus.time
                                )}
                                <span className="unit">
                                    分後
                                </span>
                            </span>
                        </div>
                    )
                )}
            </div>
            <div className="footer">表示されている時間は3月14日時点の時刻表のものです。実際の運行状況とは異なる場合があります。</div>
        </>
    )
}