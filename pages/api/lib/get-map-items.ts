import { loadNotionDB } from './load-notion-db';

const {
    NOTION_TOKEN,
    NOTION_DATABASE,
    NODE_ENV,
    NOTION_DEV_CACHE_ENABLED,
} = process.env;

const isDevCacheEnabled = NODE_ENV !== 'production' && NOTION_DEV_CACHE_ENABLED === 'true';

function getCoords(coords: string) {
    return coords.split(', ').map((x) => Number(x));
}

let mapItemsCache = null;
async function getMapItems() {
    if (isDevCacheEnabled && mapItemsCache) {
        return mapItemsCache;
    }

    const mapItemsNotionData = await loadNotionDB(NOTION_DATABASE, NOTION_TOKEN);
    const mapItems = mapItemsNotionData.map((item) => ({
        name: item.Name || '',
        type: item.Type || '',
        description: item.Description || '',
        coords: getCoords(item.Coords) || [],
        street: item.Street || '',
        images: item.Images || [],
        preview: item.Images[0] || null,
        date: item.Date || null,
    }));

    if (isDevCacheEnabled) {
        mapItemsCache = mapItems;
    }

    return mapItems;
}

export default getMapItems;
