import https from 'node:https';
import fs from 'node:fs';
import { log, getNotionGUID } from './utils.js';
import { resize, optimize } from './prepareImages.js';
import { getPlacemarksData, getImagesUrls } from './getNotionData.js';
import { IMAGES_PATH, IMAGES_PATH_EXTERNAL, PLACEMARKS_PATH } from './constants.js';

const start = Date.now()

async function init() {
    console.log('Prepare images');

    await clearCachedImages(IMAGES_PATH);

    console.log('Get list from Notion');
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
    
    console.log('Save metadata');
    await saveMetadata(items, images);

    console.log(`Finish in ${(Date.now() - start) / 1000} seconds`);
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
            const ext = new URL(url).pathname.split('.').at(-1);
            const guid = getNotionGUID(url);
            const filename = `${guid}.${ext}`;
            const file = fs.createWriteStream(IMAGES_PATH + filename);

            https.get(url, (response) => {
                response.pipe(file);
            });

            file.on('finish', () => {
                file.close();
                resolve({ id: guid, path: filename });
            });

            file.on('error', (e) => {
                console.error(`Not loaded: ${filename}`, e);
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
                        fs.unlinkSync(IMAGES_PATH + item.path);
                    } catch (e) {
                        console.log(`Error remove ${e}`);
                    }
                    resolve();
                }),
        ),
    );
    return items;
}

function saveMetadata(items, images) {
    const imagesById = images.reduce((all, item) => {
        all[item.id] = item;
        return all;
    }, {});

    const updatedItems = items.map((item) => ({
        ...item,
        images: item.images
            .map((url) => {
                const guid = getNotionGUID(url);
                const image = imagesById[guid];

                if (image) {
                    return {
                        id: image.id,
                        m: {
                            ...image.m,
                            src: `${IMAGES_PATH_EXTERNAL}/m_${image.path}`,
                        },
                        s: {
                            ...image.s,
                            src: `${IMAGES_PATH_EXTERNAL}/s_${image.path}`,
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

    fs.writeFileSync(PLACEMARKS_PATH, JSON.stringify(updatedItems));
}
