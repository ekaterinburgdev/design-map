import { NextApiRequest, NextApiResponse } from 'next';
import cacheData from 'memory-cache';
import placemarks from '../../public/notion-static/placemarks.json';

const render = () => placemarks.map((mark) => ({
    ...mark,
    preview: mark.images[0],
}));

async function withCache(cacheKey, cb) {
    const value = cacheData.get(cacheKey);

    if (value) {
        return value;
    }

    const data = await cb();

    cacheData.put(cacheKey, data, 24 * 1000 * 60 * 60);

    return data;
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const mapItems = await withCache('NOTION_DATABASE', render);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(mapItems);
}

export default handler;
