import loadNotionDB from './utils/load-notion-db.js';

const { NOTION_TOKEN, NOTION_DATABASE } = process.env;

async function handler(req, res) {
    const mapItemsDB = await loadNotionDB(NOTION_DATABASE, NOTION_TOKEN);
    const mapItems = mapItemsDB.map(item => {
        return {
            name: item['Name'],
            type: item['Type'],
            description: item['Description'],
            coords: item['Coords'],
            street: item['Street'],
            images: item['Images'],
            date: item['Date'],
        }
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(mapItems);
}

export default handler;
