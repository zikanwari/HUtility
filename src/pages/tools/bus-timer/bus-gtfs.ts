export type BusDelayMap = Record<string, Record<string, number>>;

// 新しいバックエンドサーバーのURL
const BACKEND_URL = "https://api.launchpencil.f5.si/gtfs/delays";

/**
 * バックエンドサーバーからGTFSの遅延情報を取得する
 * @returns {Promise<BusDelayMap>} バス停プレフィックスと予定時刻をキーにした遅延時間（秒）
 */
export async function fetchBusDelays(): Promise<BusDelayMap> {
    try {
        const res = await fetch(BACKEND_URL);
        if (!res.ok) {
            throw new Error(`Failed to fetch delay data: ${res.status}`);
        }
        const data: BusDelayMap = await res.json();
        return data;
    } catch (error) {
        console.error("Error fetching GTFS realtime data from backend:", error);
        return {};
    }
}
