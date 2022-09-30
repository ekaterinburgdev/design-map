import fetch from 'node-fetch';
import extractNotionValue from './extract-notion-value.js';

async function loadNotionDB(notionDB, notionToken, notionVersion = '2022-06-28') {
    const requestHeaders = {
        'Authorization': `Bearer ${notionToken}`,
        'Notion-Version': notionVersion,
        "Content-Type": "application/json"
    }

    let results = [];

    let response = await fetch(`https://api.notion.com/v1/databases/${notionDB}/query`, {
        method: 'POST',
        headers: requestHeaders
    });

    let data = await response.json();

    results = [...data.results]

    while (data.next_cursor) {
        response = await fetch(`https://api.notion.com/v1/databases/${notionDB}/query`, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({
                start_cursor: data.next_cursor
            })
        });
    
        data = await response.json();
        results = [...results, ...data.results]
    }

    return results
        .map(({ properties }) => properties)
        .map(property => Object.fromEntries(
            Object.entries(property)
                .map(([key, value]) => [key, extractNotionValue(value, value.type)])
        ))
}

export default loadNotionDB;
