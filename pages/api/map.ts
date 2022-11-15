import { NextApiRequest, NextApiResponse } from 'next';

import loadNotionDB from './utils/load-notion-db';

const { NOTION_TOKEN, NOTION_DATABASE } = process.env;

function getCoords(coords : string) {
    return coords.split(', ').map((x) => Number(x));
}

async function handler(req: NextApiRequest, res: NextApiResponse) {
    const mapItemsDB = await loadNotionDB(NOTION_DATABASE, NOTION_TOKEN);
    const mapItems = mapItemsDB.map((item) => ({
        name: item.Name,
        type: item.Type,
        description: item.Description,
        coords: getCoords(item.Coords),
        street: item.Street,
        images: item.Images,
        date: item.Date,
    }));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(mapItems);
}

export default handler;
