// pages/api/swagger.ts
import { NextApiRequest, NextApiResponse } from 'next';

const PUBLIC_URL = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const response = await fetch(PUBLIC_URL + '/swagger.json');
        res.status(200).json(await response.json());
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
}