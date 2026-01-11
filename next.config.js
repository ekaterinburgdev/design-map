/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'export',
    images: {
        unoptimized: true,
    },
    eslint: {
        dirs: ['pages', 'components', 'api', 'common'],
    },
};

export default nextConfig;
