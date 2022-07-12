import fetch from 'node-fetch';
import extractNotionValue from './extract-notion-value.mjs';

async function loadNotionDB(notionDB, notionToken, notionVersion = '2022-02-22') {
    const response = await fetch(`https://api.notion.com/v1/databases/${notionDB}/query`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${notionToken}`,
            'Notion-Version': notionVersion
        }
    });

    const { results } = await response.json();

    return results
        .map(({ properties }) => properties)
        .map(property => Object.fromEntries(
            Object.entries(property)
                .map(([key, value]) => [key, extractNotionValue(value, value.type)])
        ))
}

export default loadNotionDB;
