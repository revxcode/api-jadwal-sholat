import { NextApiRequest, NextApiResponse } from 'next';
import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, ApiResponse>({
    max: 100,
    ttl: 1000 * 60 * 60, // 1 hour
});

interface PrayerTimes {
    Fajr: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

interface ApiResponse {
    code: number;
    message?: string;
    results?: {
        datetime: {
            times: PrayerTimes;
        }[];
    };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const city: string | undefined = Array.isArray(req.query.city) ? req.query.city[0] : req.query.city;

    if (!city) return res.status(400).json({ error: 'City is required' });

    if (cache.has(city as string)) {
        return res.status(200).json(cache.get(city as string));
    }

    try {
        const response = await fetch(
            `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=3`
        );
        const data: { code: number; data: { timings: PrayerTimes } } = await response.json();

        if (data.code !== 200) {
            return res.status(404).json({ error: "Data not found" });
        }

        const prayerTimes: ApiResponse = {
            code: 200,
            results: {
                datetime: [
                    {
                        times: {
                            Fajr: data.data.timings.Fajr,
                            Dhuhr: data.data.timings.Dhuhr,
                            Asr: data.data.timings.Asr,
                            Maghrib: data.data.timings.Maghrib,
                            Isha: data.data.timings.Isha,
                        },
                    },
                ],
            },
        };

        // Simpan ke cache
        cache.set(city, prayerTimes);

        res.status(200).json(prayerTimes);
    } catch (error: any) {
        return res.status(500).json({ error: error.message });
    }
}