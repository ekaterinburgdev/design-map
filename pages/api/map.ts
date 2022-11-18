import { NextApiRequest, NextApiResponse } from 'next';
import getMapItems from './lib/get-map-items';

async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(await getMapItems());
}

export default handler;
