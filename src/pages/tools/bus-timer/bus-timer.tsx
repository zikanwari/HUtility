import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import './bus-timer.css'
import '../../../assets/menu.css'
import busData from '../../../assets/busdata.json'
import * as BusUtils from "./bus-utils";
import { fetchBusDelays, type BusDelayMap } from "./bus-gtfs";

const busStops = [
    ["広大中央口", 40010, 14],
    ["広大北口", 40011, 15],
    ["広大二神口", 40012, 16],
    ["広大西口", 40013, 18],
    ["大学会館前", 40014, 19],
    ["ががら口", 40015, 20],
    ["山中池", 40017, 22],
    ["---",],
    ["西条駅", 40001, 2065],
    ["八本松駅", 40018, ],
    ["東広島駅", 40030, ],
]

// 行き先のパターンを定義
const D_ALL = ["西条駅", "八本松駅", "東広島駅"]
const D_S_HIGASHI = ["西条駅", "東広島駅"]
const D_HACHI_HIGASHI = ["八本松駅", "東広島駅"]
const D_HACHI = ["八本松駅"]
const D_HIGASHI = ["東広島駅"]
const D_UNIV = ["広島大学"]

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

const schedules = [
    "平日",
    "土・日",
    "年末年始",
]

const jr: React.CSSProperties = {
    backgroundColor: 'rgb(0, 103, 182)',
}
const geiyo: React.CSSProperties = {
    backgroundColor: 'rgb(110, 60, 213)',
}
const rapid: React.CSSProperties = {
    backgroundColor: 'rgb(255, 62, 62)',
    marginLeft: '5px',
    marginRight: '-5px',
    padding: '0.5px 2px',
}

function RemainingTime({
    time,
    delaySeconds = 0,
}: {
    time: string;
    delaySeconds?: number;
}) {
    const totalSeconds =
        BusUtils.getRemainingSeconds(
            time,
            delaySeconds
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

    const [departure, setDeparture] = useState(busStops[0][0] as string)
    const [arrival, setArrival] = useState("");
    const [schedule, setSchedule] = useState(BusUtils.getSchedule(new Date()));
    const [showJR, setShowJR] = useState(true);
    const [showGeiyo, setShowGeiyo] = useState(true);
    const [, setTick] = useState(0);
    const [delays, setDelays] = useState<BusDelayMap>({});
    const currentDestinations = stopDestinations[departure] || []

    const buses = (busData as Record<string, BusUtils.BusInfo[]>)[departure] ?? [];
    const filteredBuses = BusUtils.filterBuses(
        buses,
        arrival,
        showJR,
        showGeiyo,
        schedule
    );

    const departureStopInfo = (busStops as Array<any>).find(stop => stop[0] === departure);
    const jrDepartureId = String(departureStopInfo?.[1] || "");
    const geiyoDepartureId = String(departureStopInfo?.[2] || "");

    const jrDelays = delays[jrDepartureId] || {};
    const geiyoDelays = delays[geiyoDepartureId] || {};

    const combinedDelays: Record<string, number> = {};
    for (const bus of filteredBuses) {
        const delay = bus.company === 'JR' ? jrDelays[bus.time] : geiyoDelays[bus.time];
        if (delay) {
            combinedDelays[bus.time] = delay;
        }
    }

    const upcomingBuses = BusUtils.getUpcomingBuses(filteredBuses, combinedDelays);
    const nextBus = upcomingBuses[0];
    const laterBuses = upcomingBuses.slice(1, 6);

    const nextBusDelay = nextBus && (nextBus.company === 'JR' ? jrDelays[nextBus.time] : geiyoDelays[nextBus.time]);

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

    // GTFSの遅延情報を取得（1分ごとに更新）
    useEffect(() => {
        let isMounted = true;
        const loadDelays = async () => {
            const data = await fetchBusDelays();
            if (isMounted) setDelays(data);
        };
        loadDelays();
        const interval = setInterval(loadDelays, 60000);
        return () => {
            isMounted = false;
            clearInterval(interval);
        };
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
                            className="select-menu"
                            value={departure}
                            onChange={(e) => setDeparture(e.target.value)}
                        >
                            {busStops.map(([stop, id]) => (
                                <option
                                    key={stop as string}
                                    value={stop as string}
                                    disabled={stop === "---"}
                                >
                                    {stop as string}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="arrival">行き先方面 </label>
                        <select
                            id="arrival"
                            className="select-menu"
                            value={arrival}
                            onChange={(e) => setArrival(e.target.value)}
                        >
                            {currentDestinations.map((destination) => (
                                <option key={destination} value={destination}>
                                    {destination}方面
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div>
                    <label htmlFor="schedule">ダイヤ</label>
                    <select
                        id="schedule"
                        className="select-menu"
                        value={schedule}
                        onChange={(e) => setSchedule(e.target.value)}
                    >
                        {schedules.map((schedule) => (
                            <option key={schedule} value={schedule}>
                                {schedule}
                            </option>
                        ))}
                    </select>

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
                            {nextBusDelay ? (
                                <span style={{ color: '#ff5555', marginLeft: '10px' }}>
                                    約{Math.floor(nextBusDelay / 60)}分遅れ
                                </span>
                            ) : null}
                        </p>
                        <h1>
                            <RemainingTime
                                time={nextBus.time}
                                delaySeconds={nextBusDelay || 0}
                            />
                        </h1>
                    </>
                ) : (
                    <p style={{ color: 'rgb(250, 154, 90)' }}>☆☆☆本日の運行は終了しました☆☆☆</p>
                )}
            </div>
            <div className="next">
                {laterBuses.map((bus) => {
                    const delay = (bus.company === 'JR' ? jrDelays[bus.time] : geiyoDelays[bus.time]) || 0;
                    return (
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
                                {bus.rapid && (
                                    <span style={rapid}>(急)</span>
                                )}
                            </span>

                            {bus.time}発
                            {" "}
                            {
                                bus.destination
                            }
                            方面

                            <span>
                                {Math.floor(BusUtils.getRemainingSeconds(bus.time, delay) / 60)}
                                <span className="unit">
                                    {delay ? (
                                        <span style={{ color: '#ff5555', fontSize: '0.8rem' }}>
                                            ({Math.floor(delay / 60)})
                                        </span>
                                    ) : null}
                                    分後
                                </span>
                            </span>
                        </div>
                    );
                })}
            </div>
            <div className="footer">表示されている時間は3月14日時点の時刻表のものです。実際の運行状況とは異なる場合があります。</div>
        </>
    )
}