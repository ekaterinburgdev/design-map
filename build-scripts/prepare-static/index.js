import https from 'node:https';
import fs from 'node:fs';
import { log, getNotionGUID } from './utils.js';
import { resize } from './prepareImages.js';
import { getPlacemarksData, getImagesUrls } from './getNotionData.js';
import { VERCEL_PUBLIC_IMAGES_PATH, IMAGES_URLS_PATH, PLACEMARKS_CACHE_PATH } from './constants.js';

const start = Date.now();

async function init() {
    console.log('Prepare images');
    await clearCachedImages(IMAGES_URLS_PATH);

    console.log('Get list from Notion');
    const items = await getPlacemarksData();
    const imageUrls = getImagesUrls(items);

    console.log(`Download ${imageUrls.length} images`);

    const images = await downloadImagesInBatches(imageUrls, 10)
        .then(log('Resize images'))
        .then(resize)
        .then(removeOriginalImages)
        .catch(console.error);

    console.log('Save metadata');
    await saveMetadata(PLACEMARKS_CACHE_PATH, items, images);

    console.log(`Finish in ${(Date.now() - start) / 1000} seconds`);
}
init();

async function clearCachedImages(path) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
    }
    fs.mkdirSync(path, { recursive: true });
}

async function downloadImagesInBatches(urls, concurrency) {
    const results = [];
    const queue = [...urls];
    let completed = 0;

    async function worker() {
        while (queue.length > 0) {
            const url = queue.shift();
            const index = urls.length - queue.length;
            try {
                const res = await downloadImage(url, index, urls.length);
                results.push(res);
            } catch (e) {}
            completed++;
        }
    }

    const workers = Array(Math.min(concurrency, urls.length)).fill(null).map(worker);

    await Promise.all(workers);
    return results;
}

function downloadImage(url, index, total) {
    return new Promise((resolve, reject) => {
        const ext = new URL(url).pathname.split('.').at(-1);
        const guid = getNotionGUID(url);
        const filename = `${guid}.${ext}`;
        const filePath = IMAGES_URLS_PATH + filename;
        const file = fs.createWriteStream(filePath);

        const request = https.get(url, (response) => {
            if (response.statusCode !== 200) {
                console.error(`Failed: ${filename} (Status: ${response.statusCode})`);
                reject(new Error(response.statusCode));
                return;
            }
            response.pipe(file);
        });

        request.on('error', (e) => {
            console.error(`Network Error: ${filename}`, e.message);
            reject(e);
        });

        file.on('finish', () => {
            file.close();
            resolve({ id: guid, path: filename });
        });

        file.on('error', (e) => {
            console.error(`Write Error: ${filename}`);
            reject(e);
        });
    });
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

    const updatedItems = items
        .map((item) => ({
            ...item,
            images:
                item.images
                    .map((url) => {
                        const guid = getNotionGUID(url);
                        const image = imagesById[guid];
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
                    .filter((src) => src !== null) || [],
        }))
        .map((mark) => ({
            ...mark,
            preview: mark.images?.[0] || null,
        }));

    fs.writeFileSync(cachPath, JSON.stringify(updatedItems));
}
