import './home.css'
import { Fragment, useMemo } from 'react'

import timedata from '../../assets/time.json'
import sample from '../../assets/sample.json'

interface Period {
    name: string
    cells: (ClassCell | OthersCell)[]
}

interface OthersCell {
    type: 'same' | 'empty'
    raw: "上記と同じ" | "空き"
}

interface ClassCell {
    type: 'class'
    subject: string
    teacher: string
    room?: string
}

interface TimeData {
    period: string
    time: string
}

interface TimeRange {
    start: number
    end: number
}

const days = ['月', '火', '水', '木', '金']
const parsedTimeData = timedata as TimeData[]

function parseTimeRange(value: string): TimeRange | null {
    const parts = value.match(/\d+/g)?.map(Number)

    if (!parts || parts.length < 4) {
        return null
    }

    const [startHour, startMinute, endHour, endMinute] = parts

    return {
        start: startHour * 60 + startMinute,
        end: endHour * 60 + endMinute,
    }
}

function getNowMinutes(now: Date) {
    return now.getHours() * 60 + now.getMinutes()
}

function getWeekdayIndex(now: Date) {
    const day = now.getDay()

    if (day < 1 || day > 5) {
        return null
    }

    return day - 1
}

function getActivePeriodIndex(periods: Period[], nowMinutes: number) {
    return periods.findIndex((period) => {
        const timeData = parsedTimeData.find((item) => item.period === period.name)
        const range = timeData ? parseTimeRange(timeData.time) : null

        if (!range) {
            return false
        }

        return nowMinutes >= range.start && nowMinutes < range.end
    })
}

function Cell({
    data,
    active,
}: {
    data: ClassCell | OthersCell
    active: boolean
}) {
    switch (data.type) {
        case 'class':
            return (
                <div className="cell">
                    <div className={`class ${active ? 'class--active' : ''}`}>
                        <div className="class-name">{data.subject}</div>
                        <div className="teacher">{data.teacher}</div>
                        <div className="room">{data.room}</div>
                    </div>
                </div>
            )
        case 'same':
            return (
                <div className={`cell ${data.type} ${active ? 'cell--active' : ''}`}>
                    <div className="class">{data.raw}</div>
                </div>
            )
        default:
            return (
                <div className={`cell ${data.type}`}>
                    {data.raw}
                </div>
            )
    }
}

function Time({ name }: { name: string }) {
    const timeData = parsedTimeData.find((t) => t.period === name)
    return <div className="time">{timeData?.time}</div>
}

export default function Home() {
    const time = useMemo(() => {
        const saved = localStorage.getItem('time')
        if (!saved) return sample as Period[]

        try {
            return JSON.parse(saved) as Period[]
        } catch {
            return sample as Period[]
        }
    }, [])

    const now = new Date()
    const nowMinutes = getNowMinutes(now)
    const activePeriodIndex = getActivePeriodIndex(time, nowMinutes)
    const activeDayIndex = getWeekdayIndex(now)

    return (
        <div className="app-content">
            <div className="timetable">
                <div />
                {
                    days.map((day) => (
                        <div key={day} className="header">{day}</div>
                    ))
                }
                {time.map((period, periodIndex) => (
                    <Fragment key={period.name}>
                        <div className="period">
                            {period.name}
                            <Time name={period.name} />
                        </div>
                        {period.cells.map((cell, dayIndex) => (
                            <Cell
                                key={`${period.name}-${dayIndex}`}
                                data={cell}
                                active={
                                    periodIndex === activePeriodIndex &&
                                    activeDayIndex === dayIndex &&
                                    cell.type === 'class'
                                }
                            />
                        ))}
                    </Fragment>
                ))}
            </div>
        </div>
    )
}
