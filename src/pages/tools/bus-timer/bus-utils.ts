export interface BusInfo {
    legend: number;
    time: string;
    company: string;
    rapid: boolean;
    destination: string;
}

export function timeToMinutes(
    time: string
): number {
    const [hour, minute] =
        time.split(":").map(Number);

    return hour * 60 + minute;
}

export function getCurrentMinutes(): number {
    const now = new Date();

    return (
        now.getHours() * 60 +
        now.getMinutes()
    );
}

export function getRemainingMinutes(
    time: string
): number {
    return (
        timeToMinutes(time) -
        getCurrentMinutes()
    );
}

export function getDestinations(
    buses: BusInfo[]
): string[] {
    return [
        ...new Set(
            buses.map(
                (bus) => bus.destination
            )
        ),
    ];
}

export function filterBuses(
    buses: BusInfo[],
    destination: string,
    showJR: boolean,
    showGeiyo: boolean
): BusInfo[] {
    const today = new Date();
    const newYear = isNewYearSchedule(today);
    const holiday = isHolidaySchedule(today);

    return buses.filter((bus) => {
        if (newYear) {
            return bus.legend === 2;
        }
        if (
            holiday &&
            bus.legend === 1
        ) {
            return false;
        }
        
        if (
            bus.company === "JR" && !showJR
        ) {
            return false;
        }

        if (
            bus.company === "芸陽" && !showGeiyo
        ) {
            return false;
        }

        if (
            destination &&
            bus.destination !== destination
        ) {
            return false;
        }

        return true;
    });
}

export function getUpcomingBuses(
    buses: BusInfo[]
): BusInfo[] {
    return buses
        .filter(
            (bus) =>
                getRemainingSeconds(bus.time) > 0
        )
        .sort((a, b) =>
            a.time.localeCompare(b.time)
        );
}

export function getRemainingSeconds(
    time: string
): number {
    const now = new Date();

    const [hour, minute] =
        time.split(":").map(Number);

    const target = new Date();

    target.setHours(hour);
    target.setMinutes(minute);
    target.setSeconds(0);
    target.setMilliseconds(0);

    return Math.max(
        0,
        Math.floor(
            (target.getTime() -
                now.getTime()) /
            1000
        )
    );
}

function isHolidaySchedule(date: Date): boolean {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    // 土日
    if (
        date.getDay() === 0 ||
        date.getDay() === 6
    ) {
        return true;
    }

    // 8/13～8/16
    if (
        month === 8 &&
        day >= 13 &&
        day <= 16
    ) {
        return true;
    }

    // 12/29～12/30
    if (
        month === 12 &&
        day >= 29 &&
        day <= 30
    ) {
        return true;
    }

    return false;
}

function isNewYearSchedule(date: Date): boolean {
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return (
        (month === 12 && day === 31) ||
        (month === 1 && day >= 1 && day <= 3)
    );
}