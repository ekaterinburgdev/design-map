import https from 'node:https';
import fs from 'node:fs';
import { log, getNotionGUID } from './utils.js';
import { resize, optimize } from './prepareImages.js';
import { getPlacemarksData, getImagesUrls } from './getNotionData.js';
import {
    VERCEL_PUBLIC_IMAGES_PATH,
    IMAGES_URLS_PATH,
    PLACEMARKS_CACHE_PATH
} from './constants.js';

const start = Date.now()

async function init() {
    console.log('Prepare images')

    await clearCachedImages(IMAGES_URLS_PATH);

    console.log('Get list from Notion')
    const items = await getPlacemarksData();
    const imageUrls = getImagesUrls(items);

    console.log(`Download ${imageUrls.length} images`);
    const images = await downloadImages(imageUrls)
        .then(log('Resize images'))
        .then(resize)
        .then(log('Remove original size images'))
        .then(removeOriginalImages)
        .then(log('Optimize images'))
        .then(optimize)
        .catch(console.log);
    
    console.log('Save metadata')
    await saveMetadata(PLACEMARKS_CACHE_PATH, items, images)

    console.log(`Finish in ${(Date.now() - start) / 1000} seconds`)
}
init()

async function clearCachedImages(path) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
    }

    fs.mkdirSync(path, { recursive: true });
}

async function downloadImages(urls) {
    const downloadImage = (url) =>
        new Promise((resolve, reject) => {
            const [filename] = new URL(url).pathname.split('/').slice(-1);
            const ext = filename.split('.').slice(-1)[0];
            const notionGUID = getNotionGUID(url);
            const outputFilename = notionGUID ? `${notionGUID}.${ext}` : filename;

            const file = fs.createWriteStream(IMAGES_URLS_PATH + outputFilename);

            https.get(url, (response) => {
                response.pipe(file);
            });

            file.on('finish', () => {
                file.close();
                resolve({ id: notionGUID, path: outputFilename });
            });

            file.on('error', (e) => {
                console.error(`Not loaded: ${outputFilename}`, e);
                reject();
            });
        });

    return Promise.all(urls.map(downloadImage));
}

async function removeOriginalImages(items) {
    await Promise.all(
        items.map(
            (item) =>
                new Promise((resolve) => {
                    try {
                        fs.unlinkSync(IMAGES_URLS_PATH + item.path);
                    } catch (e) {
                        console.log(`Error remove ${e}`);
                    }
                    resolve();
                }),
        ),
    );
    return items;
}

function saveMetadata(cachPath, items, images) {
    const imagesById = images.reduce((all, item) => {
        all[item.id] = item;
        return all;
    }, {});

    const updatedItems = items.map((item) => ({
        ...item,
        images: item.images
            .map((url) => {
                const notionGUID = url.includes('notion-static.com')
                    ? url.match(/secure.notion-static.com\/(.*)\//)[1]
                    : '';
                const image = imagesById[notionGUID];

                if (image) {
                    return {
                        id: image.id,
                        m: {
                            ...image.m,
                            src: `${VERCEL_PUBLIC_IMAGES_PATH}m_${image.path}`,
                        },
                        s: {
                            ...image.s,
                            src: `${VERCEL_PUBLIC_IMAGES_PATH}s_${image.path}`,
                        },
                    };
                }
                return null;
            })
            .filter((src) => src !== null) || []
    })).map((mark) => ({
        ...mark,
        preview: mark.images?.[0] || null
    }))

    fs.writeFileSync(cachPath, JSON.stringify(updatedItems));
}
