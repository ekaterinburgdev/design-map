import https from 'https';
import fs from 'fs';
import { Client } from '@notionhq/client';
import sharp from 'sharp';
import dotenv from 'dotenv-flow';
import imagemin from 'imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import imageminSvgo from 'imagemin-svgo';

dotenv.config();
const VERCEL_OUTPUT_PATH = './public/notion-static/';
const IMAGES_URLS_PATH = VERCEL_OUTPUT_PATH + 'images/';
const CACHE_URLS_PATH = VERCEL_OUTPUT_PATH + 'cache.json';
const CACHE_IMAGEIDS_PATH = VERCEL_OUTPUT_PATH + 'images.json';

clearCachedImages(IMAGES_URLS_PATH)
    .then(withLog('Get images list from Notion'))
    .then(withCache(CACHE_URLS_PATH, getImagesUrls))
    .then(withLog('Download images'))
    .then((urls) => urls.slice(0, 100)) // TODO: remove slice that caused by ETIMEDOUT error
    .then(download)
    .then(withLog('Resize images'))
    .then(resize)
    .then(withLog('Remove original size images'))
    .then(removeOriginalImages)
    .then(withLog('Optimize images'))
    .then(optimize)
    .then(withLog('Save metadata'))
    .then(saveMetadata(CACHE_IMAGEIDS_PATH))
    .then(withLog('Finish'))
    .catch(console.log);

function withCache(path, cb) {
    return async () => {
        // DEBUG: uncomment for debug cache
        // if (fs.existsSync(path)) {
        //     const cached = await fs.readFileSync(path);
        //     if (cached) return JSON.parse(cached);
        // }

        const result = await cb();

        await fs.writeFileSync(path, JSON.stringify(result));

        return result;
    };
}

function withLog(message) {
    return (...args) => {
        console.log(message);
        return Promise.resolve(...args);
    };
}

async function getImagesUrls() {
    const notion = new Client({ auth: process.env.NOTION_TOKEN });
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE,
        page_size: 10000,
    });
    const urls = response.results
        .map((x) => x.properties)
        .flatMap((item) =>
            Object.values(item)
                .filter((x) => x.type === 'files')
                .flatMap((x) => x.files.flatMap((x) => x?.file?.url)),
        );
    fs.writeFileSync(CACHE_URLS_PATH, JSON.stringify(urls));
    return urls;
}

async function clearCachedImages(path) {
    if (fs.existsSync(path)) {
        fs.rmSync(path, { recursive: true });
    }

    fs.mkdirSync(path, { recursive: true });
}

async function download(urls) {
    const downloadItem = (url) =>
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

            file.on('error', () => {
                console.error(`Not loaded: ${outputFilename}`);
                reject();
            });
        });

    return Promise.all(urls.map(downloadItem));
}

async function optimize(items) {
    await imagemin([`${IMAGES_URLS_PATH}/*.{jpg,jpeg,png,svg}`], {
        destination: IMAGES_URLS_PATH,
        plugins: [
            imageminMozjpeg({ quality: 75 }),
            imageminPngquant({ quality: [0.6, 0.8] }),
            imageminSvgo(),
        ],
    });

    return items;
}

async function resize(items) {
    const resizeOne = (filename, maxSize, prefix) =>
        sharp(IMAGES_URLS_PATH + filename)
            .resize({
                fit: sharp.fit.inside,
                width: maxSize,
            })
            .toFile(IMAGES_URLS_PATH + prefix + '_' + filename)
            .then(({ width, height }) => ({ width, height }));

    return Promise.all(
        items.map(async ({ id, path }) => {
            const m = await resizeOne(path, 800, 'm');
            const s = await resizeOne(path, 80, 's');
            return { id, m, s, path };
        }),
    );
}

async function removeOriginalImages(items) {
    await Promise.all(
        items.map(
            (item) =>
                new Promise((resolve) => {
                    fs.unlinkSync(IMAGES_URLS_PATH + item.path);
                    resolve();
                }),
        ),
    );
    return items;
}

function saveMetadata(path) {
    return (items) => {
        const byId = items.reduce((all, item) => {
            all[item.id] = item;
            return all;
        }, {});
        fs.writeFileSync(path, JSON.stringify(byId));
    };
}

const getNotionGUID = (url) =>
    url.includes('notion-static.com') ? url.match(/secure.notion-static.com\/(.*)\//)[1] : '';
