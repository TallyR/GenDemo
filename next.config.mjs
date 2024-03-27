/** @type {import('next').NextConfig} */
const nextConfig = {
    async redirects() {
        return [
            {
                source: "/",
                destination: "/prospecting",
                permanent: true,
            },
        ];
    },
};

export default nextConfig;
