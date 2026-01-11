import sharp from 'sharp';
import { IMAGES_URLS_PATH } from './constants.js';

const setupOptimization = (pipeline, ext) => {
    const isJpg = ext === 'jpg' || ext === 'jpeg';
    if (isJpg) {
        return pipeline.jpeg({ quality: 75, mozjpeg: true, progressive: true });
    }
    return pipeline.png({ quality: 80, palette: true });
};

export async function resize(items) {
    return Promise.all(
        items.map(async ({ id, path }, index) => {
            const inputPath = IMAGES_URLS_PATH + path;
            const ext = path.split('.').at(-1).toLowerCase();

            try {
                const mInfo = await setupOptimization(
                    sharp(inputPath, { failOnError: false }).resize({
                        fit: sharp.fit.inside,
                        width: 800,
                        withoutEnlargement: true,
                    }),
                    ext,
                ).toFile(`${IMAGES_URLS_PATH}m_${path}`);

                const sSize = 80;
                const sInfo = await setupOptimization(
                    sharp(inputPath, { failOnError: false })
                        .resize(sSize, sSize, { fit: sharp.fit.cover })
                        .composite([
                            {
                                input: Buffer.from(
                                    `<svg><circle cx="${sSize / 2}" cy="${sSize / 2}" r="${sSize / 2}" /></svg>`,
                                ),
                                blend: 'dest-in',
                            },
                        ]),
                    ext,
                ).toFile(`${IMAGES_URLS_PATH}s_${path}`);

                return {
                    id,
                    path,
                    m: { width: mInfo.width, height: mInfo.height },
                    s: { width: sInfo.width, height: sInfo.height },
                };
            } catch (err) {
                console.error(`❌ Error ${path}:`, err.message);
                return null;
            }
        }),
    ).then((results) => results.filter(Boolean));
}
