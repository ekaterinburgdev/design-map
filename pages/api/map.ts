import { NextApiRequest, NextApiResponse } from 'next';
import slug from 'slug';
import cacheData from 'memory-cache';
import { loadNotionDB } from './utils/loadNotionDB';

const { NOTION_TOKEN, NOTION_DATABASE } = process.env;

function getCoords(coords: string) {
    return coords.split(', ').map((x) => Number(x));
}

function getShortId(uuid: string): string {
    try {
        return uuid.split('-')[0];
    } catch (e) {
        return uuid;
    }
}

async function getMapItems() {
    const mapItemsDB = await loadNotionDB(NOTION_DATABASE, NOTION_TOKEN);
    return mapItemsDB.map((item) => ({
        id: slug(`${item.Name}-${getShortId(item.id)}`),
        name: item.Name,
        type: item.Type,
        description: item.Description,
        coords: getCoords(item.Coords),
        street: item.Street,
        images: item.Images,
        preview: item.Images[0],
        date: item.Date,
    }));
}

async function withCache(cacheKey, cb) {
    const value = cacheData.get(cacheKey);

    if (value) {
        return value;
    }

    const data = await cb();

    cacheData.put(cacheKey, data, 24 * 1000 * 60 * 60);

    return data;
}

async function handler(_: NextApiRequest, res: NextApiResponse) {
    const mapItems = await withCache('NOTION_DATABASE', getMapItems);

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(mapItems);
}

export default handler;
