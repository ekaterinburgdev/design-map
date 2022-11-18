/* eslint-disable no-await-in-loop */
import fetch from 'node-fetch';
import { extractNotionValues } from './extract-notion-values';

export async function loadNotionDB(notionDB, notionToken, notionVersion = '2022-06-28') {
    const requestHeaders = {
        Authorization: `Bearer ${notionToken}`,
        'Notion-Version': notionVersion,
        'Content-Type': 'application/json',
    };

    // TODO Add Notion Type
    let results : any[] = [];

    let response = await fetch(`https://api.notion.com/v1/databases/${notionDB}/query`, {
        method: 'POST',
        headers: requestHeaders,
    });

    // TODO Add Notion Type
    let data : any = await response.json();
    results = data.results || [];

    while (data.next_cursor) {
        response = await fetch(`https://api.notion.com/v1/databases/${notionDB}/query`, {
            method: 'POST',
            headers: requestHeaders,
            body: JSON.stringify({
                start_cursor: data.next_cursor,
            }),
        });

        data = await response.json();
        results = [...results, ...data.results];
    }

    return results
        .map(({ properties }) => properties)
        .map((property) => Object.fromEntries(
            Object.entries(property)
                // TODO Add Notion Type
                .map(([key, value] : [any, any]) => [key, extractNotionValues(value, value.type)]),
        ));
}
