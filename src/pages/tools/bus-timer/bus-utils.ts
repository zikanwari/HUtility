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
    return buses.filter((bus) => {
        if (
            bus.company === "JR" &&
            !showJR
        ) {
            return false;
        }

        if (
            bus.company === "芸陽" &&
            !showGeiyo
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