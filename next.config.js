/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        dirs: ['pages', 'components', 'api', 'common']
    }
};

export default nextConfig;
