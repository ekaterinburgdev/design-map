import placemarks from '../../../public/notion-static/placemarks.json';

const { NODE_ENV, NOTION_DEV_CACHE_ENABLED } = process.env;

const isDevCacheEnabled = NODE_ENV !== 'production' && NOTION_DEV_CACHE_ENABLED === 'true';

let mapItemsCache = null;
async function getMapItems() {
    if (isDevCacheEnabled && mapItemsCache) {
        return mapItemsCache;
    }

    const mapItems = placemarks.map((mark) => ({
        ...mark,
        preview: mark.images[0] || null,
    }));

    if (isDevCacheEnabled) {
        mapItemsCache = mapItems;
    }

    return mapItems;
}

export default getMapItems;
