# Ekaterinburg Map

🎨 Map of ekaterinburg.design objects

**[map.ekaterinburg.design](https://map.ekaterinburg.design)**

## Tools

- [Leaflet](https://leafletjs.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Next.js](https://nextjs.org/)
- [Vercel Serverless](https://vercel.com/)


## HTTP API
You can use the site API in your own applications.

```
https://map.ekaterinburg.design/api/map
```

### Response example
```json
[
    {
        "name": "Жилой комплекс 1968 г.",
        "type": "Таблички ОКН",
        "coords": [ 56.833605, 60.592507 ],
        "street": "Ул. Хохрякова, 23",
        "images": [
            {
                "id": "5eee6a64-8d8f-4bbe-9a39-aba17c4dac07",
                "m": { "width": 600, "height": 800, "src": "/notion-static/images/m_5eee6a64-8d8f-4bbe-9a39-aba17c4dac07.jpeg" },
                "s": { "width": 48, "height": 64, "src": "/notion-static/images/s_5eee6a64-8d8f-4bbe-9a39-aba17c4dac07.jpeg" }
            },
            {
                "id": "1a34911d-e8b4-42bf-9f0f-c061e6366601",
                "m": { "width": 600, "height": 800, "src": "/notion-static/images/m_1a34911d-e8b4-42bf-9f0f-c061e6366601.jpeg" },
                "s": { "width": 48, "height": 64, "src": "/notion-static/images/s_1a34911d-e8b4-42bf-9f0f-c061e6366601.jpeg" }
            }
        ],
        "preview": {
            "id": "5eee6a64-8d8f-4bbe-9a39-aba17c4dac07",
            "m": { "width": 600, "height": 800, "src": "/notion-static/images/m_5eee6a64-8d8f-4bbe-9a39-aba17c4dac07.jpeg" },
            "s": { "width": 48, "height": 64, "src": "/notion-static/images/s_5eee6a64-8d8f-4bbe-9a39-aba17c4dac07.jpeg" }
        },
        "date": 1501286400000
    },
    ...
]
```

## Development

1. Add `.env.local` with Notion keys
```sh
NOTION_TOKEN=
NOTION_DATABASE=
# Set `false` to prevent caching Notion responses in development mode
NOTION_DEV_CACHE_ENABLED=true
```

2. Install [Node.js](https://nodejs.org/en/download/) and [pnpm](https://www.npmjs.com/package/pnpm#user-content-install)

3. Install dependencies

```
pnpm i
```

4. Run local server

```
pnpm dev
```
