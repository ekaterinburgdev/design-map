import dotenv from 'dotenv-flow';
import slug from 'slug';
import { Client } from '@notionhq/client';
import typographText from './typographText.js';

dotenv.config();

const notion = new Client({ auth: process.env.NOTION_TOKEN });

export async function getPlacemarksData() {
    let response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE,
    });
    let results = response.results || [];

    while (response.next_cursor) {
        response = await notion.databases.query({
            database_id: process.env.NOTION_DATABASE,
            start_cursor: response.next_cursor,
        });

        results = [...results, ...response.results];
    }

    return results
        .map(({ id, properties }) => ({
            id,
            ...Object.fromEntries(
                Object.entries(properties).map(([key, value]) => [
                    key,
                    extractNotionValues(value, value.type),
                ]),
            ),
        }))
        .map((item) => ({
            id: slug(`${item.Name}-${getShortId(item.id)}`),
            name: typographText(item.Name),
            type: item.Type,
            description: typographText(item.Description),
            coords: item.Coords.split(', ').map((x) => Number(x)),
            street: item.Street,
            images: item.Images,
        }));
}

export function getImagesUrls(items) {
    return items.reduce((all, item) => all.concat(item.images), []);
}

function extractNotionValues(notionValue, notionType) {
    switch (notionType) {
        case 'title':
            return notionValue.title[0]?.plain_text;
        case 'rich_text':
            return notionValue.rich_text[0]?.plain_text;
        case 'number':
            return notionValue.number;
        case 'select':
            return notionValue.select?.name;
        case 'multi_select':
            return notionValue.multi_select.map((x) => x?.name);
        case 'date':
            return new Date(notionValue.date?.start).getTime();
        case 'checkbox':
            return notionValue.checkbox || undefined;
        case 'files':
            return notionValue.files.flatMap((x) => x?.file?.url);
        case 'url':
            return notionValue.url;
        case 'email':
            return notionValue.email;
        case 'phone_number':
            return notionValue.phone_number;
        default:
            return '';
    }
}

function getShortId(uuid) {
    try {
        return uuid.split('-')[0];
    } catch (e) {
        return uuid;
    }
}
