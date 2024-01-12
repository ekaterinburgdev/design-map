import { PLACEMARKS_PATH_EXTERNAL } from './build-scripts/prepare-static/constants.js';

/** @type {import('next').NextConfig} */
const nextConfig = {
    headers: () => [
        {
            source: PLACEMARKS_PATH_EXTERNAL,
            headers: [
                {
                    key: 'Cache-Control',
                    value: 'no-store',
                },
                {
                    key: 'Access-Control-Allow-Origin',
                    value: '*',
                }
            ],
        },
    ],
    reactStrictMode: true,
    swcMinify: true,
    eslint: {
        dirs: ['pages', 'components', 'api', 'common']
    },
    webpack(config) {
        config.module.rules.push({
            test: /\.geojson$/,
            use: ["json-loader"]
        });
        return config;
    },
};

export default nextConfig;
